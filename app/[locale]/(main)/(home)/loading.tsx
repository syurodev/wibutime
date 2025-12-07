import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading state for Hero section (page.tsx)
 */
export default function HomeLoading() {
  return (
    <>
      {/* Navigation skeleton */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>

      {/* Hero skeleton */}
      <section className="container mx-auto px-4 py-8">
        <Skeleton className="h-[400px] w-full rounded-2xl" />
      </section>
    </>
  );
}
