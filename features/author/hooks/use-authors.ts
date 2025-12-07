"use client";

/**
 * Admin Authors Hook - SWR-based data fetching for admin panel
 */

import type { StandardResponse } from "@/lib/api/types";
import { isSuccessResponse } from "@/lib/api/types";
import { endpoint } from "@/lib/api/utils/endpoint";
import { api } from "@/lib/api/utils/fetch";
import useSWR from "swr";
import type {
  Author,
  AuthorQuery,
  CreateAuthorRequest,
  UpdateAuthorRequest,
} from "../types";

interface AuthorListResult {
  items: Author[];
  total_items: number;
  total_pages: number;
  page: number;
  limit: number;
}

const fetcher = async (url: string): Promise<AuthorListResult> => {
  const response = await api.get<StandardResponse<Author[]>>(url);

  if (!isSuccessResponse(response)) {
    throw new Error(response.message || "Failed to fetch authors");
  }

  return {
    items: response.data || [],
    total_items: response.meta?.total_items || 0,
    total_pages: response.meta?.total_pages || 1,
    page: response.meta?.page || 1,
    limit: response.meta?.limit || 20,
  };
};

/**
 * Hook for fetching authors list with SWR
 */
export function useAuthors(params?: Partial<AuthorQuery>) {
  const url = endpoint("admin", "authors", params || {});

  const { data, error, isLoading, mutate } = useSWR<AuthorListResult>(
    url,
    fetcher
  );

  return {
    authors: data?.items || [],
    totalItems: data?.total_items || 0,
    totalPages: data?.total_pages || 1,
    page: data?.page || 1,
    limit: data?.limit || 20,
    isLoading,
    error,
    mutate,
  };
}

/**
 * Client-side service for author operations
 */
export const AuthorService = {
  async getList(params: Partial<AuthorQuery>): Promise<AuthorListResult> {
    const url = endpoint("authors", params);
    const response = await api.get<StandardResponse<Author[]>>(url);

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to fetch authors");
    }

    return {
      items: response.data || [],
      total_items: response.meta?.total_items || 0,
      total_pages: response.meta?.total_pages || 1,
      page: response.meta?.page || 1,
      limit: response.meta?.limit || 20,
    };
  },

  async create(data: CreateAuthorRequest): Promise<Author> {
    const url = endpoint("authors");
    const response = await api.post<StandardResponse<Author>>(url, data);

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to create author");
    }

    return response.data!;
  },

  async update(id: string, data: UpdateAuthorRequest): Promise<Author> {
    const url = endpoint("authors", id);
    const response = await api.put<StandardResponse<Author>>(url, data);

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to update author");
    }

    return response.data!;
  },

  async delete(id: string): Promise<void> {
    const url = endpoint("authors", id);
    const response = await api.delete<StandardResponse<void>>(url);

    if (!isSuccessResponse(response)) {
      throw new Error(response.message || "Failed to delete author");
    }
  },
};
