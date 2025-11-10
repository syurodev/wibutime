/**
 * Series Card Component
 * Displays series information in card format
 */

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import type { Series } from "@/lib/api/models/content/series";
import { cn } from "@/lib/utils";
import { getContentBg } from "@/lib/utils/get-content-bg";
import { Eye, Heart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { GenreTag } from "./GenreTag";

export interface SeriesCardProps {
  readonly series: Series;
  readonly variant?: "default" | "compact";
  readonly showBadge?: boolean;
  readonly showStats?: boolean;
  readonly showGenres?: boolean;
  readonly className?: string;
}

export function SeriesCard({
  series,
  variant = "default",
  showBadge = true,
  showStats = true,
  showGenres = true,
  className,
}: SeriesCardProps) {
  const isCompact = variant === "compact";

  return (
    <Link href={`/series/${series.slug}`}>
      <Card
        className={cn(
          "group overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02]",
          className
        )}
      >
        {/* Cover Image */}
        <AspectRatio ratio={3 / 4} className="overflow-hidden bg-muted">
          <div className="relative h-full w-full">
            <Image
              src={series.coverUrl}
              alt={series.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes={
                isCompact
                  ? "(max-width: 768px) 50vw, 25vw"
                  : "(max-width: 768px) 100vw, 50vw"
              }
            />

            {/* Badges overlay */}
            {showBadge && (
              <div className="absolute left-2 top-2 flex flex-col gap-2">
                {series.isNew && (
                  <Badge className={cn(getContentBg({ type: series.type }))}>
                    New
                  </Badge>
                )}
                {series.isTrending && (
                  <Badge className={cn(getContentBg({ type: series.type }))}>
                    Trending
                  </Badge>
                )}
              </div>
            )}

            {/* Type badge (bottom left) */}
            <div className="absolute bottom-2 left-2">
              <Badge className={cn(getContentBg({ type: series.type }))}>
                {series.type}
              </Badge>
            </div>
          </div>
        </AspectRatio>

        {/* Content */}
        <CardContent className="space-y-3 p-4">
          {/* Title */}
          <h3
            className={cn(
              "font-semibold line-clamp-2 group-hover:text-primary transition-colors",
              isCompact ? "text-sm" : "text-base"
            )}
          >
            {series.title}
          </h3>

          {/* Genres */}
          {showGenres && series.genres.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {series.genres.slice(0, isCompact ? 2 : 3).map((genre) => (
                <GenreTag
                  key={genre}
                  genre={genre}
                  className="text-xs pointer-events-none"
                />
              ))}
            </div>
          )}

          {/* Stats */}
          {showStats && (
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {/* Rating */}
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-current" />
                <span>{series.formattedRating}</span>
              </div>

              {/* Views */}
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{series.formattedViews}</span>
              </div>

              {/* Favorites */}
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                <span>{series.formattedFavorites}</span>
              </div>
            </div>
          )}

          {/* Latest chapter (if available) */}
          {!isCompact && series.latestChapterInfo && (
            <div className="text-xs text-muted-foreground">
              <span className="line-clamp-1">{series.latestChapterInfo}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

/**
 * Compact variant for list views
 */
export function SeriesCardCompact(props: Omit<SeriesCardProps, "variant">) {
  return <SeriesCard {...props} variant="compact" />;
}
