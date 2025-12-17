/**
 * User Settings Hooks - Selective subscriptions for better performance
 *
 * These hooks subscribe to specific parts of the store,
 * preventing unnecessary re-renders when unrelated settings change.
 */

"use client";

import type { GlassEffect, UiPreferences } from "@/features/user/types";
import { useUserSettingsStore } from "@/lib/stores/user-settings.store";

/**
 * Subscribe to theme only
 * Component only re-renders when theme changes
 */
export function useTheme() {
  const theme = useUserSettingsStore((state) => state.theme);
  const setTheme = useUserSettingsStore((state) => state.setTheme);

  return { theme, setTheme } as const;
}

/**
 * Subscribe to language only
 * Component only re-renders when language changes
 */
export function useLanguage() {
  const language = useUserSettingsStore((state) => state.language);
  const setLanguage = useUserSettingsStore((state) => state.setLanguage);

  return { language, setLanguage } as const;
}

/**
 * Subscribe to notifications setting only
 */
export function useNotifications() {
  const enabled = useUserSettingsStore((state) => state.notifications_enabled);
  const setEnabled = useUserSettingsStore((state) => state.setNotifications);

  return {
    enabled,
    setEnabled,
  } as const;
}

/**
 * Subscribe to content filters only
 */
export function useContentFilters() {
  const filters = useUserSettingsStore((state) => state.content_filters);
  const setFilters = useUserSettingsStore((state) => state.setContentFilters);
  const addFilter = useUserSettingsStore((state) => state.addContentFilter);
  const removeFilter = useUserSettingsStore(
    (state) => state.removeContentFilter
  );

  return {
    filters,
    setFilters,
    addFilter,
    removeFilter,
  } as const;
}

/**
 * Subscribe to UI preferences only
 */
export function useUiPreferences() {
  const preferences = useUserSettingsStore((state) => state.ui_preferences);
  const setPreference = useUserSettingsStore((state) => state.setUiPreference);
  const updatePreferences = useUserSettingsStore(
    (state) => state.updateUiPreferences
  );

  // Convenience methods for common preferences
  const setGlassEffect = (value: GlassEffect) =>
    setPreference("glass_effect", value);
  const setAutoPlayVideo = (value: boolean) =>
    setPreference("auto_play_video", value);
  const setShowMatureContent = (value: boolean) =>
    setPreference("show_mature_content", value);
  const setCompactView = (value: boolean) =>
    setPreference("compact_view", value);

  return {
    preferences,
    setPreference,
    updatePreferences,
    setGlassEffect,
    setAutoPlayVideo,
    setShowMatureContent,
    setCompactView,
  } as const;
}

/**
 * Subscribe to a specific UI preference
 * @param key - The UI preference key to subscribe to
 */
export function useUiPreference<K extends keyof UiPreferences>(key: K) {
  const value = useUserSettingsStore((state) => state.ui_preferences[key]);
  const setValue = useUserSettingsStore((state) => state.setUiPreference);

  return [
    value,
    (newValue: UiPreferences[K]) => setValue(key, newValue),
  ] as const;
}

/**
 * Subscribe to sync status
 * Useful for showing loading indicators or sync status
 */
export function useSyncStatus() {
  const isSyncing = useUserSettingsStore((state) => state.isSyncing);
  const hasPendingChanges = useUserSettingsStore(
    (state) => state.hasPendingChanges
  );
  const lastSyncedAt = useUserSettingsStore((state) => state.lastSyncedAt);
  const error = useUserSettingsStore((state) => state.error);

  return {
    isSyncing,
    hasPendingChanges,
    lastSyncedAt,
    error,
  } as const;
}

/**
 * Check if store has been hydrated from localStorage
 * Use this to prevent flash of wrong values during SSR
 */
export function useIsHydrated() {
  return useUserSettingsStore((state) => state.isHydrated);
}

/**
 * Get all settings (use sparingly - subscribes to everything)
 * Only use this when you truly need all settings
 */
export function useAllSettings() {
  return useUserSettingsStore((state) => ({
    theme: state.theme,
    language: state.language,
    notifications_enabled: state.notifications_enabled,
    content_filters: state.content_filters,
    ui_preferences: state.ui_preferences,
    isLoading: state.isLoading,
    error: state.error,
  }));
}

/**
 * Get settings actions (doesn't cause re-renders)
 */
export function useSettingsActions() {
  return {
    setTheme: useUserSettingsStore.getState().setTheme,
    setLanguage: useUserSettingsStore.getState().setLanguage,
    setNotifications: useUserSettingsStore.getState().setNotifications,
    setContentFilters: useUserSettingsStore.getState().setContentFilters,
    addContentFilter: useUserSettingsStore.getState().addContentFilter,
    removeContentFilter: useUserSettingsStore.getState().removeContentFilter,
    setUiPreference: useUserSettingsStore.getState().setUiPreference,
    updateUiPreferences: useUserSettingsStore.getState().updateUiPreferences,
    loadFromApi: useUserSettingsStore.getState().loadFromApi,
    syncToApi: useUserSettingsStore.getState().syncToApi,
    reset: useUserSettingsStore.getState().reset,
  } as const;
}
