/**
 * Content Card Component
 * Modern card design for displaying series with clean layout
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Heart, CheckCircle2, Plus } from "lucide-react";

/**
 * Plain object type for series data (for Client Component)
 */
export interface SeriesData {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverUrl: string;
  type: "anime" | "manga" | "novel";
  formattedViews: string;
  formattedFavorites: string;
  isTrending: boolean;
}

export interface ContentCardProps {
  /**
   * Series data (plain object)
   */
  series: SeriesData;

  /**
   * Optional ranking number
   */
  rank?: number;

  /**
   * Show verified badge beside title
   */
  showVerified?: boolean;

  /**
   * Show description text
   */
  showDescription?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;
}

export function ContentCard({
  series,
  rank,
  showVerified = false,
  showDescription = true,
  className,
}: ContentCardProps) {
  return (
    <Link href={`/series/${series.slug}`} className={cn("block h-full", className)}>
      <Card className="relative h-full overflow-hidden rounded-3xl bg-card">
        {/* Cover Image - Full Card */}
        <div className="absolute inset-0">
          <Image
            src={series.coverUrl}
            alt={series.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>

        {/* Ranking Badge */}
        {rank !== undefined && (
          <div className="absolute left-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground shadow-lg">
            {rank}
          </div>
        )}

        {/* Content Overlay - Bottom with Blur */}
        <div className="absolute inset-x-0 bottom-0 z-10">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

          {/* Blur Background */}
          <div className="absolute inset-0 backdrop-blur-sm bg-background/30" />

          {/* Content */}
          <div className="relative space-y-2 p-3">
            {/* Title with Verified Badge */}
            <div className="flex items-center gap-1">
              <h3 className="flex-1 text-sm font-semibold line-clamp-1 text-white">
                {series.title}
              </h3>
              {showVerified && series.isTrending && (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
              )}
            </div>

            {/* Description */}
            {showDescription && series.description && (
              <p className="text-xs text-white/80 line-clamp-2">
                {series.description}
              </p>
            )}

            {/* Bottom Section - Stats & Action */}
            <div className="flex items-center justify-between gap-2">
              {/* Stats */}
              <div className="flex items-center gap-2 text-xs text-white/70">
                {/* Views */}
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span className="font-medium">{series.formattedViews}</span>
                </div>

                {/* Favorites */}
                <div className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  <span className="font-medium">{series.formattedFavorites}</span>
                </div>
              </div>

              {/* Follow Button */}
              <Button
                size="sm"
                className="h-7 gap-1 rounded-full px-3 text-xs font-semibold"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // TODO: Implement follow functionality
                }}
              >
                Follow
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
