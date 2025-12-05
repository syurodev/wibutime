/**
 * Base Content Models - Zod Schemas
 * Single unified data structure cho tất cả content (anime, manga, novel)
 * Safe type generation + runtime validation với flexible defaults
 */

import { MEDIA_TYPE } from "@/lib/constants/default";
import { z } from "zod";
import { BaseUserSchema } from "../user/base-user";

/**
 * Badge variant for featured content
 */
export type BadgeVariant = "new" | "hot" | "exclusive" | "trending";

/**
 * Genre Schema
 */
export const GenreSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type Genre = z.infer<typeof GenreSchema>;

/**
 * Media Unit Schema (Chapter/Episode)
 * Flexible với default values
 */
export const MediaUnitSchema = z.object({
  id: z.string(),
  title: z.string().default("Untitled"),
  published_at: z.string().default(() => new Date().toISOString()),
});

export type MediaUnit = z.infer<typeof MediaUnitSchema>;

/**
 * Media Volume Schema
 * Optional media_unit (có thể không có chapter/episode)
 */
export const MediaVolumeSchema = z.object({
  id: z.string(),
  title: z.string().default("Untitled Volume"),
  published_at: z.string().default(() => new Date().toISOString()),
  media_unit: MediaUnitSchema.optional(),
});

export type MediaVolume = z.infer<typeof MediaVolumeSchema>;

/**
 * Media Series Schema - The main content model
 * Flexible với smart defaults cho missing data
 */
export const MediaSeriesSchema = z.object({
  // Required fields - MUST có từ BE
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  original_title: z.string().optional(),
  slug: z.string(),
  original_language: z.string(),

  // Content fields với defaults
  synopsis: z.array(z.any()).default([]), // TNode[] from platejs
  cover_url: z.string().default(""),

  // Type và status với defaults
  type: z
    .enum([MEDIA_TYPE.ANIME, MEDIA_TYPE.MANGA, MEDIA_TYPE.NOVEL])
    .default(MEDIA_TYPE.NOVEL),
  status: z
    .enum(["ongoing", "completed", "hiatus", "cancelled"])
    .default("ongoing"),

  // Relations với defaults
  genres: z.array(GenreSchema).default([]),
  owner: BaseUserSchema,

  // Stats với defaults
  rating: z.number().min(0).max(10).default(0),
  views: z.number().int().min(0).default(0),
  favorites: z.number().int().min(0).default(0),

  // Optional fields
  latest_chapter: MediaUnitSchema.optional(),

  // Timestamps với defaults
  created_at: z.string().default(() => new Date().toISOString()),
  updated_at: z.string().default(() => new Date().toISOString()),
});

export type MediaSeries = z.infer<typeof MediaSeriesSchema>;

/**
 * Array schemas for bulk operations
 */
export const GenreArraySchema = z.array(GenreSchema);
export const MediaUnitArraySchema = z.array(MediaUnitSchema);
export const MediaSeriesArraySchema = z.array(MediaSeriesSchema);

/**
 * Partial schema cho draft/incomplete content
 */
export const PartialMediaSeriesSchema = MediaSeriesSchema.partial({
  cover_url: true,
  genres: true,
  latest_chapter: true,
  synopsis: true,
});

export type PartialMediaSeries = z.infer<typeof PartialMediaSeriesSchema>;

/**
 * Preview schema cho lists/cards (minimal data)
 */
export const MediaSeriesPreviewSchema = MediaSeriesSchema.pick({
  id: true,
  title: true,
  slug: true,
  cover_url: true,
  type: true,
  rating: true,
  views: true,
});

export type MediaSeriesPreview = z.infer<typeof MediaSeriesPreviewSchema>;

/**
 * Utilities for Media Series
 */
export const MediaSeriesUtils = {
  /**
   * Format views count
   */
  formatViews(views: number): string {
    if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
    if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
    return views.toString();
  },

  /**
   * Format rating
   */
  formatRating(rating: number): string {
    return rating.toFixed(1);
  },

  /**
   * Get genre names as array
   */
  getGenreNames(series: MediaSeries): string[] {
    return series.genres.map((g) => g.name);
  },

  /**
   * Get genre names as string
   */
  getGenreString(series: MediaSeries): string {
    return this.getGenreNames(series).join(", ");
  },

  /**
   * Check if series is new (created within X days)
   */
  isNew(series: MediaSeries, daysThreshold = 30): boolean {
    const createdDate = new Date(series.created_at);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays <= daysThreshold;
  },

  /**
   * Check if series is trending (high recent views)
   */
  isTrending(series: MediaSeries, viewsThreshold = 10000): boolean {
    return series.views >= viewsThreshold;
  },

  /**
   * Get badge variant based on series data
   */
  getBadgeVariant(series: MediaSeries): BadgeVariant | null {
    if (this.isNew(series, 7)) return "new";
    if (this.isTrending(series, 50000)) return "hot";
    if (series.rating >= 9) return "exclusive";
    if (this.isTrending(series, 20000)) return "trending";
    return null;
  },

  /**
   * Create default series (for testing)
   */
  createDefault(overrides?: Partial<MediaSeries>): MediaSeries {
    return MediaSeriesSchema.parse({
      id: crypto.randomUUID(),
      title: "Untitled Series",
      slug: "untitled-series",
      user: {
        id: crypto.randomUUID(),
        display_name: "Unknown Author",
        username: "unknown",
      },
      ...overrides,
    });
  },
};

/**
 * Genre Utilities
 */
export const GenreUtils = {
  /**
   * Create genre from name
   */
  create(name: string): Genre {
    return GenreSchema.parse({
      id: crypto.randomUUID(),
      name,
    });
  },

  /**
   * Create multiple genres from names
   */
  createMany(names: string[]): Genre[] {
    return names.map((name) => this.create(name));
  },
};
