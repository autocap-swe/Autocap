# Specification: ISR Cache Configuration for Content Pages

**Author:** Amar Smajlovic
**Date:** 2026-05-08
**Status:** Draft
**Ticket:** US-030 (E6)

---

## 1. Overview

### 1.1 Summary

Configure Next.js Incremental Static Regeneration (ISR) revalidation intervals
for all pages that fetch content from Strapi. Currently every CMS fetch defaults
to 60 seconds. This spec sets intentional, content-appropriate intervals: 5
minutes for frequently-updated content (news, workshops) and 1 hour for
low-churn content (homepage articles strip). Pages that use only local static
files require no changes.

### 1.2 Goals

- News and workshop pages revalidate every 5 minutes (300s)
- Homepage revalidates every 1 hour (3600s), including its articles strip
- All pages serve stale cached HTML if Strapi is unreachable during revalidation
- CDN receives correct `Cache-Control` headers (handled automatically by Next.js ISR)

### 1.3 Non-Goals

- Pages using local `@/content/...` files (team, about, investors, entrepreneurs, etc.) — already fully static, no changes needed
- CDN provider configuration — handled outside this ticket
- Webhook-based on-demand revalidation (US-027, blocked on deployment)

### 1.4 User Story

As a website visitor, I want pages to load fast and show up-to-date content
without manual redeploys, so that I always see the latest news and workshop
listings without performance degradation.

---

## 2. Acceptance Criteria

### AC-001: News listing page revalidates every 5 minutes

GIVEN the news listing page has been statically rendered
WHEN 300 seconds have passed since the last render
AND a new visitor requests the page
THEN Next.js revalidates the page in the background using fresh Strapi data
AND the visitor receives the updated HTML on the next request

---

### AC-002: News article detail page revalidates every 5 minutes

GIVEN a news article detail page (`/news/[slug]`) has been statically rendered
WHEN 300 seconds have passed since the last render
THEN Next.js revalidates the page in the background
AND updated article content appears on the next request

---

### AC-003: Portfolio (workshop) pages revalidate every 5 minutes

GIVEN the portfolio listing page or a workshop detail page has been statically rendered
WHEN 300 seconds have passed since the last render
THEN Next.js revalidates the page in the background using fresh Strapi data

---

### AC-004: Homepage revalidates every 1 hour

GIVEN the homepage has been statically rendered
WHEN 3600 seconds have passed since the last render
THEN Next.js revalidates the homepage in the background
AND the articles strip reflects any newly published news

---

### AC-005: Pages fall back to stale cache when Strapi is unreachable

GIVEN a page has a previously cached static version
WHEN a revalidation is triggered but Strapi is unreachable or returns an error
THEN Next.js serves the previously cached HTML without error
AND a warning is logged server-side via the existing `CmsUnavailableError` path

---

### AC-006: Revalidate constants are defined in a single shared file

GIVEN a developer needs to adjust cache intervals
WHEN they look for the revalidation values
THEN they find them in one file (`src/lib/cms/revalidate.ts`) as named constants
AND no magic numbers appear in page or CMS function files

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

| File                                | Action           | Description                                                 |
| ----------------------------------- | ---------------- | ----------------------------------------------------------- |
| `src/lib/cms/revalidate.ts`         | Create           | Named revalidation constants                                |
| `src/lib/cms/article/index.ts`      | Modify           | Accept optional `revalidate` param, default 300             |
| `src/lib/cms/workshop/index.ts`     | Modify           | Accept optional `revalidate` param, default 300             |
| `src/app/page.tsx`                  | Modify           | Pass `revalidate: 3600` when calling `getArticlesContent()` |
| `src/app/news/page.tsx`             | No change needed | Will use default 300 from CMS function                      |
| `src/app/news/[slug]/page.tsx`      | No change needed | Will use default 300 from CMS function                      |
| `src/app/portfolio/page.tsx`        | No change needed | Will use default 300 from CMS function                      |
| `src/app/portfolio/[slug]/page.tsx` | No change needed | Will use default 300 from CMS function                      |

### 4.2 Revalidate Constants

```
// src/lib/cms/revalidate.ts
REVALIDATE_HIGH  = 3600   // 1 hour  — low-churn pages (homepage)
REVALIDATE_LOW   = 300    // 5 min   — frequently updated (news, workshops)
```

### 4.3 CMS Function Signature Change

```
// Before
getArticlesContent(): Promise<NewsArticle[]>

// After
getArticlesContent(revalidate = REVALIDATE_LOW): Promise<NewsArticle[]>
```

Same pattern for `getArticleBySlugContent`, `getWorkshopsContent`, `getWorkshopBySlugContent`.

The `revalidate` value is forwarded as-is into the existing `getContent()` options. No other changes to `client.ts`.

### 4.4 Homepage Call

```
// src/app/page.tsx
const articles = await getArticlesContent(REVALIDATE_HIGH)
```

This makes the homepage articles fetch cache for 1 hour, keeping it consistent
with the rest of the homepage (which is fully static).

### 4.5 CDN Cache-Control

Next.js ISR automatically sets `Cache-Control: s-maxage=<revalidate>, stale-while-revalidate`
on statically rendered pages. No manual header configuration is required for this ticket.

### 4.6 Fallback Behaviour (already implemented)

`client.ts` throws `CmsUnavailableError` on any Strapi failure. When thrown
during ISR revalidation, Next.js automatically serves the previously cached
HTML. No additional code is needed — this is verified by the existing error path.

---

## 5. Testing Strategy

### 5.1 Unit Tests

- Verify `getArticlesContent()` passes the correct `revalidate` value to `getContent()`
- Verify `getWorkshopsContent()` passes the correct `revalidate` value to `getContent()`
- Verify that calling with a custom value overrides the default

### 5.2 Manual Testing

- Start Strapi locally, load `/news` — confirm page renders
- Stop Strapi, wait 300s, reload `/news` — confirm stale page is still served (no error)
- Confirm no `fetch()` calls in news/workshop pages use hardcoded numbers

---

## 6. Dependencies

### 6.1 New Dependencies

None.

### 6.2 Feature Dependencies

- `src/lib/cms/client.ts` already supports `revalidate` option — no changes needed

---

## 7. Open Questions

- [ ] Should `generateStaticParams` in `news/[slug]` and `portfolio/[slug]` also pass `REVALIDATE_LOW` explicitly, or rely on the default? (Current default will cover it — low priority.)

---

## Sign-off

| Role          | Name           | Date | Approved |
| ------------- | -------------- | ---- | -------- |
| Product Owner | Amar Smajlovic |      | [ ]      |
| Tech Lead     | Amar Smajlovic |      | [ ]      |
