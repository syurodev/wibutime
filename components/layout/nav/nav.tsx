"use client";

import { CompactCommentEditor } from "@/features/editor/components/compact-comment-editor";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useUiPreferences } from "@/hooks/use-user-settings";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_ITEM_IDS,
  defaultItemsEnd,
  defaultItemsStart,
} from "./default-nav-items";
import { NavAccountButton } from "./nav-account-button";
import { NavAccountMenuContent } from "./nav-account-menu";
import { NavActionItem } from "./nav-action-item";
import { NavLinkItem } from "./nav-link-item";
import { NavPaginationButton } from "./nav-pagination-button";
import { NavSearch } from "./nav-search";
import { NavSearchButton } from "./nav-search-button";
import { NavSettingsMenuContent } from "./nav-settings-menu";
import { NavTriggerItem } from "./nav-trigger-item";
import { useNav } from "./use-nav";

// --- PHYSICS (Snappy & Smooth) ---
const SPRING_PHYSICS = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
  mass: 0.8,
};

const Nav = () => {
  const fullPathname = usePathname();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const pathname = useMemo(() => fullPathname.split("?")[0], [fullPathname]);
  const {
    items,
    searchMode,
    commentMode,
    toggleSearch,
    toggleComment,
    accountMenuOpen,
    toggleAccountMenu,
    settingsMenuOpen,
    toggleSettingsMenu,
    loadingItems,
    setItemLoading,
  } = useNav();
  const { breakpoint } = useMediaQuery();
  const { preferences } = useUiPreferences();
  const [hasAnimated, setHasAnimated] = useState(false);
  useEffect(() => {
    if (!hasAnimated) setHasAnimated(true);
  }, [hasAnimated]);
  const reduceBlur = preferences.glass_effect === "reduce";

  // --- LOGIC GỘP ITEMS (FIXED ORDER) ---
  const pageItems = useMemo(
    () =>
      items.filter(
        (item) => !DEFAULT_ITEM_IDS.has(item.id) && item.type !== "search"
      ),
    [items]
  );

  const mergedItems = useMemo(
    () => [...defaultItemsStart, ...pageItems, ...defaultItemsEnd],
    [pageItems]
  );

  const searchItem = mergedItems.find((item) => item.type === "search");

  // Logic Pagination
  const paginationItems = mergedItems.filter(
    (item) => item.type === "pagination"
  );
  // --- FIX: Thêm lại biến này (đã bị thiếu ở phiên bản trước) ---
  const visiblePaginationItems = searchMode ? [] : paginationItems;

  const navListItems = mergedItems.filter(
    (item) => item.type !== "search" && item.type !== "pagination"
  );

  const getMaxVisibleItems = () => {
    switch (breakpoint) {
      case "mobile":
        return 3;
      case "tablet":
        return 4;
      default:
        return Infinity;
    }
  };
  const maxVisibleItems = getMaxVisibleItems();

  const hasOverflow = navListItems.length > maxVisibleItems;
  const visibleItems = hasOverflow
    ? navListItems.slice(0, maxVisibleItems)
    : navListItems;
  const overflowItems = hasOverflow ? navListItems.slice(maxVisibleItems) : [];

  const [navWidth, setNavWidth] = useState<number | null>(null);
  const [isInitialMount, setIsInitialMount] = useState(true);

  const containerExpanded =
    searchMode || commentMode || accountMenuOpen || settingsMenuOpen;

  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const focusTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const measureContainerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // State to delay menu expansion until scale animation completes (mobile fix)
  const [delayedExpansion, setDelayedExpansion] = useState(false);
  // On mobile, touch triggers hover, so we track based on containerExpanded instead
  const wasCollapsedRef = useRef(true);

  // Track when we need to delay expansion (going from scaled-down to expanded)
  useEffect(() => {
    if (containerExpanded) {
      // On mobile, always delay since touch triggers hover simultaneously
      // On desktop, only delay if nav was in collapsed state (not hovered/focused)
      const shouldDelay =
        breakpoint === "mobile"
          ? wasCollapsedRef.current
          : wasCollapsedRef.current && !isHovered && !isFocused;

      if (shouldDelay) {
        const timer = setTimeout(() => {
          setDelayedExpansion(true);
        }, 200); // Wait for scale animation to complete
        return () => clearTimeout(timer);
      } else {
        // Already expanded (hovered/focused), no delay needed
        setDelayedExpansion(true);
      }
    } else {
      setDelayedExpansion(false);
      // Reset wasCollapsed when menu closes
      wasCollapsedRef.current = true;
    }
  }, [containerExpanded, breakpoint, isHovered, isFocused]);

  // Use delayedExpansion for content rendering on mobile
  const shouldShowExpandedContent =
    breakpoint === "mobile" ? delayedExpansion : containerExpanded;

  useEffect(() => {
    if (isInitialMount && navWidth !== null) {
      const timer = setTimeout(() => setIsInitialMount(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isInitialMount, navWidth]);

  useEffect(() => {
    if (searchMode || commentMode || accountMenuOpen || settingsMenuOpen)
      return;
    let rafId: number;
    const measure = () => {
      if (measureContainerRef.current) {
        const totalWidth =
          measureContainerRef.current.getBoundingClientRect().width;
        if (totalWidth > 100 && totalWidth !== navWidth)
          setNavWidth(totalWidth);
      }
    };
    rafId = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(rafId);
  }, [
    searchMode,
    commentMode,
    accountMenuOpen,
    settingsMenuOpen,
    items,
    navWidth,
  ]);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => setIsHovered(false), 300);
  };
  const handleFocus = () => {
    if (focusTimeoutRef.current) clearTimeout(focusTimeoutRef.current);
    setIsFocused(true);
  };
  const handleBlur = () => {
    focusTimeoutRef.current = setTimeout(() => setIsFocused(false), 300);
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        if (searchMode) toggleSearch();
        else if (commentMode) toggleComment();
        else if (accountMenuOpen) toggleAccountMenu();
        else if (settingsMenuOpen) toggleSettingsMenu();
      }
    };
    if (containerExpanded)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [
    containerExpanded,
    toggleSearch,
    toggleComment,
    toggleAccountMenu,
    toggleSettingsMenu,
    searchMode,
    commentMode,
    accountMenuOpen,
    settingsMenuOpen,
  ]);
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (searchMode) toggleSearch();
        else if (commentMode) toggleComment();
        else if (accountMenuOpen) toggleAccountMenu();
        else if (settingsMenuOpen) toggleSettingsMenu();
      }
    };
    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, [
    searchMode,
    commentMode,
    accountMenuOpen,
    settingsMenuOpen,
    toggleSearch,
    toggleComment,
    toggleAccountMenu,
    toggleSettingsMenu,
  ]);

  // Close all menus and collapse nav on scroll
  useEffect(() => {
    const handleScroll = () => {
      // Close any open menu
      if (searchMode) toggleSearch();
      else if (commentMode) toggleComment();
      else if (accountMenuOpen) toggleAccountMenu();
      else if (settingsMenuOpen) toggleSettingsMenu();

      // Also collapse the nav (remove hover state)
      setIsHovered(false);
      setIsFocused(false);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [
    searchMode,
    commentMode,
    accountMenuOpen,
    settingsMenuOpen,
    toggleSearch,
    toggleComment,
    toggleAccountMenu,
    toggleSettingsMenu,
  ]);

  const isExpanded = isHovered || isFocused || containerExpanded;

  const getContainerWidthValue = () => {
    // On mobile, use delayed expansion to let scale animation complete first
    const shouldExpand =
      breakpoint === "mobile" ? shouldShowExpandedContent : containerExpanded;
    if (shouldExpand) {
      if (breakpoint === "mobile") return "calc(100vw - 32px)";
      return 400;
    }
    if (isInitialMount) return 56;
    if (navWidth) return navWidth;
    return "auto";
  };

  // --- RENDER HELPERS ---

  const navDefault = () => (
    <motion.ul
      key="nav-default"
      initial={{ opacity: 0, scale: 0.9, filter: "blur(5px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{
        opacity: 0,
        scale: 0.95,
        filter: "blur(5px)",
        transition: { duration: 0.2 },
      }}
      transition={{ duration: 0.2 }}
      className={cn(
        !containerExpanded ? "absolute inset-0 m-auto" : "relative",
        "flex items-center gap-2 justify-center",
        "whitespace-nowrap flex-nowrap",
        "h-[56px] w-full"
      )}
      style={{ willChange: "transform, opacity" }}
    >
      <AnimatePresence mode="popLayout">
        {visibleItems.map((item, index) => {
          switch (item.type) {
            case "link":
              return (
                <NavLinkItem
                  key={item.id}
                  item={item}
                  index={index}
                  hasAnimated={hasAnimated}
                />
              );
            case "action":
              return (
                <NavActionItem
                  key={item.id}
                  item={item}
                  index={index}
                  hasAnimated={hasAnimated}
                />
              );
            case "trigger":
              return (
                <NavTriggerItem
                  key={item.id}
                  item={item}
                  index={index}
                  hasAnimated={hasAnimated}
                />
              );
            default:
              return null;
          }
        })}
        {visiblePaginationItems.map((item, index) => (
          <motion.li
            key={item.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <NavPaginationButton
              currentPage={item.currentPage}
              totalPages={item.totalPages}
              onPageChange={item.onPageChange}
              isActive={false}
            />
          </motion.li>
        ))}
        {searchItem?.type === "search" && (
          <NavSearchButton
            key="search-button"
            item={searchItem}
            index={visibleItems.length}
            hasAnimated={hasAnimated}
          />
        )}
        <NavAccountButton
          index={visibleItems.length + (searchItem ? 1 : 0)}
          overflowCount={overflowItems.length}
        />
      </AnimatePresence>
    </motion.ul>
  );

  const navExpandedContent = (children: React.ReactNode, key: string) => (
    <motion.div
      key={key}
      initial={{ opacity: 0, filter: "blur(10px)", scale: 0.98 }}
      animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
      exit={{
        opacity: 0,
        filter: "blur(10px)",
        scale: 0.98,
        position: "absolute",
        inset: 0,
        transition: { duration: 0.15 },
      }}
      transition={SPRING_PHYSICS}
      className={cn("w-[400px] max-w-[calc(100vw-64px)]", "origin-top")}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );

  return (
    <nav
      className={cn(
        "fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-300",
        isExpanded ? "bottom-6" : "bottom-4"
      )}
    >
      <motion.div
        ref={navRef}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: isExpanded ? 1 : 0.6, opacity: 1 }}
        transition={SPRING_PHYSICS}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          layout
          className={cn(
            "relative shadow-2xl rounded-2xl overflow-hidden",
            reduceBlur && "bg-background border border-border",
            !reduceBlur &&
              (isExpanded
                ? "backdrop-blur-xl bg-background/80 saturate-150 border border-white/20"
                : "backdrop-blur-md bg-background/50 border border-white/10")
          )}
          animate={{
            width: getContainerWidthValue(),
          }}
          transition={SPRING_PHYSICS}
          style={{
            minHeight: 56,
            transform: "translateZ(0)",
          }}
        >
          <motion.div
            layout="position"
            className={cn(
              "relative flex justify-center w-full",
              containerExpanded ? "items-start" : "items-center"
            )}
            style={{
              padding: containerExpanded ? "12px 16px" : "0 16px",
              minHeight: 56,
            }}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {shouldShowExpandedContent &&
                searchMode &&
                navExpandedContent(
                  <NavSearch
                    item={searchItem!}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />,
                  "search"
                )}
              {shouldShowExpandedContent &&
                commentMode &&
                navExpandedContent(
                  <CompactCommentEditor
                    onSubmit={() => toggleComment()}
                    onCancel={() => toggleComment()}
                    placeholder="Write a comment..."
                    autoFocus
                  />,
                  "comment"
                )}
              {shouldShowExpandedContent &&
                accountMenuOpen &&
                navExpandedContent(
                  <NavAccountMenuContent
                    onClose={toggleAccountMenu}
                    items={overflowItems}
                    loadingItems={loadingItems}
                    setItemLoading={setItemLoading}
                  />,
                  "account"
                )}
              {shouldShowExpandedContent &&
                settingsMenuOpen &&
                navExpandedContent(
                  <NavSettingsMenuContent onClose={toggleSettingsMenu} />,
                  "settings"
                )}
              {!containerExpanded && navDefault()}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </motion.div>
      {!containerExpanded && (
        <div
          ref={measureContainerRef}
          className="fixed pointer-events-none opacity-0 left-0 top-0"
          style={{ width: "auto", padding: "0 16px" }}
          aria-hidden="true"
        >
          <ul className="flex items-center gap-2">
            {visibleItems.map((item) => (
              <li key={item.id} className="p-3">
                {item.icon}
              </li>
            ))}
            {paginationItems.map((item) => (
              <li key={item.id} className="p-3">
                <div className="h-6 w-6" />
              </li>
            ))}
            {searchItem && (
              <li className="p-3">
                <div className="h-6 w-6" />
              </li>
            )}
            <li className="p-3">
              <div className="h-6 w-6" />
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Nav;
