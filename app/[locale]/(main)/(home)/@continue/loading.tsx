import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading state for Continue section
 * Horizontal card layout for watching/reading progress
 */
export default function ContinueLoading() {
  return (
    <div className="h-full space-y-3 p-4">
      {/* Section title */}
      <Skeleton className="h-5 w-32" />

      {/* Horizontal scroll items */}
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="shrink-0 w-24 space-y-2">
            <Skeleton className="aspect-[3/4] w-full rounded-lg" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-2 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
