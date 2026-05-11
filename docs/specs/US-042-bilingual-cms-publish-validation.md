# Specification: US-042 · Bilingual CMS — Swedish Required Before English Publish

**Author:** Alex Chen (Tech Lead)
**Date:** 2026-05-19 (retro)
**Status:** Implemented (technical); organisational process pending

---

## 1. Overview

### 1.1 Summary

To ensure AutoCap never ships an English-only page when a Swedish translation is expected, Strapi must enforce that a Swedish (SV) locale draft exists before an English (EN) entry can be published. This is a server-side guard implemented as a Strapi v5 Document Service Middleware.

### 1.2 Goals

- Block publishing an EN entry when no SV draft exists for the same document
- Allow SV entries to publish freely (no EN dependency)
- Cover all content types that have user-facing localised content
- Raise a clear, actionable validation error in the Strapi admin UI

### 1.3 Non-Goals

- Auto-creating or auto-translating SV content
- Pre-filling SV fields from EN values (requires a custom Strapi admin plugin — deferred)
- Blocking unpublish or delete operations

### 1.4 User Story

As an AutoCap content editor,
I want Strapi to prevent me from publishing an English article before I have at least saved a Swedish draft,
So that Swedish visitors are never shown an untranslated page.

---

## 2. Acceptance Criteria

### AC-001: Publishing EN entry without SV draft is blocked

GIVEN an EN locale entry for a News Article (or Workshop, or Contact Page)
AND no SV locale entry exists for that document
WHEN an editor clicks "Publish" on the EN entry in Strapi admin
THEN Strapi returns a validation error
AND the error message states: "A Swedish (sv) translation must be saved before the English version can be published"
AND the entry remains in Draft state

---

### AC-002: Publishing EN entry with SV draft succeeds

GIVEN an EN locale entry for a News Article
AND a SV locale draft exists for the same document (does not need to be published)
WHEN an editor clicks "Publish" on the EN entry
THEN the entry is published successfully
AND no validation error is shown

---

### AC-003: Publishing SV entry is never blocked

GIVEN a SV locale entry for any content type
AND the EN entry may or may not exist
WHEN an editor clicks "Publish" on the SV entry
THEN the entry is published successfully
AND no validation error is shown

---

### AC-004: Guard applies to all localised content types

GIVEN the following content types: news-article, workshop, contact-page
WHEN a publish action is attempted on any of them in EN locale
THEN AC-001 and AC-002 rules apply consistently across all three types

---

### AC-005: Guard does not interfere with non-localised content types

GIVEN a content type that is not in the guard's `LOCALISED_TYPES` list
WHEN a publish action is attempted
THEN the action proceeds normally without any additional validation

---

### AC-006: Guard does not interfere with create/update operations

GIVEN an EN entry being saved (not published)
WHEN an editor clicks "Save" without publishing
THEN the save succeeds regardless of whether a SV entry exists

---

## 3. Technical Design

### 3.1 Implementation approach — Strapi v5 Document Service Middleware

Strapi v5 removed the v4 lifecycle hooks (`beforePublish`, `afterPublish`). The correct extension point is the Document Service Middleware registered in `src/index.ts` → `register()` hook.

> **Note:** Must be in `register()`, not `bootstrap()`. The document service is not available during bootstrap.

```ts
// AutoCap-cms/src/extensions/require-sv-before-publish.ts
import { errors } from '@strapi/utils';
import type { UID } from '@strapi/types';

const { ValidationError } = errors;

const LOCALISED_TYPES: UID.ContentType[] = [
  'api::news-article.news-article',
  'api::workshop.workshop',
  'api::contact-page.contact-page',
];

export async function bilingualPublishGuard(context, next) {
  if (context.action !== 'publish') return next();
  if (!LOCALISED_TYPES.includes(context.uid)) return next();
  const locale = context.params.locale;
  if (locale && locale !== 'en') return next();
  const documentId = context.params.documentId;
  if (!documentId) return next();

  const svEntry = await strapi.documents(context.uid).findOne({ documentId, locale: 'sv' });
  if (!svEntry) {
    throw new ValidationError(
      'A Swedish (sv) translation must be saved before the English version can be published.'
    );
  }
  return next();
}
```

```ts
// AutoCap-cms/src/index.ts
export default {
  register({ strapi }) {
    strapi.documents.use(bilingualPublishGuard as any);
  },
  async bootstrap({ strapi }) {
    await seedLocales(strapi); // seeds EN (default) and SV locales if missing
  },
};
```

### 3.2 Known limitations

- The `as any` cast on `strapi.documents.use()` is needed because Strapi's internal `Middleware` type has a complex `next` return signature that doesn't match the public-facing `DocumentServiceMiddleware` interface. This is a Strapi v5 type definition gap, not a runtime issue.
- EN → SV content pre-fill (auto-copying fields when editor switches locale) is **not implemented** — it requires a custom Strapi Admin React plugin and is deferred to a future ticket.

### 3.3 Files changed

| File                                                      | Change                                                               |
| --------------------------------------------------------- | -------------------------------------------------------------------- |
| `AutoCap-cms/src/extensions/require-sv-before-publish.ts` | New — middleware logic                                               |
| `AutoCap-cms/src/index.ts`                                | Registers middleware in `register()`, seeds locales in `bootstrap()` |

---

## 4. Outstanding Work

- [ ] **Organisational process** — demo the locale switcher workflow to the AutoCap content team
- [ ] **Content freeze date** — agree with client on when all SV translations must be complete
- [ ] **Staging verification** — verify SV translations render correctly end-to-end once client delivers `sv.json`
- [ ] **EN → SV pre-fill** — custom admin plugin (deferred, separate ticket)
- [ ] **Extend to remaining types** — once Testimonial, PrivacyPolicy, etc. are migrated to CMS, add them to `LOCALISED_TYPES`

---

## 5. Traceability Matrix

| Criterion | File                           | Status            |
| --------- | ------------------------------ | ----------------- |
| AC-001    | `require-sv-before-publish.ts` | ✅ Done           |
| AC-002    | `require-sv-before-publish.ts` | ✅ Done           |
| AC-003    | Guard skips `locale !== 'en'`  | ✅ Done           |
| AC-004    | `LOCALISED_TYPES` array        | ✅ Done (3 types) |
| AC-005    | `LOCALISED_TYPES` check        | ✅ Done           |
| AC-006    | `action !== 'publish'` check   | ✅ Done           |

---

## Sign-off

| Role          | Name            | Date       | Approved   |
| ------------- | --------------- | ---------- | ---------- |
| Product Owner | —               | 2026-05-19 | ✅ (retro) |
| Tech Lead     | Alex Chen       | 2026-05-19 | ✅ (retro) |
| Quality Lead  | Dr. Priya Patel | 2026-05-19 | ✅ (retro) |
