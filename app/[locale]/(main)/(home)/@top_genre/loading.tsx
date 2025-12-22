import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading state for Top Genre section
 * Compact vertical list of genres
 */
export default function TopGenreLoading() {
  return (
    <div className="h-full space-y-3 p-4">
      {/* Section title */}
      <Skeleton className="h-5 w-20" />

      {/* Genre chips */}
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-7 rounded-full"
            style={{ width: `60px` }}
          />
        ))}
      </div>
    </div>
  );
}
