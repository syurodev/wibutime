"use server";

/**
 * Content Actions - Server Actions for mutations
 * Use these from Client Components
 */

import { updateTag } from "next/cache";
import { serverApi } from "@/lib/api/server";
import { endpoint } from "@/lib/api/utils/endpoint";
import {
  MediaSeriesSchema,
  type MediaSeries,
} from "@/lib/api/models/content/base-content";
import { ApiParser } from "@/lib/api/utils/parsers";
import { isSuccessResponse, type StandardResponse } from "@/lib/api/types";

/**
 * Create content data
 */
export interface CreateContentData {
  title: string;
  slug: string;
  description?: any[]; // TNode[] from platejs
  cover_url?: string;
  type: "anime" | "manga" | "novel";
  status?: "ongoing" | "completed" | "hiatus" | "cancelled";
  genre_ids?: string[];
  author_id: string;
}

/**
 * Update content data
 */
export interface UpdateContentData {
  title?: string;
  slug?: string;
  description?: any[];
  cover_url?: string;
  type?: "anime" | "manga" | "novel";
  status?: "ongoing" | "completed" | "hiatus" | "cancelled";
  genre_ids?: string[];
}

/**
 * Create new content
 *
 * @example
 * const content = await createContent({
 *   title: "My Novel",
 *   slug: "my-novel",
 *   type: "novel",
 *   author_id: "123"
 * })
 */
export async function createContent(
  data: CreateContentData
): Promise<MediaSeries> {
  const url = endpoint("content");

  const response = await serverApi.post<StandardResponse<unknown>>(url, data);

  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to create content");
  }

  // Immediately expire content caches
  updateTag("content");
  updateTag("content-latest");
  updateTag("content-new");

  return ApiParser.parse(MediaSeriesSchema, response);
}

/**
 * Update content
 *
 * @example
 * const updated = await updateContent("123", { title: "Updated Title" })
 */
export async function updateContent(
  id: string,
  data: UpdateContentData
): Promise<MediaSeries> {
  const url = endpoint("content", id);

  const response = await serverApi.put<StandardResponse<unknown>>(url, data);

  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to update content");
  }

  // Immediately expire content caches
  updateTag("content");
  updateTag(`content-${id}`);
  updateTag("content-latest");

  return ApiParser.parse(MediaSeriesSchema, response);
}

/**
 * Delete content
 *
 * @example
 * await deleteContent("123")
 */
export async function deleteContent(id: string): Promise<void> {
  const url = endpoint("content", id);

  const response = await serverApi.delete<StandardResponse<unknown>>(url);

  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to delete content");
  }

  // Immediately expire content caches
  updateTag("content");
  updateTag(`content-${id}`);
  updateTag("content-latest");
  updateTag("content-trending");
  updateTag("content-popular");
}

/**
 * Add content to favorites
 *
 * @example
 * await addToFavorites("123")
 */
export async function addToFavorites(contentId: string): Promise<void> {
  const url = endpoint("content", contentId, "favorite");

  const response = await serverApi.post<StandardResponse<unknown>>(url);

  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to add to favorites");
  }

  // Immediately expire content and library caches
  updateTag(`content-${contentId}`);
  updateTag("user-library");
}

/**
 * Remove content from favorites
 *
 * @example
 * await removeFromFavorites("123")
 */
export async function removeFromFavorites(contentId: string): Promise<void> {
  const url = endpoint("content", contentId, "favorite");

  const response = await serverApi.delete<StandardResponse<unknown>>(url);

  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to remove from favorites");
  }

  // Immediately expire content and library caches
  updateTag(`content-${contentId}`);
  updateTag("user-library");
}
