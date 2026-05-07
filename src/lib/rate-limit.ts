// Tiny in-memory rate limiter. Survives only as long as the Node process —
// good enough for a single-instance portfolio. For multi-instance / serverless
// deployments, swap to Redis or a similar store.

type Bucket = { count: number; resetAt: number };

const buckets: Map<string, Bucket> = new Map();

export type RateLimitOptions = {
  key: string;
  limit?: number;
  windowMs?: number;
};

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

export function rateLimit({
  key,
  limit = 5,
  windowMs = 15 * 60 * 1000,
}: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const bucket: Bucket = buckets.get(key) || { count: 0, resetAt: now + windowMs };

  if (now > bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + windowMs;
  }

  bucket.count += 1;
  buckets.set(key, bucket);

  return {
    allowed: bucket.count <= limit,
    remaining: Math.max(0, limit - bucket.count),
    resetAt: bucket.resetAt,
  };
}

export function resetRateLimit(key: string): void {
  buckets.delete(key);
}
