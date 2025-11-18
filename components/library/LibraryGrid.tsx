/**
 * Library Grid Component
 * Displays library content in a responsive grid layout
 */

import { ContentCard } from "@/components/content/ContentCard";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import type { MediaSeries } from "@/lib/api/models/content/base-content";

export interface LibraryGridProps {
	readonly series: MediaSeries[];
}

export function LibraryGrid({ series }: LibraryGridProps) {
	if (!series || series.length === 0) {
		return null;
	}

	return (
		<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:gap-6">
			{series.map((item) => (
				<AspectRatio key={item.id} ratio={3 / 5} className="w-full">
					<ContentCard series={item} className="h-full" />
				</AspectRatio>
			))}
		</div>
	);
}
