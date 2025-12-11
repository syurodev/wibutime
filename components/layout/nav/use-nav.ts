"use client";

import { useContext } from "react";
import { NavContext } from "./nav-context";

/**
 * useNav Hook
 *
 * Custom hook to access navigation context.
 * Must be used within a NavProvider component.
 *
 * Usage:
 * ```tsx
 * function MyPage() {
 *   const { setNavItems } = useNav();
 *
 *   useEffect(() => {
 *     setNavItems([
 *       { id: "home", type: "link", href: "/", icon: <Home />, label: "Home" }
 *     ]);
 *   }, [setNavItems]);
 * }
 * ```
 *
 * Returns:
 * - items: Current navigation items
 * - searchMode: Whether search mode is active
 * - loadingItems: Set of item IDs in loading state
 * - setNavItems: Function to set nav items for current page
 * - toggleSearch: Function to toggle search mode
 * - setItemLoading: Function to set loading state for an item
 */
export function useNav() {
  const context = useContext(NavContext);

  // Throw error if hook is used outside of NavProvider
  if (!context) {
    throw new Error("useNav must be used within a NavProvider");
  }

  return context;
}
