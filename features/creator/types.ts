/**
 * Creator Model - Zod Schema
 * Domain specific model for creators
 */

import { z } from "zod";
import { BaseUserSchema } from "../user/base-user";

/**
 * Creator Schema
 * Includes extensive stats and rank information
 */
export const CreatorSchema = BaseUserSchema.extend({
  // Stats
  follower_count: z.number().int().min(0).default(0),
  works_count: z.number().int().min(0).default(0),
  total_views: z.number().int().min(0).default(0),

  // Status
  is_verified: z.boolean().default(false),

  // Profile
  bio: z.array(z.any()).optional(), // TNode[] from platejs

  // Popular Work (can be null if no works)
  popular_work_id: z.string().nullable().optional(),
  popular_work_title: z.string().nullable().optional(),
  popular_work_cover_url: z.string().nullable().optional(),

  // Rank Comparison (Optional)
  current_rank: z.number().int().optional(),
  previous_rank: z.number().int().optional().nullable(),
  rank_change: z.number().int().optional().nullable(),
});

export type Creator = z.infer<typeof CreatorSchema>;

/**
 * Utilities for Creator
 */
export const CreatorUtils = {
  /**
   * Parse creator data
   */
  parse(data: unknown): Creator {
    return CreatorSchema.parse(data);
  },

  /**
   * Format follower count
   */
  formatFollowers(count: number): string {
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
    return count.toString();
  },

  /**
   * Format views count
   */
  formatViews(count: number): string {
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
    return count.toString();
  },
};
