/**
 * Author Queries - Data fetching for Server Components
 * Uses React cache for automatic deduplication
 */

import { serverApi } from "@/lib/api/server";
import { isSuccessResponse, type StandardResponse } from "@/lib/api/types";
import { endpoint } from "@/lib/api/utils/endpoint";
import { ApiParser } from "@/lib/api/utils/parsers";
import { cache } from "react";
import { AuthorSchema, type Author, type AuthorQuery } from "./types";

/**
 * Get list of authors with pagination
 */
export const getAuthors = cache(
  async (
    params?: Partial<AuthorQuery>
  ): Promise<{
    items: Author[];
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  }> => {
    const url = endpoint("authors", params || {});

    const response = await serverApi.get<StandardResponse<unknown>>(url, {
      next: {
        revalidate: 300,
        tags: ["authors"],
      },
    });

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch authors");
    }

    const items = ApiParser.parseResponseArray(AuthorSchema, response);

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
 */
export const getAuthorById = cache(async (id: string): Promise<Author> => {
  const url = endpoint("authors", id);

  const response = await serverApi.get<StandardResponse<unknown>>(url, {
    next: {
      revalidate: 300,
      tags: [`author-${id}`, "authors"],
    },
  });

  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to fetch author");
  }

  return ApiParser.parse(AuthorSchema, response);
});
