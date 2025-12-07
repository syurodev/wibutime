import { Skeleton } from "@/components/ui/skeleton";

export default function TrendingLoading() {
  return (
    <section className="container mx-auto px-4 py-8">
      <Skeleton className="h-8 w-40 mb-6" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {Array.from({ length: 15 }, (_, i) => `trending-loading-${i}`).map(
          (key) => (
            <div key={key} className="space-y-2">
              <Skeleton className="aspect-4/6 w-full rounded-2xl" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}
