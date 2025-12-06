/**
 * Auth Hook - User authentication state management
 *
 * Uses AuthContext for shared state across all components.
 * Must be used within AuthProvider.
 */

"use client";

import { AuthContext } from "@/components/providers/AuthProvider";
import { useContext } from "react";

export type { AuthUser } from "@/components/providers/AuthProvider";

/**
 * Auth Hook - Context-based session management
 *
 * Returns shared auth state from AuthProvider.
 * This ensures all components see the same auth state without individual fetches.
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
