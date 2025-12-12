import { Skeleton } from "@/components/ui/skeleton";

export default async function NewSeriesSlot() {
  // TODO: Fetch new series data
  // const series = await getCachedNew(10);
  // return <NewSeriesSection series={series} />;

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-xl font-semibold mb-4">New Series</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }, (_, i) => `new-${i}`).map((key) => (
          <div key={key} className="space-y-2">
            <Skeleton className="aspect-2/3 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </section>
  );
}
