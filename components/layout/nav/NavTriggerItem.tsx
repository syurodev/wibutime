"use client";

import { motion } from "framer-motion";
import { TriggerNavItem } from "./types";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface NavTriggerItemProps {
  readonly item: TriggerNavItem;
  readonly index?: number; // For stagger animation delay
}

/**
 * Nav Trigger Item Component
 *
 * Renders a button that executes synchronous UI actions (no loading state).
 * Perfect for triggering modals, dialogs, sheets, or other UI state changes.
 * Supports optional badge for notifications/counts.
 * Label shown in tooltip on hover.
 * Animates in with slide-from-bottom effect.
 */
export function NavTriggerItem({ item, index = 0 }: NavTriggerItemProps) {
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
            onClick={item.onClick}
            className="
              flex items-center justify-center p-3 rounded-xl
              opacity-60 hover:opacity-100 transition-opacity
            "
          >
            {/* Icon container with optional badge */}
            <span className="relative">
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
            </span>
          </button>
        </TooltipTrigger>
        {/* Tooltip content showing label on hover */}
        <TooltipContent side="top">
          <p>{item.label}</p>
        </TooltipContent>
      </Tooltip>
    </motion.li>
  );
}
