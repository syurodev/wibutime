import { Skeleton } from "@/components/ui/skeleton";

export default function LatestLoading() {
  return (
    <section className="container mx-auto px-4 py-8">
      <Skeleton className="h-7 w-40 mb-4" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }, (_, i) => `latest-loading-${i}`).map(
          (key) => (
            <div key={key} className="space-y-2">
              <Skeleton className="aspect-2/3 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          )
        )}
      </div>
    </section>
  );
}
