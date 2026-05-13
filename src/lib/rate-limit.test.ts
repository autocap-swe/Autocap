import { describe, it, expect, vi, beforeEach } from 'vitest';

let rateLimit: typeof import('./rate-limit').rateLimit;
let getClientIp: typeof import('./rate-limit').getClientIp;

beforeEach(async () => {
  vi.resetModules();
  ({ rateLimit, getClientIp } = await import('./rate-limit'));
});

describe('rateLimit', () => {
  it('allows requests up to the limit', () => {
    for (let i = 1; i <= 5; i++) {
      const result = rateLimit('1.2.3.4', 5);
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(5 - i);
    }
  });

  it('blocks the request beyond the limit', () => {
    for (let i = 0; i < 5; i++) rateLimit('1.2.3.5', 5);
    const result = rateLimit('1.2.3.5', 5);
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.retryAfter).toBeGreaterThan(0);
  });

  it('returns retryAfter in seconds', () => {
    for (let i = 0; i < 5; i++) rateLimit('1.2.3.6', 5);
    const result = rateLimit('1.2.3.6', 5);
    expect(result.retryAfter).toBeGreaterThan(0);
    expect(result.retryAfter).toBeLessThanOrEqual(60);
  });

  it('resets after the window expires', () => {
    vi.useFakeTimers();
    for (let i = 0; i < 5; i++) rateLimit('1.2.3.7', 5);
    expect(rateLimit('1.2.3.7', 5).success).toBe(false);

    vi.advanceTimersByTime(60_001);
    const result = rateLimit('1.2.3.7', 5);
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(4);
    vi.useRealTimers();
  });

  it('namespaces by limit so different routes do not share counters', () => {
    for (let i = 0; i < 5; i++) rateLimit('1.2.3.8', 5);
    const result = rateLimit('1.2.3.8', 20);
    expect(result.success).toBe(true);
  });

  it('returns limit and retryAfter 0 on successful requests', () => {
    const result = rateLimit('1.2.3.9', 5);
    expect(result.limit).toBe(5);
    expect(result.retryAfter).toBe(0);
  });
});

describe('getClientIp', () => {
  it('reads first IP from x-forwarded-for', () => {
    const req = {
      headers: { get: (h: string) => (h === 'x-forwarded-for' ? '5.6.7.8, 9.10.11.12' : null) },
    };
    expect(getClientIp(req)).toBe('5.6.7.8');
  });

  it('falls back to request.ip', () => {
    const req = { headers: { get: () => null }, ip: '5.6.7.8' };
    expect(getClientIp(req)).toBe('5.6.7.8');
  });

  it('falls back to 127.0.0.1 when nothing is available', () => {
    const req = { headers: { get: () => null } };
    expect(getClientIp(req)).toBe('127.0.0.1');
  });
});
