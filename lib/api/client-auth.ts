/**
 * Client-side authenticated API utilities
 * Use this in Client Components with the useAuth hook
 */

"use client";

import { getClientAuthToken } from "./auth-client";
import type { FetchOptions } from "./utils/fetch";
import { api } from "./utils/fetch";

/**
 * Create authenticated API client for client-side use
 * @param accessToken - Access token from useAuth hook or auto-detect from storage
 */
export function createAuthenticatedClient(accessToken?: string | null) {
  // Auto-detect token if not provided
  const token = accessToken ?? getClientAuthToken();

  return {
    /**
     * GET request with authentication
     */
    get<T = unknown>(
      endpoint: string,
      options?: Omit<FetchOptions, "method" | "body" | "token">
    ) {
      return api.get<T>(endpoint, { ...options, token: token || undefined });
    },

    /**
     * POST request with authentication
     */
    post<T = unknown>(
      endpoint: string,
      body?: unknown,
      options?: Omit<FetchOptions, "method" | "body" | "token">
    ) {
      return api.post<T>(endpoint, body, {
        ...options,
        token: token || undefined,
      });
    },

    /**
     * PUT request with authentication
     */
    put<T = unknown>(
      endpoint: string,
      body?: unknown,
      options?: Omit<FetchOptions, "method" | "body" | "token">
    ) {
      return api.put<T>(endpoint, body, {
        ...options,
        token: token || undefined,
      });
    },

    /**
     * PATCH request with authentication
     */
    patch<T = unknown>(
      endpoint: string,
      body?: unknown,
      options?: Omit<FetchOptions, "method" | "body" | "token">
    ) {
      return api.patch<T>(endpoint, body, {
        ...options,
        token: token || undefined,
      });
    },

    /**
     * DELETE request with authentication
     */
    delete<T = unknown>(
      endpoint: string,
      options?: Omit<FetchOptions, "method" | "body" | "token">
    ) {
      return api.delete<T>(endpoint, { ...options, token: token || undefined });
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
