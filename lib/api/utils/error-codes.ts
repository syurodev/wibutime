/**
 * Error Codes matching backend definitions
 * @see pkg/util/errcode/codes.go
 */
export enum ErrorCode {
  // 400x: Bad Request / Validation Errors
  ValidationRequired = "E4001",
  ValidationInvalidFormat = "E4002",
  ValidationInvalidUserID = "E4003",

  // 401x: Unauthorized / Authentication Errors
  AuthInvalidToken = "E4011",
  AuthInvalidAuthorizationFormat = "E4012",
  AuthInvalidCredentials = "E4013",
  AuthMissingAuthHeader = "E4014",

  // 403x: Forbidden / Authorization Errors
  AuthInsufficientScope = "E4031",
  AuthInsufficientAnyScope = "E4032",
  AuthForbidden = "E4033",

  // 404x: Not Found Errors
  ResourceNotFound = "E4041",
  UserNotFound = "E4042",
  ClientNotFound = "E4043",

  // 409x: Conflict Errors
  ResourceConflict = "E4091",
  DuplicateEntry = "E4092",

  // 429x: Rate Limit Errors
  RateLimitExceeded = "E4291",

  // 500x: Internal Server Errors
  InternalError = "E5001",
  MiddlewareError = "E5002",
  ScopeValidationError = "E5003",
  ContextDataError = "E5004",
  DatabaseError = "E5010",
  RedisError = "E5011",

  // 503x: Service Unavailable Errors
  ServiceUnavailable = "E5031",
  DatabaseUnavailable = "E5032",
}
