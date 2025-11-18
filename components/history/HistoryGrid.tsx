/**
 * History Grid Component
 * Grid layout for displaying history items
 */

import type { HistoryMedia } from "@/lib/api/models/content/history-content";
import { HistoryCard } from "./HistoryCard";

export interface HistoryGridProps {
	readonly history: HistoryMedia[];
	readonly className?: string;
}

export function HistoryGrid({ history, className }: HistoryGridProps) {
	if (!history || history.length === 0) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<p className="text-muted-foreground">No history found</p>
			</div>
		);
	}

	return (
		<div
			className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6 ${
				className || ""
			}`}
		>
			{history.map((item) => (
				<HistoryCard key={item.id} item={item} />
			))}
		</div>
	);
}
