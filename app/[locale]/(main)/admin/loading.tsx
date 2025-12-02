/**
 * Admin Pages Loading State
 */

import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header Skeleton */}
      <div className="mb-8 space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Actions Bar Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Table Skeleton */}
      <div className="border rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="bg-muted p-4 flex gap-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-32" />
        </div>

        {/* Table Rows */}
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="p-4 border-t flex gap-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-32" />
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between mt-6">
        <Skeleton className="h-5 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </div>
  );
}
