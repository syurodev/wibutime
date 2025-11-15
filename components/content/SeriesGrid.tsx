/**
 * Series Grid Component
 * Reusable grid layout for displaying series content
 */

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { MediaSeries } from "@/lib/api/models/content/base-content";
import { ContentCard } from "./ContentCard";

export interface SeriesGridProps {
  readonly series: MediaSeries[];
  readonly className?: string;
}

export function SeriesGrid({ series, className }: SeriesGridProps) {
  if (!series || series.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">No series found</p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:gap-6 ${
        className || ""
      }`}
    >
      {series.map((item) => (
        <AspectRatio key={item.id} ratio={3 / 5} className="w-full">
          <ContentCard series={item} className="h-full" />
        </AspectRatio>
      ))}
    </div>
  );
}
