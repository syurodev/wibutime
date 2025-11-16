/**
 * User Settings Store - Zustand with localStorage persistence & API sync
 */

import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import type { UserSettings, UiPreferences } from "@/lib/api/models/user/user-settings";
import { UserSettingsUtils } from "@/lib/api/models/user/user-settings";
import { UserSettingsService } from "@/lib/api/services/user/user-settings.service";

/**
 * Store State Interface
 */
interface UserSettingsState extends UserSettings {
  // Loading & Error States
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  lastSyncedAt: string | null;

  // Sync Status
  isSyncing: boolean;
  hasPendingChanges: boolean;
  retryCount: number;

  // Actions - Basic Setters
  setTheme: (theme: "light" | "dark" | "system") => void;
  setLanguage: (language: string) => void;
  setNotifications: (enabled: boolean) => void;
  setContentFilters: (filters: string[]) => void;
  addContentFilter: (filter: string) => void;
  removeContentFilter: (filter: string) => void;

  // Actions - UI Preferences
  setUiPreference: <K extends keyof UiPreferences>(
    key: K,
    value: UiPreferences[K]
  ) => void;
  updateUiPreferences: (preferences: Partial<UiPreferences>) => void;

  // Actions - API Sync
  loadFromApi: () => Promise<void>;
  syncToApi: () => Promise<void>;
  reset: () => void;

  // Internal Actions
  _setError: (error: string | null) => void;
  _incrementRetry: () => void;
  _resetRetry: () => void;
}

/**
 * Debounce utility
 */
let syncTimeout: NodeJS.Timeout | null = null;
const SYNC_DEBOUNCE_MS = 2000; // 2 seconds
const MAX_RETRY_COUNT = 3;
const RETRY_DELAY_MS = 5000; // 5 seconds

/**
 * Retry queue for failed syncs
 */
let retryTimeout: NodeJS.Timeout | null = null;

/**
 * User Settings Store
 */
export const useUserSettingsStore = create<UserSettingsState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State (defaults)
        ...UserSettingsUtils.createDefault(),

        // Meta State
        isLoading: false,
        isInitialized: false,
        error: null,
        lastSyncedAt: null,
        isSyncing: false,
        hasPendingChanges: false,
        retryCount: 0,

        // Basic Setters with debounced sync
        setTheme: (theme) => {
          set({ theme, hasPendingChanges: true });
          debouncedSync(get);
        },

        setLanguage: (language) => {
          set({ language, hasPendingChanges: true });
          debouncedSync(get);
        },

        setNotifications: (enabled) => {
          set({ notifications_enabled: enabled, hasPendingChanges: true });
          debouncedSync(get);
        },

        setContentFilters: (filters) => {
          set({ content_filters: filters, hasPendingChanges: true });
          debouncedSync(get);
        },

        addContentFilter: (filter) => {
          const current = get().content_filters;
          if (!current.includes(filter)) {
            set({
              content_filters: [...current, filter],
              hasPendingChanges: true,
            });
            debouncedSync(get);
          }
        },

        removeContentFilter: (filter) => {
          const current = get().content_filters;
          set({
            content_filters: current.filter((f) => f !== filter),
            hasPendingChanges: true,
          });
          debouncedSync(get);
        },

        // UI Preferences Setters
        setUiPreference: (key, value) => {
          set((state) => ({
            ui_preferences: {
              ...state.ui_preferences,
              [key]: value,
            },
            hasPendingChanges: true,
          }));
          debouncedSync(get);
        },

        updateUiPreferences: (preferences) => {
          set((state) => ({
            ui_preferences: {
              ...state.ui_preferences,
              ...preferences,
            },
            hasPendingChanges: true,
          }));
          debouncedSync(get);
        },

        // Load from API
        loadFromApi: async () => {
          // Skip if already loading
          if (get().isLoading) return;

          set({ isLoading: true, error: null });

          try {
            const settings = await UserSettingsService.getSettings();
            set({
              ...settings,
              isLoading: false,
              isInitialized: true,
              error: null,
              lastSyncedAt: new Date().toISOString(),
              hasPendingChanges: false,
            });
            get()._resetRetry();
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Failed to load settings";
            set({
              isLoading: false,
              error: errorMessage,
            });
            console.error("Failed to load settings:", error);
          }
        },

        // Sync to API
        syncToApi: async () => {
          // Skip if already syncing or no changes
          if (get().isSyncing || !get().hasPendingChanges) return;

          set({ isSyncing: true, error: null });

          try {
            const currentState = get();
            const settingsToSync: Partial<UserSettings> = {
              theme: currentState.theme,
              language: currentState.language,
              notifications_enabled: currentState.notifications_enabled,
              content_filters: currentState.content_filters,
              ui_preferences: currentState.ui_preferences,
            };

            const updated = await UserSettingsService.updateSettings(
              settingsToSync
            );

            set({
              ...updated,
              isSyncing: false,
              hasPendingChanges: false,
              lastSyncedAt: new Date().toISOString(),
              error: null,
            });
            get()._resetRetry();
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Failed to sync settings";
            set({
              isSyncing: false,
              error: errorMessage,
            });
            console.error("Failed to sync settings:", error);

            // Retry logic
            const retryCount = get().retryCount;
            if (retryCount < MAX_RETRY_COUNT) {
              get()._incrementRetry();
              scheduleRetry(get);
            }
          }
        },

        // Reset to defaults
        reset: () => {
          set({
            ...UserSettingsUtils.createDefault(),
            hasPendingChanges: true,
          });
          debouncedSync(get);
        },

        // Internal Actions
        _setError: (error) => set({ error }),
        _incrementRetry: () => set((state) => ({ retryCount: state.retryCount + 1 })),
        _resetRetry: () => set({ retryCount: 0 }),
      }),
      {
        name: "user-settings", // localStorage key
        storage: createJSONStorage(() => localStorage),
        // Only persist settings data, not meta states
        partialize: (state) => ({
          user_id: state.user_id,
          theme: state.theme,
          language: state.language,
          notifications_enabled: state.notifications_enabled,
          content_filters: state.content_filters,
          ui_preferences: state.ui_preferences,
          created_at: state.created_at,
          updated_at: state.updated_at,
        }),
      }
    ),
    {
      name: "UserSettings", // DevTools name
    }
  )
);

/**
 * Debounced sync to API
 */
function debouncedSync(get: () => UserSettingsState) {
  // Clear existing timeout
  if (syncTimeout) {
    clearTimeout(syncTimeout);
  }

  // Schedule new sync
  syncTimeout = setTimeout(() => {
    get().syncToApi();
  }, SYNC_DEBOUNCE_MS);
}

/**
 * Schedule retry for failed sync
 */
function scheduleRetry(get: () => UserSettingsState) {
  // Clear existing retry timeout
  if (retryTimeout) {
    clearTimeout(retryTimeout);
  }

  // Schedule retry
  retryTimeout = setTimeout(() => {
    console.log(`Retrying sync (attempt ${get().retryCount + 1}/${MAX_RETRY_COUNT})`);
    get().syncToApi();
  }, RETRY_DELAY_MS);
}

/**
 * Initialize store - call this on app mount
 */
export async function initializeUserSettings() {
  const store = useUserSettingsStore.getState();

  // Skip if already initialized
  if (store.isInitialized) return;

  // If we have localStorage data, we're good (persist middleware already loaded it)
  // Just mark as initialized
  if (store.theme || store.language) {
    useUserSettingsStore.setState({ isInitialized: true });
    return;
  }

  // Otherwise, load from API
  await store.loadFromApi();
}
