/**
 * Community Queries - Data fetching for Server Components
 * Uses React cache for automatic deduplication
 */

import {
  CreatorStatsSchema,
  type CreatorStats,
} from "@/features/community/creator-stats";
import { serverApi } from "@/lib/api/server";
import { isSuccessResponse, type StandardResponse } from "@/lib/api/types";
import { endpoints } from "@/lib/api/utils/endpoint";
import { ApiParser } from "@/lib/api/utils/parsers";
import { cache } from "react";

/**
 * Get top creators from API
 *
 * @example
 * const creators = await getTopCreators({ limit: 10 })
 */
export const getTopCreators = cache(
  async (params?: {
    limit?: number;
    view_period?: string;
  }): Promise<CreatorStats[]> => {
    const url = endpoints.creators({
      role: "CREATOR",
      limit: params?.limit || 10,
      view_period: params?.view_period || "week",
      sort_by: "total_views",
      sort_order: "desc",
    });

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
 * Wrapper cho getTopCreators
 * Compatible với getCachedTopCreators(limit)
 */
export const getCachedTopCreators = cache(async (limit = 10) => {
  return getTopCreators({ limit });
});
