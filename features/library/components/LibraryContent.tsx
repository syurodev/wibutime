/**
 * Library Content Component
 * Async server component for displaying library series
 */

import type { MediaSeries } from "@/lib/api/models/content/base-content";
import { SeriesGrid } from "@/components/content/SeriesGrid";

export interface LibraryContentProps {
	readonly series: MediaSeries[];
}

export async function LibraryContent({ series }: LibraryContentProps) {
	return <SeriesGrid series={series} />;
}
