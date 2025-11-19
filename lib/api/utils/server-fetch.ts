/**
 * Server-side Fetch Utility
 * Extends fetch utility with server-side authentication
 */

import "server-only";
import { getServerAuthToken } from "../auth-server";
import { apiFetch, type FetchOptions } from "./fetch";

/**
 * Server-side fetch with automatic authentication
 * Auto-injects session token from getServerAuthToken()
 */
async function serverFetch<T = unknown>(
  url: string,
  options?: FetchOptions
): Promise<T> {
  // Get server-side auth token
  const token = await getServerAuthToken();

  // Merge token into options
  return apiFetch<T>(url, {
    ...options,
    token: token || undefined,
  });
}

/**
 * Server-side API client with automatic authentication
 */
export const serverApi = {
  /**
   * GET request with server-side auth
   */
  get: <T = unknown>(url: string, options?: Omit<FetchOptions, "method" | "body">) =>
    serverFetch<T>(url, { ...options, method: "GET" }),

  /**
   * POST request with server-side auth
   */
  post: <T = unknown>(url: string, body?: unknown, options?: Omit<FetchOptions, "method" | "body">) =>
    serverFetch<T>(url, { ...options, method: "POST", body }),

  /**
   * PUT request with server-side auth
   */
  put: <T = unknown>(url: string, body?: unknown, options?: Omit<FetchOptions, "method" | "body">) =>
    serverFetch<T>(url, { ...options, method: "PUT", body }),

  /**
   * PATCH request with server-side auth
   */
  patch: <T = unknown>(url: string, body?: unknown, options?: Omit<FetchOptions, "method" | "body">) =>
    serverFetch<T>(url, { ...options, method: "PATCH", body }),

  /**
   * DELETE request with server-side auth
   */
  delete: <T = unknown>(url: string, options?: Omit<FetchOptions, "method" | "body">) =>
    serverFetch<T>(url, { ...options, method: "DELETE" }),
};

/**
 * Export serverFetch for advanced use cases
 */
export { serverFetch };
