/**
 * Auth Provider - Centralized authentication state management
 *
 * This provider ensures auth state is shared across all components,
 * preventing multiple fetch calls and state reset issues when components mount/unmount.
 */

"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";

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

interface AuthContextType {
  user: AuthUser | null;
  accessToken: string | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (callbackUrl?: string) => void;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  readonly children: ReactNode;
}

/**
 * Auth Provider Component
 *
 * Fetches and manages auth state once at the root level.
 * All child components using useAuth() will share this state.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use ref to track refresh state for reliable synchronous checks
  const isRefreshingRef = useRef(false);

  // Track if this is initial mount to avoid showing toast on page load
  const isInitialMountRef = useRef(true);

  const fetchSession = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/session");
      const data: SessionResponse = await response.json();

      setUser(data.user);
      setAccessToken(data.accessToken || null);

      // Auto-refresh if token is about to expire
      // Prevent refresh if already refreshing to avoid spam
      if (data.user && data.isExpired && !isRefreshingRef.current) {
        await refreshTokenInternal();
      }
    } catch {
      // Silent fail - session fetch error
      setUser(null);
      setAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshTokenInternal = async () => {
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

  // Fetch session on mount (only once at provider level)
  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const login = useCallback((callbackUrl?: string) => {
    const url = new URL("/api/auth/signin", globalThis.window.location.origin);
    if (callbackUrl) {
      url.searchParams.set("callbackUrl", callbackUrl);
    }
    globalThis.window.location.href = url.toString();
  }, []);

  const logout = useCallback(async () => {
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
  }, []);

  const refreshToken = useCallback(() => refreshTokenInternal(), []);

  const isAdmin = useMemo(
    () =>
      user?.roles?.some((role) => ["SUPER_ADMIN", "ADMIN"].includes(role)) ??
      false,
    [user?.roles]
  );

  const contextValue = useMemo(
    () => ({
      user,
      accessToken,
      isLoggedIn: !!user,
      isAdmin,
      isLoading,
      login,
      logout,
      refreshToken,
    }),
    [user, accessToken, isAdmin, isLoading, login, logout, refreshToken]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
