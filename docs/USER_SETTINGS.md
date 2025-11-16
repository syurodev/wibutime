# User Settings Store - Documentation

## 📚 Tổng quan

Global UserSettings store sử dụng **Zustand** với localStorage persistence và API sync. Hỗ trợ cả anonymous và logged-in users với debounced sync và automatic retry.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Changes Setting                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Zustand Store (Global State)                    │
│  ┌──────────────────┐  ┌────────────────────────────────┐  │
│  │  Instant Save    │  │   Debounced API Sync (2s)      │  │
│  │  to localStorage │  │   with Retry (3 attempts)      │  │
│  └──────────────────┘  └────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│           Components Re-render (Selective)                   │
│  Only components subscribing to changed value re-render      │
└─────────────────────────────────────────────────────────────┘
```

## 📂 File Structure

```
lib/
├── api/
│   ├── models/
│   │   └── user/
│   │       └── user-settings.ts          # Zod schema & types (snake_case)
│   └── services/
│       └── user/
│           └── user-settings.service.ts  # API calls
├── stores/
│   ├── user-settings.store.ts           # Zustand store
│   └── index.ts                          # Exports
└── hooks/
    └── use-user-settings.ts              # Helper hooks

components/
└── providers/
    └── UserSettingsProvider.tsx          # Initialize on mount

app/[locale]/(main)/
└── layout.tsx                            # Provider mounted here
```

## 🎯 Features

### ✅ Core Features
- **Instant localStorage persistence** - Mọi thay đổi save ngay lập tức
- **Debounced API sync** - Sync với backend sau 2s (tránh spam requests)
- **Automatic retry** - Retry 3 lần khi API failed
- **Selective subscriptions** - Components chỉ re-render khi cần
- **Type-safe** - Full TypeScript support với Zod validation
- **DevTools integration** - Redux DevTools để debug
- **SSR-safe** - Works với Next.js server components

### 📊 Settings Available

```typescript
{
  theme: "light" | "dark" | "system",
  language: string,                    // "en", "vi", etc.
  notifications_enabled: boolean,
  content_filters: string[],
  ui_preferences: {
    reduce_blur: boolean,
    auto_play_video: boolean,
    show_mature_content: boolean,
    compact_view: boolean,
  }
}
```

## 🔧 Usage Examples

### 1. Theme Toggle (Selective Subscription)

```tsx
"use client";

import { useTheme } from "@/lib/hooks/use-user-settings";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme(); // ✅ Only re-renders when theme changes

  return (
    <Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      {theme === "dark" ? "🌙" : "☀️"}
    </Button>
  );
}
```

### 2. Language Selector

```tsx
"use client";

import { useLanguage } from "@/lib/hooks/use-user-settings";

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <select value={language} onChange={(e) => setLanguage(e.target.value)}>
      <option value="en">English</option>
      <option value="vi">Tiếng Việt</option>
    </select>
  );
}
```

### 3. UI Preference Toggle

```tsx
"use client";

import { useUiPreference } from "@/lib/hooks/use-user-settings";
import { Switch } from "@/components/ui/switch";

export function BlurToggle() {
  const [reduceBlur, setReduceBlur] = useUiPreference("reduce_blur");

  return (
    <div className="flex items-center gap-2">
      <Switch checked={reduceBlur} onCheckedChange={setReduceBlur} />
      <span>Reduce blur effects</span>
    </div>
  );
}
```

### 4. Notifications Toggle

```tsx
"use client";

import { useNotifications } from "@/lib/hooks/use-user-settings";

export function NotificationsToggle() {
  const { enabled, setEnabled } = useNotifications();

  return (
    <button onClick={() => setEnabled(!enabled)}>
      {enabled ? "🔔 On" : "🔕 Off"}
    </button>
  );
}
```

### 5. Sync Status (Loading Indicator)

```tsx
"use client";

import { useSyncStatus } from "@/lib/hooks/use-user-settings";

export function SyncIndicator() {
  const { isSyncing, hasPendingChanges, error } = useSyncStatus();

  if (error) return <span className="text-red-500">❌ {error}</span>;
  if (isSyncing) return <span className="text-blue-500">⏳ Syncing...</span>;
  if (hasPendingChanges) return <span className="text-orange-500">⚠️ Pending</span>;
  return <span className="text-green-500">✅ Synced</span>;
}
```

### 6. Direct Store Access (No Re-renders)

```tsx
import { useUserSettingsStore } from "@/lib/stores";

// Get value without subscribing (no re-render)
function logCurrentTheme() {
  const theme = useUserSettingsStore.getState().theme;
  console.log("Current theme:", theme);
}

// Call action directly
function resetSettings() {
  useUserSettingsStore.getState().reset();
}
```

## 🎣 Available Hooks

| Hook | Returns | Use Case |
|------|---------|----------|
| `useTheme()` | `{ theme, setTheme }` | Theme toggle/selector |
| `useLanguage()` | `{ language, setLanguage }` | Language selector |
| `useNotifications()` | `{ enabled, setEnabled }` | Notifications toggle |
| `useContentFilters()` | `{ filters, setFilters, addFilter, removeFilter }` | Content filtering |
| `useUiPreferences()` | `{ preferences, setPreference, updatePreferences }` | UI settings |
| `useUiPreference(key)` | `[value, setValue]` | Single UI preference |
| `useSyncStatus()` | `{ isSyncing, hasPendingChanges, error, lastSyncedAt }` | Sync indicators |
| `useAllSettings()` | All settings | When you need everything |
| `useSettingsActions()` | All actions | Action-only (no re-renders) |

## 🔄 Sync Behavior

### 1. On App Mount
```typescript
// app/[locale]/(main)/layout.tsx
<UserSettingsProvider> // Automatically initializes store
  {children}
</UserSettingsProvider>
```

**Flow:**
1. Check localStorage → Load if exists
2. If no localStorage → Load from API
3. Mark as initialized

### 2. On User Change
```typescript
setTheme("dark"); // User changes theme
```

**Flow:**
1. ✅ Update Zustand state (instant)
2. ✅ Save to localStorage (instant)
3. ⏳ Wait 2 seconds (debounce)
4. 🌐 Sync to API
5. ✅ Update state with API response

### 3. On API Failure
```typescript
// API call fails (network error, server error, etc.)
```

**Flow:**
1. ❌ API call failed
2. 🔄 Retry after 5 seconds
3. 🔄 Retry again (max 3 attempts)
4. ❌ Give up, keep local changes
5. 💾 Settings still in localStorage
6. 🔄 Will retry on next change

## ⚙️ Configuration

### Change Sync Timing

Edit `lib/stores/user-settings.store.ts`:

```typescript
const SYNC_DEBOUNCE_MS = 2000;  // Default: 2 seconds
const MAX_RETRY_COUNT = 3;       // Default: 3 attempts
const RETRY_DELAY_MS = 5000;     // Default: 5 seconds
```

### Toggle Mock/Real API

Edit `lib/api/services/user/user-settings.service.ts`:

```typescript
const USE_MOCK = true; // Set to false when backend ready
```

## 🐛 Debugging

### 1. Redux DevTools
1. Install [Redux DevTools Extension](https://chrome.google.com/webstore/detail/redux-devtools)
2. Open DevTools → Redux tab
3. See "UserSettings" store
4. Track all state changes

### 2. Console Logs
```typescript
import { useUserSettingsStore } from "@/lib/stores";

// Log current state
console.log(useUserSettingsStore.getState());

// Subscribe to changes
useUserSettingsStore.subscribe((state) => {
  console.log("State changed:", state);
});
```

### 3. Check localStorage
```typescript
// Browser console
localStorage.getItem('user-settings');
```

## 🚀 Advanced Usage

### Custom Hook with Multiple Subscriptions

```tsx
import { useUserSettingsStore } from "@/lib/stores";

function useMyCustomSettings() {
  return useUserSettingsStore((state) => ({
    theme: state.theme,
    language: state.language,
    // Only re-renders when theme OR language changes
  }));
}
```

### Batch Updates

```tsx
import { useUserSettingsStore } from "@/lib/stores";

function applyUserPreset() {
  const store = useUserSettingsStore.getState();

  // Update multiple settings at once
  store.setTheme("dark");
  store.setLanguage("vi");
  store.updateUiPreferences({
    reduce_blur: true,
    compact_view: true,
  });

  // Will debounce and sync all changes together
}
```

### Conditional Sync

```tsx
import { useUserSettingsStore } from "@/lib/stores";

function saveSettingsNow() {
  const { hasPendingChanges, syncToApi } = useUserSettingsStore.getState();

  if (hasPendingChanges) {
    await syncToApi(); // Force sync immediately
  }
}
```

## 📝 Type Safety

All settings are type-safe với Zod validation:

```typescript
import { UserSettings, UserSettingsSchema } from "@/lib/api/models";

// Parse API response safely
const settings = UserSettingsSchema.parse(apiResponse);

// Type-safe partial updates
const updates: Partial<UserSettings> = {
  theme: "dark", // ✅ Type-checked
  language: "vi", // ✅ Type-checked
  // invalid_key: true, // ❌ TypeScript error
};
```

## 🔐 Best Practices

1. **Use selective hooks** - `useTheme()` instead of `useAllSettings()`
2. **Avoid useAllSettings()** - Only when you truly need everything
3. **Don't spam API** - Store handles debouncing automatically
4. **Check sync status** - Show loading indicators for better UX
5. **Handle errors gracefully** - Display error messages from `useSyncStatus()`
6. **Test offline mode** - Ensure localStorage fallback works

## 🎨 Example: Complete Settings Page

See `components/examples/UserSettingsExample.tsx` for a full working example.

## 📚 References

- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Zod Documentation](https://zod.dev/)
- Next.js App Router with client components

---

**Created:** November 2024
**Stack:** Next.js 16, Zustand, Zod, TypeScript
**Pattern:** Global state with localStorage + API sync
