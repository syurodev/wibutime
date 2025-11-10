/**
 * Trending Item Component
 * Displays a trending series in the Trending Now section
 */

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ContentCard, type SeriesData } from "@/components/content/ContentCard";
import type { Series } from "@/lib/api/models/series";

export interface TrendingItemProps {
  /**
   * Series model instance
   */
  series: Series;

  /**
   * Ranking position (optional)
   */
  rank?: number;
}

export function TrendingItem({ series, rank }: TrendingItemProps) {
  // Convert Series model to plain object for Client Component
  const seriesData: SeriesData = {
    id: series.id,
    title: series.title,
    slug: series.slug,
    description: series.description,
    cover_url: series.coverUrl,
    type: series.type,
    formatted_views: series.formattedViews,
    formatted_favorites: series.formattedFavorites,
    is_trending: series.isTrending,
  };

  return (
    <AspectRatio ratio={3 / 5} className="w-full">
      <ContentCard
        series={seriesData}
        rank={rank}
        showVerified={true}
        showDescription={true}
        className="h-full"
      />
    </AspectRatio>
  );
}
