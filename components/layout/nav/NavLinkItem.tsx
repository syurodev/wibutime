"use client";

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link, usePathname } from "@/i18n/routing";
import { motion } from "framer-motion";
import { LinkNavItem } from "./types";

interface NavLinkItemProps {
  readonly item: LinkNavItem;
  readonly index?: number; // For stagger animation delay
  readonly hasAnimated?: boolean; // To disable initial animation after first mount
}

/**
 * Nav Link Item Component
 *
 * Renders a navigation link that navigates to a different page.
 * Shows active state when the current pathname matches the item's href.
 * Supports optional badge for notifications/counts.
 * Label is shown in tooltip on hover.
 * Animates in with slide-from-bottom effect.
 */
export function NavLinkItem({
  item,
  index = 0,
  hasAnimated = false,
}: NavLinkItemProps) {
  // Get current pathname to determine active state
  const pathname = usePathname();
  const isActive = pathname === item.href;

  return (
    <motion.li
      layout
      className="relative"
      initial={hasAnimated ? false : { opacity: 0, y: 15 }}
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
          <Link
            href={item.href}
            className={`
              flex items-center justify-center p-3 rounded-xl transition-opacity
              ${
                isActive
                  ? "opacity-100" // Active state: full opacity
                  : "opacity-60 hover:opacity-100" // Inactive state: dimmed, brighten on hover
              }
            `}
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
          </Link>
        </TooltipTrigger>
        {/* Tooltip content showing label on hover */}
        <TooltipContent side="top">
          <p>{item.label}</p>
        </TooltipContent>
      </Tooltip>
    </motion.li>
  );
}
