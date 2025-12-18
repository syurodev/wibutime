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
 * Novel Schema matching Backend API Response
 */
export const NovelBackendSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  synopsis: z.any(),
  cover_image_url: z.string().optional().nullable(),
  thumbnail_url: z.string().optional().nullable(),
  status: z.string(),
  is_oneshot: z.boolean(),
  genre_ids: z
    .array(z.string())
    .nullable()
    .optional()
    .transform((val) => val ?? []),
  author_ids: z
    .array(z.string())
    .nullable()
    .optional()
    .transform((val) => val ?? []),
  artist_ids: z
    .array(z.string())
    .nullable()
    .optional()
    .transform((val) => val ?? []),
  genres: z
    .array(z.object({ id: z.string(), name: z.string() }))
    .nullable()
    .optional()
    .transform((val) => val ?? []),
  authors: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string().optional(),
      })
    )
    .nullable()
    .optional()
    .transform((val) => val ?? []),
  artists: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string().optional(),
      })
    )
    .nullable()
    .optional()
    .transform((val) => val ?? []),
  original_language: z.string().optional(),
  original_title: z.string().optional(),
  metadata: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type NovelBackend = z.infer<typeof NovelBackendSchema>;

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

// ============================================================================
// Dashboard & Analytics Types
// ============================================================================

export interface DashboardStats {
  totalNovels: number;
  totalChapters: number;
  totalViews: number;
  totalFavorites: number;
  averageRating: number;
  activeNovels: number; // ongoing status count
  trend?: {
    novels: number; // percentage change
    chapters: number;
    views: number;
    favorites: number;
  };
}

export interface TimeSeriesData {
  date: string; // ISO date string
  views: number;
  chapters: number;
  novels?: number;
  favorites?: number;
}

export interface NovelStatusBreakdown {
  status: "draft" | "ongoing" | "completed" | "hiatus" | "dropped";
  count: number;
  percentage: number;
}

export interface TopNovel {
  id: string;
  title: string;
  coverImage?: string;
  status: "draft" | "ongoing" | "completed" | "hiatus" | "dropped";
  viewCount: number;
  favoriteCount: number;
  ratingAverage: number;
  ratingCount: number;
  totalChapters: number;
  totalWords: number;
  lastChapterAt?: string;
}

export interface PublishingActivityData {
  period: string; // Date or period label
  chaptersPublished: number;
  wordsPublished: number;
}

export type OwnerType = "user" | "tenant";

/**
 * Get list of novels with filtering
 */
export interface GetNovelsParams {
  page?: number;
  limit?: number;
  owner?: string; // Owner ID
  key_search?: string;
  genre_ids?: string[];
  author_id?: string;
  artist_id?: string;
  status?: string[];
  original_language?: string;
  sort_by?: "created_at" | "rating" | "views" | "last_chapter";
  sort_order?: "asc" | "desc";
  token?: string; // Optional auth token for server-side calls
}

// ============================================================================
// Novel Full Response - Cho trang chi tiết novel (/novels/[slug]/full)
// ============================================================================

/**
 * Owner Info Schema
 */
export const OwnerInfoSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  display_name: z.string().optional(), // for owner (uploader)
  username: z.string().optional(),
  avatar_url: z.string().nullable().optional(),
  slug: z.string().optional(),
});

export type OwnerInfo = z.infer<typeof OwnerInfoSchema>;

export const GenreInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
});

export type GenreInfo = z.infer<typeof GenreInfoSchema>;

/**
 * Chapter Summary Schema - không có content
 */
export const ChapterSummarySchema = z.object({
  id: z.string(),
  volume_id: z.string().nullable().optional(),
  chapter_number: z.number(),
  title: z.string(),
  slug: z.string(),
  display_order: z.number(),
  status: z.string(),
  published_at: z.string().nullable().optional(),
});

export type ChapterSummary = z.infer<typeof ChapterSummarySchema>;

/**
 * Volume with Chapters Schema
 */
export const VolumeWithChaptersSchema = z.object({
  id: z.string(),
  volume_number: z.number(),
  title: z.string(),
  slug: z.string(),
  cover_image_url: z.string().nullable().optional(),
  display_order: z.number(),
  is_published: z.boolean(),
  published_at: z.string().nullable().optional(),
  chapters: z.array(ChapterSummarySchema).default([]),
});

export type VolumeWithChapters = z.infer<typeof VolumeWithChaptersSchema>;

/**
 * Novel Full Response Schema - Response từ /novels/:slug/full
 */
export const NovelFullResponseSchema = z.object({
  // Basic Info
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  synopsis: z.any(), // JSON content
  cover_image_url: z.string().nullable().optional(),
  thumbnail_url: z.string().nullable().optional(),
  status: z.string(),
  is_oneshot: z.boolean(),
  original_language: z.string().nullable().optional(),
  original_title: z.string().nullable().optional(),

  // Relations
  genre_ids: z.array(z.string()).default([]),
  author_ids: z.array(z.string()).default([]),
  artist_ids: z.array(z.string()).default([]),
  genres: z.array(GenreInfoSchema).default([]),
  authors: z.array(OwnerInfoSchema).default([]),
  artists: z.array(OwnerInfoSchema).default([]),
  owner: OwnerInfoSchema,

  // Stats
  total_volumes: z.number().default(0),
  total_chapters: z.number().default(0),
  total_words: z.number().default(0),
  view_count: z.number().default(0),
  favorite_count: z.number().default(0),
  rating_average: z.number().default(0),
  rating_count: z.number().default(0),

  // Metadata
  metadata: z.string().nullable().optional(),
  first_published_at: z.string().nullable().optional(),
  last_chapter_at: z.string().nullable().optional(),
  completed_at: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),

  // Volumes and Chapters
  volumes: z.array(VolumeWithChaptersSchema).default([]),
  chapters: z.array(ChapterSummarySchema).default([]), // chapters không thuộc volume nào
});

export type NovelFullResponse = z.infer<typeof NovelFullResponseSchema>;
