/**
 * Theme Provider - Integrates UserSettings store with next-themes
 *
 * This component:
 * 1. Wraps app with next-themes ThemeProvider
 * 2. Syncs theme from UserSettings store to next-themes
 * 3. Applies theme to document (dark/light mode)
 */

"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { useEffect } from "react";
import { useUserSettingsStore } from "@/lib/stores/user-settings.store";

interface ThemeProviderProps {
  readonly children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      <ThemeSync />
      {children}
    </NextThemesProvider>
  );
}

/**
 * Syncs theme from UserSettings store to next-themes
 */
function ThemeSync() {
  // Subscribe to theme changes from UserSettings store
  const userTheme = useUserSettingsStore((state) => state.theme);
  // Get next-themes setTheme function
  const { setTheme } = useTheme();

  useEffect(() => {
    // Sync UserSettings theme to next-themes
    setTheme(userTheme);
  }, [userTheme, setTheme]);

  return null;
}
