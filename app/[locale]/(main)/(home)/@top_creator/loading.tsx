import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading state for Top Creator section
 * Vertical list of top creators
 */
export default function TopCreatorLoading() {
  return (
    <div className="h-full space-y-3 p-4">
      {/* Section title */}
      <Skeleton className="h-5 w-28" />

      {/* Creator list */}
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-2 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
