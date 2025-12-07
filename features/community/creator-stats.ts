/**
 * Creator Stats Model - Zod Schema
 * Extended user model with community statistics
 */

import { z } from "zod";
import { BaseUserSchema } from "../user/base-user";

/**
 * Creator Stats Schema
 * User with additional creator statistics
 */
export const CreatorStatsSchema = BaseUserSchema.extend({
  follower_count: z.number().int().min(0).default(0),
  works_count: z.number().int().min(0).default(0),
  total_views: z.number().int().min(0).default(0),
  is_verified: z.boolean().default(false),
  bio: z.array(z.any()).optional(), // TNode[] from platejs
  popular_work_id: z.string().optional(),
  popular_work_title: z.string().optional(),
  popular_work_cover_url: z.string().optional(),
});

export type CreatorStats = z.infer<typeof CreatorStatsSchema>;

/**
 * Utilities for Creator Stats
 */
export const CreatorStatsUtils = {
  /**
   * Parse creator stats data
   */
  parse(data: unknown): CreatorStats {
    return CreatorStatsSchema.parse(data);
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
