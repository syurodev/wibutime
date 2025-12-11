# Dynamic Navigation System

A flexible, context-based navigation system that allows pages to dynamically control navigation items with support for multiple item types.

## Features

✅ **4 Types of Nav Items**: Link, Action, Trigger, and Search
✅ **Search Mode**: Expandable search bar that takes over the nav
✅ **Loading States**: Spinner and disabled states for async actions
✅ **Toast Notifications**: Success/error feedback using Sonner
✅ **Badge Support**: Optional badges for notifications/counts
✅ **Type-Safe**: Full TypeScript support
✅ **Dark Mode**: Built-in dark mode support

## Architecture

```
components/layout/nav/
├── types.ts              # TypeScript type definitions
├── NavContext.tsx        # Context provider for state management
├── useNav.ts            # Custom hook for accessing nav context
├── Nav.tsx              # Main navigation component
├── NavLinkItem.tsx      # Link navigation item
├── NavActionItem.tsx    # Async action item
├── NavTriggerItem.tsx   # Sync trigger item
└── NavSearch.tsx        # Search bar component
```

## Usage

### 1. Basic Setup (Already Done)

The navigation is already set up in the layout:

```tsx
// app/[locale]/(main)/layout.tsx
<NavProvider>
  <Nav />
  <Toaster />
</NavProvider>
```

### 2. Using in Pages

Import the `useNav` hook and set nav items in your page:

```tsx
"use client";

import { useEffect } from "react";
import { useNav } from "@/components/layout/nav/use-nav";
import { Home, Heart } from "lucide-react";

export default function MyPage() {
  const { setNavItems } = useNav();

  useEffect(() => {
    setNavItems([
      {
        id: "home",
        type: "link",
        href: "/",
        icon: <Home className="w-5 h-5" />,
        label: "Home",
      },
      // ... more items
    ]);
  }, [setNavItems]);

  return <div>Your content</div>;
}
```

## Nav Item Types

### 1. Link Item

Navigate between pages using Next.js Link.

```tsx
{
  id: "home",
  type: "link",
  href: "/",
  icon: <Home className="w-5 h-5" />,
  label: "Home",
  badge: 5, // Optional badge
}
```

**Use cases:**

- Page navigation
- Route changes
- External links

### 2. Action Item

Execute async actions (API calls) with loading states.

```tsx
{
  id: "follow",
  type: "action",
  icon: <Heart className="w-5 h-5" />,
  label: "Follow",
  loadingText: "Loading...", // Text during loading
  successMessage: "Followed successfully", // Toast message
  errorMessage: "Failed to follow", // Error toast
  onClick: async () => {
    await api.followUser(userId);
  },
  badge: "✓", // Optional badge
}
```

**Features:**

- Loading spinner during execution
- Disabled state while loading
- Success/error toast notifications
- Error handling

**Use cases:**

- Follow/unfollow users
- Like/unlike content
- Save/bookmark items
- Subscribe/unsubscribe

### 3. Trigger Item

Execute synchronous UI actions (no loading state).

```tsx
{
  id: "settings",
  type: "trigger",
  icon: <Settings className="w-5 h-5" />,
  label: "Settings",
  onClick: () => setModalOpen(true),
  badge: "!", // Optional badge
}
```

**Use cases:**

- Open modals/dialogs
- Open sheets/drawers
- Toggle UI states
- Show/hide components

### 4. Search Item

Toggle expandable search mode.

```tsx
{
  id: "search",
  type: "search",
  icon: <Search className="w-5 h-5" />,
  label: "Search",
  placeholder: "Search...", // Optional placeholder
  onSearch: (query) => {
    // Handle search query
    console.log("Searching:", query);
  },
}
```

**Features:**

- Expands to full-width search bar
- Hides other nav items when active
- Auto-focus on open
- Real-time search callback

## Examples

### Example 1: Home Page with Links

```tsx
"use client";

import { useEffect } from "react";
import { useNav } from "@/components/layout/nav/use-nav";
import { Home, Search, Library } from "lucide-react";

export default function HomePage() {
  const { setNavItems } = useNav();

  useEffect(() => {
    setNavItems([
      {
        id: "home",
        type: "link",
        href: "/",
        icon: <Home className="w-5 h-5" />,
        label: "Home",
      },
      {
        id: "search",
        type: "search",
        icon: <Search className="w-5 h-5" />,
        label: "Search",
        onSearch: (query) => console.log(query),
      },
      {
        id: "library",
        type: "link",
        href: "/library",
        icon: <Library className="w-5 h-5" />,
        label: "Library",
      },
    ]);
  }, [setNavItems]);

  return <div>Content</div>;
}
```

### Example 2: Profile with Actions

```tsx
"use client";

import { useEffect, useState } from "react";
import { useNav } from "@/components/layout/nav/use-nav";
import { Home, Heart, Bookmark } from "lucide-react";

export default function ProfilePage() {
  const { setNavItems } = useNav();
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    setNavItems([
      {
        id: "home",
        type: "link",
        href: "/",
        icon: <Home className="w-5 h-5" />,
        label: "Home",
      },
      {
        id: "follow",
        type: "action",
        icon: <Heart className="w-5 h-5" />,
        label: isFollowing ? "Following" : "Follow",
        successMessage: isFollowing ? "Unfollowed" : "Followed",
        onClick: async () => {
          await api.toggleFollow();
          setIsFollowing(!isFollowing);
        },
      },
      {
        id: "save",
        type: "action",
        icon: <Bookmark className="w-5 h-5" />,
        label: "Save",
        successMessage: "Saved!",
        onClick: async () => {
          await api.saveProfile();
        },
      },
    ]);
  }, [setNavItems, isFollowing]);

  return <div>Profile Content</div>;
}
```

### Example 3: Settings with Modals

```tsx
"use client";

import { useEffect, useState } from "react";
import { useNav } from "@/components/layout/nav/use-nav";
import { Home, Settings, Share2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function SettingsPage() {
  const { setNavItems } = useNav();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    setNavItems([
      {
        id: "home",
        type: "link",
        href: "/",
        icon: <Home className="w-5 h-5" />,
        label: "Home",
      },
      {
        id: "settings",
        type: "trigger",
        icon: <Settings className="w-5 h-5" />,
        label: "Settings",
        onClick: () => setIsModalOpen(true),
      },
      {
        id: "share",
        type: "trigger",
        icon: <Share2 className="w-5 h-5" />,
        label: "Share",
        onClick: () => setIsShareOpen(true),
      },
    ]);
  }, [setNavItems]);

  return (
    <>
      <div>Settings Content</div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>Settings Modal</DialogContent>
      </Dialog>

      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent>Share Modal</DialogContent>
      </Dialog>
    </>
  );
}
```

## API Reference

### useNav Hook

```tsx
const {
  items, // Current nav items
  searchMode, // Whether search is active
  loadingItems, // Set of loading item IDs
  setNavItems, // Set nav items for current page
  toggleSearch, // Toggle search mode
  setItemLoading, // Manually set loading state
} = useNav();
```

### NavItem Types

```typescript
type NavItemBase = {
  id: string;
  icon: ReactNode;
  label: string;
  badge?: number | string;
};

type LinkNavItem = NavItemBase & {
  type: "link";
  href: string;
};

type ActionNavItem = NavItemBase & {
  type: "action";
  onClick: () => Promise<void>;
  loadingText?: string;
  successMessage?: string;
  errorMessage?: string;
};

type TriggerNavItem = NavItemBase & {
  type: "trigger";
  onClick: () => void;
};

type SearchNavItem = NavItemBase & {
  type: "search";
  onSearch?: (query: string) => void;
  placeholder?: string;
};
```

## Tips & Best Practices

### 1. Keep nav items in dependency array

```tsx
useEffect(() => {
  setNavItems([...]);
}, [setNavItems, someDependency]); // Include dependencies
```

### 2. Use meaningful IDs

```tsx
id: "follow-user-123"; // Good
id: "item1"; // Bad
```

### 3. Handle errors in action items

```tsx
onClick: async () => {
  try {
    await api.action();
  } catch (error) {
    throw new Error("Meaningful error message");
  }
};
```

### 4. Clean up state on unmount

```tsx
useEffect(() => {
  setNavItems([...]);

  return () => {
    // Optional cleanup
  };
}, []);
```

## Demo Pages

Check out these pages to see the navigation in action:

- `/` - Home page with basic links and search
- `/library` - Action items with loading states
- `/profile` - Trigger items with modals/sheets

## Customization

### Styling

Edit the nav component styling in `Nav.tsx`:

```tsx
className = "fixed bottom-6 left-1/2 -translate-x-1/2 z-50";
```

### Search Behavior

Customize search in `NavSearch.tsx`:

```tsx
placeholder={item.placeholder || "Search..."}
```

### Toast Messages

Toaster is configured in the layout. Customize in `components/ui/sonner.tsx`.

## Troubleshooting

**Nav items not showing?**

- Make sure you're calling `setNavItems` in a client component
- Check that NavProvider wraps your layout

**Loading state not working?**

- Ensure your onClick returns a Promise
- Check that the item type is "action"

**Search not expanding?**

- Make sure you have a search item in your nav items
- Check that the item type is "search"

**Toast not appearing?**

- Verify Toaster component is in layout
- Check console for errors
