/**
 * Genre Model - Zod Schema
 * Model for genre management
 */

import { z } from "zod";

/**
 * Genre Schema - Full data model
 */
export const GenreSchema = z.object({
  // Required fields
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  slug: z.string(),

  // Optional fields
  description: z.string().max(1000, "Description too long").default(""),
  parent_id: z.string().uuid().nullable().default(null),
  display_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(false),

  // Stats
  series_count: z.number().int().min(0).default(0),
  active_readers: z.number().int().min(0).default(0),
  total_views: z.number().int().min(0).default(0),
  trend: z.enum(["rising", "stable", "falling"]).default("stable"),

  // Timestamps
  created_at: z.string().default(() => new Date().toISOString()),
  updated_at: z.string().default(() => new Date().toISOString()),
});

export type Genre = z.infer<typeof GenreSchema>;

/**
 * Create Genre Request Schema
 */
export const CreateGenreSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  description: z.string().max(1000, "Description too long").optional(),
  parent_id: z.string().uuid().nullable().optional(),
});

export type CreateGenreRequest = z.infer<typeof CreateGenreSchema>;

/**
 * Update Genre Request Schema
 */
export const UpdateGenreSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long").optional(),
  description: z.string().max(1000, "Description too long").optional(),
  parent_id: z.string().uuid().nullable().optional(),
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
 * Utilities for Genre
 */
export const GenreUtils = {
  /**
   * Parse genre data
   */
  parse(data: unknown): Genre {
    return GenreSchema.parse(data);
  },

  /**
   * Parse array of genres
   */
  parseArray(data: unknown): Genre[] {
    return GenreArraySchema.parse(data);
  },

  /**
   * Format views count
   */
  formatViews(count: number): string {
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
    return count.toString();
  },

  /**
   * Get trend badge color
   */
  getTrendBadge(trend: Genre["trend"]): { color: string; label: string } {
    switch (trend) {
      case "rising":
        return { color: "text-green-600", label: "Rising" };
      case "falling":
        return { color: "text-red-600", label: "Falling" };
      default:
        return { color: "text-gray-600", label: "Stable" };
    }
  },

  /**
   * Format timestamp
   */
  formatDate(timestamp: string): string {
    return new Date(timestamp).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  },
};
