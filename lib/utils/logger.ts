/**
 * Structured logging utility for production
 */

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  userId?: string;
  requestId?: string;
}

/**
 * Determines if we should log at the given level based on NODE_ENV
 */
function shouldLog(level: LogLevel): boolean {
  const nodeEnv = process.env.NODE_ENV || 'development';

  if (nodeEnv === 'test') {
    return false; // Don't log in tests
  }

  if (nodeEnv === 'production') {
    // Only log errors and warnings in production
    return level === 'error' || level === 'warn';
  }

  // Log everything in development
  return true;
}

/**
 * Formats a log entry for output
 */
function formatLogEntry(entry: LogEntry): string {
  const parts = [
    `[${entry.timestamp}]`,
    `[${entry.level.toUpperCase()}]`,
    entry.message,
  ];

  if (entry.userId) {
    parts.push(`(userId: ${entry.userId})`);
  }

  if (entry.requestId) {
    parts.push(`(requestId: ${entry.requestId})`);
  }

  let output = parts.join(' ');

  if (entry.context) {
    output += `\n  Context: ${JSON.stringify(entry.context, null, 2)}`;
  }

  if (entry.error) {
    output += `\n  Error: ${entry.error.name}: ${entry.error.message}`;
    if (entry.error.stack) {
      output += `\n  Stack: ${entry.error.stack}`;
    }
  }

  return output;
}

/**
 * Core logging function
 */
function log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error): void {
  if (!shouldLog(level)) {
    return;
  }

  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    context,
  };

  if (error) {
    entry.error = {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  const formatted = formatLogEntry(entry);

  switch (level) {
    case 'error':
      console.error(formatted);
      break;
    case 'warn':
      console.warn(formatted);
      break;
    case 'info':
      console.info(formatted);
      break;
    case 'debug':
      console.debug(formatted);
      break;
  }
}

/**
 * Creates a logger with pre-set context
 */
export function createLogger(defaultContext: Record<string, unknown>) {
  return {
    error: (message: string, error?: Error, additionalContext?: Record<string, unknown>) => {
      log('error', message, { ...defaultContext, ...additionalContext }, error);
    },
    warn: (message: string, context?: Record<string, unknown>) => {
      log('warn', message, { ...defaultContext, ...context });
    },
    info: (message: string, context?: Record<string, unknown>) => {
      log('info', message, { ...defaultContext, ...context });
    },
    debug: (message: string, context?: Record<string, unknown>) => {
      log('debug', message, { ...defaultContext, ...context });
    },
  };
}

/**
 * Default logger exports
 */
export const logger = {
  error: (message: string, error?: Error, context?: Record<string, unknown>) => {
    log('error', message, context, error);
  },
  warn: (message: string, context?: Record<string, unknown>) => {
    log('warn', message, context);
  },
  info: (message: string, context?: Record<string, unknown>) => {
    log('info', message, context);
  },
  debug: (message: string, context?: Record<string, unknown>) => {
    log('debug', message, context);
  },
};

/**
 * Creates a request-specific logger with request ID
 */
export function createRequestLogger(requestId: string, userId?: string) {
  return createLogger({ requestId, userId });
}

/**
 * Async error logging wrapper - logs and rethrows
 */
export async function logAsyncError<T>(
  fn: () => Promise<T>,
  message: string,
  context?: Record<string, unknown>
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    logger.error(message, error as Error, context);
    throw error;
  }
}

/**
 * Sync error logging wrapper - logs and rethrows
 */
export function logSyncError<T>(
  fn: () => T,
  message: string,
  context?: Record<string, unknown>
): T {
  try {
    return fn();
  } catch (error) {
    logger.error(message, error as Error, context);
    throw error;
  }
}
