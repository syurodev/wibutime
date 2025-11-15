"use client";

import { CompactCommentEditor } from "@/components/editor/compact-comment-editor";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { MoreHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";
import type { TNode } from "platejs";
import { useEffect, useRef, useState } from "react";
import {
  DEFAULT_ITEM_IDS,
  defaultItemsEnd,
  defaultItemsStart,
} from "./defaultNavItems";
import { NavActionItem } from "./NavActionItem";
import { NavLinkItem } from "./NavLinkItem";
import { NavMore } from "./NavMore";
import { NavPaginationButton } from "./NavPaginationButton";
import { NavSearch } from "./NavSearch";
import { NavSearchButton } from "./NavSearchButton";
import { NavTriggerItem } from "./NavTriggerItem";
import { useNav } from "./useNav";

/**
 * Main Navigation Component
 *
 * Renders a bottom navigation bar that dynamically displays items based on
 * the current page's configuration. Supports search mode where the nav expands
 * to show a search bar.
 *
 * Both nav items and search content animate with slide-from-bottom effect.
 */
const Nav = () => {
  // Get current pathname to force re-render on page change
  const pathname = usePathname();

  // Get nav state from context
  const {
    items,
    searchMode,
    commentMode,
    toggleSearch,
    toggleComment,
    moreMenuOpen,
    toggleMoreMenu,
    loadingItems,
    setItemLoading,
  } = useNav();

  // Get current breakpoint for responsive behavior
  const { breakpoint } = useMediaQuery();

  /**
   * Merge default navigation items with page-specific items
   * - defaultItemsStart appear FIRST (e.g., Home)
   * - Page items appear in the MIDDLE
   * - defaultItemsEnd appear LAST (e.g., Search)
   *
   * Filter out:
   * - Items with IDs that conflict with defaults
   * - Search items from pages (we use default search)
   */
  const pageItems = items.filter(
    (item) =>
      !DEFAULT_ITEM_IDS.has(item.id) && // No default ID conflicts
      item.type !== "search" // No page-specific search (use default)
  );

  const mergedItems = [...defaultItemsStart, ...pageItems, ...defaultItemsEnd];

  // Separate search and pagination items from other nav items
  // Search item is handled specially (can expand to full width)
  // Pagination items are hidden when search mode is active
  const searchItem = mergedItems.find((item) => item.type === "search");
  const paginationItems = mergedItems.filter(
    (item) => item.type === "pagination"
  );
  const otherItems = mergedItems.filter(
    (item) => item.type !== "search" && item.type !== "pagination"
  );

  // Hide pagination items when search mode is active (per user requirement)
  const visiblePaginationItems = searchMode ? [] : paginationItems;

  // Calculate max visible items based on breakpoint
  const getMaxVisibleItems = () => {
    switch (breakpoint) {
      case "mobile":
        return 3; // Show 3 items + More button on mobile
      case "tablet":
        return 4; // Show 4 items + More button on tablet
      default:
        return Infinity; // Show all items on desktop
    }
  };

  const maxVisibleItems = getMaxVisibleItems();

  // Auto-prioritize items: Links first, then Actions/Triggers
  const prioritizeItems = (items: typeof otherItems) => {
    const linkItems = items.filter((item) => item.type === "link");
    const otherItemTypes = items.filter((item) => item.type !== "link");
    return [...linkItems, ...otherItemTypes];
  };

  const prioritizedItems = prioritizeItems(otherItems);

  // Split into visible and overflow items
  const hasOverflow = prioritizedItems.length > maxVisibleItems;
  const visibleItems = hasOverflow
    ? prioritizedItems.slice(0, maxVisibleItems)
    : prioritizedItems;
  const overflowItems = hasOverflow
    ? prioritizedItems.slice(maxVisibleItems)
    : [];

  // Calculate total nav items for dynamic container duration
  // This ensures container resize matches stagger animation timing
  const totalNavItems =
    visibleItems.length +
    visiblePaginationItems.length +
    (searchItem ? 1 : 0) +
    (hasOverflow ? 1 : 0);

  // Dynamic container duration: base (200ms) + stagger delay (30ms per item)
  const baseDuration = 0.2; // 200ms base exit animation
  const staggerPerItem = 0.03; // 30ms stagger between items
  const containerDuration = baseDuration + totalNavItems * staggerPerItem;

  // State to store measured nav width for smooth transitions
  const [navWidth, setNavWidth] = useState<number | null>(null);

  // Initial mount state for entry animation (square → width)
  const [isInitialMount, setIsInitialMount] = useState(true);

  // Compute container expansion state directly (no delay needed)
  const containerExpanded = searchMode || commentMode;

  // Track hover and focus state for scale animation
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Timeout refs for delayed scale-down animation
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const focusTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Hidden ref container for measuring natural width without affecting visible layout
  const measureContainerRef = useRef<HTMLDivElement>(null);

  // Ref for nav container to detect click outside
  const navRef = useRef<HTMLDivElement>(null);

  // Initial mount animation: start as square, then expand to measured width
  useEffect(() => {
    if (isInitialMount && navWidth !== null) {
      // Delay to show square state before expanding
      const timer = setTimeout(() => {
        setIsInitialMount(false);
      }, 200); // 200ms to see the square shape

      return () => clearTimeout(timer);
    }
  }, [isInitialMount, navWidth]);

  // Measure nav content width when items change
  // Measure immediately so width transition happens simultaneously with item animations
  useEffect(() => {
    if (searchMode || commentMode) {
      return;
    }

    // Use requestAnimationFrame for smoother measurement sync with render cycle
    const rafId = requestAnimationFrame(() => {
      if (measureContainerRef.current) {
        // Measure the hidden container width (already includes padding from inline style)
        // getBoundingClientRect() returns total width including padding
        const totalWidth =
          measureContainerRef.current.getBoundingClientRect().width;

        // Only set width if it's reasonable (> 100px)
        if (totalWidth > 100 && totalWidth !== navWidth) {
          setNavWidth(totalWidth);
        }
      }
    });

    return () => {
      cancelAnimationFrame(rafId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchMode, commentMode, items]);

  // Handlers for hover with delay
  const handleMouseEnter = () => {
    // Clear any pending timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    // Delay scale-down by 300ms
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 300);
  };

  // Handlers for focus with delay
  const handleFocus = () => {
    // Clear any pending timeout
    if (focusTimeoutRef.current) {
      clearTimeout(focusTimeoutRef.current);
      focusTimeoutRef.current = null;
    }
    setIsFocused(true);
  };

  const handleBlur = () => {
    // Delay scale-down by 300ms
    focusTimeoutRef.current = setTimeout(() => {
      setIsFocused(false);
    }, 300);
  };

  // Detect scroll to collapse nav
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // If scrolling (position changed)
      if (currentScrollY !== lastScrollY) {
        // Clear hover and focus states when scrolling
        setIsHovered(false);
        setIsFocused(false);

        // Clear existing timeout
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (focusTimeoutRef.current) clearTimeout(focusTimeoutRef.current);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Handle click outside to close search mode
  useEffect(() => {
    if (!searchMode) return;

    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside nav container
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        toggleSearch();
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchMode, toggleSearch]);

  // Handle click outside to close comment mode
  useEffect(() => {
    if (!commentMode) return;

    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside nav container
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        toggleComment();
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [commentMode, toggleComment]);

  // Handle ESC key to close search or comment mode
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (searchMode) {
          toggleSearch();
        } else if (commentMode) {
          toggleComment();
        }
      }
    };

    // Add event listener
    document.addEventListener("keydown", handleEscKey);

    // Clean up
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [searchMode, commentMode, toggleSearch, toggleComment]);

  // Determine if nav should be expanded (full size)
  const isExpanded = isHovered || isFocused || searchMode || commentMode;

  // Calculate container width based on current state
  const getContainerWidth = () => {
    if (containerExpanded) {
      // Responsive width: full width on mobile with margins, 400px on desktop
      if (breakpoint === "mobile") {
        return "calc(100vw - 32px)"; // 16px margin on each side
      }
      return "400px";
    }
    if (isInitialMount) {
      return "56px"; // Initial: square (width = height)
    }
    if (navWidth) {
      return `${navWidth}px`;
    }
    return "auto";
  };

  const commentModeNav = () => {
    return (
      <motion.div
        key="comment-content"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{
          duration: 0.2,
          ease: [0.4, 0, 0.2, 1],
        }}
        className="w-full"
      >
        <CompactCommentEditor
          onSubmit={(content: TNode[]) => {
            // Handle comment submission
            // TODO: Add your comment submission logic here
            toggleComment(); // Close after submit
          }}
          onCancel={() => {
            toggleComment(); // Close on cancel
          }}
          placeholder="Write a comment..."
          autoFocus={true}
        />
      </motion.div>
    );
  };

  const navDefault = () => {
    return (
      <motion.ul
        key={`nav-content-${pathname}`}
        className="flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.2,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        <AnimatePresence mode="popLayout">
          {/* Render each visible nav item based on its type with index for stagger */}
          {visibleItems.map((item, index) => {
            switch (item.type) {
              case "link":
                // Link item: navigate to another page
                return <NavLinkItem key={item.id} item={item} index={index} />;
              case "action":
                // Action item: async operation (API calls)
                return (
                  <NavActionItem key={item.id} item={item} index={index} />
                );
              case "trigger":
                // Trigger item: sync UI action (open modal)
                return (
                  <NavTriggerItem key={item.id} item={item} index={index} />
                );
              default:
                return null;
            }
          })}
          {/* Render pagination items (hidden during search mode) */}
          {visiblePaginationItems.map((item, index) => (
            <motion.li
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{
                duration: 0.2,
                delay: (visibleItems.length + index) * 0.05,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <NavPaginationButton
                currentPage={item.currentPage}
                totalPages={item.totalPages}
                onPageChange={item.onPageChange}
                isActive={false}
              />
            </motion.li>
          ))}
          {/* Render search button when not in search mode */}
          {searchItem?.type === "search" && (
            <NavSearchButton
              key="search-button"
              item={searchItem}
              index={visibleItems.length}
            />
          )}
          {/* Render More button when there are overflow items */}
          {hasOverflow && (
            <NavTriggerItem
              key="more-button"
              item={{
                id: "more",
                type: "trigger",
                icon: <MoreHorizontal />,
                label: "More",
                badge: overflowItems.length,
                onClick: toggleMoreMenu,
              }}
              index={visibleItems.length + (searchItem ? 1 : 0)}
            />
          )}
        </AnimatePresence>
      </motion.ul>
    );
  };

  const navSearchMode = () => {
    return (
      <motion.div
        key="search-content"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{
          duration: 0.2,
          ease: [0.4, 0, 0.2, 1],
        }}
        className="w-full"
      >
        {searchItem?.type === "search" && (
          <NavSearch
            item={searchItem}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        )}
      </motion.div>
    );
  };

  const renderNavContent = () => {
    if (searchMode) {
      // Search mode: show search input with results (dynamic height)
      return navSearchMode();
    }

    if (commentMode) {
      // Comment mode: show compact comment editor (dynamic height)
      return commentModeNav();
    }

    // Nav mode: show navigation items
    // Exit duration matches nav items (200ms) for uniform animation
    return navDefault();
  };

  return (
    // Fixed position at bottom center of screen
    <nav
      className={cn(
        "fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-300",
        isExpanded ? "bottom-6" : "bottom-4"
      )}
    >
      {/* Initial mount animation wrapper with hover/focus scale effect */}
      <motion.div
        ref={navRef}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: isExpanded ? 1 : 0.6,
          opacity: 1,
        }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/*
        Nav container with glass morphism effect
        Uses CSS transition for width animation
        Width transitions smoothly between measured nav width and search width (400px)
      */}
        <div
          className={cn(
            "relative shadow-lg rounded-2xl",
            isInitialMount && "overflow-hidden",
            isExpanded
              ? "backdrop-blur-xl bg-background/80"
              : "backdrop-blur-md bg-background/40"
          )}
          style={{
            minHeight: "56px",
            width: getContainerWidth(),
            transition: `all ${containerDuration}s ease-in-out`,
          }}
        >
          {/*
          Content wrapper with dynamic height
          Nav mode: Fixed at 56px total (32px content + 24px padding)
          Search mode: Expands smoothly up to 600px max
          Comment mode: No overflow-hidden to allow floating toolbar to render outside
          Using max-height for smooth CSS transition (height: auto doesn't transition)
        */}
          <div
            className={cn(
              "relative flex items-center",
              !commentMode && "overflow-hidden"
            )}
            style={{
              height: containerExpanded ? "auto" : "56px",
              maxHeight: containerExpanded ? "600px" : "56px",
              padding: "12px 16px",
              transition: `all ${containerDuration}s ease-in-out`,
            }}
          >
            {/* AnimatePresence for smooth transitions between modes */}
            {/* mode="wait" ensures exit completes before enter starts */}
            <AnimatePresence initial={false} mode="wait">
              {renderNavContent()}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Hidden measurement container - always renders with width: auto for accurate measurement */}
      {!searchMode && !commentMode && (
        <div
          ref={measureContainerRef}
          className="fixed pointer-events-none opacity-0 left-0 top-0"
          style={{
            width: "auto",
            padding: "12px 16px",
          }}
          aria-hidden="true"
        >
          <ul className="flex items-center gap-2">
            {visibleItems.map((item) => {
              // Render simplified item structure for measurement (no animations/tooltips)
              return (
                <li key={item.id} className="p-3">
                  {item.icon}
                </li>
              );
            })}
            {/* Include pagination items in measurement */}
            {paginationItems.map((item) => (
              <li key={item.id} className="rounded-full px-3 py-2">
                <div className="flex items-center gap-1">
                  <div className="h-6 w-6" />
                  <div className="px-1 text-sm">
                    <span className="hidden sm:inline">Page</span>
                    <span>{item.currentPage}</span>
                    <span>/</span>
                    <span>{item.totalPages}</span>
                  </div>
                  <div className="h-6 w-6" />
                </div>
              </li>
            ))}
            {searchItem && <li className="p-3">{searchItem.icon}</li>}
            {hasOverflow && (
              <li className="p-3">
                <MoreHorizontal />
              </li>
            )}
          </ul>
        </div>
      )}

      {/* More Menu Drawer */}
      <NavMore
        open={moreMenuOpen}
        onOpenChange={toggleMoreMenu}
        items={overflowItems}
        loadingItems={loadingItems}
        setItemLoading={setItemLoading}
      />
    </nav>
  );
};

export default Nav;
