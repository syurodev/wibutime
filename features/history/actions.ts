"use server";

/**
 * History Actions - Server Actions for mutations
 * Use these from Client Components
 *
 * Backend API:
 * - POST /api/v1/history - Update progress
 * - DELETE /api/v1/history/:id - Delete history item
 * - POST /api/v1/history/clear - Clear all history
 * - POST /api/v1/progress/:type/:id/units/:uid/complete - Mark chapter as read
 */

import { serverApi } from "@/lib/api/server";
import { isSuccessResponse, type StandardResponse } from "@/lib/api/types";
import { ApiParser } from "@/lib/api/utils/parsers";
import { updateTag } from "next/cache";
import {
  HistoryItem,
  HistoryItemSchema,
  type UpdateHistoryInput,
} from "./types";

// =============================================================================
// UPDATE PROGRESS
// =============================================================================

/**
 * Add or update reading/watching progress
 * API: POST /api/v1/history
 *
 * Called when user reads a chapter or watches an episode.
 *
 * @example
 * // Update novel reading progress
 * await updateHistory({
 *   content_id: "novel-uuid",
 *   media_type: "novel",
 *   latest_unit_id: "chapter-uuid",
 *   novel_last_read_info: { node_id: "para-123", preview: "Subaru..." }
 * })
 *
 * // Update manga reading progress
 * await updateHistory({
 *   content_id: "manga-uuid",
 *   media_type: "manga",
 *   latest_unit_id: "chapter-uuid",
 *   manga_last_page_read: 15
 * })
 *
 * // Update anime watching progress
 * await updateHistory({
 *   content_id: "anime-uuid",
 *   media_type: "anime",
 *   latest_unit_id: "episode-uuid",
 *   anime_last_episode_time_viewed: "12:34"
 * })
 */
export async function updateHistory(
  input: UpdateHistoryInput
): Promise<HistoryItem> {
  const response = await serverApi.post<StandardResponse<HistoryItem>>(
    "/history",
    input
  );

  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to update history");
  }

  // Invalidate history caches
  updateTag("user-history");
  updateTag("continue-reading");

  return ApiParser.parse(HistoryItemSchema, response);
}

// =============================================================================
// DELETE HISTORY
// =============================================================================

/**
 * Delete a history entry
 * API: DELETE /api/v1/history/:id
 *
 * @example
 * await deleteHistory("history-entry-uuid")
 */
export async function deleteHistory(id: string): Promise<void> {
  const response = await serverApi.delete<StandardResponse<unknown>>(
    `/history/${id}`
  );

  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to delete history");
  }

  // Invalidate history caches
  updateTag("user-history");
  updateTag("continue-reading");
}

// =============================================================================
// CLEAR ALL HISTORY
// =============================================================================

/**
 * Clear all history for the current user
 * API: POST /api/v1/history/clear
 *
 * @example
 * await clearHistory()
 */
export async function clearHistory(): Promise<void> {
  const response = await serverApi.post<StandardResponse<unknown>>(
    "/history/clear"
  );

  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to clear history");
  }

  // Invalidate all history caches
  updateTag("user-history");
  updateTag("continue-reading");
}

// =============================================================================
// MARK UNIT COMPLETE
// =============================================================================

/**
 * Mark a chapter/episode as completed
 * API: POST /api/v1/progress/:media_type/:media_id/units/:unit_id/complete
 *
 * Called when user finishes reading a chapter or watching an episode.
 *
 * @example
 * await markUnitComplete("novel", "novel-uuid", "chapter-uuid")
 */
export async function markUnitComplete(
  mediaType: "novel" | "manga" | "anime",
  mediaId: string,
  unitId: string
): Promise<void> {
  const response = await serverApi.post<StandardResponse<unknown>>(
    `/progress/${mediaType}/${mediaId}/units/${unitId}/complete`
  );

  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to mark unit as complete");
  }

  // Invalidate progress cache for this media
  updateTag(`progress-${mediaType}-${mediaId}`);
  updateTag("user-history");
}
