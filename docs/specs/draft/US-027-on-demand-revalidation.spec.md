# Specification: On-Demand ISR Revalidation via Strapi Webhook

**Author:** Amar Smajlovic
**Date:** 2026-05-11
**Status:** Draft
**Ticket:** US-027

---

## 1. Overview

### 1.1 Summary

Next.js currently relies on time-based ISR (300 s for news/workshops, 3600 s for
low-churn content). When a content editor publishes or updates an entry in Strapi
the change will not appear on the live site until the next scheduled revalidation
window. This spec adds on-demand revalidation: a Strapi lifecycle hook fires a
signed webhook to a Next.js API route, which immediately purges the ISR cache for
the affected pages. Published changes appear within seconds rather than minutes.

### 1.2 Goals

- A published Strapi entry triggers revalidation of all affected Next.js pages
  within 5 seconds of the publish action
- The webhook endpoint is protected by a shared secret token
- Invalid or unsigned requests are rejected with 401 before any revalidation runs
- News articles and workshops are the two content types in scope for v1
- Time-based ISR (US-030) remains as a safety net for missed webhooks

### 1.3 Non-Goals

- Revalidating static content pages (about, team, investors, entrepreneurs) —
  these are not CMS-driven
- Granular per-slug revalidation for the listing page — entire listing is always
  revalidated on any entry change
- Strapi Draft mode / unpublish triggers — only `afterPublish` and `afterUpdate`
  on published entries are in scope
- CDN edge-layer purging — handled by the SRE outside this ticket (US-004)

### 1.4 User Story

As a content editor,
I want published changes to appear on the site within minutes,
So that I do not need to ask a developer to redeploy after every content update.

---

## 2. Acceptance Criteria

### AC-001: Published news article revalidates immediately

GIVEN a news article exists on the live site
WHEN the editor publishes a change in Strapi
THEN the Next.js news listing page (`/news`) is revalidated within 5 seconds
AND the specific article page (`/news/[slug]`) is revalidated within 5 seconds
AND the next visitor sees the updated content without a redeploy

---

### AC-002: Published workshop revalidates immediately

GIVEN a workshop entry exists in the portfolio
WHEN the editor publishes a change in Strapi
THEN the portfolio listing page (`/portfolio`) is revalidated within 5 seconds
AND the specific workshop page (`/portfolio/[slug]`) is revalidated within 5 seconds

---

### AC-003: Webhook rejected without valid secret

GIVEN the webhook endpoint `POST /api/revalidate` is called
WHEN the `x-revalidate-secret` header is missing or does not match `REVALIDATE_SECRET`
THEN the endpoint returns 401
AND no revalidation is performed

---

### AC-004: Unknown content type is handled gracefully

GIVEN the webhook endpoint receives a valid secret
WHEN the `contentType` field is not a recognised type (not `news-article` or `workshop`)
THEN the endpoint returns 200 with `{ revalidated: false, reason: "unknown_content_type" }`
AND no revalidation is performed
AND no error is thrown

---

### AC-005: Strapi unavailability does not block revalidation path

GIVEN the Next.js revalidation route is called
WHEN `revalidatePath()` or `revalidateTag()` throws internally
THEN the endpoint catches the error
AND returns 500 with `{ error: "revalidation_failed" }`
AND logs the error server-side

---

### AC-006: Webhook fires on both publish and update

GIVEN a Strapi entry is already published
WHEN the editor saves an update to that entry (afterUpdate lifecycle)
THEN the same revalidation webhook fires as it would for a fresh publish

---

## 3. Technical Design

### 3.1 Environment Variables

| Variable                | Location             | Purpose                                        |
| ----------------------- | -------------------- | ---------------------------------------------- |
| `REVALIDATE_SECRET`     | Next.js `.env.local` | Secret token validated on each webhook request |
| `NEXTJS_REVALIDATE_URL` | Strapi `.env`        | Full URL to `POST /api/revalidate`             |
| `REVALIDATE_SECRET`     | Strapi `.env`        | Same value as Next.js — sent in webhook header |

### 3.2 Next.js Webhook Route

**Path:** `POST /api/revalidate`

**Request shape:**

```
Header: x-revalidate-secret: <token>
Body:   { "contentType": "news-article" | "workshop", "slug"?: string }
```

**Logic (pseudocode):**

```
1. Read header x-revalidate-secret
2. If it does not match REVALIDATE_SECRET → return 401
3. Parse body, extract contentType and optional slug
4. Switch on contentType:
   news-article →
     revalidatePath('/[locale]/news', 'page') for each locale
     if slug present: revalidatePath('/[locale]/news/[slug]', 'page') for each locale
   workshop →
     revalidatePath('/[locale]/portfolio', 'page') for each locale
     if slug present: revalidatePath('/[locale]/portfolio/[slug]', 'page') for each locale
   default → return 200 { revalidated: false, reason: "unknown_content_type" }
5. Return 200 { revalidated: true, contentType, paths: [...] }
```

**Notes:**

- Locales to revalidate: `['en', 'sv']` (driven by `NEXT_PUBLIC_ENABLE_SV` at build time,
  but hardcoding both is safe — revalidating a non-existent path is a no-op)
- Route must be in `src/app/api/revalidate/route.ts` following existing API route conventions

### 3.3 Strapi Lifecycle Hook

**Location:** `cms/src/index.ts` — in the existing `register` / `bootstrap` block, or
per-content-type in `cms/src/api/news-article/content-types/news-article/lifecycles.ts`
and `cms/src/api/workshop/content-types/workshop/lifecycles.ts`.

Per-content-type lifecycle files are preferred — they keep `src/index.ts` clean.

**Logic (pseudocode):**

```
afterPublish / afterUpdate(event):
  slug = event.result.slug
  contentType = "news-article" | "workshop"
  POST NEXTJS_REVALIDATE_URL
    header: x-revalidate-secret: REVALIDATE_SECRET
    body: { contentType, slug }
  On fetch error: log warning, do not throw (editor action must not fail)
```

**Critical:** The lifecycle hook must never throw. A failed webhook must be a
silent warning — the editor's publish action should always succeed.

### 3.4 Relationship to Time-Based ISR

On-demand revalidation supplements, not replaces, time-based ISR.

| Scenario                         | Mechanism                                                  |
| -------------------------------- | ---------------------------------------------------------- |
| Editor publishes content         | Webhook → immediate revalidation                           |
| Webhook delivery fails           | ISR timer (300 s) catches it as fallback                   |
| Strapi is unreachable during ISR | Stale HTML served (existing CmsUnavailableError behaviour) |

---

## 4. Test Strategy

| Level  | File                                   | What to test                                                                                                                          |
| ------ | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Unit   | `src/app/api/revalidate/route.test.ts` | 401 on bad secret, 200 + correct paths on valid request, unknown contentType returns `revalidated: false`, malformed JSON returns 400 |
| Unit   | Strapi lifecycles                      | Hook fires on afterPublish and afterUpdate, does not throw on fetch error                                                             |
| Manual | Dev environment                        | Publish article in Strapi admin → confirm `/news` reflects change without page reload after ~2 s                                      |

`revalidatePath` is a Next.js internal — mock it in unit tests with `jest.mock('next/cache')`.

---

## 5. Risks & Open Questions

| Risk                                                              | Mitigation                                                                       |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `REVALIDATE_SECRET` mismatch between envs                         | Document in `.env.example` for both repos; add startup check log                 |
| Strapi cannot reach Next.js (different networks pre-staging)      | Acceptable until US-004 (staging) lands; ISR fallback covers this                |
| High publish frequency flooding revalidation endpoint             | Low risk for this content volume; rate limit (US-031) will cover it              |
| `revalidatePath` with locale prefix — does `/[locale]/news` work? | Must confirm in implementation; fallback is to enumerate `['/news', '/sv/news']` |

---

## 6. Out of Scope / Future

- On-demand revalidation for `contact-page` single type (rarely changes, ISR is sufficient)
- Revalidation on Strapi `afterDelete` / unpublish lifecycle events
- Strapi webhook plugin UI — lifecycle code is sufficient for now
