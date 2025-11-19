/**
 * Author Queries - Data fetching for Server Components
 * Uses React cache for automatic deduplication
 */

import { cache } from "react";
import { serverApi } from "@/lib/api/server";
import { endpoint } from "@/lib/api/utils/endpoint";
import {
  AuthorSchema,
  AuthorArraySchema,
  type Author,
  type AuthorQuery,
} from "@/lib/api/models/admin/author";
import { ApiParser } from "@/lib/api/utils/parsers";
import { isSuccessResponse } from "@/lib/api/types";

/**
 * Get list of authors with pagination
 *
 * @example
 * const authors = await getAuthors({ page: 1, limit: 20, search: "john" })
 */
export const getAuthors = cache(
  async (params?: Partial<AuthorQuery>): Promise<{
    items: Author[];
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  }> => {
    const url = endpoint("authors", params || {});

    const response = await serverApi.get(url, {
      next: {
        revalidate: 300, // Cache 5 minutes
        tags: ["authors"],
      },
    });

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch authors");
    }

    const items = ApiParser.parseResponseArray(AuthorArraySchema, response);

    return {
      items,
      page: response.meta?.page || 1,
      limit: response.meta?.limit || 20,
      total_items: response.meta?.total_items || items.length,
      total_pages: response.meta?.total_pages || 1,
    };
  }
);

/**
 * Get author by ID
 *
 * @example
 * const author = await getAuthorById("550e8400-e29b-41d4-a716-446655440000")
 */
export const getAuthorById = cache(async (id: string): Promise<Author> => {
  const url = endpoint("authors", id);

  const response = await serverApi.get(url, {
    next: {
      revalidate: 300, // Cache 5 minutes
      tags: [`author-${id}`, "authors"],
    },
  });

  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to fetch author");
  }

  return ApiParser.parse(AuthorSchema, response);
});
