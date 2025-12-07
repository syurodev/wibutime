/**
 * Utility functions for formatting statistics and metrics
 */

/**
 * Format large numbers with K, M, B suffixes
 * @example 1234 → "1.2K", 1234567 → "1.2M"
 */
export function formatNumber(num: number | null | undefined): string {
  if (num == null) return "0";
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}

/**
 * Format number with commas
 * @example 1234567 → "1,234,567"
 */
export function formatNumberWithCommas(num: number | null | undefined): string {
  if (num == null) return "0";
  return num.toLocaleString("en-US");
}

/**
 * Format rating with one decimal place
 * @example 4.567 → "4.6", 5 → "5.0"
 */
export function formatRating(rating: number | null | undefined): string {
  if (rating == null) return "0.0";
  return rating.toFixed(1);
}

/**
 * Format percentage
 * @example 0.1234 → "12.3%", 0.5 → "50%"
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return (value * 100).toFixed(decimals) + "%";
}

/**
 * Format trend value with + or - sign
 * @example 15.5 → "+15.5%", -8.2 → "-8.2%"
 */
export function formatTrend(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return sign + value.toFixed(1) + "%";
}

/**
 * Get color class for trend indicator
 */
export function getTrendColor(value: number): string {
  if (value > 0) return "text-green-600 dark:text-green-500";
  if (value < 0) return "text-red-600 dark:text-red-500";
  return "text-muted-foreground";
}

/**
 * Format duration in words
 * @example 3600 → "1 hour", 86400 → "1 day"
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? "s" : ""}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""}`;
  return `${seconds} second${seconds !== 1 ? "s" : ""}`;
}

/**
 * Calculate percentage change between two values
 */
export function calculatePercentageChange(
  oldValue: number,
  newValue: number
): number {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return ((newValue - oldValue) / oldValue) * 100;
}
