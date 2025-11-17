"use client";

/**
 * Client-side auth utilities
 * Simple helpers for sign in/out
 */

/**
 * Sign in with OAuth
 * Redirects to OAuth server login page
 */
export function signIn(callbackUrl?: string) {
  const url = new URL("/api/auth/signin", globalThis.window.location.origin);
  if (callbackUrl) {
    url.searchParams.set("callbackUrl", callbackUrl);
  }
  globalThis.window.location.href = url.toString();
}

/**
 * Sign out
 * Clears session and redirects to home
 */
export async function signOut() {
  try {
    await fetch("/api/auth/signout", { method: "POST" });
    globalThis.window.location.href = "/";
  } catch (error) {
    console.error("Failed to sign out:", error);
  }
}

/**
 * Refresh access token
 */
export async function refreshToken() {
  try {
    const response = await fetch("/api/auth/refresh", { method: "POST" });
    return response.ok;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return false;
  }
}
