import { ZodError } from 'zod';

export interface ApiErrorResponse {
  error: string;
  message: string;
  issues?: Array<{ path: string; message: string }>;
  statusCode: number;
}

/**
 * Formats caught errors into safe, sanitized JSON responses.
 * Never leaks database details, SQL queries, or server stack traces to client.
 */
export function formatErrorResponse(error: unknown): ApiErrorResponse {
  // Handle Zod validation error
  if (error instanceof ZodError) {
    const issues = error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));

    return {
      error: 'VALIDATION_ERROR',
      message: 'The request payload failed input schema validation.',
      issues,
      statusCode: 400,
    };
  }

  // Handle generic error
  if (error instanceof Error) {
    // If it's a known client-safe error
    if (error.message.includes('Rate limit exceeded')) {
      return {
        error: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please try again in a few moments.',
        statusCode: 429,
      };
    }
  }

  // Fallback for unhandled server exceptions (Mask internal database/server error details)
  console.error('[ArchTier Internal Server Error]:', error);
  return {
    error: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected internal error occurred. Please try again later.',
    statusCode: 500,
  };
}
