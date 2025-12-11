/**
 * useMediaQuery Hook
 * SSR-safe media query hook for responsive design
 */

"use client";

import { useEffect, useState } from "react";

export type Breakpoint = "mobile" | "tablet" | "desktop";

export function useMediaQuery() {
  // Initialize with actual window width if available (CSR), otherwise default to desktop
  const getInitialBreakpoint = (): Breakpoint => {
    if (typeof window === "undefined") return "desktop";
    const width = window.innerWidth;
    if (width < 640) return "mobile";
    if (width < 1024) return "tablet";
    return "desktop";
  };

  const [breakpoint, setBreakpoint] = useState<Breakpoint>(getInitialBreakpoint);

  useEffect(() => {
    // Check if we're in browser
    if (typeof window === "undefined") return;

    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setBreakpoint("mobile");
      } else if (width < 1024) {
        setBreakpoint("tablet");
      } else {
        setBreakpoint("desktop");
      }
    };

    // Initial check (in case window size changed between mount and effect)
    updateBreakpoint();

    // Debounced resize handler
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateBreakpoint, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return {
    breakpoint,
    isMobile: breakpoint === "mobile",
    isTablet: breakpoint === "tablet",
    isDesktop: breakpoint === "desktop",
  };
}
