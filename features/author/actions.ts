"use server";

/**
 * Author Actions - Server Actions for mutations
 */

import { serverApi } from "@/lib/api/server";
import { isSuccessResponse, type StandardResponse } from "@/lib/api/types";
import { endpoint } from "@/lib/api/utils/endpoint";
import { ApiParser } from "@/lib/api/utils/parsers";
import { updateTag } from "next/cache";
import {
  AuthorSchema,
  type Author,
  type CreateAuthorRequest,
  type UpdateAuthorRequest,
} from "./types";

/**
 * Create a new author
 */
export async function createAuthor(data: CreateAuthorRequest): Promise<Author> {
  const url = endpoint("authors");
  const response = await serverApi.post<StandardResponse<unknown>>(url, data);

  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to create author");
  }

  updateTag("authors");
  return ApiParser.parse(AuthorSchema, response);
}

/**
 * Update an author
 */
export async function updateAuthor(
  id: string,
  data: UpdateAuthorRequest
): Promise<Author> {
  const url = endpoint("authors", id);
  const response = await serverApi.put<StandardResponse<unknown>>(url, data);

  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to update author");
  }

  updateTag("authors");
  updateTag(`author-${id}`);
  return ApiParser.parse(AuthorSchema, response);
}

/**
 * Delete an author
 */
export async function deleteAuthor(id: string): Promise<void> {
  const url = endpoint("authors", id);
  const response = await serverApi.delete<StandardResponse<unknown>>(url);

  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to delete author");
  }

  updateTag("authors");
  updateTag(`author-${id}`);
}

/**
 * Merge authors
 */
export async function mergeAuthor(data: {
  target_id: string;
  source_ids: string[];
}) {
  const url = endpoint("authors/merge");
  const response = await serverApi.post<StandardResponse<unknown>>(url, data);

  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to merge authors");
  }

  updateTag("authors");
  return response.data;
}

/**
 * Preview merge authors
 */
export async function previewMergeAuthor(data: {
  target_id: string;
  source_ids: string[];
}) {
  const url = endpoint("authors/merge/preview");
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
    source_authors?: string[];
  };
}
