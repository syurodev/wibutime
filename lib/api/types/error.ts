/**
 * API Error Types
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public response?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string = "Authentication failed", code?: string) {
    super(message, code, 401);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends ApiError {
  constructor(message: string = "Access denied", code?: string) {
    super(message, code, 403);
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = "Resource not found", code?: string) {
    super(message, code, 404);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends ApiError {
  constructor(message: string = "Validation failed", code?: string, public errors?: Record<string, string[]>) {
    super(message, code, 422);
    this.name = "ValidationError";
  }
}

export class NetworkError extends ApiError {
  constructor(message: string = "Network error occurred") {
    super(message, "NETWORK_ERROR", 0);
    this.name = "NetworkError";
  }
}
