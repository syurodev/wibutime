"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { SearchNavItem } from "./types";
import { useNav } from "./useNav";

interface NavSearchButtonProps {
  readonly item: SearchNavItem;
  readonly index?: number; // For stagger animation delay
}

/**
 * Nav Search Button Component
 *
 * Renders a search button in nav mode that triggers search mode when clicked.
 * Shows as a nav item with tooltip and slide-from-bottom animation.
 * This is separate from NavSearch to avoid dual-mode complexity.
 */
export function NavSearchButton({ item, index = 0 }: NavSearchButtonProps) {
  const { toggleSearch } = useNav();

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
            onClick={toggleSearch}
            className="
              flex items-center justify-center p-3 rounded-xl
              opacity-60 hover:opacity-100 transition-opacity
              cursor-pointer
            "
          >
            {/* Search icon */}
            <span>{item.icon}</span>
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
