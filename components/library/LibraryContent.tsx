/**
 * Library Content Component
 * Main content area with filters and grid
 */

"use client";

import { useState, useMemo } from "react";
import type { MediaSeries } from "@/lib/api/models/content/base-content";
import type { CONTENT_TYPE } from "@/lib/constants/default";
import { LibraryFilters, type SortOption } from "./LibraryFilters";
import { LibraryGrid } from "./LibraryGrid";

export interface LibraryContentProps {
	readonly series: MediaSeries[];
}

export function LibraryContent({ series }: LibraryContentProps) {
	const [currentType, setCurrentType] = useState<CONTENT_TYPE | "all">("all");
	const [currentSort, setCurrentSort] = useState<SortOption>("recent");

	// Filter and sort logic
	const filteredAndSortedSeries = useMemo(() => {
		let filtered = series;

		// Filter by type
		if (currentType !== "all") {
			filtered = series.filter((item) => item.type === currentType);
		}

		// Sort
		const sorted = [...filtered];
		switch (currentSort) {
			case "title":
				sorted.sort((a, b) => a.title.localeCompare(b.title));
				break;
			case "updated":
				sorted.sort(
					(a, b) =>
						new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
				);
				break;
			case "rating":
				// Assuming there's a rating field; adjust if needed
				sorted.sort((a, b) => (b.favorites || 0) - (a.favorites || 0));
				break;
			case "recent":
			default:
				// Keep current order (assuming it's already sorted by recent)
				break;
		}

		return sorted;
	}, [series, currentType, currentSort]);

	return (
		<div className="space-y-8">
			{/* Filters */}
			<LibraryFilters
				currentType={currentType}
				currentSort={currentSort}
				onTypeChange={setCurrentType}
				onSortChange={setCurrentSort}
			/>

			{/* Results count */}
			<div className="text-sm text-muted-foreground">
				Showing {filteredAndSortedSeries.length} of {series.length} items
			</div>

			{/* Grid */}
			<LibraryGrid series={filteredAndSortedSeries} />
		</div>
	);
}
