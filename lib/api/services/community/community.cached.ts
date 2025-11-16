/**
 * Cached Community Service - Optimized data fetching with Cache Components
 * These functions use 'use cache' directive for better performance
 *
 * Cache Strategy:
 * - Top Creators: 10min stale, 30min revalidate, 2hr expire
 * - Genre Stats: 15min stale, 1hr revalidate, 4hr expire
 * - Milestones: 5min stale, 15min revalidate, 1hr expire
 */

import { cacheLife, cacheTag } from "next/cache";
import type { CreatorStats } from "../../models/community/creator-stats";
import type { GenreStats } from "../../models/community/genre-stats";
import type { Milestone } from "../../models/community/milestone";
import { CommunityService } from "./community.service";

/**
 * Get top creators with caching
 * Creator rankings change moderately, use medium cache duration
 */
export async function getCachedTopCreators(
  limit = 10
): Promise<CreatorStats[]> {
  "use cache";
  cacheTag("top-creators");
  cacheLife("moderate"); // 10min stale, 30min revalidate

  return await CommunityService.getTopCreators(limit);
}

/**
 * Get genre stats with caching
 * Genre stats change slowly, can use longer cache
 */
export async function getCachedGenreStats(limit = 12): Promise<GenreStats[]> {
  "use cache";
  cacheTag("genre-stats");
  cacheLife("long"); // 15min stale, 1hr revalidate

  return await CommunityService.getGenreStats(limit);
}

/**
 * Get community milestones with caching
 * Milestones are achievements, need moderate freshness
 */
export async function getCachedMilestones(limit = 6): Promise<Milestone[]> {
  "use cache";
  cacheTag("milestones");
  cacheLife("moderate");

  return await CommunityService.getMilestones(limit);
}
