/**
 * Novel Skeleton - Loading state for novel detail page
 */

import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";

export function NovelSkeleton() {
  return (
    <>
      {/* Hero Skeleton */}
      <div className="relative">
        <Container className="py-8 lg:py-12">
          <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
            {/* Cover Skeleton */}
            <div className="flex-shrink-0">
              <Skeleton className="w-48 h-72 md:w-56 md:h-80 rounded-lg mx-auto md:mx-0" />
            </div>

            {/* Info Skeleton */}
            <div className="flex-1 space-y-4">
              {/* Badges */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-16" />
              </div>

              {/* Title */}
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-5 w-1/2" />

              {/* Author */}
              <div className="flex items-center gap-4">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>

              {/* Genres */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <Skeleton className="h-11 w-28" />
                <Skeleton className="h-11 w-28" />
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Content Skeleton */}
      <Container className="py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </Container>
    </>
  );
}
