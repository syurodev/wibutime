/**
 * Community Service
 * Business logic for community features (creators, genres, milestones)
 */

import type { CreatorStats } from "../../models/community/creator-stats";
import type { GenreStats } from "../../models/community/genre-stats";
import type { Milestone } from "../../models/community/milestone";
import {
  getMockCreators,
  getMockGenreStats,
  getMockMilestones,
} from "../../mock/mock-community";

/**
 * Community Service
 * Handles community-related data operations
 */
export const CommunityService = {
  /**
   * Get top creators
   * @param limit - Number of creators to return
   * @returns Array of CreatorStats
   */
  async getTopCreators(limit: number = 10): Promise<CreatorStats[]> {
    // TODO: Replace with real API call
    const creators = getMockCreators(50);

    // Sort by follower count (descending)
    const sorted = creators.sort(
      (a, b) => b.follower_count - a.follower_count
    );

    return sorted.slice(0, limit);
  },

  /**
   * Get genre stats
   * @param limit - Number of genres to return
   * @returns Array of GenreStats
   */
  async getGenreStats(limit: number = 12): Promise<GenreStats[]> {
    // TODO: Replace with real API call
    const genres = getMockGenreStats(limit);

    // Sort by active readers (descending)
    return genres.sort((a, b) => b.active_readers - a.active_readers);
  },

  /**
   * Get community milestones
   * @param limit - Number of milestones to return
   * @returns Array of Milestone
   */
  async getMilestones(limit: number = 6): Promise<Milestone[]> {
    // TODO: Replace with real API call
    const milestones = getMockMilestones(limit);

    // Sort by achieved date (most recent first)
    return milestones.sort(
      (a, b) =>
        new Date(b.achieved_at).getTime() - new Date(a.achieved_at).getTime()
    );
  },

  /**
   * Get rising genres (trending up)
   * @param limit - Number of genres to return
   * @returns Array of GenreStats with rising trend
   */
  async getRisingGenres(limit: number = 6): Promise<GenreStats[]> {
    const genres = await this.getGenreStats(20);

    // Filter rising genres
    const rising = genres.filter((g) => g.trend === "rising");

    return rising.slice(0, limit);
  },
};
