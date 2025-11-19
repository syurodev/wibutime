/**
 * Client-side Authentication Utility
 * Safe to use in Client Components
 */

/**
 * Get authentication token from localStorage/sessionStorage
 * Client-side only
 *
 * @returns Token string or null if not authenticated
 */
export function getClientAuthToken(): string | null {
  if (!globalThis.window) {
    return null;
  }

  // Try localStorage first, then sessionStorage
  return (
    localStorage.getItem("auth_token") ||
    sessionStorage.getItem("auth_token") ||
    null
  );
}

/**
 * Get auth headers for client-side requests
 */
export function getClientAuthHeaders(): HeadersInit {
  const token = getClientAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Set authentication token (client-side only)
 * @param token - Auth token to store
 * @param persistent - Store in localStorage (true) or sessionStorage (false)
 */
export function setAuthToken(token: string, persistent = true): void {
  if (!globalThis.window) {
    console.warn("setAuthToken called on server-side");
    return;
  }

  const storage = persistent ? localStorage : sessionStorage;
  storage.setItem("auth_token", token);
}

/**
 * Clear authentication token (client-side only)
 */
export function clearAuthToken(): void {
  if (!globalThis.window) {
    console.warn("clearAuthToken called on server-side");
    return;
  }

  localStorage.removeItem("auth_token");
  sessionStorage.removeItem("auth_token");
}

/**
 * Check if user is authenticated (client-side)
 */
export function isAuthenticated(): boolean {
  return getClientAuthToken() !== null;
}
