/**
 * Unified Authentication Utility
 * Re-exports client and server auth functions
 *
 * IMPORTANT:
 * - Client Components: Import from "@/lib/api/auth-client"
 * - Server Components: Import from "@/lib/api/auth-server"
 * - This file re-exports both for convenience in lib/api/index.ts
 */

// Client-side functions (safe for client components)
export {
  getClientAuthToken,
  getClientAuthHeaders,
  setAuthToken,
  clearAuthToken,
  isAuthenticated,
} from "./auth-client";

// Server-side functions (server components/actions only)
export { getServerAuthToken, getServerAuthHeaders } from "./auth-server";
