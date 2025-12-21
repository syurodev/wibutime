import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading state for Top Organization section
 * Vertical list of organizations/studios
 */
export default function TopOrganizationLoading() {
  return (
    <div className="h-full space-y-3 p-4">
      {/* Section title */}
      <Skeleton className="h-5 w-32" />

      {/* Organization list */}
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-lg shrink-0" />
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
