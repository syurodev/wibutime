"use server";

/**
 * Genre Actions - Server Actions for mutations
 * Use these from Client Components
 */

import { GenreSchema, type Genre } from "@/features/genre/types";
import { serverApi } from "@/lib/api/server";
import { isSuccessResponse, type StandardResponse } from "@/lib/api/types";
import { endpoint } from "@/lib/api/utils/endpoint";
import { ApiParser } from "@/lib/api/utils/parsers";
import { revalidatePath, updateTag } from "next/cache";
import * as z from "zod";

/**
 * Create a new genre
 *
 * @example
 * const genre = await createGenre({ name: "Fantasy" })
 */
export async function createGenre(data: { name: string }): Promise<Genre> {
  const url = endpoint("genres");

  const response = await serverApi.post<StandardResponse<unknown>>(url, data);

  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to create genre");
  }

  // Immediately expire genres cache
  updateTag("genres");

  return ApiParser.parse(GenreSchema, response);
}

/**
 * Update a genre
 *
 * @example
 * const updated = await updateGenre("123", { name: "Science Fiction" })
 */
export async function updateGenre(
  id: string,
  data: { name: string }
): Promise<Genre> {
  const url = endpoint("genres", id);

  const response = await serverApi.put<StandardResponse<unknown>>(url, data);

  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to update genre");
  }

  // Revalidate genres cache
  updateTag("genres");
  updateTag(`genre-${id}`);

  return ApiParser.parse(GenreSchema, response);
}

/**
 * Delete a genre
 *
 * @example
 * await deleteGenre("123")
 */
export async function deleteGenre(id: string): Promise<void> {
  const url = endpoint("genres", id);

  const response = await serverApi.delete<StandardResponse<unknown>>(url);

  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to delete genre");
  }

  // Revalidate genres cache
  updateTag("genres");
  updateTag(`genre-${id}`);
}

/**
 * Merge genres
 *
 * @example
 * await mergeGenre({ target_id: "...", source_ids: ["...", "..."] })
 */
export async function mergeGenre(data: {
  target_id: string;
  source_ids: string[];
}) {
  const url = endpoint("genres/merge");
  const response = await serverApi.post<StandardResponse<unknown>>(url, data);

  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to merge genres");
  }

  revalidatePath("/admin/genres");
  updateTag("genres");

  return response.data;
}

export async function previewMergeGenre(data: {
  target_id: string;
  source_ids: string[];
}) {
  const url = endpoint("genres/merge/preview");
  const response = await serverApi.post<StandardResponse<unknown>>(url, data);

  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to preview merge");
  }

  const PreviewSchema = z.object({
    affected_novels: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        slug: z.string(),
        cover_image_url: z.string().nullable().optional(),
      })
    ),
    source_genres: z.array(z.string()).nullable().optional(),
  });

  return ApiParser.parse(PreviewSchema, response);
}
