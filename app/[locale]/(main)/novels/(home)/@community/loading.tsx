import { Skeleton } from "@/components/ui/skeleton";

export default function CommunityLoading() {
  return (
    <section className="container mx-auto px-4 py-8">
      <Skeleton className="h-7 w-40 mb-4" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Skeleton className="h-96 rounded-xl" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    </section>
  );
}
