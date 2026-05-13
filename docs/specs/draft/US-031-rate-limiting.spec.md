# Specification: Rate Limiting on Next.js API Routes

**Author:** Amar Smajlovic
**Date:** 2026-05-12
**Status:** Draft
**Ticket:** US-031

---

## 1. Overview

### 1.1 Summary

Apply per-IP rate limiting to the public contact form endpoint `/api/contact`.
The `/api/revalidate` webhook is excluded — it is already protected by a shared
secret header and is only callable by Strapi. Limits are enforced using an
in-memory fixed-window counter stored in a module-level `Map`. No external
infrastructure is required. The implementation includes a clear upgrade path to
Redis once the SRE dependency is resolved.

### 1.2 Goals

- `/api/contact` allows a maximum of 5 requests per minute per IP
- Requests that exceed the limit receive a `429 Too Many Requests` response with
  a `Retry-After` header and a structured JSON error body
- Every response from the route includes `X-RateLimit-Limit` and
  `X-RateLimit-Remaining` headers
- Rate limit windows reset automatically after 60 seconds
- The rate limiter is implemented as a reusable utility so adding it to future
  routes requires minimal code

### 1.3 Non-Goals

- Redis-backed distributed rate limiting (future work, blocked on SRE)
- Per-user or per-token authentication-based limiting
- Global rate limiting across multiple Next.js instances (requires Redis)
- Rate limiting on `/api/revalidate` — already protected by shared secret header
- Rate limiting on routes other than `/api/contact`

### 1.4 User Story

As a site operator, I want API routes protected against abuse and accidental
flooding, so that a single client cannot degrade the service for others or
trigger excessive downstream processing.

---

## 2. Acceptance Criteria

### AC-001: Contact route blocks the 6th request within a 60-second window

GIVEN the `/api/contact` route has received 5 POST requests from the same IP
within the current 60-second window
WHEN a 6th POST request arrives from that same IP before the window resets
THEN the route returns HTTP `429`
AND the response body is `{ "error": "too_many_requests", "retryAfter": <N> }`
where `N` is the number of seconds remaining in the current window
AND the response includes a `Retry-After: <N>` header

---

### AC-002: Rate limit headers are present on every response

GIVEN a POST request is made to `/api/contact`
WHEN the request is within the allowed limit
THEN the response includes `X-RateLimit-Limit: <limit>` reflecting the route's
configured maximum
AND the response includes `X-RateLimit-Remaining: <n>` reflecting how many
requests remain in the current window

---

### AC-004: Rate limit headers are present on 429 responses

GIVEN a POST request exceeds the per-IP limit for a route
WHEN the `429` response is returned
THEN the response includes `X-RateLimit-Limit: <limit>`
AND the response includes `X-RateLimit-Remaining: 0`

---

### AC-005: Window resets after 60 seconds

GIVEN an IP has exhausted its request allowance on `/api/contact`
WHEN 60 seconds have elapsed since the start of that window
AND the same IP sends a new POST request
THEN the request is accepted with HTTP `200` (or the route's normal response)
AND `X-RateLimit-Remaining` reflects a full window minus one

---

### AC-006: Legitimate requests within the limit pass through normally

GIVEN no previous requests have been made from an IP within the current window
WHEN up to 5 POST requests are made to `/api/contact` from that IP
THEN each request receives the route's normal response (not `429`)
AND `X-RateLimit-Remaining` decrements correctly with each request

---

### AC-007: Rate limiter is implemented as a standalone reusable utility

GIVEN a developer needs to apply rate limiting to a new API route
WHEN they look for the rate limiting logic
THEN they find a single utility at `src/lib/rate-limit.ts` that is not coupled
to any specific route
AND applying it to a new route requires no duplication of counter or window logic

---

## 3. Traceability Matrix

| Criterion | Test File | Test Name | Status |
| --------- | --------- | --------- | ------ |
| AC-001    |           |           | ⏳     |
| AC-002    |           |           | ⏳     |
| AC-003    |           |           | ⏳     |
| AC-004    |           |           | ⏳     |
| AC-005    |           |           | ⏳     |
| AC-006    |           |           | ⏳     |

**Status:** ⏳ Pending | ✅ Passed | ❌ Failed

---

## 4. Technical Design

### 4.1 Files to Create or Modify

| File                           | Action | Description                                              |
| ------------------------------ | ------ | -------------------------------------------------------- |
| `src/lib/rate-limit.ts`        | Create | In-memory fixed-window rate limiter utility              |
| `src/app/api/contact/route.ts` | Modify | Call rate limiter with limit 5 before processing request |

### 4.2 Rate Limiter Utility

```
// src/lib/rate-limit.ts

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  retryAfter: number   // seconds until window resets; 0 when success is true
}

rateLimit(ip: string, limit: number, windowMs: number): RateLimitResult
```

The utility maintains a module-level `Map<string, { count: number; windowStart: number }>`.
On each call it:

1. Derives a key from `ip + limit` to namespace limits per route.
2. Checks whether the current timestamp is outside the stored window; if so,
   resets the counter.
3. Increments the counter and returns `success: true` when `count <= limit`.
4. Returns `success: false` with a non-zero `retryAfter` when `count > limit`.

The `Map` is never explicitly cleared between requests in the same process
instance; stale entries are evicted lazily on the next request from the same IP.

### 4.3 IP Extraction

The client IP is read from the `x-forwarded-for` request header (first value) or
the `request.ip` property provided by Next.js. If neither is available (e.g.
local development without a proxy), fall back to the string `"127.0.0.1"` so
local testing against the 429 behaviour remains possible.

### 4.4 Route Integration Pattern

```
// src/app/api/contact/route.ts
const result = rateLimit(ip, CONTACT_LIMIT, WINDOW_MS)
if (!result.success) {
  return NextResponse.json(
    { error: 'too_many_requests', retryAfter: result.retryAfter },
    {
      status: 429,
      headers: {
        'Retry-After': String(result.retryAfter),
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': '0',
      },
    }
  )
}
// attach headers to the successful response
```

### 4.5 Configuration Constants

```
// src/lib/rate-limit.ts (or a shared constants file)
CONTACT_LIMIT = 5       // requests per window
WINDOW_MS     = 60_000  // 60 seconds
```

### 4.6 Redis Upgrade Path

When Redis becomes available, replace the in-memory `Map` inside
`src/lib/rate-limit.ts` with an atomic Redis `INCR` + `EXPIRE` pattern. The
function signature and the route integration code remain unchanged; only the
storage backend is swapped. No changes to routes or tests are required at that
point beyond updating the utility internals and adding an integration test.

---

## 5. Testing Strategy

### 5.1 Unit Tests

- Call `rateLimit()` up to the limit from the same IP — all return `success: true`
- Call `rateLimit()` one beyond the limit — returns `success: false` with correct
  `retryAfter`
- Simulate time advancing past `windowMs` — next call resets counter and returns
  `success: true`
- Verify `remaining` decrements correctly with each call

### 5.2 Integration Tests (route handlers)

- POST to `/api/contact` 5 times — all return the route's normal status
- POST to `/api/contact` a 6th time — returns `429` with correct body and headers
- Confirm `X-RateLimit-Limit` and `X-RateLimit-Remaining` are present on a
  normal `200` response

### 5.3 Manual Testing

- Start the dev server (`npm run dev`)
- Run `for i in $(seq 1 7); do curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3000/api/contact; done`
- Confirm the first 5 lines print `200` (or the route's normal code) and lines
  6–7 print `429`
- Wait 60 seconds and repeat — confirm requests succeed again

---

## 6. Dependencies

### 6.1 New Dependencies

None. The implementation uses only the Node.js standard library and Next.js
built-ins.

### 6.2 Feature Dependencies

- `src/app/api/contact/route.ts` must exist (US-023 / contact form endpoint)
- `src/app/api/revalidate/route.ts` must exist (US-027 / on-demand revalidation)

---

## 7. Open Questions

- [ ] What is the target timeline for the Redis dependency being unblocked by SRE?

---

## Sign-off

| Role          | Name           | Date | Approved |
| ------------- | -------------- | ---- | -------- |
| Product Owner | Amar Smajlovic |      | [ ]      |
| Tech Lead     | Amar Smajlovic |      | [ ]      |
