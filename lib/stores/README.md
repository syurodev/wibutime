# User Settings Store

## Problem Solved

Fixed issue where settings (like theme) would reset to defaults on page reload despite being saved to localStorage.

## Root Cause

Zustand persist middleware needs time to **hydrate** from localStorage. During SSR/initial render, the store starts with default values before hydration completes, causing a flash of wrong values.

## Solution

Added `isHydrated` state tracking and hydration handling:

1. **Track hydration state** with `isHydrated` flag
2. **Wait for hydration** in `initializeUserSettings()` before proceeding
3. **Handle hydration callback** in persist middleware

## Usage

### Basic Usage (Client Components)

```tsx
"use client";

import { useTheme, useIsHydrated } from "@/lib/hooks/use-user-settings";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isHydrated = useIsHydrated();

  // Show loading state during hydration to prevent flash
  if (!isHydrated) {
    return <div>Loading...</div>;
  }

  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Current: {theme}
    </button>
  );
}
```

### SSR-Safe Usage

```tsx
"use client";

import { useTheme, useIsHydrated } from "@/lib/hooks/use-user-settings";
import { useState, useEffect } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isHydrated = useIsHydrated();
  const [mounted, setMounted] = useState(false);

  // Wait for both mount and hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isHydrated) {
    // Return static placeholder during SSR and hydration
    return <div className="w-10 h-10" />;
  }

  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      {theme}
    </button>
  );
}
```

### Available Hooks

```tsx
// Theme
const { theme, setTheme } = useTheme();

// Language
const { language, setLanguage } = useLanguage();

// UI Preferences
const { preferences, setPreference } = useUiPreferences();

// Check hydration
const isHydrated = useIsHydrated();

// Sync status
const { isSyncing, hasPendingChanges, error } = useSyncStatus();
```

## How It Works

### 1. Persist Middleware

```ts
persist(
  (set, get) => ({ /* store */ }),
  {
    name: "user-settings",
    storage: createJSONStorage(() => localStorage),
    onRehydrateStorage: () => {
      return (state) => {
        if (state) {
          state.isHydrated = true; // Mark as hydrated
        }
      };
    },
  }
)
```

### 2. Initialize Function

```ts
export async function initializeUserSettings() {
  // Wait for hydration to complete (max 100ms)
  if (!store.isHydrated) {
    await new Promise<void>((resolve) => {
      const checkHydration = () => {
        if (useUserSettingsStore.getState().isHydrated) {
          resolve();
        } else {
          setTimeout(checkHydration, 10);
        }
      };
      checkHydration();
      setTimeout(() => resolve(), 100); // Timeout safety
    });
  }

  // Now safe to use hydrated values
  const hydratedStore = useUserSettingsStore.getState();
  // ...
}
```

### 3. Provider Setup

Provider is automatically set up in root layout:

```tsx
// app/layout.tsx
<UserSettingsProvider>
  <YourApp />
</UserSettingsProvider>
```

## Best Practices

### ✅ DO

- Use `useIsHydrated()` hook to check if localStorage has loaded
- Show loading state or placeholder during hydration
- Use selective hooks (`useTheme`, `useLanguage`) instead of `useAllSettings`

### ❌ DON'T

- Don't render theme-dependent UI before `isHydrated === true`
- Don't assume localStorage values are available immediately
- Don't use `useAllSettings` unless you need everything

## Debugging

Check browser console for hydration logs:

```
User settings hydrated from localStorage
```

Check localStorage directly:

```js
// In browser console
localStorage.getItem("user-settings");
```

Check Zustand DevTools:

```
Extension: Redux DevTools
Store Name: UserSettings
```

## Migration from Old Code

If you had code like this:

```tsx
// ❌ Old code - will flash default values
const { theme } = useTheme();
return <div data-theme={theme}>...</div>;
```

Update to:

```tsx
// ✅ New code - waits for hydration
const { theme } = useTheme();
const isHydrated = useIsHydrated();

if (!isHydrated) {
  return <div>Loading...</div>;
}

return <div data-theme={theme}>...</div>;
```
