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
// Server-side API utilities should be imported directly from "@/lib/api/server"
// or specific files to avoid bundling server code in client components.
// export { serverApi, serverFetch } from "./server";

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
  clearAuthToken,
  getClientAuthHeaders,
  getClientAuthToken,
  isAuthenticated,
  setAuthToken,
} from "./auth-client";

// Server-side auth should be imported from "@/lib/api/auth-server"
// export { getServerAuthHeaders, getServerAuthToken } from "./auth-server";

// ===== CONFIGURATION =====

export { API_CONFIG } from "./config";

// ===== TYPES & ERROR HANDLING =====

export {
  ApiError,
  AuthenticationError,
  AuthorizationError,
  NetworkError,
  NotFoundError,
  ValidationError,
} from "./types/error";
export { isPaginatedResponse, isSuccessResponse } from "./types/response";
export type {
  PaginatedResponse,
  PaginationMeta,
  StandardResponse,
} from "./types/response";

// ===== UTILITIES =====

export { endpoint, endpoints } from "./utils/endpoint";
export { ApiParser } from "./utils/parsers";

// ===== MODELS =====

export * from "./models";

// ===== QUERIES (Server Components) =====

// Server Components Queries - Import directly from specific feature files
// to avoid "server-only" errors in Client Components.
// export * from "@/features/artist/api/queries";
// export * from "@/features/genre/api/queries";
// export * from "@/features/history/api/queries";
// export * from "@/features/library/api/queries";
// export * from "./queries/author";
// export * from "./queries/community";
// export * from "./queries/content";
// export * from "./queries/user";

// ===== ACTIONS (Server Actions) =====

/**
 * Use these in Client Components for mutations
 * All actions use "use server" directive
 */
export * from "@/features/artist/api/actions";
export * from "@/features/genre/api/actions";
export * from "@/features/history/api/actions";
export * from "./actions/author";
export * from "./actions/content";
export * from "./actions/user";

// ===== SERVICES (DEPRECATED - Use queries/actions instead) =====

/**
 * @deprecated Use queries and actions instead
 * Services will be removed in a future version
 */
export * from "./services";
