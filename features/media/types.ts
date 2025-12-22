/**
 * Media Types - Zod Schema
 * Types for media top API (top anime, manga, novel)
 */

import { MediaSeriesSchema } from "@/features/content/types";
import { z } from "zod";

/**
 * Extended Media Series with rank info
 */
export const MediaSeriesWithRankSchema = MediaSeriesSchema.extend({
  current_rank: z.number().int().optional().nullable(),
  previous_rank: z.number().int().optional().nullable(),
  rank_change: z.number().int().optional().nullable(),
});

export type MediaSeriesWithRank = z.infer<typeof MediaSeriesWithRankSchema>;

/**
 * Top Media Response Schema
 * Response from /api/v1/media/top - always returns arrays
 */
export const TopMediaResponseSchema = z.object({
  anime: z.array(MediaSeriesWithRankSchema).default([]),
  manga: z.array(MediaSeriesWithRankSchema).default([]),
  novel: z.array(MediaSeriesWithRankSchema).default([]),
});

export type TopMediaResponse = z.infer<typeof TopMediaResponseSchema>;

/**
 * Top Media Query Parameters
 */
export interface TopMediaParams {
  period?: "day" | "week" | "month" | "year";
  offset?: 0 | 1; // 0 = current period, 1 = previous period
  limit?: number; // Number of items per type (default 1, max 10)
}
