/**
 * Server-side API utilities
 * Only import this file from Server Components or Server Actions
 */

import "server-only";
import { getSession } from "@/lib/auth/session";
import { apiClient, type ApiRequestOptions } from "./client";
import type { StandardResponse } from "./types";

/**
 * Get Authorization header for authenticated requests
 */
async function getAuthHeaders(): Promise<HeadersInit> {
  const session = await getSession();

  if (!session) {
    return {};
  }

  return {
    Authorization: `Bearer ${session.accessToken}`,
  };
}

/**
 * Server-side API client with automatic authentication
 */
export const serverApi = {
  /**
   * GET request with authentication
   */
  async get<T>(endpoint: string, options?: ApiRequestOptions): Promise<StandardResponse<T>> {
    const authHeaders = await getAuthHeaders();
    return apiClient.get<T>(endpoint, {
      ...options,
      headers: {
        ...options?.headers,
        ...authHeaders,
      },
    });
  },

  /**
   * POST request with authentication
   */
  async post<T>(
    endpoint: string,
    body?: unknown,
    options?: ApiRequestOptions
  ): Promise<StandardResponse<T>> {
    const authHeaders = await getAuthHeaders();
    return apiClient.post<T>(endpoint, body, {
      ...options,
      headers: {
        ...options?.headers,
        ...authHeaders,
      },
    });
  },

  /**
   * PUT request with authentication
   */
  async put<T>(
    endpoint: string,
    body?: unknown,
    options?: ApiRequestOptions
  ): Promise<StandardResponse<T>> {
    const authHeaders = await getAuthHeaders();
    return apiClient.put<T>(endpoint, body, {
      ...options,
      headers: {
        ...options?.headers,
        ...authHeaders,
      },
    });
  },

  /**
   * PATCH request with authentication
   */
  async patch<T>(
    endpoint: string,
    body?: unknown,
    options?: ApiRequestOptions
  ): Promise<StandardResponse<T>> {
    const authHeaders = await getAuthHeaders();
    return apiClient.patch<T>(endpoint, body, {
      ...options,
      headers: {
        ...options?.headers,
        ...authHeaders,
      },
    });
  },

  /**
   * DELETE request with authentication
   */
  async delete<T>(endpoint: string, options?: ApiRequestOptions): Promise<StandardResponse<T>> {
    const authHeaders = await getAuthHeaders();
    return apiClient.delete<T>(endpoint, {
      ...options,
      headers: {
        ...options?.headers,
        ...authHeaders,
      },
    });
  },
};
