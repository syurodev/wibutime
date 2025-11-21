/**
 * History Grid Component
 * Grid layout for displaying history items with enhanced cards
 */

import type { HistoryMedia } from "@/features/history/types/history-content";
import { EnhancedHistoryCard } from "./EnhancedHistoryCard";

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
      className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 ${
        className || ""
      }`}
    >
      {history.map((item) => (
        <EnhancedHistoryCard key={item.id} item={item} />
      ))}
    </div>
  );
}
