/**
 * History Queries - Data fetching for Server Components
 * Uses React cache for automatic deduplication
 */

import {
  HistoryMediaSchema,
  type HistoryMedia,
} from "@/features/history/types/history-content";
import { serverApi } from "@/lib/api/server";
import { isSuccessResponse, type StandardResponse } from "@/lib/api/types";
import { endpoint } from "@/lib/api/utils/endpoint";
import { ApiParser } from "@/lib/api/utils/parsers";
import type { CONTENT_TYPE } from "@/lib/constants/default";
import { cache } from "react";

/**
 * History query parameters
 */
export interface HistoryQuery {
  page?: number;
  limit?: number;
  type?: CONTENT_TYPE | "all";
  sort?: "recent" | "title" | "updated";
}

/**
 * Get recent history
 * Returns user's continue watching/reading list
 *
 * @example
 * const history = await getRecentHistory({ limit: 12 })
 */
export const getRecentHistory = cache(
  async (params?: { limit?: number }): Promise<HistoryMedia[]> => {
    const url = endpoint("history", params || {});

    const response = await serverApi.get<StandardResponse<unknown>>(url, {
      next: {
        revalidate: 60, // Cache 1 minute
        tags: ["user-history"],
      },
    });

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch history");
    }

    return ApiParser.parseResponseArray(HistoryMediaSchema, response);
  }
);

/**
 * Get paginated history with filters and sorting
 *
 * @example
 * const history = await getHistory({ page: 1, type: "anime", sort: "recent" })
 */
export const getHistory = cache(
  async (
    params?: Partial<HistoryQuery>
  ): Promise<{
    items: HistoryMedia[];
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  }> => {
    const url = endpoint("history", params || {});

    const response = await serverApi.get<StandardResponse<unknown>>(url, {
      next: {
        revalidate: 60, // Cache 1 minute
        tags: ["user-history"],
      },
    });

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch history");
    }

    const items = ApiParser.parseResponseArray(HistoryMediaSchema, response);

    return {
      items,
      page: response.meta?.page || 1,
      limit: response.meta?.limit || 15,
      total_items: response.meta?.total_items || items.length,
      total_pages: response.meta?.total_pages || 1,
    };
  }
);

/**
 * Get history item by ID
 *
 * @example
 * const item = await getHistoryById("550e8400-e29b-41d4-a716-446655440000")
 */
export const getHistoryById = cache(
  async (id: string): Promise<HistoryMedia> => {
    const url = endpoint("history", id);

    const response = await serverApi.get<StandardResponse<unknown>>(url, {
      next: {
        revalidate: 60, // Cache 1 minute
        tags: [`history-${id}`, "user-history"],
      },
    });

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch history item");
    }

    return ApiParser.parse(HistoryMediaSchema, response);
  }
);
