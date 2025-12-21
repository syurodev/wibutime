import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading state for Top View section
 * Shows anime, manga, novel rankings
 */
export default function TopViewLoading() {
  return (
    <div className="h-full space-y-3 p-4">
      {/* Section title */}
      <Skeleton className="h-5 w-28" />

      {/* Tabs skeleton */}
      <div className="flex gap-2">
        <Skeleton className="h-7 w-16 rounded-full" />
        <Skeleton className="h-7 w-16 rounded-full" />
        <Skeleton className="h-7 w-16 rounded-full" />
      </div>

      {/* List items */}
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="aspect-[2/3] w-10 rounded" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-2 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
