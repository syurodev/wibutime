/**
 * Centralized Fetch Utility
 * Tập trung xử lý tất cả API calls với logging, error handling, và caching
 */

import { ApiError, logError, logRequest, logResponse } from "./error-handler";

/**
 * Fetch options with Next.js caching support
 */
export interface FetchOptions extends Omit<RequestInit, "body"> {
  /**
   * Request body - will be automatically JSON stringified if object
   */
  body?: unknown;

  /**
   * Next.js cache options
   */
  cache?: RequestCache;

  /**
   * Next.js revalidation time in seconds
   */
  revalidate?: number | false;

  /**
   * Next.js cache tags for on-demand revalidation
   */
  tags?: string[];

  /**
   * Custom headers to merge with defaults
   */
  headers?: HeadersInit;

  /**
   * Base URL (default: process.env.NEXT_PUBLIC_API_URL)
   */
  baseURL?: string;

  /**
   * Auth token (auto attached to Authorization header)
   */
  token?: string;

  /**
   * Skip auto JSON parsing (return raw Response)
   */
  raw?: boolean;

  /**
   * Timeout in milliseconds
   */
  timeout?: number;
}

/**
 * Get auth token from storage
 */
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
}

/**
 * Build headers with defaults
 */
function buildHeaders(options?: FetchOptions): Headers {
  const headers = new Headers(options?.headers);

  // Auto add Content-Type for JSON body
  if (
    options?.body &&
    typeof options.body === "object" &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  // Auto attach Authorization token
  const token = options?.token || getAuthToken();

  // Debug logging for token
  if (process.env.NODE_ENV === "development") {
    if (token) {
      console.log(`🔑 Auth token found: ${token.substring(0, 20)}...`);
    } else {
      console.warn("⚠️ No auth token found in localStorage/sessionStorage");
    }
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
}

/**
 * Build full URL
 */
function buildURL(url: string, baseURL?: string): string {
  // If URL is already absolute, return as is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Use provided baseURL or environment variable or default fallback
  const base = baseURL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
  return `${base}${url.startsWith("/") ? url : `/${url}`}`;
}

/**
 * Build Next.js cache config
 */
function buildNextConfig(options?: FetchOptions): RequestInit {
  const config: RequestInit = {};

  if (options?.cache) {
    config.cache = options.cache;
  }

  if (options?.revalidate !== undefined) {
    config.next = { revalidate: options.revalidate };
  }

  if (options?.tags) {
    config.next = { ...config.next, tags: options.tags };
  }

  return config;
}

/**
 * Main fetch function with full features
 */
export async function apiFetch<T = unknown>(
  url: string,
  options?: FetchOptions
): Promise<T> {
  const method = options?.method || "GET";
  const fullURL = buildURL(url, options?.baseURL);
  const headers = buildHeaders(options);

  // Build request body
  let body: BodyInit | undefined;
  if (options?.body) {
    if (typeof options.body === "string") {
      body = options.body;
    } else if (options.body instanceof FormData) {
      body = options.body;
      // Remove Content-Type to let browser set it with boundary
      headers.delete("Content-Type");
    } else {
      body = JSON.stringify(options.body);
    }
  }

  // Build fetch options
  const fetchOptions: RequestInit = {
    method,
    headers,
    body,
    ...buildNextConfig(options),
    // Spread other options
    credentials: options?.credentials,
    mode: options?.mode,
    redirect: options?.redirect,
    referrer: options?.referrer,
    referrerPolicy: options?.referrerPolicy,
    signal: options?.signal,
  };

  // Add timeout if specified
  let timeoutId: NodeJS.Timeout | undefined;
  if (options?.timeout) {
    const controller = new AbortController();
    timeoutId = setTimeout(() => controller.abort(), options.timeout);
    fetchOptions.signal = controller.signal;
  }

  // Log request
  logRequest(method, fullURL, options?.body, headers);

  try {
    const response = await fetch(fullURL, fetchOptions);

    // Clear timeout
    if (timeoutId) clearTimeout(timeoutId);

    // Log response
    logResponse(method, fullURL, response.status);

    // Handle 401 Unauthorized
    if (response.status === 401) {
      console.warn("🔒 401 Unauthorized - No auto redirect (disabled for debugging)");
      const error = await parseApiError(response);
      logError(method, fullURL, error);
      throw error;
    }

    // Handle errors
    if (!response.ok) {
      const error = await parseApiError(response);
      logError(method, fullURL, error);
      throw error;
    }

    // Return raw response if requested
    if (options?.raw) {
      return response as unknown as T;
    }

    // Parse JSON response
    const data = await response.json();
    return data as T;
  } catch (error) {
    // Clear timeout on error
    if (timeoutId) clearTimeout(timeoutId);

    // Re-throw ApiError
    if (error instanceof ApiError) {
      throw error;
    }

    // Log and wrap other errors
    logError(method, fullURL, error);

    // Network errors
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new ApiError(
        "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng."
      );
    }

    // Timeout errors
    if ((error as Error).name === "AbortError") {
      throw new ApiError("Request timeout. Vui lòng thử lại.");
    }

    // Unknown errors
    throw new ApiError(
      error instanceof Error ? error.message : "Unknown error occurred"
    );
  }
}

/**
 * Parse error from API response
 */
async function parseApiError(response: Response): Promise<ApiError> {
  try {
    const data = await response.json();

    // Backend error format
    if (data.error) {
      return new ApiError(
        data.error.message || `Request failed with status ${response.status}`,
        response.status,
        data.error.code,
        data.error.details
      );
    }

    // Fallback
    return new ApiError(
      data.message || `Request failed with status ${response.status}`,
      response.status
    );
  } catch {
    // Cannot parse JSON
    return new ApiError(
      `HTTP ${response.status}: ${response.statusText}`,
      response.status
    );
  }
}

/**
 * Convenience methods for common HTTP verbs
 */
export const api = {
  /**
   * GET request
   */
  get: <T = unknown>(url: string, options?: Omit<FetchOptions, "method" | "body">) =>
    apiFetch<T>(url, { ...options, method: "GET" }),

  /**
   * POST request
   */
  post: <T = unknown>(url: string, body?: unknown, options?: Omit<FetchOptions, "method" | "body">) =>
    apiFetch<T>(url, { ...options, method: "POST", body }),

  /**
   * PUT request
   */
  put: <T = unknown>(url: string, body?: unknown, options?: Omit<FetchOptions, "method" | "body">) =>
    apiFetch<T>(url, { ...options, method: "PUT", body }),

  /**
   * PATCH request
   */
  patch: <T = unknown>(url: string, body?: unknown, options?: Omit<FetchOptions, "method" | "body">) =>
    apiFetch<T>(url, { ...options, method: "PATCH", body }),

  /**
   * DELETE request
   */
  delete: <T = unknown>(url: string, options?: Omit<FetchOptions, "method" | "body">) =>
    apiFetch<T>(url, { ...options, method: "DELETE" }),
};

/**
 * Export default for convenience
 */
export default api;
