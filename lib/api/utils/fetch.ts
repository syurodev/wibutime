/**
 * Centralized Fetch Utility
 * Tập trung xử lý tất cả API calls với logging, error handling, và caching
 */

import { toast } from "sonner";
import {
  clearAuthToken,
  getClientAuthToken,
  setAuthToken,
} from "../auth-client";
import { API_CONFIG } from "../config";
import { ErrorCode } from "./error-codes";
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
 * Uses unified auth utility
 */
async function getAuthToken(): Promise<string | null> {
  // 1. Try client-side token
  if (globalThis.window) {
    const token = getClientAuthToken();
    console.log(
      "[apiFetch] Client-side token check:",
      token ? "Found" : "Missing"
    );
    if (token) return token;
  }
  return null;
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
  const token =
    options?.token ||
    (options?.headers as Record<string, string>)?.["Authorization"]?.replace(
      "Bearer ",
      ""
    ) ||
    null;

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

  // Use provided baseURL or global config
  const base = baseURL || API_CONFIG.baseURL;
  const path = url.startsWith("/") ? url : `/${url}`;
  return `${base}${path}`;
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
 * Refresh auth token
 */
async function refreshAuthToken(): Promise<string | null> {
  try {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (data.success && data.accessToken) {
      return data.accessToken;
    }
    return null;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return null;
  }
}

/**
 * Main fetch function with full features
 */
/**
 * Process request body and return appropriate BodyInit
 */
function processRequestBody(
  body: unknown,
  headers: Headers
): BodyInit | undefined {
  if (!body) return undefined;

  if (typeof body === "string") {
    return body;
  }

  if (body instanceof FormData) {
    // Remove Content-Type to let browser set it with boundary
    headers.delete("Content-Type");
    return body;
  }

  return JSON.stringify(body);
}

/**
 * Setup timeout controller
 */
function setupTimeout(
  timeout?: number
): { signal: AbortSignal; timeoutId?: NodeJS.Timeout } | undefined {
  if (!timeout) return undefined;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  return { signal: controller.signal, timeoutId };
}

/**
 * Handle 401 Unauthorized responses
 */
async function handleUnauthorized<T>(
  response: Response,
  url: string,
  options: FetchOptions | undefined,
  fullURL: string
): Promise<T> {
  // Prevent infinite loop if refresh endpoint itself returns 401
  if (fullURL.includes("/auth/refresh")) {
    console.warn("🔒 Refresh endpoint returned 401, clearing auth...");
    toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
    clearAuthToken();
    // Don't throw to prevent runtime errors
    return null as T;
  }

  console.log("🔒 401 Unauthorized - Attempting token refresh...");

  // Try to refresh token
  const newToken = await refreshAuthToken();

  if (!newToken) {
    console.warn("❌ Token refresh failed, clearing auth...");
    clearAuthToken();
    toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
    // Don't throw to prevent runtime errors
    return null as T;
  }

  console.log("✅ Token refreshed successfully, retrying request...");

  // Update local storage
  setAuthToken(newToken);

  // Retry original request with new token
  const newHeaders = new Headers(options?.headers);
  newHeaders.set("Authorization", `Bearer ${newToken}`);

  // Update headers in options
  const newOptions = {
    ...options,
    headers: newHeaders,
    token: newToken,
  };

  // Recursive call with new token
  return apiFetch<T>(url, newOptions);
}

/**
 * Handle fetch errors
 */
function handleFetchError(
  error: unknown,
  method: string,
  fullURL: string
): never {
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

/**
 * Main fetch function with full features
 */
export async function apiFetch<T = unknown>(
  url: string,
  options?: FetchOptions
): Promise<T> {
  const method = options?.method || "GET";
  const fullURL = buildURL(url, options?.baseURL);

  // Get token asynchronously if not provided
  let token = options?.token;
  if (!token) {
    const authToken = await getAuthToken();
    token = authToken || undefined;
  }

  const headers = buildHeaders({ ...options, token });
  const body = processRequestBody(options?.body, headers);

  // Build fetch options
  const fetchOptions: RequestInit = {
    method,
    headers,
    body,
    ...buildNextConfig(options),
    credentials: options?.credentials,
    mode: options?.mode,
    redirect: options?.redirect,
    referrer: options?.referrer,
    referrerPolicy: options?.referrerPolicy,
    signal: options?.signal,
  };

  // Add timeout if specified
  const timeoutInfo = setupTimeout(options?.timeout);
  if (timeoutInfo) {
    fetchOptions.signal = timeoutInfo.signal;
  }

  // Log request
  logRequest(method, fullURL, options?.body, headers);

  try {
    const response = await fetch(fullURL, fetchOptions);

    // Clear timeout
    if (timeoutInfo?.timeoutId) clearTimeout(timeoutInfo.timeoutId);

    // Log response
    logResponse(method, fullURL, response.status);

    // Handle 401 Unauthorized
    if (response.status === 401) {
      return await handleUnauthorized<T>(response, url, options, fullURL);
    }

    // Handle errors
    if (!response.ok) {
      const error = await parseApiError(response);

      // Handle token errors gracefully
      if (
        error.code === ErrorCode.AuthInvalidToken ||
        error.message?.includes("Invalid or expired token") ||
        error.message?.includes("token")
      ) {
        console.warn("🔒 Token error detected:", error.message);
        toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
        clearAuthToken();
        // Don't throw, return null to prevent runtime errors
        return null as T;
      }

      // Log and throw other errors
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
    if (timeoutInfo?.timeoutId) clearTimeout(timeoutInfo.timeoutId);
    handleFetchError(error, method, fullURL);
  }
}

/**
 * Parse error from API response
 */
async function parseApiError(response: Response): Promise<ApiError> {
  try {
    const data = await response.json();

    // Debug: Log toàn bộ error response từ server
    console.log("🔴 Error Response từ Server:", {
      status: response.status,
      statusText: response.statusText,
      data: data,
    });

    // Backend StandardResponse format: {success: false, code: "...", message: "..."}
    if (data.message) {
      console.log("✅ Lấy message từ data.message:", data.message);
      return new ApiError(
        data.message, // Message đã được dịch từ server
        response.status,
        data.code,
        data.data // Details nếu có
      );
    }

    // Legacy backend error format (nếu có)
    if (data.error) {
      console.log("✅ Lấy message từ data.error.message:", data.error.message);
      return new ApiError(
        data.error.message || `Request failed with status ${response.status}`,
        response.status,
        data.error.code,
        data.error.details
      );
    }

    // Fallback
    console.warn("⚠️ Không tìm thấy message trong response, dùng fallback");
    return new ApiError(
      `Request failed with status ${response.status}`,
      response.status
    );
  } catch (err) {
    // Cannot parse JSON
    console.error("❌ Không thể parse JSON response:", err);
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
  get: <T = unknown>(
    url: string,
    options?: Omit<FetchOptions, "method" | "body">
  ) => apiFetch<T>(url, { ...options, method: "GET" }),

  /**
   * POST request
   */
  post: <T = unknown>(
    url: string,
    body?: unknown,
    options?: Omit<FetchOptions, "method" | "body">
  ) => apiFetch<T>(url, { ...options, method: "POST", body }),

  /**
   * PUT request
   */
  put: <T = unknown>(
    url: string,
    body?: unknown,
    options?: Omit<FetchOptions, "method" | "body">
  ) => apiFetch<T>(url, { ...options, method: "PUT", body }),

  /**
   * PATCH request
   */
  patch: <T = unknown>(
    url: string,
    body?: unknown,
    options?: Omit<FetchOptions, "method" | "body">
  ) => apiFetch<T>(url, { ...options, method: "PATCH", body }),

  /**
   * DELETE request
   */
  delete: <T = unknown>(
    url: string,
    options?: Omit<FetchOptions, "method" | "body">
  ) => apiFetch<T>(url, { ...options, method: "DELETE" }),
};

/**
 * Export default for convenience
 */
export default api;
