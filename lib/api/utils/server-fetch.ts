/**
 * Server-side Fetch Utility
 * Extends fetch utility with server-side authentication
 */

import { cookies } from "next/headers";
import "server-only";
import { getServerAuthToken } from "../auth-server";
import { apiFetch, type FetchOptions } from "./fetch";

/**
 * Server-side fetch with automatic authentication
 * Auto-injects session token from getServerAuthToken()
 * Also forwards Cookie header for refresh token to work
 */
async function serverFetch<T = unknown>(
  url: string,
  options?: FetchOptions
): Promise<T> {
  // Get server-side auth token
  const token = await getServerAuthToken();

  // Get cookies to forward (needed for refresh token on 401)
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join("; ");

  // Merge existing headers with Cookie
  const existingHeaders = options?.headers
    ? new Headers(options.headers)
    : new Headers();

  if (cookieHeader) {
    existingHeaders.set("Cookie", cookieHeader);
  }

  // Merge token into options
  return apiFetch<T>(url, {
    ...options,
    headers: existingHeaders,
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
  get: <T = unknown>(
    url: string,
    options?: Omit<FetchOptions, "method" | "body">
  ) => serverFetch<T>(url, { ...options, method: "GET" }),

  /**
   * POST request with server-side auth
   */
  post: <T = unknown>(
    url: string,
    body?: unknown,
    options?: Omit<FetchOptions, "method" | "body">
  ) => serverFetch<T>(url, { ...options, method: "POST", body }),

  /**
   * PUT request with server-side auth
   */
  put: <T = unknown>(
    url: string,
    body?: unknown,
    options?: Omit<FetchOptions, "method" | "body">
  ) => serverFetch<T>(url, { ...options, method: "PUT", body }),

  /**
   * PATCH request with server-side auth
   */
  patch: <T = unknown>(
    url: string,
    body?: unknown,
    options?: Omit<FetchOptions, "method" | "body">
  ) => serverFetch<T>(url, { ...options, method: "PATCH", body }),

  /**
   * DELETE request with server-side auth
   */
  delete: <T = unknown>(
    url: string,
    options?: Omit<FetchOptions, "method" | "body">
  ) => serverFetch<T>(url, { ...options, method: "DELETE" }),
};

/**
 * Export serverFetch for advanced use cases
 */
export { serverFetch };
