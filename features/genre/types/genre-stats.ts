/**
 * Genre Stats Model - Zod Schema
 * Genre with community activity statistics
 */

import { GenreSchema } from "@/lib/api/models/content/base-content";
import { z } from "zod";

/**
 * Genre Stats Schema
 * Genre with additional activity statistics
 */
export const GenreStatsSchema = GenreSchema.extend({
  series_count: z.number().int().min(0).default(0),
  active_readers: z.number().int().min(0).default(0),
  total_views: z.number().int().min(0).default(0),
  trend: z.enum(["rising", "stable", "falling"]).default("stable"),
  // Optional fields
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
});

export type GenreStats = z.infer<typeof GenreStatsSchema>;

/**
 * Utilities for Genre Stats
 */
export const GenreStatsUtils = {
  /**
   * Parse genre stats data
   */
  parse(data: unknown): GenreStats {
    return GenreStatsSchema.parse(data);
  },

  /**
   * Format series count
   */
  formatSeriesCount(count: number): string {
    if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
    return count.toString();
  },

  /**
   * Format active readers
   */
  formatActiveReaders(count: number): string {
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
    return count.toString();
  },

  /**
   * Get trend icon
   */
  getTrendIcon(trend: "rising" | "stable" | "falling"): string {
    switch (trend) {
      case "rising":
        return "↗";
      case "falling":
        return "↘";
      default:
        return "→";
    }
  },
};
