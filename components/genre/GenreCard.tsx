/**
 * Genre Card Component
 * Reusable card for displaying genre with stats and visual effects
 */

import { Link } from "@/i18n/routing";
import type { GenreStats } from "@/lib/api/models/community/genre-stats";
import { GenreStatsUtils } from "@/lib/api/models/community/genre-stats";
import { cn } from "@/lib/utils";
import { BookOpen, TrendingDown, TrendingUp, Users } from "lucide-react";

export interface GenreCardProps {
  /**
   * Genre data with stats
   */
  readonly genre: GenreStats;

  /**
   * Additional CSS classes
   */
  readonly className?: string;

  /**
   * Show trend indicator icon (rising/falling)
   * @default true
   */
  readonly showTrendIndicator?: boolean;

  /**
   * Show stats (series count, active readers)
   * @default true
   */
  readonly showStats?: boolean;

  /**
   * Show description text
   * @default true
   */
  readonly showDescription?: boolean;

  /**
   * Custom href override (default: /genre/{id})
   */
  readonly href?: string;
}

export function GenreCard({
  genre,
  className,
  showTrendIndicator = true,
  showStats = true,
  showDescription = true,
  href,
}: GenreCardProps) {
  // Get trend icon component
  const TrendIcon =
    genre.trend === "rising"
      ? TrendingUp
      : genre.trend === "falling"
        ? TrendingDown
        : null;

  const cardHref = href || `/genre/${genre.id}`;

  return (
    <Link href={cardHref}>
      <div
        className={cn(
          "group relative rounded-[20px] border-4 border-secondary bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/30 h-full overflow-hidden",
          className
        )}
      >
        {/* Gradient background overlay with animated position on hover */}
        <div
          className="absolute inset-0 rounded-2xl opacity-10 pointer-events-none transition-all duration-500 ease-out"
          style={{
            background: `linear-gradient(135deg, ${genre.color || "#8b5cf6"}, transparent)`,
            backgroundSize: "200% 200%",
            backgroundPosition: "0% 0%",
          }}
        />

        {/* Hover state gradient animation */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-15 pointer-events-none transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, transparent, ${genre.color || "#8b5cf6"})`,
          }}
        />

        <div className="relative p-4">
          {/* Genre Name with Trend */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <h3 className="font-bold text-base line-clamp-1 flex-1">
              {genre.name}
            </h3>
            {showTrendIndicator && TrendIcon && (
              <TrendIcon
                className={cn(
                  "size-4 flex-shrink-0",
                  genre.trend === "rising" && "text-green-500",
                  genre.trend === "falling" && "text-red-500"
                )}
              />
            )}
          </div>

          {/* Stats */}
          {showStats && (
            <div className="space-y-2">
              {/* Series Count */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <BookOpen className="size-3.5" />
                  <span className="text-xs">Series</span>
                </div>
                <span className="font-semibold">
                  {GenreStatsUtils.formatSeriesCount(genre.series_count)}
                </span>
              </div>

              {/* Active Readers */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Users className="size-3.5" />
                  <span className="text-xs">Readers</span>
                </div>
                <span className="font-semibold">
                  {GenreStatsUtils.formatActiveReaders(genre.active_readers)}
                </span>
              </div>
            </div>
          )}

          {/* Description (if available) */}
          {showDescription && genre.description && (
            <p className="mt-3 text-xs text-muted-foreground line-clamp-2">
              {genre.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
