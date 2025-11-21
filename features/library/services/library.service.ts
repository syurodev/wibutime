/**
 * Library Service - API service for user's library content
 */

import { getMockMediaSeries } from "@/lib/api/mock/mock-base-content";
import {
  MediaSeries,
  MediaSeriesSchema,
} from "@/lib/api/models/content/base-content";
import {
  isSuccessResponse,
  type PaginationMeta,
  type StandardResponse,
} from "@/lib/api/types";
import { ApiParser } from "@/lib/api/utils/parsers";
import type { CONTENT_TYPE } from "@/lib/constants/default";

/**
 * Simulate API delay
 */
async function mockDelay(min = 200, max = 500): Promise<void> {
  const delay = Math.random() * (max - min) + min;
  await new Promise((resolve) => setTimeout(resolve, delay));
}

export class LibraryService {
  /**
   * Get user library with pagination and sorting
   *
   * @param options - Pagination, filter and sort options
   * @param options.type - Content type filter (default: 'all')
   * @param options.page - Page number (default: 1)
   * @param options.limit - Items per page (default: 20)
   * @param options.sort - Sort option: 'recent' | 'title' | 'updated' | 'rating' (default: 'recent')
   */
  static async getLibraryPaginated(options?: {
    type?: CONTENT_TYPE | "all";
    page?: number;
    limit?: number;
    sort?: "recent" | "title" | "updated" | "rating";
  }): Promise<{
    items: MediaSeries[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  }> {
    const {
      type = "all",
      page = 1,
      limit = 20,
      sort = "recent",
    } = options || {};
    await mockDelay();

    // Filter by type if specified
    let filteredSeries = getMockMediaSeries(100);
    if (type !== "all") {
      filteredSeries = filteredSeries.filter((s) => s.type === type);
    }

    // Sort based on the sort parameter
    let sortedSeries: typeof filteredSeries;
    switch (sort) {
      case "title":
        sortedSeries = filteredSeries.toSorted((a, b) =>
          a.title.localeCompare(b.title)
        );
        break;
      case "updated":
        sortedSeries = filteredSeries.toSorted(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
        break;
      case "rating":
        sortedSeries = filteredSeries.toSorted(
          (a, b) => b.favorites - a.favorites
        );
        break;
      case "recent":
      default:
        // Sort by created_at (most recent added to library)
        sortedSeries = filteredSeries.toSorted(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
    }

    // Calculate pagination
    const totalItems = sortedSeries.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = sortedSeries.slice(startIndex, endIndex);

    const meta: PaginationMeta = {
      page,
      limit,
      total_items: totalItems,
      total_pages: totalPages,
    };

    const response: StandardResponse<MediaSeries[]> = {
      success: true,
      message: "Library series retrieved successfully",
      data: paginatedItems,
      meta,
    };

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch library series");
    }

    return {
      items: ApiParser.parseResponseArray(MediaSeriesSchema, response),
      totalItems: meta.total_items,
      totalPages: meta.total_pages,
      currentPage: meta.page,
    };
  }
}
