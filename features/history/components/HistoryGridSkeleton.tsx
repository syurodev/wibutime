/**
 * History Grid Skeleton Component
 * Loading state for enhanced history grid with adaptive layout
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
			className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 ${
				className || ""
			}`}
		>
			{Array.from({ length: count }).map((_, index) => (
				<div
					key={index}
					className="relative flex flex-row w-full rounded-[20px] border-4 border-secondary bg-card shadow-sm overflow-hidden min-h-[200px]"
				>
					{/* Image Skeleton - Horizontal layout */}
					<Skeleton className="w-[170px] h-full shrink-0" />

					{/* Content Skeleton */}
					<div className="flex flex-1 flex-col justify-between p-4 gap-2">
						{/* Title & Rating */}
						<div className="space-y-2">
							<div className="flex items-start justify-between gap-2">
								<Skeleton className="h-5 w-3/4" />
								<Skeleton className="h-5 w-12 rounded-md" />
							</div>
							<div className="flex gap-2">
								<Skeleton className="h-5 w-20" />
								<Skeleton className="h-3 w-24" />
							</div>
						</div>

						{/* Genres */}
						<div className="flex gap-1.5">
							<Skeleton className="h-5 w-16" />
							<Skeleton className="h-5 w-20" />
							<Skeleton className="h-5 w-14" />
						</div>

						{/* Progress Bar */}
						<div className="space-y-1">
							<div className="flex justify-between">
								<Skeleton className="h-3 w-12" />
								<Skeleton className="h-3 w-16" />
							</div>
							<Skeleton className="h-1.5 w-full rounded-full" />
						</div>

						{/* Stats */}
						<div className="flex gap-3">
							<Skeleton className="h-3 w-12" />
							<Skeleton className="h-3 w-12" />
						</div>

						{/* Author */}
						<div className="flex items-center gap-2">
							<Skeleton className="h-6 w-6 rounded-full" />
							<Skeleton className="h-3 w-24" />
						</div>

						{/* Resume Box */}
						<Skeleton className="h-12 w-full rounded-lg" />
					</div>
				</div>
			))}
		</div>
	);
}
