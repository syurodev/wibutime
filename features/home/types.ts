/**
 * Home Data Types - Zod Schemas for home page aggregated data
 */

import { z } from "zod";
import { CreatorStatsSchema } from "../community/creator-stats";
import { MediaSeriesSchema } from "../content/types";

/**
 * Genre Stats Schema for home page
 */
export const HomeGenreSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable().optional(),
  novel_count: z.number().int().min(0).default(0),
  active_readers: z.number().int().min(0).default(0),
  total_views: z.number().int().min(0).default(0),
  trend: z.string().optional(),
});

export type HomeGenre = z.infer<typeof HomeGenreSchema>;

/**
 * Home Data Schema - Aggregated data for home page
 * Matches backend PublicService.HomeData structure
 */
export const HomeDataSchema = z.object({
  hero: z.array(MediaSeriesSchema).default([]),
  trending: z.array(MediaSeriesSchema).default([]),
  creators: z.array(CreatorStatsSchema).default([]),
  genres: z.array(HomeGenreSchema).default([]),
});

export type HomeData = z.infer<typeof HomeDataSchema>;
