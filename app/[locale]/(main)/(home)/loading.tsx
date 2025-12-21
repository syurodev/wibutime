import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading state for Event section (main page)
 * Shows a skeleton that matches the bento card dimensions
 */
export default function EventLoading() {
  return (
    <div className="relative w-full h-full animate-pulse">
      <Skeleton className="absolute inset-0 rounded-xl" />
    </div>
  );
}
