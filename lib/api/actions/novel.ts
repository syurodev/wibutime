"use server";

import { serverApi } from "@/lib/api/server";
import { isSuccessResponse, type StandardResponse } from "@/lib/api/types";
import { endpoint } from "@/lib/api/utils/endpoint";
import { updateTag } from "next/cache";
import { cookies } from "next/headers";

/**
 * Create data for novel
 */
export interface CreateNovelData {
  title: string;
  original_title?: string;
  synopsis?: any; // Plate JSON
  cover_image_url?: string;
  thumbnail_url?: string;
  status: string;
  is_oneshot: boolean;
  original_language?: string;
  owner_id: string;
  owner_type: string;
  genre_ids?: string[];
  author_ids?: string[];
  artist_ids?: string[];
  metadata?: string;
}

/**
 * Update data for novel
 */
export interface UpdateNovelData {
  title: string;
  original_title?: string;
  synopsis?: any; // Plate JSON
  cover_image_url?: string;
  thumbnail_url?: string;
  status: string;
  original_language?: string;
  metadata?: string;
}

/**
 * Novel interface matching backend response
 */
export interface Novel {
  id: string;
  title: string;
  slug: string;
  synopsis: string; // JSON string or content string
  cover_image_url?: string;
  thumbnail_url?: string;
  status: string;
  original_language?: string;
  original_title?: string;
  total_volumes: number;
  total_chapters: number;
  total_words: number;
  view_count: number;
  favorite_count: number;
  rating_average: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
}

/**
 * Create a new novel
 */
/**
 * Create a new novel
 */
export async function createNovel(data: CreateNovelData): Promise<Novel> {
  console.log(
    "[Action] Creating novel with data:",
    JSON.stringify(data, null, 2)
  );
  const url = endpoint("novels");

  // Get cookies to pass to API for potential token refresh
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const response = await serverApi.post<StandardResponse<Novel>>(url, data, {
    headers: {
      Cookie: cookieHeader,
    },
  });

  console.log(
    "[Action] Create novel response:",
    JSON.stringify(response, null, 2)
  );

  if (!response || !isSuccessResponse(response)) {
    const message = response?.message || "Failed to create novel";
    console.error("[Action] Create novel failed:", message);
    throw new Error(message);
  }

  // Revalidate cache
  updateTag("novels");

  return response.data;
}

/**
 * Update a novel
 */
export async function updateNovel(
  id: string,
  data: UpdateNovelData
): Promise<Novel> {
  console.log(
    `[Action] Updating novel ${id} with data:`,
    JSON.stringify(data, null, 2)
  );
  const url = endpoint("novels", id);

  // Get cookies to pass to API for potential token refresh
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const response = await serverApi.put<StandardResponse<Novel>>(url, data, {
    headers: {
      Cookie: cookieHeader,
    },
  });

  console.log(
    "[Action] Update novel response:",
    JSON.stringify(response, null, 2)
  );

  if (!response || !isSuccessResponse(response)) {
    const message = response?.message || "Failed to update novel";
    console.error("[Action] Update novel failed:", message);
    throw new Error(message);
  }

  // Revalidate cache
  updateTag("novels");
  updateTag(`novel-${id}`);

  return response.data;
}
