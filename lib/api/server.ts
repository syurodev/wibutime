/**
 * Server-side API utilities
 * Only import this file from Server Components or Server Actions
 *
 * Re-exports serverApi from utils/server-fetch.ts
 */

import "server-only";

// Re-export serverApi from utils/server-fetch
export { serverApi, serverFetch } from "./utils/server-fetch";
