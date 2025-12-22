/**
 * History Types - Zod Schemas for Media Progress/History
 * Matches backend API: /api/v1/history/*
 */

import { MEDIA_TYPE } from "@/lib/constants/default";
import { z } from "zod";
import { GenreSchema } from "../content";
import { BaseUserSchema } from "../user/base-user";

// =============================================================================
// POSITION SCHEMAS
// =============================================================================

/**
 * Novel position - where user left off reading
 */
export const NovelPositionSchema = z.object({
  node_id: z.string(),
  preview: z.string(),
});

export type NovelPosition = z.infer<typeof NovelPositionSchema>;

/**
 * Manga position - page number
 */
export const MangaPositionSchema = z.object({
  page: z.number().int().min(0),
});

export type MangaPosition = z.infer<typeof MangaPositionSchema>;

/**
 * Anime position - time in video
 */
export const AnimePositionSchema = z.object({
  time: z.string(), // "12:34" or "01:23:45"
  seconds: z.number().int().min(0).optional(),
});

export type AnimePosition = z.infer<typeof AnimePositionSchema>;

// =============================================================================
// MAIN SCHEMAS
// =============================================================================

/**
 * Media info in history response
 */
export const HistoryMediaInfoSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  cover_url: z.string().nullable().optional(),
  type: z.enum([MEDIA_TYPE.ANIME, MEDIA_TYPE.MANGA, MEDIA_TYPE.NOVEL]),
  status: z.string().optional(),
  genres: z.array(GenreSchema).default([]),
  author: BaseUserSchema.optional(),
  rating: z.number().min(0).max(10).default(0),
  views: z.number().int().min(0).default(0),
  favorites: z.number().int().min(0).default(0),
});

export type HistoryMediaInfo = z.infer<typeof HistoryMediaInfoSchema>;

/**
 * Unit info (chapter/episode) in history response
 */
export const HistoryUnitInfoSchema = z.object({
  id: z.string(),
  number: z.number().int(),
  title: z.string(),
  slug: z.string().optional(),
});

export type HistoryUnitInfo = z.infer<typeof HistoryUnitInfoSchema>;

/**
 * Main History Item Schema
 * Represents user's progress on a media (novel/manga/anime)
 */
export const HistoryItemSchema = z.object({
  id: z.string(),

  // Media info
  media: HistoryMediaInfoSchema.optional(),

  // Current unit (chapter/episode)
  latest_unit: HistoryUnitInfoSchema.optional(),

  // Position data (based on media type)
  novel_last_read_info: NovelPositionSchema.optional(),
  manga_last_page_read: z.number().int().min(0).optional(),
  anime_last_episode_time_viewed: z.string().optional(),

  // Progress stats
  user_progress_percentage: z.number().min(0).max(100).default(0),
  total_units: z.number().int().min(0).optional(),
  completed_units: z.number().int().min(0).optional(),

  // Timestamps
  last_viewed_at: z.string(),
  content_updated_at: z.string().optional(),
});

export type HistoryItem = z.infer<typeof HistoryItemSchema>;

/**
 * Array schema
 */
export const HistoryItemArraySchema = z.array(HistoryItemSchema);

// =============================================================================
// UNIT PROGRESS (for chapter list view)
// =============================================================================

/**
 * Unit (chapter/episode) progress status
 */
export const UnitProgressSchema = z.object({
  unit_id: z.string(),
  status: z.enum(["in_progress", "completed"]),
  is_read: z.boolean(),
  completed_at: z.string().nullable().optional(),
});

export type UnitProgress = z.infer<typeof UnitProgressSchema>;

export const UnitProgressArraySchema = z.array(UnitProgressSchema);

// =============================================================================
// QUERY PARAMS
// =============================================================================

export interface HistoryQueryParams {
  page?: number;
  limit?: number;
  type?: "novel" | "manga" | "anime" | "all";
  sort?: "recent" | "title" | "progress";
}

// =============================================================================
// UPDATE INPUT
// =============================================================================

export interface UpdateHistoryInput {
  content_id: string;
  media_type?: "novel" | "manga" | "anime";
  latest_unit_id: string;
  novel_last_read_info?: NovelPosition;
  manga_last_page_read?: number;
  anime_last_episode_time_viewed?: string;
}
