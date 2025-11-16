/**
 * Auth Hook - User authentication state management
 *
 * This is a MOCK implementation for UI development.
 * Replace with real authentication API when backend is ready.
 */

"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * User type matching BaseUser schema
 */
export type AuthUser = {
  id: string;
  display_name: string;
  username: string;
  avatar_url?: string;
  email?: string;
};

/**
 * Auth Store State
 */
interface AuthStore {
  user: AuthUser | null;
  isLoggedIn: boolean;

  // Actions
  login: (user: AuthUser) => void;
  logout: () => void;
  updateUser: (updates: Partial<AuthUser>) => void;
}

/**
 * Auth Store with localStorage persistence
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isLoggedIn: false,

      // Login action
      login: (user) => {
        set({
          user,
          isLoggedIn: true,
        });
      },

      // Logout action
      logout: () => {
        set({
          user: null,
          isLoggedIn: false,
        });
      },

      // Update user info
      updateUser: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },
    }),
    {
      name: "auth", // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/**
 * Auth Hook - Selective subscriptions
 */
export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const updateUser = useAuthStore((state) => state.updateUser);

  return {
    user,
    isLoggedIn,
    login,
    logout,
    updateUser,
  } as const;
}

/**
 * Mock login for testing
 * Call this to simulate a user login
 */
export function mockLogin() {
  useAuthStore.getState().login({
    id: "mock-user-1",
    display_name: "John Doe",
    username: "johndoe",
    email: "john@example.com",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  });
}

/**
 * Mock logout for testing
 */
export function mockLogout() {
  useAuthStore.getState().logout();
}
