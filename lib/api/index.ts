/**
 * API Service Layer - Main Export
 * Centralized exports for all API utilities
 */

// ===== RECOMMENDED API CLIENTS =====

/**
 * Client-side API (Browser / Client Components)
 * Auto-handles authentication from localStorage
 */
export { api, apiFetch } from "./utils/fetch";
export type { FetchOptions } from "./utils/fetch";

/**
 * Server-side API (Server Components / Server Actions)
 * Auto-handles authentication from session
 */
export { serverApi, serverFetch } from "./server";

/**
 * Authenticated Client (Client Components with explicit token)
 * Use when you need to pass token explicitly
 */
export { createAuthenticatedClient } from "./client-auth";

// ===== AUTHENTICATION UTILITIES =====

/**
 * Client-side auth (safe for Client Components)
 */
export {
  getClientAuthToken,
  getClientAuthHeaders,
  setAuthToken,
  clearAuthToken,
  isAuthenticated,
} from "./auth-client";

/**
 * Server-side auth (Server Components/Actions only)
 */
export { getServerAuthToken, getServerAuthHeaders } from "./auth-server";

// ===== CONFIGURATION =====

export { API_CONFIG } from "./config";

// ===== TYPES & ERROR HANDLING =====

export type { StandardResponse, PaginationMeta, PaginatedResponse } from "./types/response";
export { isSuccessResponse, isPaginatedResponse } from "./types/response";
export {
  ApiError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ValidationError,
  NetworkError,
} from "./types/error";

// ===== UTILITIES =====

export { ApiParser } from "./utils/parsers";
export { endpoint, endpoints } from "./utils/endpoint";

// ===== MODELS =====

export * from "./models";

// ===== QUERIES (Server Components) =====

/**
 * Use these in Server Components for data fetching
 * All queries use React cache for automatic deduplication
 */
export * from "./queries/user";
export * from "./queries/content";
export * from "./queries/genre";
export * from "./queries/author";
export * from "./queries/artist";
export * from "./queries/history";
export * from "./queries/community";

// ===== ACTIONS (Server Actions) =====

/**
 * Use these in Client Components for mutations
 * All actions use "use server" directive
 */
export * from "./actions/user";
export * from "./actions/content";
export * from "./actions/genre";
export * from "./actions/author";
export * from "./actions/artist";
export * from "./actions/history";

// ===== SERVICES (DEPRECATED - Use queries/actions instead) =====

/**
 * @deprecated Use queries and actions instead
 * Services will be removed in a future version
 */
export * from "./services";

