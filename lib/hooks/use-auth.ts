/**
 * Auth Hook - User authentication state management
 *
 * Custom OAuth implementation with Jose session management
 */

"use client";

import { useEffect, useState } from "react";

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
      if (data.user && data.isExpired) {
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
    try {
      await fetch("/api/auth/refresh", { method: "POST" });
      await fetchSession();
    } catch (error) {
      console.error("Failed to refresh token:", error);
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
