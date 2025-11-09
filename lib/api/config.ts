/**
 * API Configuration
 */

export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
} as const;

/**
 * Get authentication token (customize based on your auth strategy)
 */
export async function getAuthToken(): Promise<string | null> {
  // TODO: Implement your auth token retrieval logic
  // Examples:
  // - Read from cookies (server-side)
  // - Get from session/JWT
  // - Get from auth provider (NextAuth, Clerk, etc.)

  // For now, return null (you'll implement this based on your auth)
  return null;
}
