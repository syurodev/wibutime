/**
 * Container Component
 * Reusable container with configurable max-width and responsive padding
 */

import { cn } from "@/lib/utils";

export interface ContainerProps {
  /**
   * Container content
   */
  readonly children: React.ReactNode;

  /**
   * Max width variant
   * - 'sm': 640px
   * - 'md': 768px
   * - 'lg': 1024px
   * - 'xl': 1280px (default)
   * - '2xl': 1536px
   * - 'full': no max-width constraint
   */
  readonly maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";

  /**
   * Apply horizontal padding (default: true)
   * - Mobile: 16px (px-4)
   * - Tablet: 24px (sm:px-6)
   * - Desktop: 32px (lg:px-8)
   */
  readonly padding?: boolean;

  /**
   * Add bottom spacing for bottom navigation (default: false)
   * Adds pb-24 (96px) to prevent content from being hidden by bottom nav
   */
  readonly bottomSpacing?: boolean;

  /**
   * Additional CSS classes
   */
  readonly className?: string;

  /**
   * HTML element to render (default: 'div')
   */
  readonly as?: "div" | "section" | "main" | "article" | "aside";
}

export function Container({
  children,
  maxWidth = "xl",
  padding = true,
  bottomSpacing = false,
  className,
  as: Component = "div",
}: ContainerProps) {
  return (
    <Component
      className={cn(
        // Base styles
        "mx-auto w-full",
        // Responsive padding
        padding && "px-4 sm:px-6 lg:px-8",
        // Bottom spacing for navigation
        bottomSpacing && "pb-24",
        // Max-width variants
        maxWidth === "sm" && "max-w-screen-sm",
        maxWidth === "md" && "max-w-3xl",
        maxWidth === "lg" && "max-w-5xl",
        maxWidth === "xl" && "max-w-7xl",
        maxWidth === "2xl" && "max-w-screen-2xl",
        maxWidth === "full" && "max-w-full",
        // Custom classes
        className
      )}
    >
      {children}
    </Component>
  );
}
