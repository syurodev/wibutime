"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { ActionNavItem } from "./types";
import { useNav } from "./useNav";

interface NavActionItemProps {
  readonly item: ActionNavItem;
  readonly index?: number; // For stagger animation delay
}

/**
 * Nav Action Item Component
 *
 * Renders a button that executes async operations (API calls).
 * Features:
 * - Loading spinner during execution
 * - Disabled state while loading
 * - Toast notifications for success/error
 * - Optional badge for notifications/counts
 * - Label shown in tooltip on hover
 * - Animates in with slide-from-bottom effect
 */
export function NavActionItem({ item, index = 0 }: NavActionItemProps) {
  // Get loading state from context
  const { loadingItems, setItemLoading } = useNav();
  const isLoading = loadingItems.has(item.id);

  /**
   * Handle button click
   * - Prevents multiple clicks while loading
   * - Shows loading state
   * - Displays toast on success/error
   */
  const handleClick = async () => {
    // Prevent multiple clicks
    if (isLoading) return;

    // Set loading state
    setItemLoading(item.id, true);

    try {
      // Execute the async action
      await item.onClick();

      // Show success toast if message is provided
      if (item.successMessage) {
        toast.success(item.successMessage);
      }
    } catch (error) {
      // Handle errors and show error toast
      const errorMsg =
        item.errorMessage ||
        (error instanceof Error ? error.message : "An error occurred");
      toast.error(errorMsg);
    } finally {
      // Clear loading state
      setItemLoading(item.id, false);
    }
  };

  return (
    <motion.li
      layout
      className="relative"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{
        duration: 0.2,
        delay: index * 0.03, // Stagger effect: 30ms between items
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleClick}
            disabled={isLoading}
            className={`
              flex items-center justify-center p-3 rounded-xl transition-opacity
              ${
                isLoading
                  ? "opacity-50 cursor-not-allowed" // Loading state: dimmed and not clickable
                  : "opacity-60 hover:opacity-100" // Normal state
              }
            `}
          >
            {/* Icon container: shows spinner when loading, icon otherwise */}
            <span className="relative">
              {isLoading ? (
                <Spinner className="w-5 h-5" />
              ) : (
                <>
                  {item.icon}
                  {/* Badge indicator (notifications, counts, etc.) */}
                  {item.badge && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-4 min-w-4 px-1 text-xs flex items-center justify-center"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </span>
          </button>
        </TooltipTrigger>
        {/* Tooltip content: shows loading text if loading, otherwise shows label */}
        <TooltipContent side="top">
          <p>{isLoading && item.loadingText ? item.loadingText : item.label}</p>
        </TooltipContent>
      </Tooltip>
    </motion.li>
  );
}
