"use server";

/**
 * Genre Actions - Server Actions for mutations
 * Use these from Client Components
 */

import { updateTag } from "next/cache";
import { serverApi } from "@/lib/api/server";
import { endpoint } from "@/lib/api/utils/endpoint";
import { GenreSchema, type Genre } from "@/lib/api/models/admin/genre";
import { ApiParser } from "@/lib/api/utils/parsers";
import { isSuccessResponse, type StandardResponse } from "@/lib/api/types";

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
