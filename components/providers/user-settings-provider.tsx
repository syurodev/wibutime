/**
 * User Settings Provider - Initializes settings store on mount
 *
 * This component doesn't actually provide context (Zustand handles that),
 * but it initializes the store when the app mounts.
 */

"use client";

import { initializeUserSettings } from "@/lib/stores/user-settings.store";
import { useEffect } from "react";

interface UserSettingsProviderProps {
  readonly children: React.ReactNode;
}

export function UserSettingsProvider({ children }: UserSettingsProviderProps) {
  useEffect(() => {
    // Initialize settings on mount
    // This will:
    // 1. Use localStorage data if available (persist middleware)
    // 2. Otherwise, load from API
    initializeUserSettings().catch((error) => {
      console.error("Failed to initialize user settings:", error);
    });
  }, []);

  // This component doesn't wrap children in a provider
  // Zustand store is globally accessible
  return <>{children}</>;
}
