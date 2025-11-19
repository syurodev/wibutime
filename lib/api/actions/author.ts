"use server";

/**
 * Author Actions - Server Actions for mutations
 * Use these from Client Components
 */

import { updateTag } from "next/cache";
import { serverApi } from "@/lib/api/server";
import { endpoint } from "@/lib/api/utils/endpoint";
import { AuthorSchema, type Author } from "@/lib/api/models/admin/author";
import { ApiParser } from "@/lib/api/utils/parsers";
import { isSuccessResponse, type StandardResponse } from "@/lib/api/types";

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
