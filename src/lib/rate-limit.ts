export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  retryAfter: number;
}

interface WindowEntry {
  count: number;
  windowStart: number;
}

const store = new Map<string, WindowEntry>();

const WINDOW_MS = 60_000;

export function rateLimit(ip: string, limit: number): RateLimitResult {
  const key = `${ip}:${limit}`;
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now - entry.windowStart >= WINDOW_MS) {
    store.set(key, { count: 1, windowStart: now });
    return { success: true, limit, remaining: limit - 1, retryAfter: 0 };
  }

  if (entry.count >= limit) {
    const retryAfter = Math.ceil((entry.windowStart + WINDOW_MS - now) / 1000);
    return { success: false, limit, remaining: 0, retryAfter };
  }

  entry.count += 1;
  return { success: true, limit, remaining: limit - entry.count, retryAfter: 0 };
}

export function getClientIp(request: {
  headers: { get: (h: string) => string | null };
  ip?: string;
}): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.ip ?? '127.0.0.1';
}
