/**
 * History Service - mock implementation for continue section
 */

import type { HistoryMedia } from "@/lib/api/models/content/history-content";
import {
  HistoryMediaSchema,
} from "@/lib/api/models/content/history-content";
import { getMockHistoryMedia } from "@/lib/api/mock/mock-history-content";
import {
  isSuccessResponse,
  type StandardResponse,
} from "@/lib/api/types";
import { ApiParser } from "@/lib/api/utils/parsers";

const mockDelay = async (min = 200, max = 400) => {
  const delay = Math.random() * (max - min) + min;
  await new Promise((resolve) => setTimeout(resolve, delay));
};

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
}
