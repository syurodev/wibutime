/**
 * Utility functions for working with date ranges
 */

export type DateRange = "7d" | "30d" | "90d" | "1y" | "all";

export interface DateRangeOption {
  value: DateRange;
  label: string;
  days: number | null;
}

/**
 * Available date range options for dashboards
 */
export const DATE_RANGE_OPTIONS: DateRangeOption[] = [
  { value: "7d", label: "Last 7 days", days: 7 },
  { value: "30d", label: "Last 30 days", days: 30 },
  { value: "90d", label: "Last 90 days", days: 90 },
  { value: "1y", label: "Last year", days: 365 },
  { value: "all", label: "All time", days: null },
];

/**
 * Get date range boundaries
 */
export function getDateRangeBounds(range: DateRange): {
  start: Date;
  end: Date;
} {
  const end = new Date();
  const start = new Date();

  switch (range) {
    case "7d":
      start.setDate(end.getDate() - 7);
      break;
    case "30d":
      start.setDate(end.getDate() - 30);
      break;
    case "90d":
      start.setDate(end.getDate() - 90);
      break;
    case "1y":
      start.setFullYear(end.getFullYear() - 1);
      break;
    case "all":
      start.setFullYear(2020, 0, 1); // Arbitrary start date
      break;
  }

  return { start, end };
}

/**
 * Format date for display
 * @example "2024-01-15" → "Jan 15"
 */
export function formatChartDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * Format date with year
 * @example "2024-01-15" → "Jan 15, 2024"
 */
export function formatFullDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Get relative time string
 * @example "2 hours ago", "3 days ago"
 */
export function getRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }
  if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }
  if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  }
  const years = Math.floor(diffInSeconds / 31536000);
  return `${years} year${years > 1 ? "s" : ""} ago`;
}

/**
 * Generate date series for charts
 */
export function generateDateSeries(
  start: Date,
  end: Date,
  interval: "day" | "week" | "month" = "day"
): Date[] {
  const dates: Date[] = [];
  const current = new Date(start);

  while (current <= end) {
    dates.push(new Date(current));

    switch (interval) {
      case "day":
        current.setDate(current.getDate() + 1);
        break;
      case "week":
        current.setDate(current.getDate() + 7);
        break;
      case "month":
        current.setMonth(current.getMonth() + 1);
        break;
    }
  }

  return dates;
}

/**
 * Format date to ISO string for API calls
 */
export function toISODateString(date: Date): string {
  return date.toISOString().split("T")[0];
}
