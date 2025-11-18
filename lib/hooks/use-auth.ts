/**
 * Auth Hook - User authentication state management
 *
 * Custom OAuth implementation with Jose session management
 */

"use client";

import { useEffect, useRef, useState } from "react";

/**
 * User type matching BaseUser schema
 */
export type AuthUser = {
  id: string;
  name: string;
  email: string;
  image?: string;
};

type SessionResponse = {
  user: AuthUser | null;
  accessToken?: string;
  isExpired?: boolean;
};

/**
 * Auth Hook - Fetch-based session management
 */
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use ref to track refresh state for reliable synchronous checks
  const isRefreshingRef = useRef(false);

  // Fetch session on mount
  useEffect(() => {
    fetchSession();
  }, []);

  const fetchSession = async () => {
    try {
      const response = await fetch("/api/auth/session");
      const data: SessionResponse = await response.json();

      setUser(data.user);
      setAccessToken(data.accessToken || null);

      // Auto-refresh if token is about to expire
      // Prevent refresh if already refreshing to avoid spam
      if (data.user && data.isExpired && !isRefreshingRef.current) {
        await refreshToken();
      }
    } catch (error) {
      console.error("Failed to fetch session:", error);
      setUser(null);
      setAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async () => {
    // Prevent multiple simultaneous refresh requests
    if (isRefreshingRef.current) {
      console.log("Refresh already in progress, skipping...");
      return false;
    }

    isRefreshingRef.current = true;

    try {
      const response = await fetch("/api/auth/refresh", { method: "POST" });

      // If refresh fails (401 = invalid/expired refresh token), clear session
      if (!response.ok) {
        console.error("Token refresh failed, clearing session");
        setUser(null);
        setAccessToken(null);
        isRefreshingRef.current = false;
        return false;
      }

      // Only fetch session again if refresh was successful
      await fetchSession();
      isRefreshingRef.current = false;
      return true;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      // Clear session on error to prevent infinite loop
      setUser(null);
      setAccessToken(null);
      isRefreshingRef.current = false;
      return false;
    }
  };

  const login = (callbackUrl?: string) => {
    const url = new URL("/api/auth/signin", window.location.origin);
    if (callbackUrl) {
      url.searchParams.set("callbackUrl", callbackUrl);
    }
    window.location.href = url.toString();
  };

  const logout = async () => {
    try {
      // Call POST to revoke tokens and delete session
      await fetch("/api/auth/signout", { method: "POST" });
      setUser(null);
      setAccessToken(null);

      // Redirect to OAuth server logout (GET endpoint)
      // This will clear session_id cookie and redirect back to app
      window.location.href = "/api/auth/signout";
    } catch (error) {
      console.error("Failed to sign out:", error);
      // Fallback to home page
      window.location.href = "/";
    }
  };

  return {
    user,
    accessToken,
    isLoggedIn: !!user,
    isLoading,
    login,
    logout,
    refreshToken,
  } as const;
}
