/**
 * Novel Detail Loading State
 */

import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";

export default function NovelDetailLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section Skeleton */}
      <div className="border-b bg-gradient-to-b from-muted/30 to-background">
        <Container className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-12">
            {/* Cover Skeleton */}
            <div className="mx-auto md:mx-0">
              <Skeleton className="w-56 md:w-64 lg:w-72 aspect-[2/3] rounded-xl" />
            </div>

            {/* Content Skeleton */}
            <div className="flex flex-col gap-6">
              {/* Badges Skeleton */}
              <div className="flex flex-wrap items-center gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>

              {/* Title Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
              </div>

              {/* Author Skeleton */}
              <Skeleton className="h-5 w-32" />

              {/* Stats Grid Skeleton */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-20" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                ))}
              </div>

              {/* Buttons Skeleton */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Skeleton className="h-11 w-40" />
                <Skeleton className="h-11 w-36" />
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Content Section Skeleton */}
      <Container className="py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
          {/* Main Content Skeleton */}
          <div className="space-y-12">
            {/* Synopsis Skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-8 w-32" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-6 w-20" />
                ))}
              </div>
            </div>

            {/* Volumes Skeleton */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-5 w-32" />
              </div>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full rounded-xl" />
              ))}
            </div>

            {/* Reviews Skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-40 w-full rounded-xl" />
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full rounded-xl" />
              ))}
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <aside className="space-y-6">
            <Skeleton className="h-64 w-full rounded-xl" />
            <div className="space-y-3">
              <Skeleton className="h-6 w-40" />
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg" />
              ))}
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
