/**
 * Community Milestone Model - Zod Schema
 * Platform and community achievement tracking
 */

import { z } from "zod";

/**
 * Milestone Type
 */
export const MilestoneTypeEnum = z.enum([
  "platform", // Platform-wide milestones
  "series", // Individual series milestones
  "creator", // Creator achievements
  "community", // Community events
]);

export type MilestoneType = z.infer<typeof MilestoneTypeEnum>;

/**
 * Milestone Schema
 */
export const MilestoneSchema = z.object({
  id: z.string(),
  type: MilestoneTypeEnum,
  title: z.string(),
  description: z.string(),
  value: z.number().int().min(0),
  icon: z.string().default("trophy"),
  achieved_at: z.string().default(() => new Date().toISOString()),
  // Optional fields for context
  series_id: z.string().optional(),
  series_title: z.string().optional(),
  creator_id: z.string().optional(),
  creator_name: z.string().optional(),
});

export type Milestone = z.infer<typeof MilestoneSchema>;

/**
 * Utilities for Milestones
 */
export const MilestoneUtils = {
  /**
   * Parse milestone data
   */
  parse(data: unknown): Milestone {
    return MilestoneSchema.parse(data);
  },

  /**
   * Format milestone value
   */
  formatValue(value: number): string {
    if (value >= 1_000_000_000)
      return `${(value / 1_000_000_000).toFixed(1)}B`;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
    return value.toString();
  },

  /**
   * Get time since achievement
   */
  getTimeSince(achievedAt: string): string {
    const now = new Date();
    const achieved = new Date(achievedAt);
    const diffMs = now.getTime() - achieved.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  },
};
