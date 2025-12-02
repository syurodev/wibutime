/**
 * Novel Models - Zod Schemas
 * Data models cho novel detail page
 * Follows pattern from base-content.ts with snake_case fields
 */

import { z } from "zod";

/**
 * Genre Schema
 */
export const NovelGenreSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type NovelGenre = z.infer<typeof NovelGenreSchema>;

/**
 * Chapter Schema
 */
export const NovelChapterSchema = z.object({
  id: z.string(),
  title: z.string(),
  chapter_number: z.number().int().min(1),
  content: z.any(),
  status: z.string(),
  price: z.number().min(0).optional(),
  currency: z.string().length(3).optional(),
  views: z.number().int().min(0).default(0),
  created_at: z.string(),
  is_free: z.boolean().default(true),
});

export type NovelChapter = z.infer<typeof NovelChapterSchema>;

/**
 * Volume Schema - Updated to match backend VolumeResponse
 */
export const NovelVolumeSchema = z.object({
  id: z.string(),
  novel_id: z.string(),
  novel_title: z.string(), // Novel title for display
  volume_number: z.number().int().min(1),
  title: z.string(),
  slug: z.string(),
  cover_image_url: z.string().nullable().optional(),
  chapter_count: z.number().int().min(0),
  word_count: z.number().int().min(0),
  display_order: z.number().int().min(0),
  is_published: z.boolean(),
  published_at: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
  // Optional fields for UI that might be populated
  description: z.string().optional(),
  chapters: z.array(NovelChapterSchema).default([]),
});

export type NovelVolume = z.infer<typeof NovelVolumeSchema>;

/**
 * Review Schema
 */
export const NovelReviewSchema = z.object({
  id: z.number(),
  user: z.object({
    name: z.string(),
    avatar: z.string(),
  }),
  comment: z.string(),
  rating: z.number().min(1).max(5),
  time: z.string(),
});

export type NovelReview = z.infer<typeof NovelReviewSchema>;

/**
 * Recommendation Schema
 */
export const NovelRecommendationSchema = z.object({
  id: z.number(),
  title: z.string(),
  subtitle: z.string(),
  rating: z.number().min(0).max(5),
  image: z.string(),
});

export type NovelRecommendation = z.infer<typeof NovelRecommendationSchema>;

/**
 * Novel Detail Schema - Full novel data
 * Uses snake_case to match server response
 */
export const NovelDetailSchema = z.object({
  // Basic Info
  id: z.string(),
  title: z.string(),
  original_title: z.string(),
  slug: z.string(),
  cover_url: z.string(),

  // People
  author: z.string(),
  artist: z.string(),

  // Stats
  rating: z.number().min(0).max(5),
  rating_count: z.number().int().min(0),
  views: z.number().int().min(0),
  favorites: z.number().int().min(0),

  // Status
  status: z.string(),
  type: z.string(),
  release_year: z.number().int(),

  // Content
  description: z.array(z.any()), // TNode[] from platejs
  genres: z.array(NovelGenreSchema),
  tags: z.array(z.string()),

  // Relations
  volumes: z.array(NovelVolumeSchema),
  reader_comments: z.array(NovelReviewSchema),
  recommendations: z.array(NovelRecommendationSchema),
});

export type NovelDetail = z.infer<typeof NovelDetailSchema>;

/**
 * Array schemas
 */
export const NovelGenreArraySchema = z.array(NovelGenreSchema);
export const NovelVolumeArraySchema = z.array(NovelVolumeSchema);
export const NovelReviewArraySchema = z.array(NovelReviewSchema);
export const NovelRecommendationArraySchema = z.array(
  NovelRecommendationSchema
);

/**
 * Novel Utilities
 */
export const NovelUtils = {
  /**
   * Check if novel is bookmarked (to be implemented with real API)
   */
  isBookmarked(novelId: string): boolean {
    return false;
  },

  /**
   * Format rating for display
   */
  formatRating(rating: number): string {
    return rating.toFixed(1);
  },

  // TODO: Update these methods when NovelDetail schema is updated
  getTotalChapters(novel: NovelDetail): number {
    return novel.volumes.reduce((sum, vol) => sum + vol.chapter_count, 0);
  },
  getAllChapters(novel: NovelDetail): NovelChapter[] {
    return novel.volumes.flatMap((vol) => vol.chapters || []);
  },
  getFreeChaptersCount(novel: NovelDetail): number {
    return this.getAllChapters(novel).filter((ch) => ch.is_free).length;
  },
};
