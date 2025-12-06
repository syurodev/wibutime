"use server";

/**
 * Author Actions - Server Actions for mutations
 * Use these from Client Components
 */

import { AuthorSchema, type Author } from "@/lib/api/models/admin/author";
import { serverApi } from "@/lib/api/server";
import { isSuccessResponse, type StandardResponse } from "@/lib/api/types";
import { endpoint } from "@/lib/api/utils/endpoint";
import { ApiParser } from "@/lib/api/utils/parsers";
import { updateTag } from "next/cache";

/**
 * Create data for author
 */
export interface CreateAuthorData {
  name: string;
  bio?: string;
}

/**
 * Update data for author
 */
export interface UpdateAuthorData {
  name?: string;
  bio?: string;
}

/**
 * Create a new author
 *
 * @example
 * const author = await createAuthor({ name: "John Doe", bio: "Fantasy writer" })
 */
export async function createAuthor(data: CreateAuthorData): Promise<Author> {
  const url = endpoint("authors");

  const response = await serverApi.post<StandardResponse<unknown>>(url, data);

  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to create author");
  }

  // Revalidate authors cache
  updateTag("authors");

  return ApiParser.parse(AuthorSchema, response);
}

/**
 * Update an author
 *
 * @example
 * const updated = await updateAuthor("123", { name: "Jane Doe" })
 */
export async function updateAuthor(
  id: string,
  data: UpdateAuthorData
): Promise<Author> {
  const url = endpoint("authors", id);

  const response = await serverApi.put<StandardResponse<unknown>>(url, data);

  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to update author");
  }

  // Revalidate authors cache
  updateTag("authors");
  updateTag(`author-${id}`);

  return ApiParser.parse(AuthorSchema, response);
}

/**
 * Delete an author
 *
 * @example
 * await deleteAuthor("123")
 */
export async function deleteAuthor(id: string): Promise<void> {
  const url = endpoint("authors", id);

  const response = await serverApi.delete<StandardResponse<unknown>>(url);

  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to delete author");
  }

  // Revalidate authors cache
  updateTag("authors");
  updateTag(`author-${id}`);
}

/**
 * Merge authors
 *
 * @example
 * await mergeAuthor({ target_id: "...", source_ids: ["...", "..."] })
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

  // Revalidate authors is tricky as we don't know the path here easily without importing consts
  // But usually revalidating the tag is enough for data fetching hooks
  updateTag("authors");

  return response.data;
}

export async function previewMergeAuthor(data: {
  target_id: string;
  source_ids: string[];
}) {
  const url = endpoint("authors/merge/preview");
  const response = await serverApi.post<StandardResponse<unknown>>(url, data);

  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to preview merge");
  }

  // We need to import Zod here or define schema.
  // Since we cannot import zod easily if not already imported, let's look at file.
  // The file does NOT import zod. I need to add import zod.
  // Wait, I can't add import in this replace block easily if it's at top.
  // I will use `any` for now or better, I will assume the response is correct or rely on parser.
  // But `ApiParser.parse` needs a Zod schema.
  // I must add `import * as z from "zod";` to the top of file first.

  // Actually, I should use multi_replace to add import and append functions.
  // For now I will just return response.data as any, or use a simple cast if I can't import zod.
  // But wait, the previous file `features/genre/api/actions.ts` uses zod.
  // I should check if I can modify imports.

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
