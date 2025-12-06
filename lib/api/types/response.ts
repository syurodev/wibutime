/**
 * Standard API Response Types
 * Matches backend StandardResponse and PaginationMeta structs
 */

/**
 * Pagination metadata from API
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
}

/**
 * Standard response wrapper from API
 */
export interface StandardResponse<T = unknown> {
  success: boolean;
  code?: string;
  message: string;
  data?: T;
  meta?: PaginationMeta;
}

/**
 * Paginated response helper type
 */
export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

/**
 * Type guard to check if response is successful
 */
export function isSuccessResponse<T>(
  response: StandardResponse<T>
): response is StandardResponse<T> & { success: true } {
  return response.success === true;
}

/**
 * Type guard to check if response has pagination
 */
export function isPaginatedResponse<T>(
  response: StandardResponse<T>
): response is StandardResponse<T> & { meta: PaginationMeta } {
  return response.meta !== undefined;
}
