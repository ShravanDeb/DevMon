import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

const limiters = new Map<string, Ratelimit>();

function getLimiter(name: string, config: { windowMs: number; max: number }) {
  if (!limiters.has(name) && redis) {
    limiters.set(
      name,
      new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(config.max, `${config.windowMs}ms`),
        analytics: true,
      })
    );
  }
  return limiters.get(name) ?? null;
}

export async function rateLimit(
  name: string,
  identifier: string,
  config: { windowMs: number; max: number }
): Promise<{ success: boolean; remaining: number }> {
  const limiter = getLimiter(name, config);
  if (!limiter) return { success: true, remaining: 999 };

  const { success, remaining } = await limiter.limit(identifier);
  return { success, remaining };
}

export const RATE_LIMITS = {
  cardGen: { windowMs: 60_000, max: 10 },
  reads: { windowMs: 60_000, max: 60 },
  og: { windowMs: 60_000, max: 5 },
} as const;
