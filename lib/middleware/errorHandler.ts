/**
 * Centralized error handling for API routes
 */

import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { logger } from '@/lib/utils/logger';
import { ApiResponse } from '@/lib/types/api';

/**
 * Custom error classes for better error handling
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    this.name = 'ApiError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string = 'Bad request') {
    super(400, message);
    this.name = 'BadRequestError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized') {
    super(401, message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = 'Forbidden') {
    super(403, message);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found') {
    super(404, message);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends ApiError {
  constructor(message: string = 'Conflict') {
    super(409, message);
    this.name = 'ConflictError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string = 'Validation failed', public errors?: Record<string, string[]>) {
    super(400, message);
    this.name = 'ValidationError';
  }
}

export class RateLimitError extends ApiError {
  constructor(message: string = 'Rate limit exceeded') {
    super(429, message);
    this.name = 'RateLimitError';
  }
}

/**
 * Handles different types of errors and returns appropriate NextResponse
 */
export function handleApiError(error: unknown, context?: string): NextResponse<ApiResponse> {
  // Log all errors
  if (error instanceof Error) {
    logger.error(
      `${context ? `${context}: ` : ''}${error.message}`,
      error,
      context ? { context } : undefined
    );
  } else {
    logger.error(
      `${context ? `${context}: ` : ''}Unknown error`,
      new Error(String(error)),
      context ? { context, error } : undefined
    );
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const fieldErrors: Record<string, string[]> = {};
    for (const [key, value] of Object.entries(error.flatten().fieldErrors)) {
      if (value && value.length > 0) {
        fieldErrors[key] = value;
      }
    }

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Validation error',
        errors: fieldErrors,
      },
      { status: 400 }
    );
  }

  // Handle custom API errors
  if (error instanceof ApiError) {
    // Don't expose operational error details in production
    const message = process.env.NODE_ENV === 'production' && !error.isOperational
      ? 'An error occurred'
      : error.message;

    const response: ApiResponse = {
      success: false,
      error: message,
    };

    // Add validation errors if present
    if (error instanceof ValidationError && error.errors) {
      response.errors = error.errors;
    }

    return NextResponse.json<ApiResponse>(response, { status: error.statusCode });
  }

  // Handle mongoose errors
  if (isMongooseError(error)) {
    // Duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || 'field';
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: `${field} already exists`,
        },
        { status: 409 }
      );
    }

    // Validation error
    if (error.name === 'ValidationError') {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Validation error',
          errors: Object.entries(error.errors || {}).reduce((acc, [key, err]: [string, { message: string }]) => {
            acc[key] = [err.message];
            return acc;
          }, {} as Record<string, string[]>),
        },
        { status: 400 }
      );
    }

    // Cast error (invalid ObjectId)
    if (error.name === 'CastError') {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Invalid ID format',
        },
        { status: 400 }
      );
    }
  }

  // Handle JWT errors
  if (isJwtError(error)) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Invalid or expired token',
      },
      { status: 401 }
    );
  }

  // Generic error handler
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const message = isDevelopment && error instanceof Error
    ? error.message
    : 'Internal server error';

  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error: message,
    },
    { status: 500 }
  );
}

/**
 * Type guard for mongoose errors
 */
function isMongooseError(error: unknown): error is { code?: number; name: string; keyPattern?: Record<string, unknown>; errors?: Record<string, { message: string }> } {
  return (
    typeof error === 'object' &&
    error !== null &&
    ('code' in error || 'name' in error)
  );
}

/**
 * Type guard for JWT errors
 */
function isJwtError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError' ||
      error.name === 'NotBeforeError')
  );
}

/**
 * Wrapper for async route handlers that automatically catch and handle errors
 */
export function withErrorHandler<T extends unknown[]>(
  handler: (...args: T) => Promise<NextResponse>,
  context?: string
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleApiError(error, context);
    }
  };
}

/**
 * Wraps a promise with error handling
 */
export async function asyncHandler<T>(
  promise: Promise<T>,
  context?: string
): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    throw handleApiError(error, context);
  }
}
