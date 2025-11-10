/**
 * Content Badge Component
 * Displays status badges (NEW, HOT, EXCLUSIVE, TRENDING, etc.)
 */

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { BadgeVariant } from "@/lib/api/models/content/featured";

export interface ContentBadgeProps {
  /**
   * Badge text
   */
  text: string;

  /**
   * Badge variant (determines color scheme)
   */
  variant?: BadgeVariant;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Get color classes based on variant
 */
function getBadgeColors(variant: BadgeVariant = "new"): string {
  const colors: Record<BadgeVariant, string> = {
    new: "bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30",
    hot: "bg-red-500/20 border-red-500/30 hover:bg-red-500/30",
    exclusive: "bg-purple-500/20 border-purple-500/30 hover:bg-purple-500/30",
    trending: "bg-yellow-500/20 border-yellow-500/30 hover:bg-yellow-500/30",
  };
  return colors[variant];
}

export function ContentBadge({
  text,
  variant = "new",
  className,
}: ContentBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "pointer-events-none select-none font-semibold uppercase tracking-wide",
        getBadgeColors(variant),
        className
      )}
    >
      {text}
    </Badge>
  );
}
