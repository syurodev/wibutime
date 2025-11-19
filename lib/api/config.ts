/**
 * API Configuration
 */

export const API_CONFIG = {
  /**
   * API base URL
   * Override with NEXT_PUBLIC_API_URL environment variable
   */
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1",

  /**
   * Request timeout in milliseconds
   */
  timeout: 30000, // 30 seconds

  /**
   * Default headers
   */
  headers: {
    "Content-Type": "application/json",
  },

  /**
   * Use mock API instead of real backend
   * Set NEXT_PUBLIC_USE_MOCK_API=true in .env.local for development
   */
  useMock: process.env.NEXT_PUBLIC_USE_MOCK_API === "true",

  /**
   * Enable verbose API logging
   * Automatically enabled in development mode
   */
  enableLogging:
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_API_DEBUG === "true",
} as const;
