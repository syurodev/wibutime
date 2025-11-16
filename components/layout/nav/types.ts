import { ReactNode } from "react";

/**
 * Navigation Type Definitions
 *
 * Defines all types for the dynamic navigation system.
 * Four types of nav items: Link, Action, Trigger, and Search.
 */

/**
 * Base properties shared by all nav items
 */
export type NavItemBase = {
  id: string; // Unique identifier for the item
  icon: ReactNode; // Icon component (usually from lucide-react)
  label: string; // Display text below the icon
  badge?: number | string; // Optional badge for notifications/counts
};

/**
 * Link Nav Item
 *
 * Navigates to a different page when clicked.
 * Uses Next.js Link component with i18n routing.
 *
 * Example:
 * {
 *   id: "home",
 *   type: "link",
 *   href: "/",
 *   icon: <Home />,
 *   label: "Home"
 * }
 */
export type LinkNavItem = NavItemBase & {
  type: "link";
  href: string; // Destination path (locale prefix added automatically)
};

/**
 * Action Nav Item
 *
 * Executes an async operation (API call) when clicked.
 * Shows loading spinner and displays toast notifications.
 *
 * Example:
 * {
 *   id: "follow",
 *   type: "action",
 *   icon: <Heart />,
 *   label: "Follow",
 *   onClick: async () => { await api.follow() },
 *   successMessage: "Followed!",
 *   errorMessage: "Failed to follow"
 * }
 */
export type ActionNavItem = NavItemBase & {
  type: "action";
  onClick: () => Promise<void>; // Async function to execute
  loadingText?: string; // Text to show while loading (optional)
  successMessage?: string; // Toast message on success (optional)
  errorMessage?: string; // Toast message on error (optional)
};

/**
 * Trigger Nav Item
 *
 * Executes a synchronous UI action when clicked (no loading state).
 * Perfect for opening modals, dialogs, sheets, etc.
 *
 * Example:
 * {
 *   id: "settings",
 *   type: "trigger",
 *   icon: <Settings />,
 *   label: "Settings",
 *   onClick: () => setModalOpen(true)
 * }
 */
export type TriggerNavItem = NavItemBase & {
  type: "trigger";
  onClick: () => void; // Synchronous function to execute
};

/**
 * Search Nav Item
 *
 * Special item that toggles search mode.
 * When clicked, nav expands to show full-width search input.
 *
 * Example:
 * {
 *   id: "search",
 *   type: "search",
 *   icon: <Search />,
 *   label: "Search",
 *   placeholder: "Search...",
 *   onSearch: (query) => console.log(query)
 * }
 */
export type SearchNavItem = NavItemBase & {
  type: "search";
  onSearch?: (query: string) => void; // Callback when search query changes (optional)
  placeholder?: string; // Placeholder text for search input (optional)
};

/**
 * Pagination Nav Item
 *
 * Compact inline pagination controls for list pages.
 * Displays current page and total pages with prev/next arrows.
 * Automatically hidden when search mode is active.
 *
 * Example:
 * {
 *   id: "pagination",
 *   type: "pagination",
 *   icon: <FileText />,
 *   label: "Page",
 *   currentPage: 2,
 *   totalPages: 10,
 *   onPageChange: (page) => router.push(`?page=${page}`)
 * }
 */
export type PaginationNavItem = NavItemBase & {
  type: "pagination";
  currentPage: number; // Current active page (1-indexed)
  totalPages: number; // Total number of pages
  onPageChange: (page: number) => void; // Callback when page changes
};

/**
 * Union type of all nav item types
 * Allows type-safe rendering based on item.type
 */
export type NavItem =
  | LinkNavItem
  | ActionNavItem
  | TriggerNavItem
  | SearchNavItem
  | PaginationNavItem;

/**
 * Navigation Context Type
 *
 * Defines the shape of the navigation context value.
 * Used by useNav hook to access navigation state.
 */
export type NavContextType = {
  items: NavItem[]; // Current navigation items
  searchMode: boolean; // Whether search mode is active
  commentMode: boolean; // Whether comment mode is active
  accountMenuOpen: boolean; // Whether Account menu dropdown is open
  loadingItems: Set<string>; // Set of item IDs in loading state
  setNavItems: (items: NavItem[]) => void; // Set nav items for current page
  toggleSearch: () => void; // Toggle search mode on/off
  toggleComment: () => void; // Toggle comment mode on/off
  toggleAccountMenu: () => void; // Toggle Account menu dropdown on/off
  setItemLoading: (itemId: string, loading: boolean) => void; // Set loading state for an item
};
