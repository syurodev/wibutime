/**
 * History Grid Skeleton Component
 * Loading state for history grid
 */

import { Skeleton } from "@/components/ui/skeleton";

export interface HistoryGridSkeletonProps {
	/**
	 * Number of skeleton items to show
	 */
	readonly count?: number;

	/**
	 * Additional className for the grid container
	 */
	readonly className?: string;
}

export function HistoryGridSkeleton({
	count = 15,
	className,
}: HistoryGridSkeletonProps) {
	return (
		<div
			className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6 ${
				className || ""
			}`}
		>
			{Array.from({ length: count }).map((_, index) => (
				<div
					key={index}
					className="relative flex w-full rounded-[20px] border-4 border-secondary bg-card overflow-hidden"
				>
					{/* Left: Image Skeleton */}
					<Skeleton className="w-28 h-full shrink-0" />

					{/* Right: Content Skeleton */}
					<div className="flex flex-1 flex-col justify-between px-3 py-2.5 gap-2">
						{/* Title & Time */}
						<div className="space-y-2">
							<Skeleton className="h-4 w-3/4" />
							<Skeleton className="h-3 w-1/2" />
						</div>

						{/* Author */}
						<div className="flex items-center gap-2">
							<Skeleton className="h-5 w-5 rounded-full" />
							<Skeleton className="h-3 w-24" />
						</div>

						{/* Resume Box */}
						<Skeleton className="h-10 w-full rounded-lg" />
					</div>
				</div>
			))}
		</div>
	);
}
