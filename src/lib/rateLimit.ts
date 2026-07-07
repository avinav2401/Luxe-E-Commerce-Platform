export interface RateLimitOptions {
  windowMs: number;
  max: number;
}

export interface RateLimitInfo {
  count: number;
  resetTime: number;
}

const limiters = new Map<string, RateLimitInfo>();

export function rateLimit(identifier: string, options: RateLimitOptions = { windowMs: 15 * 60 * 1000, max: 100 }): boolean {
  const now = Date.now();
  const info = limiters.get(identifier);

  if (!info || now > info.resetTime) {
    limiters.set(identifier, {
      count: 1,
      resetTime: now + options.windowMs,
    });
    return true;
  }

  if (info.count >= options.max) {
    return false; // Rate limit exceeded
  }

  info.count += 1;
  return true;
}

// Clean up expired entries periodically to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, info] of limiters.entries()) {
    if (now > info.resetTime) {
      limiters.delete(key);
    }
  }
}, 60000); // Clean up every minute
