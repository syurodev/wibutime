/**
 * Client-side authenticated API utilities
 * Use this in Client Components with the useAuth hook
 */

"use client";

import { apiClient, type ApiRequestOptions } from "./client";
import type { StandardResponse } from "./types";

/**
 * Create authenticated API client for client-side use
 * @param accessToken - Access token from useAuth hook
 */
export function createAuthenticatedClient(accessToken: string | null) {
  return {
    /**
     * GET request with authentication
     */
    get<T>(endpoint: string, options?: ApiRequestOptions): Promise<StandardResponse<T>> {
      return apiClient.get<T>(endpoint, {
        ...options,
        headers: {
          ...options?.headers,
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      });
    },

    /**
     * POST request with authentication
     */
    post<T>(
      endpoint: string,
      body?: unknown,
      options?: ApiRequestOptions
    ): Promise<StandardResponse<T>> {
      return apiClient.post<T>(endpoint, body, {
        ...options,
        headers: {
          ...options?.headers,
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      });
    },

    /**
     * PUT request with authentication
     */
    put<T>(
      endpoint: string,
      body?: unknown,
      options?: ApiRequestOptions
    ): Promise<StandardResponse<T>> {
      return apiClient.put<T>(endpoint, body, {
        ...options,
        headers: {
          ...options?.headers,
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      });
    },

    /**
     * PATCH request with authentication
     */
    patch<T>(
      endpoint: string,
      body?: unknown,
      options?: ApiRequestOptions
    ): Promise<StandardResponse<T>> {
      return apiClient.patch<T>(endpoint, body, {
        ...options,
        headers: {
          ...options?.headers,
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      });
    },

    /**
     * DELETE request with authentication
     */
    delete<T>(endpoint: string, options?: ApiRequestOptions): Promise<StandardResponse<T>> {
      return apiClient.delete<T>(endpoint, {
        ...options,
        headers: {
          ...options?.headers,
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      });
    },
  };
}

/**
 * Example usage:
 *
 * ```tsx
 * import { useAuth } from "@/lib/hooks/use-auth";
 * import { createAuthenticatedClient } from "@/lib/api/client-auth";
 *
 * function MyComponent() {
 *   const { user } = useAuth();
 *
 *   useEffect(() => {
 *     const client = createAuthenticatedClient(user?.accessToken);
 *     client.get("/posts").then(data => console.log(data));
 *   }, [user]);
 * }
 * ```
 */
