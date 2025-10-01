// Standard API Response Types based on backend Go structs

/**
 * Error detail object used in standard responses
 */
export interface ErrorDetail {
    code: string;
    description?: string;
}

/**
 * Standard response envelope for all APIs
 * Maps to Go's StandardResponse struct
 */
export interface StandardResponse<T = any> {
    success: boolean;
    message: string;
    data: T;
    error: ErrorDetail | null;
    meta: Record<string, any>;
}

/**
 * Pagination metadata
 */
export interface Pagination {
    page: number;
    page_size: number;
    total_pages: number;
    total_items: number;
}

/**
 * Paginated response with generic data
 */
export interface PaginatedResponse<T = any> {
    data: T[];
    page: number;
    page_size: number;
    total_pages: number;
    total_items: number;
}

/**
 * Pagination request parameters
 */
export interface PaginationRequest {
    page?: number;
    page_size?: number;
}

// Helper type for API endpoints that return StandardResponse
export type ApiResponse<T = any> = StandardResponse<T>;

// Helper type for API endpoints that return paginated data
export type ApiPaginatedResponse<T = any> = StandardResponse<
    PaginatedResponse<T>
>;
