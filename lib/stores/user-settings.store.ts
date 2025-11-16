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

  // Actions - Cleanup & Lifecycle
  cleanup: () => void;
  logout: () => void;

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

          // Mark as syncing and clear pending flag
          // We'll track if new changes come in during the sync
          set({ isSyncing: true, hasPendingChanges: false, error: null });

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

            // Check if new changes came in during sync
            // (hasPendingChanges would be set to true by setters during the sync)
            const hasNewChanges = get().hasPendingChanges;

            set({
              ...updated,
              isSyncing: false,
              lastSyncedAt: new Date().toISOString(),
              error: null,
              // Keep hasPendingChanges if new changes came in
              hasPendingChanges: hasNewChanges,
            });
            get()._resetRetry();

            // If changes came in during sync, schedule another sync
            if (hasNewChanges) {
              debouncedSync(get);
            }
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Failed to sync settings";
            set({
              isSyncing: false,
              error: errorMessage,
              // Keep pending changes flag on error so we can retry
              hasPendingChanges: true,
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

        // Cleanup - cancel all pending operations
        cleanup: () => {
          // Clear all timeouts to prevent memory leaks
          if (syncTimeout) {
            clearTimeout(syncTimeout);
            syncTimeout = null;
          }
          if (retryTimeout) {
            clearTimeout(retryTimeout);
            retryTimeout = null;
          }

          // Reset sync states
          set({
            isSyncing: false,
            hasPendingChanges: false,
            retryCount: 0,
          });
        },

        // Logout - cleanup and reset to defaults
        logout: () => {
          // First cleanup all pending operations
          get().cleanup();

          // Reset to default state
          set({
            ...UserSettingsUtils.createDefault(),
            isLoading: false,
            isInitialized: false,
            error: null,
            lastSyncedAt: null,
            isSyncing: false,
            hasPendingChanges: false,
            retryCount: 0,
          });
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

  // Check if we have persisted data by looking for lastSyncedAt or user_id
  // These indicate data from a previous session
  const hasPersistedData = store.lastSyncedAt !== null || store.user_id !== null;

  if (hasPersistedData) {
    // We have localStorage data from previous session
    // Mark as initialized but optionally sync in background to get latest
    useUserSettingsStore.setState({ isInitialized: true });

    // Optional: Sync in background to get latest server data
    // This won't block the UI
    store.loadFromApi().catch((error) => {
      console.warn("Background sync failed during initialization:", error);
    });

    return;
  }

  // No persisted data - first time user or cleared storage
  // Load from API (this will set defaults if API fails)
  await store.loadFromApi();
}
