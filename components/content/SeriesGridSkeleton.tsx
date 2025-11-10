/**
 * Series Grid Skeleton Component
 * Loading state for series grid
 */

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";

export interface SeriesGridSkeletonProps {
  /**
   * Number of skeleton items to show
   */
  readonly count?: number;

  /**
   * Additional className for the grid container
   */
  readonly className?: string;
}

export function SeriesGridSkeleton({
  count = 20,
  className,
}: SeriesGridSkeletonProps) {
  return (
    <div
      className={`grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:gap-6 ${
        className || ""
      }`}
    >
      {Array.from({ length: count }).map((_, index) => (
        <AspectRatio
          key={index}
          ratio={3 / 5}
          className="w-full overflow-hidden max-h-[336px]"
        >
          <div className="h-full w-full">
            {/* Cover Image Skeleton */}
            <Skeleton className="h-full w-full rounded-2xl" />
          </div>
        </AspectRatio>
      ))}
    </div>
  );
}
