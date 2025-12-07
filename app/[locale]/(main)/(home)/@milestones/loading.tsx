import { Skeleton } from "@/components/ui/skeleton";

export default function MilestonesLoading() {
  return (
    <section className="container mx-auto px-4 py-8">
      <Skeleton className="h-7 w-48 mb-4" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }, (_, i) => `milestone-loading-${i}`).map(
          (key) => (
            <Skeleton key={key} className="h-32 rounded-xl" />
          )
        )}
      </div>
    </section>
  );
}
