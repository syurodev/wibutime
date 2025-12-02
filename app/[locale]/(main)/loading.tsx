/**
 * Homepage Loading State
 */

import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="min-h-screen pb-24">
      {/* Hero Section Skeleton */}
      <div className="relative h-[600px] bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl space-y-6">
            <Skeleton className="h-16 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-2/3" />
            <div className="flex gap-3 pt-4">
              <Skeleton className="h-12 w-36" />
              <Skeleton className="h-12 w-36" />
            </div>
          </div>
        </div>
      </div>

      {/* Sections Skeleton */}
      {[1, 2, 3, 4, 5].map((section) => (
        <div key={section} className="container mx-auto px-4 py-12">
          <Skeleton className="h-10 w-48 mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
              <div key={item} className="space-y-2">
                <Skeleton className="aspect-2/3 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
