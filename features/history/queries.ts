/**
 * History Queries - Data fetching for Server Components
 * Uses React cache for automatic deduplication
 *
 * Backend API:
 * - GET /api/v1/history - Paginated history list
 * - GET /api/v1/history/recent - Recent items for "Continue" section
 * - GET /api/v1/progress/:type/:id/units - Chapter read statuses
 */

import { serverApi } from "@/lib/api/server";
import { isSuccessResponse, type StandardResponse } from "@/lib/api/types";
import { ApiParser } from "@/lib/api/utils/parsers";
import { cache } from "react";
import {
  HistoryItem,
  HistoryItemSchema,
  type HistoryQueryParams,
  UnitProgress,
  UnitProgressSchema,
} from "./types";

// =============================================================================
// CONTINUE READING / RECENT HISTORY
// =============================================================================

/**
 * Get recent history for "Continue Reading/Watching" section
 * API: GET /api/v1/history/recent
 *
 * @example
 * const history = await getRecentHistory({ limit: 12 })
 */
export const getRecentHistory = cache(
  async (params?: { limit?: number }): Promise<HistoryItem[]> => {
    const queryParams = new URLSearchParams();
    if (params?.limit) {
      queryParams.append("limit", params.limit.toString());
    }

    const url = `/history/recent${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await serverApi.get<StandardResponse<HistoryItem[]>>(url, {
      next: {
        revalidate: 60, // Cache 1 minute
        tags: ["user-history", "continue-reading"],
      },
    });

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch recent history");
    }

    return ApiParser.parseResponseArray(HistoryItemSchema, response);
  }
);

// =============================================================================
// HISTORY LIST (PAGINATED)
// =============================================================================

/**
 * Get paginated history with filters
 * API: GET /api/v1/history
 *
 * @example
 * const { items, page, total_pages } = await getHistory({ page: 1, type: "novel" })
 */
export const getHistory = cache(
  async (
    params?: Partial<HistoryQueryParams>
  ): Promise<{
    items: HistoryItem[];
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  }> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.type && params.type !== "all")
      queryParams.append("type", params.type);
    if (params?.sort) queryParams.append("sort", params.sort);

    const url = `/history${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await serverApi.get<StandardResponse<HistoryItem[]>>(url, {
      next: {
        revalidate: 60,
        tags: ["user-history"],
      },
    });

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch history");
    }

    const items = ApiParser.parseResponseArray(HistoryItemSchema, response);

    return {
      items,
      page: response.meta?.page || 1,
      limit: response.meta?.limit || 15,
      total_items: response.meta?.total_items || items.length,
      total_pages: response.meta?.total_pages || 1,
    };
  }
);

// =============================================================================
// UNIT PROGRESS (FOR CHAPTER LIST)
// =============================================================================

/**
 * Get read status for all chapters in a media
 * API: GET /api/v1/progress/:media_type/:media_id/units
 *
 * @example
 * const progress = await getUnitProgress("novel", "novel-uuid")
 * // Returns array of { unit_id, status, is_read, completed_at }
 */
export const getUnitProgress = cache(
  async (
    mediaType: "novel" | "manga" | "anime",
    mediaId: string
  ): Promise<UnitProgress[]> => {
    const url = `/progress/${mediaType}/${mediaId}/units`;

    const response = await serverApi.get<StandardResponse<UnitProgress[]>>(
      url,
      {
        next: {
          revalidate: 60,
          tags: ["user-history", `progress-${mediaType}-${mediaId}`],
        },
      }
    );

    if (!isSuccessResponse(response)) {
      // Return empty array if no progress found (not an error)
      return [];
    }

    return ApiParser.parseResponseArray(UnitProgressSchema, response);
  }
);

/**
 * Helper: Create a map of unit_id -> is_read for easy lookup
 *
 * @example
 * const readMap = await getUnitProgressMap("novel", "novel-uuid")
 * const isRead = readMap.get("chapter-uuid") // true/false
 */
export const getUnitProgressMap = cache(
  async (
    mediaType: "novel" | "manga" | "anime",
    mediaId: string
  ): Promise<Map<string, boolean>> => {
    const progress = await getUnitProgress(mediaType, mediaId);
    return new Map(progress.map((p) => [p.unit_id, p.is_read]));
  }
);
