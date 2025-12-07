/**
 * Genre Model - Zod Schema
 * Model for genre management
 */

import { Trend } from "@/lib/constants/trend";
import { z } from "zod";

/**
 * Genre Schema - Full data model
 */
export const GenreSchema = z.object({
  // Required fields
  id: z.string(),
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  slug: z.string(),

  // Optional fields
  description: z.string().max(1000, "Description too long").default(""),
  parent_id: z.string().nullable().optional(),
  display_order: z.number().int().min(0).optional(),
  is_active: z.boolean().optional(),

  // Stats
  series_count: z.number().int().min(0).default(0),
  active_readers: z.number().int().min(0).default(0),
  total_views: z.number().int().min(0).default(0),
  trend: z.enum([Trend.RISING, Trend.STABLE, Trend.FALLING]).optional(),

  // Timestamps
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type Genre = z.infer<typeof GenreSchema>;

/**
 * Create Genre Request Schema
 */
export const CreateGenreSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  description: z.string().max(1000, "Description too long").optional(),
  parent_id: z.string().nullable().optional(),
});

export type CreateGenreRequest = z.infer<typeof CreateGenreSchema>;

/**
 * Update Genre Request Schema
 */
export const UpdateGenreSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name too long")
    .optional(),
  description: z.string().max(1000, "Description too long").optional(),
  parent_id: z.string().nullable().optional(),
  display_order: z.number().int().min(0).optional(),
  is_active: z.boolean().optional(),
});

export type UpdateGenreRequest = z.infer<typeof UpdateGenreSchema>;

/**
 * Genre Query Parameters Schema
 */
export const GenreQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  sort_by: z.enum(["name", "views", "series", "created", "updated"]).optional(),
  sort_order: z.enum(["asc", "desc"]).default("desc"),
  active_only: z.boolean().default(false),
});

export type GenreQuery = z.infer<typeof GenreQuerySchema>;

/**
 * Array schema
 */
export const GenreArraySchema = z.array(GenreSchema);

/**
 * Genre Stats Schema
 * Genre with additional activity statistics
 */
export const GenreStatsSchema = GenreSchema.extend({
  series_count: z.number().int().min(0).default(0), // tổng anime, manga, novel
  active_readers: z.number().int().min(0).default(0), // số người đọc, xem
  total_views: z.number().int().min(0).default(0), // tổng lượt xem
  trend: z.enum([Trend.RISING, Trend.STABLE, Trend.FALLING]).optional(), // xu hướng cần i18n
  description: z.string().optional(),
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
  getTrendIcon(trend: Trend): string {
    switch (trend) {
      case Trend.RISING:
        return "↗";
      case Trend.FALLING:
        return "↘";
      default:
        return "→";
    }
  },
};
