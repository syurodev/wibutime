"use server";

/**
 * Artist Actions - Server Actions for mutations
 * Use these from Client Components
 */

import { ArtistSchema, type Artist } from "@/features/artist/types";
import { serverApi } from "@/lib/api/server";
import { isSuccessResponse, type StandardResponse } from "@/lib/api/types";
import { endpoint } from "@/lib/api/utils/endpoint";
import { ApiParser } from "@/lib/api/utils/parsers";
import { updateTag } from "next/cache";

/**
 * Create data for artist
 */
export interface CreateArtistData {
  name: string;
  bio?: string;
}

/**
 * Update data for artist
 */
export interface UpdateArtistData {
  name?: string;
  bio?: string;
}

/**
 * Create a new artist
 *
 * @example
 * const artist = await createArtist({ name: "Jane Smith", bio: "Manga artist" })
 */
export async function createArtist(data: CreateArtistData): Promise<Artist> {
  const url = endpoint("artists");

  const response = await serverApi.post<StandardResponse<unknown>>(url, data);

  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to create artist");
  }

  // Revalidate artists cache
  updateTag("artists");

  return ApiParser.parse(ArtistSchema, response);
}

/**
 * Update an artist
 *
 * @example
 * const updated = await updateArtist("123", { name: "Jane Doe" })
 */
export async function updateArtist(
  id: string,
  data: UpdateArtistData
): Promise<Artist> {
  const url = endpoint("artists", id);

  const response = await serverApi.put<StandardResponse<unknown>>(url, data);

  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to update artist");
  }

  // Revalidate artists cache
  updateTag("artists");
  updateTag(`artist-${id}`);

  return ApiParser.parse(ArtistSchema, response);
}

/**
 * Delete an artist
 *
 * @example
 * await deleteArtist("123")
 */
export async function deleteArtist(id: string): Promise<void> {
  const url = endpoint("artists", id);

  const response = await serverApi.delete<StandardResponse<unknown>>(url);

  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to delete artist");
  }

  // Revalidate artists cache
  updateTag("artists");
  updateTag(`artist-${id}`);
}

/**
 * Merge artists
 *
 * @example
 * await mergeArtist({ target_id: "...", source_ids: ["...", "..."] })
 */
export async function mergeArtist(data: {
  target_id: string;
  source_ids: string[];
}) {
  const url = endpoint("artists/merge");
  const response = await serverApi.post<StandardResponse<unknown>>(url, data);

  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to merge artists");
  }

  updateTag("artists");

  return response.data;
}

export async function previewMergeArtist(data: {
  target_id: string;
  source_ids: string[];
}) {
  const url = endpoint("artists/merge/preview");
  const response = await serverApi.post<StandardResponse<unknown>>(url, data);

  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to preview merge");
  }

  return response.data as {
    affected_novels: {
      id: string;
      title: string;
      slug: string;
      cover_image_url?: string | null;
    }[];
    source_artists?: string[];
  };
}
