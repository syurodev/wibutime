/**
 * History Service - mock implementation for continue section
 */

import type { HistoryMedia } from "@/lib/api/models/content/history-content";
import {
  HistoryMediaSchema,
} from "@/lib/api/models/content/history-content";
import { getMockHistoryMedia } from "@/lib/api/mock/mock-history-content";
import type { CONTENT_TYPE } from "@/lib/constants/default";
import {
  isSuccessResponse,
  type StandardResponse,
} from "@/lib/api/types";
import { ApiParser } from "@/lib/api/utils/parsers";

const mockDelay = async (min = 200, max = 400) => {
  const delay = Math.random() * (max - min) + min;
  await new Promise((resolve) => setTimeout(resolve, delay));
};

export type HistorySortOption = "recent" | "title" | "updated";

interface GetHistoryPaginatedParams {
  type?: CONTENT_TYPE | "all";
  page?: number;
  limit?: number;
  sort?: HistorySortOption;
}

interface PaginatedHistoryResponse {
  items: HistoryMedia[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export class HistoryService {
  /**
   * Get continue-watching/reading list for current user
   */
  static async getRecentHistory(limit = 12): Promise<HistoryMedia[]> {
    await mockDelay();

    const response: StandardResponse<HistoryMedia[]> = {
      success: true,
      message: "History fetched successfully",
      data: getMockHistoryMedia(limit),
    };

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch history");
    }

    return ApiParser.parseResponseArray(
      HistoryMediaSchema,
      response
    );
  }

  /**
   * Get paginated history with filters and sorting
   */
  static async getHistoryPaginated({
    type = "all",
    page = 1,
    limit = 15,
    sort = "recent",
  }: GetHistoryPaginatedParams): Promise<PaginatedHistoryResponse> {
    await mockDelay();

    // Get all mock history data
    const allHistory = getMockHistoryMedia(50);

    // Filter by type
    let filtered = allHistory;
    if (type !== "all") {
      filtered = allHistory.filter((item) => item.type === type);
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sort) {
        case "title":
          return a.title.localeCompare(b.title);
        case "updated":
          return (
            new Date(b.content_updated_at).getTime() -
            new Date(a.content_updated_at).getTime()
          );
        case "recent":
        default:
          return (
            new Date(b.last_viewed_at).getTime() -
            new Date(a.last_viewed_at).getTime()
          );
      }
    });

    // Paginate
    const totalItems = sorted.length;
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = Math.min(Math.max(1, page), totalPages || 1);
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    const items = sorted.slice(startIndex, endIndex);

    return {
      items,
      currentPage,
      totalPages,
      totalItems,
    };
  }
}
