/**
 * Structured API error classes per FBC-07 (ErrorEnvelope) and FBC-ERR-001.
 * Maps HTTP status codes to typed error classes for downstream handling.
 */

export class ApiError extends Error {
  constructor(status, errorCode, message, traceId, details = []) {
    super(message || "API error");
    this.name = "ApiError";
    this.status = status;
    this.errorCode = errorCode;
    this.traceId = traceId;
    this.details = details;
  }
}

export class ApiAuthError extends ApiError {
  constructor(errorCode, message, traceId, details) {
    super(401, errorCode, message || "Authentication required", traceId, details);
    this.name = "ApiAuthError";
  }
}

export class ApiValidationError extends ApiError {
  constructor(errorCode, message, traceId, details) {
    super(422, errorCode, message || "Validation failed", traceId, details);
    this.name = "ApiValidationError";
  }
}

export class ApiForbiddenError extends ApiError {
  constructor(errorCode, message, traceId, details) {
    super(403, errorCode, message || "Insufficient permissions", traceId, details);
    this.name = "ApiForbiddenError";
  }
}

export class ApiNotFoundError extends ApiError {
  constructor(errorCode, message, traceId, details) {
    super(404, errorCode, message || "Resource not found", traceId, details);
    this.name = "ApiNotFoundError";
  }
}

export class ApiConflictError extends ApiError {
  constructor(errorCode, message, traceId, details) {
    super(409, errorCode, message || "Conflict", traceId, details);
    this.name = "ApiConflictError";
  }
}

export class ApiRateLimitError extends ApiError {
  constructor(errorCode, message, traceId, details) {
    super(429, errorCode, message || "Rate limit exceeded", traceId, details);
    this.name = "ApiRateLimitError";
  }
}

export class ApiServerError extends ApiError {
  constructor(status, errorCode, message, traceId, details) {
    super(status || 500, errorCode, message || "Server error", traceId, details);
    this.name = "ApiServerError";
  }
}

/**
 * Factory: maps HTTP status + ErrorEnvelope body to typed error.
 */
export function createApiError(status, body = {}) {
  const { error_code, message, trace_id, details } = body;
  switch (status) {
    case 400:
    case 422:
      return new ApiValidationError(error_code, message, trace_id, details);
    case 401:
      return new ApiAuthError(error_code, message, trace_id, details);
    case 403:
      return new ApiForbiddenError(error_code, message, trace_id, details);
    case 404:
      return new ApiNotFoundError(error_code, message, trace_id, details);
    case 409:
      return new ApiConflictError(error_code, message, trace_id, details);
    case 429:
      return new ApiRateLimitError(error_code, message, trace_id, details);
    default:
      if (status >= 500) {
        return new ApiServerError(status, error_code, message, trace_id, details);
      }
      return new ApiError(status, error_code, message || `Request failed (${status})`, trace_id, details);
  }
}
