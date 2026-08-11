import { redis } from "./redis";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  /** Seconds until the counter resets. 0 for unlimited. */
  resetIn: number;
}

export const RateLimitWindows = {
  MINUTE: 60,
  HOUR: 60 * 60,
  DAY: 24 * 60 * 60,
} as const;

/**
 * Per-user sliding-window rate limit backed by Redis.
 * Uses two counters (current window + previous window) to avoid a hard reset
 * spike while keeping constant memory and O(1) per check.
 */
export async function checkRateLimit(opts: {
  userId: string;
  scope: string;
  limit: number;
  windowSeconds?: number;
}): Promise<RateLimitResult> {
  const { userId, scope, limit } = opts;
  const windowSeconds = opts.windowSeconds ?? RateLimitWindows.DAY;

  if (!isFinite(limit) || limit <= 0) {
    return { allowed: true, remaining: Number.POSITIVE_INFINITY, limit, resetIn: 0 };
  }

  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const window = Math.floor(now / windowMs); // current window index
  const prevWindow = window - 1;

  const key = (w: number) => `rl:${scope}:${userId}:${w}`;
  const curKey = key(window);
  const prevKey = key(prevWindow);

  try {
    const [curCount, prevCount] = await Promise.all([
      redis.get<number>(curKey).then((v) => Number(v || 0)),
      redis.get<number>(prevKey).then((v) => Number(v || 0)),
    ]);

    // Weighted estimate: fraction of the current window already elapsed.
    const elapsedFrac = (now % windowMs) / windowMs;
    const estimatedWithinLimit = curCount >= limit;

    // Simulate the increment for this request.
    const nextCount = curCount + 1;
    const weightedTotal = prevCount * (1 - elapsedFrac) + nextCount;

    if (weightedTotal > limit) {
      const remaining = Math.max(0, Math.floor(limit - weightedTotal));
      return { allowed: false, remaining, limit, resetIn: estimatedWithinLimit ? 0 : windowSeconds };
    }

    // Persist the increment (atomic, cheapest option).
    const next = await redis.incr(curKey);
    if (next === 1) {
      await redis.expire(curKey, Math.max(windowSeconds * 2, 120));
    }

    return { allowed: true, remaining: Math.max(0, Math.floor(limit - weightedTotal)), limit, resetIn: windowSeconds };
  } catch (err) {
    // Fail-open: if Redis is unavailable, never block legitimate traffic.
    console.warn(`[RateLimit] Redis error for scope=${scope}:`, err);
    return { allowed: true, remaining: limit, limit, resetIn: windowSeconds };
  }
}