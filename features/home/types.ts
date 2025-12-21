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
 * Organization Stats Schema
 */
export const OrganizationStatsSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  avatar_url: z.string().optional(),
  member_count: z.number().int().default(0),
  total_activity: z.number().int().default(0),
});

/**
 * Novel Chapter Summary Schema (Fresh Updates)
 */
export const NovelChapterSummarySchema = z.object({
  id: z.string(),
  novel_id: z.string(),
  volume_id: z.string().nullable().optional(),
  chapter_number: z.number().int(),
  title: z.string(),
  slug: z.string(),
  word_count: z.number().int(),
  published_at: z.string(),
  novel_title: z.string().optional(),
  novel_slug: z.string().optional(),
  novel_cover: z.string().optional(), // Added for display
  author_name: z.string().optional(), // Added for display
});

/**
 * Home Data Schema - Aggregated data for home page
 * Matches backend PublicService.HomeData structure
 */
export const HomeDataSchema = z.object({
  hero: z.array(MediaSeriesSchema).default([]),
  trending: z.array(MediaSeriesSchema).default([]),

  // Community & Analytics
  creators: z.array(CreatorStatsSchema).default([]), // Legacy support if needed
  most_active_creators: z.array(CreatorStatsSchema).default([]),
  active_organizations: z.array(OrganizationStatsSchema).default([]),
  rising_stars: z.array(CreatorStatsSchema).default([]),

  // Content Updates
  fresh_updates: z.array(NovelChapterSummarySchema).default([]),

  genres: z.array(HomeGenreSchema).default([]),
});

export type HomeData = z.infer<typeof HomeDataSchema>;
export type OrganizationStats = z.infer<typeof OrganizationStatsSchema>;
export type NovelChapterSummary = z.infer<typeof NovelChapterSummarySchema>;
