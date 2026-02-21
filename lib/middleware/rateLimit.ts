/**
 * Rate limiting middleware for API routes
 *
 * Note: This is an in-memory implementation suitable for single-server deployments.
 * For multi-server deployments, use Redis or similar distributed store.
 */

import { NextRequest, NextResponse } from 'next/server';
import { existsSync } from 'fs';
import { join } from 'path';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitConfig {
  windowMs: number;      // Time window in milliseconds
  maxRequests: number;   // Max requests per window
  keyGenerator?: (request: NextRequest) => string; // Custom key generator
  skipSuccessfulRequests?: boolean; // Don't count successful requests
}

// In-memory store (use Redis for production)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries periodically (every minute)
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);

// Check if rate limiting should be disabled for testing
let isTestMode = process.env.NODE_ENV === 'test' ||
                 process.env.PLAYWRIGHT_TEST === 'true' ||
                 process.env.DISABLE_RATE_LIMIT === 'true';

// Also check for test indicator file (created during E2E tests)
if (!isTestMode) {
  try {
    const testIndicator = join(process.cwd(), '.playwright-test-running');
    if (existsSync(testIndicator)) {
      isTestMode = true;
    }
  } catch {
    // Ignore errors
  }
}

/**
 * Clean expired entries for a specific key
 */
function cleanExpiredEntry(key: string): void {
  const entry = rateLimitStore.get(key);
  if (entry && entry.resetTime < Date.now()) {
    rateLimitStore.delete(key);
  }
}

/**
 * Get or create rate limit entry for a key
 */
function getEntry(key: string, windowMs: number): RateLimitEntry {
  const now = Date.now();
  let entry = rateLimitStore.get(key);

  if (!entry || entry.resetTime < now) {
    entry = {
      count: 0,
      resetTime: now + windowMs,
    };
    rateLimitStore.set(key, entry);
  }

  return entry;
}

/**
 * Default key generator - uses IP address
 */
function defaultKeyGenerator(request: NextRequest): string {
  // Try to get real IP from headers (useful behind proxy)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip'); // Cloudflare

  const ip = forwardedFor?.split(',')[0].trim() ||
             realIp ||
             cfConnectingIp ||
             'unknown';

  return `ratelimit:${ip}`;
}

/**
 * Rate limiting middleware factory
 */
export function createRateLimiter(config: RateLimitConfig) {
  const {
    windowMs,
    maxRequests,
    keyGenerator = defaultKeyGenerator,
    skipSuccessfulRequests = false,
  } = config;

  return async function rateLimit(request: NextRequest): Promise<NextResponse | null> {
    // Skip rate limiting in test mode
    if (isTestMode) {
      return null;
    }

    const key = keyGenerator(request);
    cleanExpiredEntry(key);

    const entry = getEntry(key, windowMs);

    // Check if limit exceeded
    if (entry.count >= maxRequests) {
      const retryAfter = Math.ceil((entry.resetTime - Date.now()) / 1000);

      return NextResponse.json(
        {
          success: false,
          error: 'Too many requests',
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(entry.resetTime).toISOString(),
            'Retry-After': retryAfter.toString(),
          },
        }
      );
    }

    // Increment counter
    entry.count++;
    rateLimitStore.set(key, entry);

    // Add rate limit headers to request for response
    const headers = new Headers({
      'X-RateLimit-Limit': maxRequests.toString(),
      'X-RateLimit-Remaining': (maxRequests - entry.count).toString(),
      'X-RateLimit-Reset': new Date(entry.resetTime).toISOString(),
    });

    return null; // No error, request should proceed
  };
}

/**
 * Pre-configured rate limiters for common use cases
 */

// Strict rate limiter for login endpoint (5 requests per 15 minutes)
export const loginRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
});

// Standard rate limiter for API routes (100 requests per minute)
export const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100,
});

// Relaxed rate limiter for read operations (200 requests per minute)
export const readRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 200,
});

// File upload rate limiter (10 uploads per minute)
export const uploadRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10,
  keyGenerator: (request) => {
    // Use IP + user-specific key for uploads
    const userId = request.headers.get('x-user-id') || 'anonymous';
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const cfConnectingIp = request.headers.get('cf-connecting-ip');

    const ip = forwardedFor?.split(',')[0].trim() ||
               realIp ||
               cfConnectingIp ||
               'unknown';
    return `upload:${ip}:${userId}`;
  },
});

/**
 * Apply rate limiting to an API route handler
 *
 * Usage:
 * ```ts
 * export async function GET(request: NextRequest) {
 *   const rateLimitResult = await apiRateLimiter(request);
 *   if (rateLimitResult) return rateLimitResult;
 *
 *   // Your handler code here
 * }
 * ```
 */
export async function withRateLimit(
  request: NextRequest,
  rateLimiter: ReturnType<typeof createRateLimiter>
): Promise<NextResponse | null> {
  return rateLimiter(request);
}

/**
 * Create a rate-limited route handler
 *
 * Usage:
 * ```ts
 * export const GET = createRateLimitedHandler(
 *   async (request: NextRequest) => {
 *     // Your handler code
 *     return NextResponse.json({ data: '...' });
 *   },
 *   apiRateLimiter
 * );
 * ```
 */
export function createRateLimitedHandler(
  handler: (request: NextRequest) => Promise<NextResponse> | NextResponse,
  rateLimiter: ReturnType<typeof createRateLimiter>
) {
  return async function rateLimitedHandler(request: NextRequest): Promise<NextResponse> {
    const rateLimitResult = await rateLimiter(request);
    if (rateLimitResult) {
      return rateLimitResult;
    }

    return handler(request);
  };
}

/**
 * Get rate limit info for a key (useful for displaying limits to users)
 */
export function getRateLimitInfo(
  request: NextRequest,
  config: RateLimitConfig
): {
  limit: number;
  remaining: number;
  resetAt: Date;
} {
  const key = config.keyGenerator
    ? config.keyGenerator(request)
    : defaultKeyGenerator(request);

  const entry = getEntry(key, config.windowMs);

  return {
    limit: config.maxRequests,
    remaining: Math.max(0, config.maxRequests - entry.count),
    resetAt: new Date(entry.resetTime),
  };
}

/**
 * Reset rate limit for a key (admin function)
 */
export function resetRateLimit(request: NextRequest): void {
  const key = defaultKeyGenerator(request);
  rateLimitStore.delete(key);
}
