/**
 * Creator Queries - Data fetching
 */

import { serverApi } from "@/lib/api/server";
import { isSuccessResponse, type StandardResponse } from "@/lib/api/types";
import { endpoints } from "@/lib/api/utils/endpoint";
import { ApiParser } from "@/lib/api/utils/parsers";
import { cache } from "react";
import { CreatorSchema, type Creator } from "./types";

/**
 * Get top creators from API
 * Supports rank comparison
 *
 * @example
 * const creators = await getTopCreators({ limit: 10, include_rank_change: true })
 */
export const getTopCreators = cache(
  async (params?: {
    limit?: number;
    period?: string;
    include_rank_change?: boolean;
  }): Promise<Creator[]> => {
    // We construct the URL manually or assume endpoints.creators supports these params
    // Current endpoints helper might be rigid, so we use string interpolation for safety if needed
    // But ideally we use the endpoints utility if it supports query params object

    // Using endpoints.creators but overriding query params logic if needed
    const url = endpoints.creators({
      role: "CREATOR",
      limit: params?.limit || 10,
      view_period: params?.period || "week",
      sort_by: "total_views",
      sort_order: "desc",
      // Custom params can be appended if endpoints() doesn't support them all
    });

    // Append include_rank_change manually if not supported by endpoints builder
    const finalUrl = params?.include_rank_change
      ? `${url}&include_rank_change=true`
      : url;

    const response = await serverApi.get<StandardResponse<unknown>>(finalUrl, {
      next: {
        revalidate: 300, // Cache 5 minutes
        tags: [
          "creators",
          "top-creators",
          `top-creators-${params?.period}-${params?.limit}-${params?.include_rank_change}`,
        ],
      },
    });

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch top creators");
    }

    return ApiParser.parseResponseArray(CreatorSchema, response);
  }
);
