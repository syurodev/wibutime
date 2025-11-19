/**
 * Server-side Authentication Utility
 * Must be called from Server Components or Server Actions only
 */

import "server-only";

/**
 * Get server-side authentication token
 * Must be called from Server Components or Server Actions
 *
 * @returns Token string or null if not authenticated
 */
export async function getServerAuthToken(): Promise<string | null> {
  try {
    const { getSession } = await import("@/lib/auth/session");
    const session = await getSession();
    return session?.accessToken || null;
  } catch (error) {
    console.error("Failed to get server session:", error);
    return null;
  }
}

/**
 * Get auth headers for server-side requests
 */
export async function getServerAuthHeaders(): Promise<HeadersInit> {
  const token = await getServerAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
