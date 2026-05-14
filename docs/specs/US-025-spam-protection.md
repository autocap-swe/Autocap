# Specification: US-025 — Spam Protection on All Contact Forms

**Author:** Alex Chen (Tech Lead)
**Date:** 2026-05-13
**Status:** Draft

---

## 1. Overview

### 1.1 Summary

Add Cloudflare Turnstile bot protection to all three contact form endpoints (General, Entrepreneur, Investor). Each form renders an invisible Turnstile widget that issues a one-time token; the server validates the token with the Cloudflare Siteverify API before processing the submission. Combined with the existing IP-based rate limiter (lowered to 5/hour), bots cannot flood the email inbox even if they bypass the widget.

### 1.2 Goals

- Validate a Cloudflare Turnstile token on every form POST before sending any email
- Block requests with missing or invalid tokens with HTTP 403
- Reduce the per-IP rate limit to 5 submissions per hour across all three forms
- Zero friction for real users (Turnstile is invisible/non-interactive by default)

### 1.3 Non-Goals

- reCAPTCHA v3 support (Turnstile is preferred; no annoying checkbox)
- Admin dashboard or submission logging
- CAPTCHA on non-contact API routes

### 1.4 User Story

As a backend developer,
I want spam protection on all form endpoints,
So that bots cannot flood the email inbox.

---

## 2. Acceptance Criteria

### AC-001: Turnstile token required on form submission

GIVEN a user fills out any of the three contact forms (General, Entrepreneur, Investor)
WHEN they submit the form
THEN a valid Cloudflare Turnstile token is included in the request body as `cfTurnstileToken`

---

### AC-002: Server validates token before processing

GIVEN a POST request arrives at `/api/contact/general`, `/api/contact/entrepreneur`, or `/api/contact/investor`
AND the request body contains a `cfTurnstileToken` field
WHEN the server processes the request
THEN it calls the Cloudflare Siteverify API (`https://challenges.cloudflare.com/turnstile/v0/siteverify`) with the token and `TURNSTILE_SECRET_KEY`
AND only proceeds to send the email if the response `success` field is `true`

---

### AC-003: Invalid or missing token returns 403

GIVEN a POST request arrives at any contact endpoint
WHEN the `cfTurnstileToken` field is missing, empty, or fails Cloudflare validation
THEN the server returns HTTP 403 with body `{ "error": "invalid_captcha" }`
AND no email is sent

---

### AC-004: Rate limit reduced to 5 submissions per IP per hour

GIVEN any IP address submitting to any contact endpoint
WHEN they have already submitted 5 times within the current hour
THEN the server returns HTTP 429 with `{ "error": "too_many_requests", "retryAfter": <seconds> }`
AND the `Retry-After` and `X-RateLimit-*` headers are set correctly

---

### AC-005: Turnstile widget renders on all three forms

GIVEN a user visits the Contact page
WHEN the page loads
THEN the Cloudflare Turnstile widget is rendered (invisible mode) on each of the three form tabs: General, Entrepreneur, and Investor
AND the widget uses `NEXT_PUBLIC_TURNSTILE_SITE_KEY` from environment

---

### AC-006: Token is reset after a failed submission

GIVEN a form submission fails (network error, validation error, or 403)
WHEN the error is handled on the client
THEN the Turnstile widget is reset so a fresh token is generated for the next attempt

---

### AC-007: Build succeeds without Turnstile env vars

GIVEN `NEXT_PUBLIC_TURNSTILE_SITE_KEY` or `TURNSTILE_SECRET_KEY` are not set
WHEN the application builds (e.g., in CI without production secrets)
THEN the build completes without errors
AND at runtime a missing `TURNSTILE_SECRET_KEY` causes the server to return 500 with `{ "error": "captcha_misconfigured" }` rather than crashing the process

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
| AC-007    |           |           | ⏳     |

**Status:** ⏳ Pending | ✅ Passed | ❌ Failed

---

## 4. Technical Design

### 4.1 Components / Files to Create or Modify

| File                                                 | Action | Description                                                                    |
| ---------------------------------------------------- | ------ | ------------------------------------------------------------------------------ |
| `src/lib/captcha/turnstile.ts`                       | Create | `verifyTurnstileToken(token: string): Promise<boolean>` — calls Siteverify API |
| `src/components/contact/TurnstileWidget.tsx`         | Create | Client component wrapping `@marsidev/react-turnstile`                          |
| `src/app/api/contact/general/route.ts`               | Modify | Add token extraction + `verifyTurnstileToken` call before `handleContactForm`  |
| `src/app/api/contact/entrepreneur/route.ts`          | Modify | Same                                                                           |
| `src/app/api/contact/investor/route.ts`              | Modify | Same                                                                           |
| `src/app/api/contact/general/handler.ts`             | Modify | Rate limit constant → 5                                                        |
| `src/app/api/contact/entrepreneur/handler.ts`        | Modify | Rate limit constant → 5                                                        |
| `src/app/api/contact/investor/handler.ts`            | Modify | Rate limit constant → 5                                                        |
| `src/components/contact/ContactForm.tsx`             | Modify | Add `<TurnstileWidget>`, include token in submit payload                       |
| `src/components/contact/EntrepreneurContactForm.tsx` | Modify | Same                                                                           |
| `src/components/investors/InvestorContactForm.tsx`   | Modify | Same                                                                           |
| `.env.example`                                       | Modify | Add `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`                |

### 4.2 Data Model

```typescript
// Request body extension (all three forms)
interface WithCaptcha {
  cfTurnstileToken: string;
}

// Turnstile Siteverify response
interface TurnstileVerifyResponse {
  success: boolean;
  'error-codes'?: string[];
}
```

### 4.3 API Endpoints

| Method | Endpoint                    | Change                        |
| ------ | --------------------------- | ----------------------------- |
| POST   | `/api/contact/general`      | Add Turnstile validation step |
| POST   | `/api/contact/entrepreneur` | Add Turnstile validation step |
| POST   | `/api/contact/investor`     | Add Turnstile validation step |

### 4.4 Server-side validation flow (all three routes)

```
1. Check rate limit → 429 if exceeded
2. Parse JSON → 400 if malformed
3. Extract cfTurnstileToken → 403 if missing
4. Call verifyTurnstileToken(token) → 403 if false
5. Run Zod schema validation → 422 if invalid
6. Send email → 200
```

---

## 5. UI/UX Requirements

### 5.1 All breakpoints

- Turnstile widget renders in invisible/non-interactive mode — no checkbox shown to users
- Widget is placed just before the submit button inside each form
- On failed submission, widget resets automatically (fresh token for retry)

### 5.2 Accessibility

- Widget iframe has appropriate `title` attribute
- No change to existing keyboard navigation flow (widget is invisible)

---

## 6. Error Handling

| Error Scenario                        | HTTP | Response Body                          | User-facing message                                |
| ------------------------------------- | ---- | -------------------------------------- | -------------------------------------------------- |
| Missing token                         | 403  | `{ "error": "invalid_captcha" }`       | "Spam check failed. Please refresh and try again." |
| Invalid token (Cloudflare says no)    | 403  | `{ "error": "invalid_captcha" }`       | "Spam check failed. Please refresh and try again." |
| `TURNSTILE_SECRET_KEY` not configured | 500  | `{ "error": "captcha_misconfigured" }` | "Server error. Please try again later."            |
| Cloudflare Siteverify unreachable     | 503  | `{ "error": "captcha_unavailable" }`   | "Could not verify request. Please try again."      |
| Rate limit exceeded                   | 429  | `{ "error": "too_many_requests" }`     | "Too many submissions. Please wait and try again." |

---

## 7. Performance Considerations

- Siteverify call adds ~100–200 ms server-side latency per submission (acceptable for form POSTs)
- Widget script (~50 kB) loaded from Cloudflare CDN — does not impact LCP
- No caching of tokens (tokens are single-use by design)

---

## 8. Security Considerations

- `TURNSTILE_SECRET_KEY` is server-only; never exposed to the client
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is client-safe (Cloudflare site key is public by design)
- Token validated server-side on every request — client-side widget cannot be bypassed by omitting it
- Existing HTML-entity escaping in email templates covers XSS in form fields
- Rate limit applies before Turnstile check to prevent Siteverify API abuse

---

## 9. Testing Strategy

### 9.1 Unit Tests

- `verifyTurnstileToken` — mock fetch: returns `true` on `{ success: true }`, `false` otherwise
- Route handlers — mock `verifyTurnstileToken`: returns 403 when false, proceeds when true
- Zod schemas — `cfTurnstileToken` present and non-empty (if added to schema)

### 9.2 Integration Tests

- Full POST with valid dummy token in test env (use Cloudflare's always-pass test secret key `1x0000000000000000000000000000000AA`)
- Full POST with missing token → 403
- Full POST with invalid token → 403

### 9.3 Manual Testing

- Render form in browser, submit — Turnstile should be invisible, submission succeeds
- Disable JS → form should gracefully degrade (no token → 403, show error)
- Submit 6 times from same IP → 6th returns 429

---

## 10. Dependencies

### 10.1 New Dependencies

- `@marsidev/react-turnstile` — React wrapper for Cloudflare Turnstile widget

### 10.2 Feature Dependencies

- US-015 General Contact Form (already implemented)
- US-022 Entrepreneur Contact Form (already implemented)
- US-023 Investor Contact Form (already implemented)
- Requires: Cloudflare Turnstile site created, `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` obtained

---

## 11. Rollout Plan

- [ ] Cloudflare Turnstile site created, keys obtained
- [ ] Implementation complete
- [ ] All tests passing
- [ ] Quality gates passed
- [ ] User testing approved
- [ ] `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` added to Vercel env vars
- [ ] Ready for commit

---

## 12. Open Questions

- [ ] Should token validation be skipped in `NODE_ENV=test` to avoid hitting Cloudflare in CI, or use Cloudflare's test secret key?
- [ ] Do all three forms share one Turnstile site key, or one per form?

---

## Sign-off

| Role          | Name            | Date | Approved |
| ------------- | --------------- | ---- | -------- |
| Product Owner | Amar            |      | [ ]      |
| Tech Lead     | Alex Chen       |      | [ ]      |
| Quality Lead  | Dr. Priya Patel |      | [ ]      |
