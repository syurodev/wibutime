"use client";

import {
  createContext,
  useCallback,
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
  // Current navigation items (set by each page)
  const [items, setItems] = useState<NavItem[]>([]);

  // Whether search mode is active (nav expanded to show search input)
  const [searchMode, setSearchMode] = useState(false);

  // Whether comment mode is active (nav expanded to show comment editor)
  const [commentMode, setCommentMode] = useState(false);

  // Whether Account menu dropdown is open
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  // Whether Settings menu is open (new)
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);

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
    // Close other modes
    if (!searchMode) {
      setCommentMode(false);
      setSettingsMenuOpen(false);
    }
  }, [searchMode]);

  /**
   * Toggle comment mode on/off
   * When on, nav expands to show comment editor
   */
  const toggleComment = useCallback(() => {
    setCommentMode((prev) => !prev);
    // Close other modes
    if (!commentMode) {
      setSearchMode(false);
      setSettingsMenuOpen(false);
    }
  }, [commentMode]);

  /**
   * Toggle Account menu dropdown on/off
   */
  const toggleAccountMenu = useCallback(() => {
    setAccountMenuOpen((prev) => !prev);
    if (!accountMenuOpen) {
      setSettingsMenuOpen(false); // Close settings when opening account
    }
  }, [accountMenuOpen]);

  /**
   * Toggle Settings menu on/off (new)
   */
  const toggleSettingsMenu = useCallback(() => {
    setSettingsMenuOpen((prev) => !prev);
    // Close other modes
    if (!settingsMenuOpen) {
      setSearchMode(false);
      setCommentMode(false);
      setAccountMenuOpen(false);
    }
  }, [settingsMenuOpen]);

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
      settingsMenuOpen,
      loadingItems,
      setNavItems,
      toggleSearch,
      toggleComment,
      toggleAccountMenu,
      toggleSettingsMenu,
      setItemLoading,
    }),
    [
      items,
      searchMode,
      commentMode,
      accountMenuOpen,
      settingsMenuOpen,
      loadingItems,
      setNavItems,
      toggleSearch,
      toggleComment,
      toggleAccountMenu,
      toggleSettingsMenu,
      setItemLoading,
    ]
  );

  return (
    <NavContext.Provider value={contextValue}>{children}</NavContext.Provider>
  );
}
