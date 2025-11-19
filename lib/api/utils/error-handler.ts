/**
 * API Error Handler Utilities
 * Xử lý errors từ API calls với logging và error handling chuẩn
 */

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Log API request details
 */
export function logRequest(
  method: string,
  url: string,
  body?: unknown
): void {
  if (process.env.NODE_ENV === "development") {
    console.group(`🔵 API Request: ${method} ${url}`);
    console.log("Method:", method);
    console.log("URL:", url);
    if (body) {
      console.log("Body:", body);
    }
    console.log("Timestamp:", new Date().toISOString());
    console.groupEnd();
  }
}

/**
 * Log API response details
 */
export function logResponse(
  method: string,
  url: string,
  status: number,
  data?: unknown
): void {
  if (process.env.NODE_ENV === "development") {
    const emoji = status >= 200 && status < 300 ? "✅" : "❌";
    console.group(`${emoji} API Response: ${method} ${url}`);
    console.log("Status:", status);
    if (data) {
      console.log("Data:", data);
    }
    console.log("Timestamp:", new Date().toISOString());
    console.groupEnd();
  }
}

/**
 * Log API error details
 */
export function logError(
  method: string,
  url: string,
  error: unknown
): void {
  console.group(`🔴 API Error: ${method} ${url}`);
  console.error("Error:", error);
  console.log("Timestamp:", new Date().toISOString());
  console.groupEnd();
}

/**
 * Handle 401 Unauthorized
 * Redirect to login and clear any auth state
 */
export function handle401Unauthorized(): void {
  console.warn("🔒 Unauthorized - Redirecting to login");

  // Clear any stored auth tokens
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_token");

    // Redirect to login page
    const currentPath = window.location.pathname;
    const loginUrl = `/login?redirect=${encodeURIComponent(currentPath)}`;
    window.location.href = loginUrl;
  }
}

/**
 * Parse error from API response
 */
export async function parseApiError(
  response: Response,
  defaultMessage: string
): Promise<ApiError> {
  try {
    const data = await response.json();

    // Chuẩn backend error format
    if (data.error) {
      return new ApiError(
        data.error.message || defaultMessage,
        response.status,
        data.error.code,
        data.error.details
      );
    }

    // Fallback
    return new ApiError(
      data.message || defaultMessage,
      response.status
    );
  } catch {
    // Không parse được JSON
    return new ApiError(
      `HTTP ${response.status}: ${response.statusText}`,
      response.status
    );
  }
}

/**
 * Handle API fetch with error handling
 */
export async function fetchWithErrorHandling(
  url: string,
  options?: RequestInit
): Promise<Response> {
  const method = options?.method || "GET";

  // Log request
  logRequest(method, url, options?.body);

  try {
    const response = await fetch(url, options);

    // Log response
    logResponse(method, url, response.status);

    // Handle 401 Unauthorized
    if (response.status === 401) {
      handle401Unauthorized();
      throw new ApiError("Unauthorized - Redirecting to login", 401);
    }

    // Handle other errors
    if (!response.ok) {
      const error = await parseApiError(
        response,
        `Request failed with status ${response.status}`
      );
      logError(method, url, error);
      throw error;
    }

    return response;
  } catch (error) {
    // Network errors or other fetch errors
    if (error instanceof ApiError) {
      throw error;
    }

    logError(method, url, error);

    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new ApiError("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.");
    }

    throw new ApiError(
      error instanceof Error ? error.message : "Unknown error occurred"
    );
  }
}
