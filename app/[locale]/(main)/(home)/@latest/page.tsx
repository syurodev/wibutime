import { Skeleton } from "@/components/ui/skeleton";

export default async function LatestSlot() {
  // TODO: Fetch latest data
  // const series = await getCachedLatest(10);
  // return <LatestUpdatesSection series={series} />;

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-xl font-semibold mb-4">Latest Updates</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }, (_, i) => `latest-${i}`).map((key) => (
          <div key={key} className="space-y-2">
            <Skeleton className="aspect-2/3 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </section>
  );
}
