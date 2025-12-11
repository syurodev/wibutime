/**
 * Library Content Component
 * Async server component for displaying library series
 */

import { SeriesGrid } from "@/components/content/series-grid";
import { MediaSeries } from "@/features/content";

export interface LibraryContentProps {
  readonly series: MediaSeries[];
}

export async function LibraryContent({ series }: LibraryContentProps) {
  return <SeriesGrid series={series} />;
}
