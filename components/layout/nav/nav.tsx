"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NavActionItem } from "./NavActionItem";
import { NavLinkItem } from "./NavLinkItem";
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
  const { items, searchMode, toggleSearch } = useNav();

  // Separate search item from other nav items
  // Search item is handled specially (can expand to full width)
  const searchItem = items.find((item) => item.type === "search");
  const otherItems = items.filter((item) => item.type !== "search");

  // State to store measured nav width for smooth transitions
  const [navWidth, setNavWidth] = useState<number | null>(null);

  // Initial mount state for entry animation (square → width)
  const [isInitialMount, setIsInitialMount] = useState(true);

  // Delayed state for container dimensions to coordinate with animations
  const [containerSearchMode, setContainerSearchMode] = useState(searchMode);

  // Track hover and focus state for scale animation
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Timeout refs for delayed scale-down animation
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const focusTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Coordinate container timing with animations
  // Container resize is delayed to sync with animation sequence
  useEffect(() => {
    const timer = setTimeout(
      () => {
        setContainerSearchMode(searchMode);
      },
      searchMode ? 75 : 0
    ); // Delay resize when opening, immediate when closing

    return () => clearTimeout(timer);
  }, [searchMode]);

  // Measure nav content width when items change
  // Measure immediately so width transition happens simultaneously with item animations
  useEffect(() => {
    console.log("[Nav Debug] Effect triggered:", {
      searchMode,
      itemsLength: items.length,
      currentNavWidth: navWidth,
    });

    if (searchMode) {
      console.log("[Nav Debug] ❌ In search mode, skipping measurement");
      return;
    }

    console.log(
      "[Nav Debug] ✓ Measuring immediately. Item count:",
      items.length
    );

    // Small delay to ensure hidden container has rendered with new items
    const measureDelay = 10; // Just enough for DOM update

    const timeoutId = setTimeout(() => {
      console.log("[Nav Debug] ⏱️ Measuring hidden container...");

      if (measureContainerRef.current) {
        // Measure the hidden container width (already includes padding from inline style)
        // getBoundingClientRect() returns total width including padding
        const totalWidth =
          measureContainerRef.current.getBoundingClientRect().width;
        console.log(
          "[Nav Debug] 📏 Measured total width (with padding):",
          totalWidth,
          "px"
        );

        // Only set width if it's reasonable (> 100px)
        if (totalWidth > 100 && totalWidth !== navWidth) {
          console.log(
            "[Nav Debug] ✅ Setting navWidth to:",
            totalWidth,
            "(will transition from",
            navWidth,
            ")"
          );
          setNavWidth(totalWidth);
        } else if (totalWidth === navWidth) {
          console.log("[Nav Debug] ℹ️ Width unchanged:", totalWidth);
        } else {
          console.log(
            "[Nav Debug] ❌ Width too small, skipping:",
            totalWidth
          );
        }
      } else {
        console.log("[Nav Debug] ❌ measureContainerRef.current is null");
      }
    }, measureDelay);

    return () => {
      console.log("[Nav Debug] 🧹 Cleanup: clearing timeout");
      clearTimeout(timeoutId);
    };
  }, [searchMode, items, navWidth]);

  // Debug log for state changes
  useEffect(() => {
    let calculatedWidth = "auto";
    if (containerSearchMode) {
      calculatedWidth = "400px";
    } else if (navWidth) {
      calculatedWidth = `${navWidth}px`;
    }

    console.log("[Nav Debug] State updated:", {
      searchMode,
      containerSearchMode,
      navWidth,
      itemsCount: items.length,
      calculatedWidth,
    });
  }, [searchMode, containerSearchMode, navWidth, items.length]);

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

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (focusTimeoutRef.current) clearTimeout(focusTimeoutRef.current);
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

  // Determine if nav should be expanded (full size)
  const isExpanded = isHovered || isFocused || searchMode;

  // Calculate container width based on current state
  const getContainerWidth = () => {
    if (containerSearchMode) {
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
          scale: isExpanded ? 1 : 0.65,
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
            "relative shadow-lg rounded-2xl backdrop-blur-sm",
            "transition-all duration-300 ease-in-out",
            isInitialMount && "overflow-hidden"
          )}
          style={{
            minHeight: "56px",
            width: getContainerWidth(),
          }}
        >
          {/*
          Content wrapper with dynamic height
          Nav mode: Fixed at 56px total (32px content + 24px padding)
          Search mode: Expands smoothly up to 600px max
          Using max-height for smooth CSS transition (height: auto doesn't transition)
        */}
          <div
            className="relative overflow-hidden transition-all duration-300 ease-in-out flex items-center"
            style={{
              height: containerSearchMode ? "auto" : "56px",
              maxHeight: containerSearchMode ? "600px" : "56px",
              padding: "12px 16px",
            }}
          >
            {/* AnimatePresence for smooth transitions between modes */}
            {/* mode="wait" ensures exit completes before enter starts - prevents overlap */}
            <AnimatePresence initial={false} mode="wait">
              {searchMode ? (
                // Search mode: show search input with results (dynamic height)
                <motion.div
                  key="search-content"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{
                    duration: 0.15,
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
              ) : (
                // Nav mode: show navigation items with staggered animation
                <motion.ul
                  key={`nav-content-${pathname}`}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.15,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >
                  <AnimatePresence mode="popLayout">
                    {/* Render each nav item based on its type with index for stagger */}
                    {otherItems.map((item, index) => {
                      switch (item.type) {
                        case "link":
                          // Link item: navigate to another page
                          return (
                            <NavLinkItem
                              key={item.id}
                              item={item}
                              index={index}
                            />
                          );
                        case "action":
                          // Action item: async operation (API calls)
                          return (
                            <NavActionItem
                              key={item.id}
                              item={item}
                              index={index}
                            />
                          );
                        case "trigger":
                          // Trigger item: sync UI action (open modal)
                          return (
                            <NavTriggerItem
                              key={item.id}
                              item={item}
                              index={index}
                            />
                          );
                        default:
                          return null;
                      }
                    })}
                    {/* Render search button when not in search mode */}
                    {searchItem?.type === "search" && (
                      <NavSearchButton
                        key="search-button"
                        item={searchItem}
                        index={otherItems.length}
                      />
                    )}
                  </AnimatePresence>
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Hidden measurement container - always renders with width: auto for accurate measurement */}
      {!searchMode && (
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
            {otherItems.map((item) => {
              // Render simplified item structure for measurement (no animations/tooltips)
              return (
                <li key={item.id} className="p-3">
                  {item.icon}
                </li>
              );
            })}
            {searchItem && <li className="p-3">{searchItem.icon}</li>}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Nav;
