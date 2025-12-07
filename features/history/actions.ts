"use server";

/**
 * History Actions - Server Actions for mutations
 * Use these from Client Components
 */

import {
  HistoryMediaSchema,
  type HistoryMedia,
  type NovelBookmark,
} from "@/features/history/types";
import { serverApi } from "@/lib/api/server";
import { isSuccessResponse, type StandardResponse } from "@/lib/api/types";
import { endpoint } from "@/lib/api/utils/endpoint";
import { ApiParser } from "@/lib/api/utils/parsers";
import { updateTag } from "next/cache";

/**
 * Update history data
 */
export interface UpdateHistoryData {
  content_id: string;
  latest_unit_id?: string;
  novel_last_read_info?: NovelBookmark;
  anime_last_episode_time_viewed?: string;
  manga_last_page_read?: number;
}

/**
 * Add or update history entry
 *
 * @example
 * const history = await updateHistory({
 *   content_id: "123",
 *   latest_unit_id: "456",
 *   novel_last_read_info: { node_id: "abc", preview: "..." }
 * })
 */
export async function updateHistory(
  data: UpdateHistoryData
): Promise<HistoryMedia> {
  const url = endpoint("history");

  const response = await serverApi.post<StandardResponse<unknown>>(url, data);

  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to update history");
  }

  // Immediately expire history cache
  updateTag("user-history");

  return ApiParser.parse(HistoryMediaSchema, response);
}

/**
 * Delete a history entry
 *
 * @example
 * await deleteHistory("123")
 */
export async function deleteHistory(id: string): Promise<void> {
  const url = endpoint("history", id);

  const response = await serverApi.delete<StandardResponse<unknown>>(url);

  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to delete history");
  }

  // Immediately expire history cache
  updateTag("user-history");
  updateTag(`history-${id}`);
}

/**
 * Clear all history
 *
 * @example
 * await clearHistory()
 */
export async function clearHistory(): Promise<void> {
  const url = endpoint("history", "clear");

  const response = await serverApi.post<StandardResponse<unknown>>(url);

  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to clear history");
  }

  // Immediately expire history cache
  updateTag("user-history");
}
