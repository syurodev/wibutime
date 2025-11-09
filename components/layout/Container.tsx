/**
 * Container Component
 * Reusable container with configurable max-width and responsive padding
 */

import { cn } from "@/lib/utils";

export interface ContainerProps {
  /**
   * Container content
   */
  children: React.ReactNode;

  /**
   * Max width variant
   * - 'sm': 640px
   * - 'md': 768px
   * - 'lg': 1024px
   * - 'xl': 1280px (default)
   * - '2xl': 1536px
   * - 'full': no max-width constraint
   */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";

  /**
   * Apply horizontal padding (default: true)
   * - Mobile: 16px (px-4)
   * - Tablet: 24px (sm:px-6)
   * - Desktop: 32px (lg:px-8)
   */
  padding?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * HTML element to render (default: 'div')
   */
  as?: "div" | "section" | "main" | "article" | "aside";
}

export function Container({
  children,
  maxWidth = "xl",
  padding = true,
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
        // Max-width variants
        maxWidth === "sm" && "max-w-screen-sm",
        maxWidth === "md" && "max-w-screen-md",
        maxWidth === "lg" && "max-w-screen-lg",
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
