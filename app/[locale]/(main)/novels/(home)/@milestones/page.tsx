import { Skeleton } from "@/components/ui/skeleton";

export default async function MilestonesSlot() {
  // TODO: Fetch milestones data
  // const milestones = await getCachedMilestones(6);
  // return <CommunityMilestonesSection milestones={milestones} />;

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-xl font-semibold mb-4">Community Milestones</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }, (_, i) => `milestone-${i}`).map((key) => (
          <Skeleton key={key} className="h-32 rounded-xl" />
        ))}
      </div>
    </section>
  );
}
