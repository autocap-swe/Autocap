# Specification: CMS Integration (Frontend) — Read-Only Pilot, v2 (no fallback)

**Author:** Amar Smajlovic (Full Stack Dev)
**Date:** 2026-05-05
**Status:** Approved (v2 supersedes v1's fallback-based architecture)

> **v2 changes** (vs the originally approved v1):
>
> 1. **No runtime fallback.** `getContent` no longer accepts `fallback`. ISR is
>    the protective layer (Next.js keeps stale cached HTML on revalidation
>    failure); real outages bubble to the page's `error.tsx`.
> 2. **Per-page wrappers stay** but in **folders**: `src/lib/cms/<page>/` with
>    `index.ts` (wrapper), `mapper.ts`, `types.ts`, `index.test.ts`. Pages
>    import `get<Page>Content()` — never the generic.
> 3. **`src/content/<file>.ts` is deleted as part of each page's migration.**
>    The contact pilot deletes `src/content/contact.ts`.
> 4. Roadmap for the rest of the pages: see
>    `Autocap/docs/specs/00-content-migration-roadmap.md`.

---

## 1. Overview

### 1.1 Summary

Standardise how Next.js consumes content from the AutoCap Strapi CMS at
`../cms/`. One generic client (`src/lib/cms/client.ts` — `getContent`) plus
**one folder per page** under `src/lib/cms/<page>/` with the wrapper, mapper,
types, and tests. Pages call `get<Page>Content()` and render whatever comes
back. On any CMS failure, `getContent` throws — Next.js ISR keeps the
last-known-good cached HTML serving in production. Hardcoded
`src/content/*.ts` is **deleted** per page as it migrates. The contact page
is the **pilot**.

### 1.2 Goals

- One generic fetch utility (`getContent`); one folder per CMS-driven page.
- Pages import `get<Page>Content()`, not the generic.
- ISR is the only protective layer — no duplicated copy in code.
- Contact page renders identical output once switched, users notice no regression.

### 1.3 Non-Goals

- **Translations / locales / i18n.** Explicitly deferred. This spec reads
  English content only; the existing Strapi i18n plumbing (`cms/`) stays
  untouched but is _not_ exercised here. A future spec
  (`Autocap/docs/specs/cms-locales.md`) will add `locale` to `getContent`,
  the Strapi side will turn on per-field localisation, and `next-intl` will
  carry the URL strategy.
- **Form submission handling** (`POST /api/contact/general`, etc.). Custom
  Next.js routes — separate spec.
- **Migrating other pages.** Each page gets its own spec — see the roadmap
  at `Autocap/docs/specs/00-content-migration-roadmap.md`.
- **Dynamic content-types** with real entities (workshops, news, team).
  Those are Phase C in the roadmap.

### 1.4 User Story

As an **AutoCap engineer**,
I want each page to import a focused `get<Page>Content()` wrapper that hides
the slug, types, and mapper,
So that page code reads as `const data = await getContactContent()` —
boilerplate-free.

As an **AutoCap content editor**,
I want my Strapi edits to the Contact Page to appear on the public site
within ~60s, and I want the site to keep serving the last-published copy
even if Strapi briefly goes down,
So that publishes are fast and editor outages never take the site offline.

> The "stays online during Strapi outages" guarantee comes from Next.js ISR's
> default behaviour: revalidation failure returns the previously cached HTML.
> This replaces the v1 hardcoded-fallback pattern.

---

## 2. Acceptance Criteria

### AC-001: Single generic `getContent` function (no fallback)

GIVEN the file `src/lib/cms/client.ts`
WHEN inspecting its public exports
THEN there is exactly one content-fetching function exported as
`getContent<TCms, TFinal = TCms>(slug: string, options?: GetContentOptions<TCms, TFinal>): Promise<TFinal>`
AND `GetContentOptions` includes `revalidate?: number | false`,
`params?: Record<string, string>`, and optional
`mapper?: (cms: TCms) => TFinal`
AND **`fallback` is NOT a valid option** (removed in v2)
AND when the CMS responds successfully, the function returns the typed
payload (run through `mapper` if provided)
AND on any failure (network error, non-2xx, Strapi error envelope, `data: null`,
malformed JSON), the function throws `CmsUnavailableError`
with `slug` and (when available) `status`.

---

### AC-002: Per-page wrapper folder pattern

GIVEN any CMS-driven page X
WHEN inspecting `src/lib/cms/<x>/`
THEN the folder contains exactly:

- `index.ts` — exports `get<X>Content()` that wraps `getContent`
- `mapper.ts` — pure function `<x>Mapper(cms): <X>Content`
- `types.ts` — `Cms<X>` interface mirroring the Strapi shape
- `index.test.ts` — Jest tests for the wrapper
  AND the page imports `get<X>Content` from `@/lib/cms/<x>` only — never
  `getContent` directly.

---

### AC-003: Contact page is fully CMS-driven

GIVEN the contact page at `src/app/contact/page.tsx`
WHEN the page renders
THEN it calls `await getContactContent()` exactly once
AND every text on the page (hero, routing, general inquiry copy, form labels,
success message, company info) originates from `getContactContent()`
AND `src/content/contact.ts` is **deleted** after this spec ships
AND `ContactContent`, `ContactFormLabels`, and `CompanyContactInfo` interfaces
live in `src/lib/cms/contact/types.ts` (moved out of `src/content/`).

---

### AC-004: Form labels come from CMS (no hardcoded defaults at the call site)

GIVEN the `GeneralContactForm` component
WHEN it renders
THEN it receives a fully-populated `formLabels: ContactFormLabels` prop from the page
AND it does **not** read any hardcoded label/placeholder defaults — every
string comes from props.
(If the CMS omits a field, the missing value is empty/blank — which we accept
because Strapi enforces required fields. No silent fallback in code.)

> Note: this AC is about **labels/copy**. Form **submission** is out of
> scope — see Non-Goals.

---

### AC-005: ISR caching with sensible default

GIVEN a `getContent('contact-page')` call
WHEN Next.js fetches the page
THEN the underlying `fetch` uses `next: { revalidate: 60 }` by default
AND `revalidate` can be overridden (e.g. `{ revalidate: 300 }` or `{ revalidate: false }`).

---

### AC-006: Error Handling — CMS down / 5xx / malformed payload

GIVEN the CMS returns a non-2xx status, throws a network error, or returns
invalid JSON, OR returns a Strapi `error` envelope, OR returns `data: null`
WHEN `getContent` runs
THEN a single `console.warn` is emitted with shape `[CMS] <slug>: <status/error>`
AND `getContent` throws `CmsUnavailableError` with `slug` and `status` (when known)
AND the page-level `error.tsx` (Next.js error boundary) handles it.

> In production with ISR, runtime failures during revalidation cause Next.js
> to **keep serving the previously cached HTML** — the throw never reaches
> users for already-cached pages. First-time builds against a down CMS will
> fail (intentionally — the build is the gate that ensures content exists).

---

### AC-007: Edge Case — published-but-empty entry

GIVEN the CMS has a `contact-page` published entry where every field is empty/null
WHEN `getContactContent()` runs
THEN the page renders with empty strings in those fields (acceptable; Strapi
should enforce required fields)
AND no error is thrown.

---

### AC-008: Type safety via generics

GIVEN `getContent<CmsContactPage, ContactContent>('contact-page', { mapper })`
WHEN compiling
THEN the return type is `ContactContent`
AND TypeScript flags shape mismatches in the mapper at the call site
AND `npm run typecheck` exits 0.

---

### AC-009: `src/content/contact.ts` deleted; types moved to `lib/cms/contact/types.ts`

GIVEN the migration completes
WHEN inspecting the repo
THEN `src/content/contact.ts` and `src/content/contact.test.ts` are **deleted**
AND `ContactContent`, `ContactFormLabels`, `CompanyContactInfo`,
`ContactCardData` interfaces are exported from `src/lib/cms/contact/types.ts`
AND `src/content/index.ts` no longer re-exports anything from contact
AND no production code imports from `@/content/contact` (compile is clean).

---

### AC-010: US-005 — public read permissions (per content-type)

GIVEN the `contact-page` content-type exists in Strapi
WHEN the public role is configured
THEN the Public role has `findOne` permission on `contact-page` (and only that)
AND `curl -i http://localhost:1337/api/contact-page` returns `200`
AND `curl -i -X POST http://localhost:1337/api/contact-page` returns `401` or `403`.

---

## 3. Traceability Matrix

| Criterion | Test File                                            | Test Name                                                                 | Status |
| --------- | ---------------------------------------------------- | ------------------------------------------------------------------------- | ------ |
| AC-001    | `src/lib/cms/client.test.ts`                         | `getContent` signature has no `fallback`; throws on failure               | ✅     |
| AC-002    | `src/lib/cms/contact/index.test.ts` (existence)      | per-page folder pattern + page imports wrapper                            | ✅     |
| AC-003    | `src/app/contact/page.test.tsx`                      | contact page calls `getContactContent` once; renders all CMS-sourced text | ✅     |
| AC-004    | `src/components/contact/GeneralContactForm.test.tsx` | form receives + uses formLabels prop without hardcoded defaults           | ✅     |
| AC-005    | `src/lib/cms/client.test.ts`                         | revalidate default + override                                             | ✅     |
| AC-006    | `src/lib/cms/client.test.ts`                         | every failure path throws `CmsUnavailableError`                           | ✅     |
| AC-007    | `src/lib/cms/contact/index.test.ts`                  | empty payload renders empty strings, no throw                             | ✅     |
| AC-008    | typecheck                                            | `npm run typecheck` 0 errors                                              | ✅     |
| AC-009    | grep / `src/lib/cms/contact/types.ts`                | `src/content/contact.ts` deleted; types moved                             | ✅     |
| AC-010    | manual curl                                          | public read 200; POST 401/403                                             | ⏳     |

---

## 4. Technical Design

### 4.1 Files to Create / Modify / Delete

| Path                                                 | Action     | Description                                                                                                                                                                                                  |
| ---------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/lib/cms/client.ts`                              | Modify     | `getContent` — drop `fallback` option entirely; throw on every failure; export `CmsUnavailableError`                                                                                                         |
| `src/lib/cms/client.test.ts`                         | Modify     | Cover AC-001/005/006/007: signature, ISR default, every failure path throws                                                                                                                                  |
| `src/lib/cms/contact/index.ts`                       | Modify     | `getContactContent()` calls `getContent('contact-page', { mapper })` — no fallback                                                                                                                           |
| `src/lib/cms/contact/mapper.ts`                      | Modify     | Drop the `?? fallback.X` chain; return CMS values directly; for fields not yet in CMS (e.g. `specializedCards`) keep them in the mapper as constants OR move to a `lib/cms/contact/static.ts` if substantial |
| `src/lib/cms/contact/types.ts`                       | Modify     | Add `ContactContent`, `ContactFormLabels`, `CompanyContactInfo`, `ContactCardData` (moved from `src/content/contact.ts`)                                                                                     |
| `src/lib/cms/contact/index.test.ts`                  | Modify     | Cover AC-002/007: wrapper calls client correctly; empty payload doesn't throw                                                                                                                                |
| `src/app/contact/page.tsx`                           | Verify     | Already imports `getContactContent`; ensure no `@/content/contact` imports remain                                                                                                                            |
| `src/app/contact/page.test.tsx`                      | Create     | AC-003                                                                                                                                                                                                       |
| `src/components/contact/GeneralContactForm.tsx`      | Modify     | Drop the `formLabels = contactFormLabelDefaults` default; require `formLabels` as a prop                                                                                                                     |
| `src/components/contact/GeneralContactForm.test.tsx` | Modify     | Pass an explicit `formLabels` prop in every render                                                                                                                                                           |
| `src/content/contact.ts`                             | **Delete** | Replaced by `src/lib/cms/contact/types.ts` + Strapi data                                                                                                                                                     |
| `src/content/contact.test.ts`                        | **Delete** | Tests for deleted module                                                                                                                                                                                     |
| `src/content/index.ts`                               | Modify     | Remove the contact re-export                                                                                                                                                                                 |

### 4.2 `getContent` signature (v2 — no fallback)

```ts
export interface GetContentOptions<TCms, TFinal> {
  revalidate?: number | false;
  params?: Record<string, string>;
  /** Optional shape adapter: maps the raw CMS payload to the page shape. */
  mapper?: (cms: TCms) => TFinal;
}

export class CmsUnavailableError extends Error { ... }

export async function getContent<TCms, TFinal = TCms>(
  slug: string,
  options?: GetContentOptions<TCms, TFinal>,
): Promise<TFinal>;
```

`TCms` is what Strapi sends; `TFinal` is what the page wants (default: same).
Mapper is the only place shape-mismatch lives.

### 4.3 Behaviour (v2)

```
1. Build URL: ${CMS_API_URL}/api/${slug} + params
2. fetch with next.revalidate
3. if fetch threw                         → warn → throw CmsUnavailableError
4. if !res.ok                             → warn → throw CmsUnavailableError(status)
5. parse json (try/catch); on parse error → warn → throw
6. if json.error                          → warn → throw CmsUnavailableError(json.error.status)
7. if json.data === null                  → warn → throw CmsUnavailableError
8. if mapper                              → return mapper(json.data)
9. else                                    → return json.data as TFinal
```

### 4.4 Mapper for the Contact Page (v2 — no fallback)

```ts
// src/lib/cms/contact/mapper.ts
import type { CmsContactPage, ContactContent, ContactCardData } from './types';

// Static cards: navigation, not editorial copy. Promote to a Strapi component
// later if editors need to manage them.
const SPECIALIZED_CARDS: readonly ContactCardData[] = [
  /* For Investors, For Workshop Owners */
];

export function contactMapper(cms: CmsContactPage): ContactContent {
  return {
    hero: { title: cms.heroTitle, description: cms.heroDescription },
    routing: { text: cms.routingText },
    specializedCards: [...SPECIALIZED_CARDS],
    generalInquiry: { title: cms.generalInquiryTitle, successMessage: cms.successMessage },
    companyInfo: {
      email: cms.companyEmail,
      address: cms.companyAddress,
      businessHours: cms.businessHours,
    },
    formLabels: {
      nameLabel: cms.nameLabel,
      namePlaceholder: cms.namePlaceholder,
      emailLabel: cms.emailLabel,
      emailPlaceholder: cms.emailPlaceholder,
      subjectLabel: cms.subjectLabel,
      subjectPlaceholder: cms.subjectPlaceholder,
      messageLabel: cms.messageLabel,
      messagePlaceholder: cms.messagePlaceholder,
      gdprConsentText: cms.gdprConsentText,
      submitButtonText: cms.submitButtonText,
    },
  };
}
```

> Strapi MUST mark each consumed field as **required** so the mapper never
> produces `undefined`. The schema changes in Section 11 enforce this.

### 4.5 Page

```tsx
// src/app/contact/page.tsx
import { getContactContent } from '@/lib/cms/contact';

export default async function ContactPage() {
  const { hero, routing, specializedCards, generalInquiry, companyInfo, formLabels } =
    await getContactContent();
  // ...render
}
```

### 4.6 Wrapper

```ts
// src/lib/cms/contact/index.ts
import { getContent } from '../client';
import type { CmsContactPage, ContactContent } from './types';
import { contactMapper } from './mapper';

export async function getContactContent(): Promise<ContactContent> {
  return getContent<CmsContactPage, ContactContent>('contact-page', {
    mapper: contactMapper,
  });
}
```

---

## 5. UI/UX Requirements

No visual change when CMS is populated correctly. If a Strapi field is
blank, the corresponding text on the page is blank — there is no code-level
fallback. (Strapi enforces required-ness.) Responsive/a11y untouched.

---

## 6. Error Handling (v2)

| Scenario                                                | Behaviour                                           |
| ------------------------------------------------------- | --------------------------------------------------- |
| CMS unreachable (network / DNS / timeout)               | `console.warn`, throw `CmsUnavailableError`         |
| CMS 4xx (e.g. 404 — content-type missing)               | warn, throw `CmsUnavailableError(404)`              |
| CMS 5xx                                                 | warn, throw `CmsUnavailableError(5xx)`              |
| CMS returns `{ error }` envelope                        | warn, throw `CmsUnavailableError(error.status)`     |
| CMS returns `{ data: null }` (entry not published)      | warn, throw `CmsUnavailableError`                   |
| CMS returns `{ data: {} }` (entry exists, fields blank) | mapper runs; result has empty strings; **no throw** |
| CMS returns malformed JSON                              | warn, throw `CmsUnavailableError`                   |

In production with ISR, Next.js catches the throw during revalidation and
**keeps serving the previously cached HTML** — users do not see the error.
First-time builds against a misconfigured CMS will fail (intended — fix the
CMS, then build).

---

## 7. Performance Considerations

- Default `revalidate: 60` keeps editor latency reasonable while serving
  cached HTML 99% of the time.
- Each slug is its own cache key (URL-derived).
- No JS shipped to the client for content fetching — Server Components only.

---

## 8. Security Considerations

- `CMS_API_URL` is read from env (`process.env.CMS_API_URL`), never
  hardcoded.
- For now: no API token (Strapi `Public` role serves `find` on
  content-types we expose). When private content lands, add a
  `STRAPI_API_TOKEN` env var and the client sends an `Authorization` header.
- Mapper is pure; no eval, no dynamic dispatch.
- Errors do not leak Strapi internals to the user — `CmsUnavailableError`
  carries status only.

---

## 9. Testing Strategy

### 9.1 Unit (Jest)

- `src/lib/cms/client.test.ts` — covers AC-001/005/006: signature, ISR
  defaults, every failure path throws.
- `src/lib/cms/contact/index.test.ts` — covers AC-002/007: wrapper invokes
  client correctly; empty payload renders empty (does not throw).
- `src/lib/cms/contact/mapper.test.ts` (optional) — pure function spot-check.

### 9.2 Integration

- `src/app/contact/page.test.tsx` — rendered with mocked wrapper; covers
  AC-003.

### 9.3 Manual

- Run `cms` workspace (`cd cms && npm run db:up && npm run develop`),
  publish the Contact Page entry filling **every** required field.
  Reload web. Page renders.
- Stop Strapi. Reload web in dev → see Next.js error page (expected).
- Run `npm run build` while Strapi is up → build passes; the rendered HTML
  is cached. Stop Strapi. The built/served HTML still works
  (ISR cache is stale-but-served).
- Curl checks for AC-010:
  ```
  curl -i http://localhost:1337/api/contact-page             # 200
  curl -i -X POST http://localhost:1337/api/contact-page     # 401/403
  ```

---

## 10. Dependencies

### 10.1 New dependencies

- None on web. (`fetch` is built-in.)

### 10.2 CMS-side dependencies

- The Strapi `contact-page` single-type must be expanded — see
  Section 11 below for the full schema.
- Strapi `Public` role must allow `find` on `contact-page`.

### 10.3 Spec dependencies

- Builds on `cms/docs/specs/cms-scaffold.md` (Strapi installed).
- Builds on `cms/docs/specs/local-postgres-docker.md` (Postgres for dev).

---

## 11. What You Need to Do in Strapi

The CMS workspace already has a `contact-page` single-type with **one field**
(`heroTitle`). Before this spec ships, the content-type needs to be expanded.

> Localisation is intentionally **not** turned on for this content-type yet
> — translations are out of scope for this spec. A future
> `cms-locales.md` spec will flip the flag and add Swedish copy.

### 11.1 Add the missing fields — **all marked Required**

In **Content-Type Builder → Contact Page**, add these fields. Tick the
**Required** advanced option on every one (no fallback in code → blank
fields render blank text on the site, which we don't want).

| Field                 | Type         | Required | Notes                         |
| --------------------- | ------------ | -------- | ----------------------------- |
| `heroTitle`           | Text (Short) | yes      | Already exists; mark required |
| `heroDescription`     | Text (Long)  | yes      |                               |
| `routingText`         | Text (Short) | yes      |                               |
| `generalInquiryTitle` | Text (Short) | yes      |                               |
| `successMessage`      | Text (Long)  | yes      | Form success message          |
| `companyEmail`        | Text (Short) | yes      |                               |
| `companyAddress`      | Text (Long)  | yes      |                               |
| `businessHours`       | Text (Short) | no       | Optional in current shape     |
| `nameLabel`           | Text (Short) | yes      | Form                          |
| `namePlaceholder`     | Text (Short) | yes      | Form                          |
| `emailLabel`          | Text (Short) | yes      | Form                          |
| `emailPlaceholder`    | Text (Short) | yes      | Form                          |
| `subjectLabel`        | Text (Short) | yes      | Form                          |
| `subjectPlaceholder`  | Text (Short) | yes      | Form                          |
| `messageLabel`        | Text (Short) | yes      | Form                          |
| `messagePlaceholder`  | Text (Long)  | yes      | Form                          |
| `gdprConsentText`     | Text (Long)  | yes      | Form                          |
| `submitButtonText`    | Text (Short) | yes      | Form                          |

### 11.2 Grant public read access (US-005)

**Settings → Users & Permissions → Roles → Public → Contact-page**:

- Tick `findOne` (single-types only have findOne, not find). Nothing else.
- Save.

### 11.3 Publish content

In **Content Manager → Single Types → Contact Page**:

- Open the entry, fill in **every** required field, click **Save** then **Publish**.

### 11.4 Sanity check (AC-010)

```bash
curl -i http://localhost:1337/api/contact-page          # 200, data populated
curl -i -X POST http://localhost:1337/api/contact-page  # 401 or 403
```

If the GET returns `data: null`, the entry isn't published. If it returns
401/403, the Public role doesn't have `findOne`.

> If you prefer to edit
> `cms/src/api/contact-page/content-types/contact-page/schema.json`
> directly: that works too, but you'll need to restart Strapi after the
> change. The admin UI is the supported path.

---

## 12. Rollout Plan

- [x] Spec v2 approved by user
- [ ] Strapi side: 11.1 → 11.3 done (all 17 fields, public findOne, entry published)
- [x] `getContent` (v2) — drop `fallback`; throw on every failure
- [x] `src/lib/cms/contact/types.ts` — move ContactContent et al from `src/content/contact.ts`
- [x] `src/lib/cms/contact/mapper.ts` — drop fallback fall-throughs
- [x] `src/lib/cms/contact/index.ts` — call `getContent` without `fallback`
- [x] `src/components/contact/GeneralContactForm.tsx` — require `formLabels`; tests updated
- [x] `src/content/contact.ts` and `contact.test.ts` deleted; `src/content/index.ts` updated
- [x] `src/app/contact/page.test.tsx` created (AC-003)
- [x] Tests pass (all CMS + contact suites: 42 tests, 0 failures)
- [x] `npm run lint` and `npm run typecheck` 0-exit
- [ ] AC-010 curl checks pass (manual — requires Strapi running)
- [ ] User testing: live-edit a field in Strapi admin, see it reflect within ~60s; stop Strapi → cached HTML still serves
- [ ] On approval: `docs/features/cms-integration.md` generated
- [ ] Manual commit per workflow rules

---

## 13. Open Questions

- [ ] Should the mapper live in `src/lib/cms/mappers/` or `src/content/`?
      **Default: `src/lib/cms/mappers/`** — mappers are CMS-shape-aware
      adapters; `src/content/` stays clean as the fallback source.
- [ ] What revalidate value? **Default: 60s.** Marketing copy doesn't
      change minute-to-minute.
- [ ] Should we keep the `__mocks__/` folder? **Default: yes** — Jest
      tests still need to mock the client.
- [ ] Should the fallback be loud (warn in dev, silent in prod) or always
      silent? **Default: warn always** — matches existing `console.warn`
      in `client.ts` today.

---

## Sign-off

| Role          | Name            | Date       | Approved |
| ------------- | --------------- | ---------- | -------- |
| Product Owner | Amar Smajlovic  | 2026-05-04 | [x]      |
| Tech Lead     | Amar Smajlovic  | 2026-05-04 | [x]      |
| Quality Lead  | Dr. Priya Patel |            | [ ]      |
