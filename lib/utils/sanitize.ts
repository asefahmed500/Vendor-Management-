/**
 * Sanitization utilities for preventing injection attacks
 */

/**
 * Escapes special regex characters in a string
 * Prevents ReDoS (Regular Expression Denial of Service) attacks
 *
 * @param input - The string to escape
 * @returns The escaped string safe for use in regex
 */
export function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Escapes HTML special characters to prevent XSS attacks
 *
 * @param input - The string to escape
 * @returns The HTML-escaped string
 */
export function escapeHtml(input: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return input.replace(/[&<>"'/]/g, char => map[char]);
}

/**
 * Sanitizes a search query for use in MongoDB regex queries
 *
 * @param query - The search query to sanitize
 * @returns The sanitized query safe for regex
 */
export function sanitizeSearchQuery(query: string): string {
  // Trim whitespace
  let sanitized = query.trim();
  // Escape regex special characters
  sanitized = escapeRegex(sanitized);
  return sanitized;
}

/**
 * Validates and sanitizes a filename to prevent path traversal attacks
 *
 * @param filename - The filename to validate
 * @returns The sanitized filename or null if invalid
 */
export function sanitizeFilename(filename: string): string | null {
  // Remove any directory paths
  let sanitized = filename.replace(/.*[\/\\]/g, '');

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');

  // Check for suspicious patterns
  if (/^\./.test(sanitized)) {
    return null; // Hidden files (starting with dot) are rejected
  }

  // Limit filename length
  if (sanitized.length > 255) {
    return null;
  }

  // Allow only safe characters (alphanumeric, dots, hyphens, underscores, spaces)
  if (!/^[a-zA-Z0-9._\-\s]+$/.test(sanitized)) {
    return null;
  }

  return sanitized;
}

/**
 * Sanitizes user input that will be displayed in activity logs or comments
 *
 * @param input - The input to sanitize
 * @param maxLength - Maximum allowed length (default 1000)
 * @returns The sanitized and truncated input
 */
export function sanitizeUserInput(input: string, maxLength = 1000): string {
  let sanitized = input.trim();
  // Escape HTML
  sanitized = escapeHtml(sanitized);
  // Truncate if too long
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength) + '...';
  }
  return sanitized;
}
