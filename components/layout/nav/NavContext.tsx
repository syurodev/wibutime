"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { NavContextType, NavItem } from "./types";

/**
 * Navigation Context
 *
 * Provides global state management for the navigation bar.
 * Allows pages to dynamically control navigation items, search mode, and loading states.
 */
export const NavContext = createContext<NavContextType | undefined>(undefined);

interface NavProviderProps {
  readonly children: ReactNode;
}

/**
 * Navigation Context Provider
 *
 * Wraps the application to provide navigation state to all child components.
 * Should be placed in the layout component.
 */
export function NavProvider({ children }: NavProviderProps) {
  // Debug: Track component mount/unmount
  useEffect(() => {
    console.log("[NavProvider Debug] 🟢 NavProvider MOUNTED");
    return () => {
      console.log("[NavProvider Debug] 🔴 NavProvider UNMOUNTED");
    };
  }, []);

  // Current navigation items (set by each page)
  const [items, setItems] = useState<NavItem[]>([]);

  // Whether search mode is active (nav expanded to show search input)
  const [searchMode, setSearchMode] = useState(false);

  // Whether comment mode is active (nav expanded to show comment editor)
  const [commentMode, setCommentMode] = useState(false);

  // Whether Account menu dropdown is open
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  // Set of item IDs that are currently in loading state (for action items)
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());

  /**
   * Set navigation items for the current page
   * Wrapped in useCallback to prevent infinite loops in useEffect
   */
  const setNavItems = useCallback((newItems: NavItem[]) => {
    setItems(newItems);
  }, []);

  /**
   * Toggle search mode on/off
   * When on, nav expands to show search input
   */
  const toggleSearch = useCallback(() => {
    setSearchMode((prev) => !prev);
    // Close comment mode when opening search
    if (!searchMode) setCommentMode(false);
  }, [searchMode]);

  /**
   * Toggle comment mode on/off
   * When on, nav expands to show comment editor
   */
  const toggleComment = useCallback(() => {
    setCommentMode((prev) => !prev);
    // Close search mode when opening comment
    if (!commentMode) setSearchMode(false);
  }, [commentMode]);

  /**
   * Toggle Account menu dropdown on/off
   */
  const toggleAccountMenu = useCallback(() => {
    setAccountMenuOpen((prev) => !prev);
  }, []);

  /**
   * Set loading state for a specific nav item
   * Used by action items to show loading spinner
   */
  const setItemLoading = useCallback((itemId: string, loading: boolean) => {
    setLoadingItems((prev) => {
      const newSet = new Set(prev);
      if (loading) {
        newSet.add(itemId); // Add to loading set
      } else {
        newSet.delete(itemId); // Remove from loading set
      }
      return newSet;
    });
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      items,
      searchMode,
      commentMode,
      accountMenuOpen,
      loadingItems,
      setNavItems,
      toggleSearch,
      toggleComment,
      toggleAccountMenu,
      setItemLoading,
    }),
    [
      items,
      searchMode,
      commentMode,
      accountMenuOpen,
      loadingItems,
      setNavItems,
      toggleSearch,
      toggleComment,
      toggleAccountMenu,
      setItemLoading,
    ]
  );

  // Debug: Track context value changes
  useEffect(() => {
    console.log("[NavContext Debug] contextValue changed!", {
      itemsCount: items.length,
      searchMode,
      commentMode,
      accountMenuOpen,
      loadingItemsSize: loadingItems.size,
    });
  }, [
    contextValue,
    items.length,
    searchMode,
    commentMode,
    accountMenuOpen,
    loadingItems,
  ]);

  return (
    <NavContext.Provider value={contextValue}>{children}</NavContext.Provider>
  );
}
