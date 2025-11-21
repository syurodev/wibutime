/**
 * Community Queries - Data fetching for Server Components
 * Uses React cache for automatic deduplication
 */

import {
  GenreStatsSchema,
  type GenreStats,
} from "@/features/genre/types/genre-stats";
import {
  CreatorStatsSchema,
  type CreatorStats,
} from "@/lib/api/models/community/creator-stats";
import {
  MilestoneSchema,
  type Milestone,
} from "@/lib/api/models/community/milestone";
import { serverApi } from "@/lib/api/server";
import { isSuccessResponse, type StandardResponse } from "@/lib/api/types";
import { endpoint } from "@/lib/api/utils/endpoint";
import { ApiParser } from "@/lib/api/utils/parsers";
import { cache } from "react";

/**
 * Get top creators
 *
 * @example
 * const creators = await getTopCreators({ limit: 10 })
 */
export const getTopCreators = cache(
  async (params?: { limit?: number }): Promise<CreatorStats[]> => {
    const url = endpoint("community", "creators", "top", params || {});

    const response = await serverApi.get<StandardResponse<unknown>>(url, {
      next: {
        revalidate: 300, // Cache 5 minutes
        tags: ["community-creators"],
      },
    });

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch top creators");
    }

    return ApiParser.parseResponseArray(CreatorStatsSchema, response);
  }
);

/**
 * Get genre statistics
 *
 * @example
 * const genreStats = await getGenreStats({ limit: 12 })
 */
export const getGenreStats = cache(
  async (params?: { limit?: number }): Promise<GenreStats[]> => {
    const url = endpoint("community", "genres", "stats", params || {});

    const response = await serverApi.get<StandardResponse<unknown>>(url, {
      next: {
        revalidate: 300, // Cache 5 minutes
        tags: ["community-genre-stats"],
      },
    });

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch genre stats");
    }

    return ApiParser.parseResponseArray(GenreStatsSchema, response);
  }
);

/**
 * Get rising genres (trending up)
 *
 * @example
 * const risingGenres = await getRisingGenres({ limit: 6 })
 */
export const getRisingGenres = cache(
  async (params?: { limit?: number }): Promise<GenreStats[]> => {
    const url = endpoint("community", "genres", "rising", params || {});

    const response = await serverApi.get<StandardResponse<unknown>>(url, {
      next: {
        revalidate: 300, // Cache 5 minutes
        tags: ["community-genre-stats"],
      },
    });

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch rising genres");
    }

    return ApiParser.parseResponseArray(GenreStatsSchema, response);
  }
);

/**
 * Get community milestones
 *
 * @example
 * const milestones = await getMilestones({ limit: 6 })
 */
export const getMilestones = cache(
  async (params?: { limit?: number }): Promise<Milestone[]> => {
    const url = endpoint("community", "milestones", params || {});

    const response = await serverApi.get<StandardResponse<unknown>>(url, {
      next: {
        revalidate: 300, // Cache 5 minutes
        tags: ["community-milestones"],
      },
    });

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch milestones");
    }

    return ApiParser.parseResponseArray(MilestoneSchema, response);
  }
);
