/**
 * Auth Hook - User authentication state management
 *
 * Custom OAuth implementation with Jose session management
 */

"use client";

import { useEffect, useId, useRef, useState } from "react";
import { toast } from "sonner";

// Debug counter for tracking hook instances
let instanceCounter = 0;

/**
 * User type matching BaseUser schema
 */
export type AuthUser = {
  id: string;
  name: string;
  email: string;
  image?: string;
  roles?: string[];
  permissions?: string[];
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
  // Debug: unique instance ID
  const instanceId = useRef(++instanceCounter).current;
  const componentId = useId();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use ref to track refresh state for reliable synchronous checks
  const isRefreshingRef = useRef(false);

  // Track if this is initial mount to avoid showing toast on page load
  const isInitialMountRef = useRef(true);

  // Debug: Track mount/unmount
  useEffect(() => {
    console.log(
      `[useAuth #${instanceId}] 🟢 MOUNTED (componentId: ${componentId})`
    );
    return () => {
      console.log(`[useAuth #${instanceId}] 🔴 UNMOUNTED`);
    };
  }, [instanceId, componentId]);

  // Fetch session on mount
  useEffect(() => {
    fetchSession();
  }, []);

  const fetchSession = async () => {
    console.log(`[useAuth #${instanceId}] 📡 fetchSession START`);
    try {
      const response = await fetch("/api/auth/session");
      const data: SessionResponse = await response.json();
      console.log(`[useAuth #${instanceId}] 📡 fetchSession RESPONSE:`, {
        hasUser: !!data.user,
        userName: data.user?.name,
      });

      console.log(
        `[useAuth #${instanceId}] 📝 setUser:`,
        data.user?.name || "null"
      );
      setUser(data.user);
      setAccessToken(data.accessToken || null);

      // Auto-refresh if token is about to expire
      // Prevent refresh if already refreshing to avoid spam
      if (data.user && data.isExpired && !isRefreshingRef.current) {
        await refreshToken();
      }
    } catch (err) {
      // Silent fail - session fetch error
      console.log(`[useAuth #${instanceId}] ❌ fetchSession ERROR:`, err);
      setUser(null);
      setAccessToken(null);
    } finally {
      console.log(
        `[useAuth #${instanceId}] ✅ fetchSession COMPLETE, setIsLoading(false)`
      );
      setIsLoading(false);
    }
  };

  const refreshToken = async () => {
    // Prevent multiple simultaneous refresh requests
    if (isRefreshingRef.current) {
      return false;
    }

    isRefreshingRef.current = true;

    try {
      const response = await fetch("/api/auth/refresh", { method: "POST" });

      // If refresh fails (401 = invalid/expired refresh token), clear session
      if (!response.ok) {
        // Only show toast if not initial mount (user is actively using the app)
        if (!isInitialMountRef.current) {
          toast.error("Session expired. Please login again.");
        }
        setUser(null);
        setAccessToken(null);
        isRefreshingRef.current = false;
        isInitialMountRef.current = false;
        return false;
      }

      // Only fetch session again if refresh was successful
      await fetchSession();
      isRefreshingRef.current = false;
      isInitialMountRef.current = false;
      return true;
    } catch {
      // Clear session on error to prevent infinite loop
      // Only show toast if not initial mount
      if (!isInitialMountRef.current) {
        toast.error("Session expired. Please login again.");
      }
      setUser(null);
      setAccessToken(null);
      isRefreshingRef.current = false;
      isInitialMountRef.current = false;
      return false;
    }
  };

  const login = (callbackUrl?: string) => {
    const url = new URL("/api/auth/signin", globalThis.window.location.origin);
    if (callbackUrl) {
      url.searchParams.set("callbackUrl", callbackUrl);
    }
    globalThis.window.location.href = url.toString();
  };

  const logout = async () => {
    try {
      // Call POST to revoke tokens and delete session
      await fetch("/api/auth/signout", { method: "POST" });
      setUser(null);
      setAccessToken(null);

      // Redirect to OAuth server logout (GET endpoint)
      // This will clear session_id cookie and redirect back to app
      globalThis.window.location.href = "/api/auth/signout";
    } catch {
      // Fallback to home page on error
      globalThis.window.location.href = "/";
    }
  };

  const isAdmin =
    user?.roles?.some((role) => ["SUPER_ADMIN", "ADMIN"].includes(role)) ??
    false;

  return {
    user,
    accessToken,
    isLoggedIn: !!user,
    isAdmin,
    isLoading,
    login,
    logout,
    refreshToken,
  } as const;
}
