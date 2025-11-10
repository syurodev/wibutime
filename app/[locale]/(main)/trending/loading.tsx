/**
 * Trending Page Loading State
 */

import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";
import { SeriesGridSkeleton } from "@/components/content/SeriesGridSkeleton";

export default function TrendingLoading() {
  return (
    <div className="min-h-screen py-8">
      <Container maxWidth="xl">
        {/* Page Header Skeleton */}
        <div className="mb-8 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-5 w-64" />
          </div>

          {/* Content Type Tabs Skeleton */}
          <div className="flex gap-2">
            <Skeleton className="h-10 w-16" />
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>

        {/* Series Grid Skeleton */}
        <SeriesGridSkeleton count={20} className="mb-8" />

        {/* Pagination Skeleton */}
        <div className="flex justify-center gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-24" />
        </div>
      </Container>
    </div>
  );
}
