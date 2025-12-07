import { Skeleton } from "@/components/ui/skeleton";
import { getCachedTopCreators } from "@/features/community/queries";
import { TopCreatorsSection } from "@/features/home/components/TopCreatorsSection";
import { Suspense } from "react";

async function TopCreatorsLoader() {
  try {
    const topCreators = await getCachedTopCreators(8);
    console.log(topCreators);
    return <TopCreatorsSection creators={topCreators} />;
  } catch (error) {
    console.error("Failed to load top creators:", error);
    return (
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-4">Top Creators</h2>
        <p className="text-muted-foreground">Failed to load creators.</p>
      </section>
    );
  }
}

function TopCreatorsSkeleton() {
  return (
    <section className="container mx-auto px-4 py-8">
      <Skeleton className="h-8 w-48 mb-4" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton
            key={`top-creator-${i}-skeleton`}
            className="h-48 rounded-xl"
          />
        ))}
      </div>
    </section>
  );
}

export default function CommunitySlot() {
  return (
    <Suspense fallback={<TopCreatorsSkeleton />}>
      <TopCreatorsLoader />
    </Suspense>
  );
}
