/**
 * User Settings Example - Demonstrates how to use the UserSettings store
 *
 * This is an example component showing various usage patterns.
 * You can delete this file or use it as reference.
 */

"use client";

import {
  useTheme,
  useLanguage,
  useNotifications,
  useUiPreference,
  useSyncStatus,
} from "@/lib/hooks/use-user-settings";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export function UserSettingsExample() {
  // Example 1: Subscribe to theme only (component only re-renders when theme changes)
  const { theme, setTheme } = useTheme();

  // Example 2: Subscribe to language only
  const { language, setLanguage } = useLanguage();

  // Example 3: Subscribe to notifications
  const { enabled: notificationsEnabled, setEnabled: setNotifications } =
    useNotifications();

  // Example 4: Subscribe to a specific UI preference
  const [reduceBlur, setReduceBlur] = useUiPreference("reduce_blur");

  // Example 5: Get sync status (for showing loading indicators)
  const { isSyncing, hasPendingChanges, lastSyncedAt, error } = useSyncStatus();

  return (
    <div className="space-y-6 p-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold mb-4">User Settings Example</h2>
        <p className="text-muted-foreground mb-6">
          This demonstrates the UserSettings store with selective subscriptions
          for optimal performance.
        </p>
      </div>

      {/* Sync Status */}
      {(isSyncing || hasPendingChanges || error) && (
        <div className="p-4 border rounded-lg space-y-2">
          <h3 className="font-semibold">Sync Status</h3>
          <div className="space-y-1 text-sm">
            {isSyncing && <p className="text-blue-600">⏳ Syncing...</p>}
            {hasPendingChanges && !isSyncing && (
              <p className="text-orange-600">⚠ Changes pending sync</p>
            )}
            {error && <p className="text-red-600">❌ Error: {error}</p>}
            {lastSyncedAt && (
              <p className="text-muted-foreground">
                Last synced: {new Date(lastSyncedAt).toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Theme Setting */}
      <div className="space-y-2">
        <h3 className="font-semibold">Theme</h3>
        <p className="text-sm text-muted-foreground">Current: {theme}</p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={theme === "light" ? "default" : "outline"}
            onClick={() => setTheme("light")}
          >
            Light
          </Button>
          <Button
            size="sm"
            variant={theme === "dark" ? "default" : "outline"}
            onClick={() => setTheme("dark")}
          >
            Dark
          </Button>
          <Button
            size="sm"
            variant={theme === "system" ? "default" : "outline"}
            onClick={() => setTheme("system")}
          >
            System
          </Button>
        </div>
      </div>

      {/* Language Setting */}
      <div className="space-y-2">
        <h3 className="font-semibold">Language</h3>
        <p className="text-sm text-muted-foreground">Current: {language}</p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={language === "en" ? "default" : "outline"}
            onClick={() => setLanguage("en")}
          >
            English
          </Button>
          <Button
            size="sm"
            variant={language === "vi" ? "default" : "outline"}
            onClick={() => setLanguage("vi")}
          >
            Tiếng Việt
          </Button>
        </div>
      </div>

      {/* Notifications Setting */}
      <div className="space-y-2">
        <h3 className="font-semibold">Notifications</h3>
        <div className="flex items-center gap-2">
          <Switch
            checked={notificationsEnabled}
            onCheckedChange={setNotifications}
          />
          <span className="text-sm">
            {notificationsEnabled ? "Enabled" : "Disabled"}
          </span>
        </div>
      </div>

      {/* UI Preference Example */}
      <div className="space-y-2">
        <h3 className="font-semibold">UI Preferences</h3>
        <div className="flex items-center gap-2">
          <Switch checked={reduceBlur} onCheckedChange={setReduceBlur} />
          <span className="text-sm">Reduce blur effects</span>
        </div>
      </div>

      {/* Implementation Notes */}
      <div className="p-4 bg-muted rounded-lg space-y-2">
        <h3 className="font-semibold">How it works:</h3>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li>✅ All changes are auto-saved to localStorage instantly</li>
          <li>✅ Changes are synced to API after 2 seconds (debounced)</li>
          <li>✅ Automatic retry on failed syncs (max 3 attempts)</li>
          <li>✅ Each hook subscribes to specific state (no unnecessary re-renders)</li>
          <li>✅ Works for both anonymous and logged-in users</li>
          <li>✅ Redux DevTools integration for debugging</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * USAGE IN OTHER COMPONENTS:
 *
 * // Simple theme toggle button
 * function ThemeToggle() {
 *   const { theme, setTheme } = useTheme();
 *   return <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>Toggle</button>;
 * }
 *
 * // Language selector
 * function LanguageSelector() {
 *   const { language, setLanguage } = useLanguage();
 *   return <select value={language} onChange={(e) => setLanguage(e.target.value)}>...</select>;
 * }
 *
 * // UI preference toggle
 * function BlurToggle() {
 *   const [reduceBlur, setReduceBlur] = useUiPreference('reduce_blur');
 *   return <Switch checked={reduceBlur} onCheckedChange={setReduceBlur} />;
 * }
 *
 * // Direct store access (without re-renders)
 * import { useUserSettingsStore } from '@/lib/stores';
 *
 * function SomeComponent() {
 *   const handleSave = () => {
 *     const theme = useUserSettingsStore.getState().theme;
 *     console.log('Current theme:', theme);
 *   };
 * }
 */
