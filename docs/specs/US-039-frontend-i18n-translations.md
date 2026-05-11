# Specification: US-039 · Frontend i18n — Swedish Translations

**Author:** Alex Chen (Tech Lead)
**Date:** 2026-05-19 (retro)
**Status:** Implemented

---

## 1. Overview

### 1.1 Summary

All user-facing text on the AutoCap frontend must be externalised into translation files so that the site can be served in both English (default) and Swedish. This covers static UI strings managed via next-intl JSON files and dynamic content fetched from Strapi CMS. A Swedish translator (external client) provides the SV strings.

### 1.2 Goals

- Extract every hardcoded English string into `messages/en.json`
- Provide a matching `messages/sv.json` for the Swedish translator to fill in
- Ensure all CMS content types that have user-visible fields carry the `i18n: localized` flag in Strapi
- Make the frontend fall back to English when a Swedish CMS translation does not yet exist

### 1.3 Non-Goals

- Machine-translation of any content
- Right-to-left language support
- Translation of error logs or internal admin strings

### 1.4 User Story

As an AutoCap content editor,
I want to enter Swedish translations in Strapi and have them appear on the `/sv/` pages,
So that Swedish visitors receive a fully localised experience.

---

## 2. Acceptance Criteria

### AC-001: English JSON is the single source of truth for UI strings

GIVEN the frontend codebase
WHEN a developer searches for any user-visible string rendered in a React component
THEN the string is referenced via `t('key')` (next-intl) and its value lives in `messages/en.json`
AND no hardcoded English string appears in JSX outside of `messages/en.json`

---

### AC-002: Swedish JSON mirrors the English key structure

GIVEN `messages/en.json` with N keys
WHEN `messages/sv.json` is compared against it
THEN every key present in `en.json` also exists in `sv.json`
AND the Swedish values are either translated strings or `swe_<english>` placeholders awaiting the client

---

### AC-003: Locale routing works without URL prefix for English

GIVEN a visitor who navigates to `https://autocapgroup.se/`
WHEN the page loads
THEN English content is served with no `/en/` prefix in the URL
AND Swedish is served at `/sv/` when the language selector switches locale

---

### AC-004: CMS content types expose i18n fields in Strapi

GIVEN the Strapi admin panel
WHEN an editor opens a News Article, Workshop, or Contact Page entry
THEN a locale switcher (EN / SV) is visible
AND each localised field can hold independent EN and SV values

---

### AC-005: Frontend falls back to English when SV translation is missing

GIVEN a CMS collection (e.g. News Articles) where a Swedish locale entry does not exist
WHEN a visitor browses `/sv/news`
THEN the English version of the article is displayed
AND no 404 or empty page is shown

---

### AC-006: Missing translation key causes build error, not silent empty string

GIVEN a next-intl translation key used in a component
WHEN the key is absent from `messages/en.json`
THEN the Next.js build fails with a `MISSING_MESSAGE` error
AND the developer is alerted before any broken string reaches production

---

### AC-007: Static build succeeds when CMS is unreachable

GIVEN the CMS (Strapi) is offline during `npm run build`
WHEN Next.js attempts to statically generate CMS-dependent pages
THEN collection pages (news, portfolio) render with empty lists via `.catch(() => [])`
AND single-type pages (contact) return a 404 via `notFound()`
AND the build completes without crashing

---

## 3. Technical Design

### 3.1 next-intl setup

- `localePrefix: 'as-needed'` — English at root, Swedish at `/sv/`
- `localeDetection: false` — locale is chosen explicitly via the language selector
- All pages under `src/app/[locale]/` call `setRequestLocale(locale)` before any async work
- `[locale]/layout.tsx` exports `generateStaticParams` returning `[{ locale: 'en' }, { locale: 'sv' }]`

### 3.2 CMS fallback strategy

- `getArticlesContent` and `getWorkshopsContent`: if the SV fetch returns an empty array (200 + `[]`), re-fetch with `locale: 'en'`
- `getContactContent`: no fallback — `notFound()` on failure (content must be in CMS)
- The Strapi client already handles 404 → EN fallback for single-type endpoints

### 3.3 Files changed

| File                                              | Change                                                            |
| ------------------------------------------------- | ----------------------------------------------------------------- |
| `src/app/[locale]/layout.tsx`                     | Added `generateStaticParams`; font switched to `next/font/google` |
| `src/lib/cms/article/index.ts`                    | EN fallback when SV returns empty array                           |
| `src/lib/cms/workshop/index.ts`                   | EN fallback when SV returns empty array                           |
| `src/app/[locale]/contact/page.tsx`               | Removed hardcoded `fallbackContent`; added `notFound()`           |
| `src/app/[locale]/portfolio/page.tsx`             | `WorkshopMap` wrapped with `WorkshopMapWrapper` (ssr: false)      |
| `src/components/portfolio/WorkshopMapWrapper.tsx` | New client wrapper for dynamic mapbox import                      |
| `messages/en.json`                                | Added `entrepreneurs.breadcrumb.entrepreneurs` key                |
| `messages/sv.json`                                | Matching SV key added                                             |
| `src/app/[locale]/entrepreneurs/why/page.tsx`     | Fixed broken `t('entrepreneurs' as never)` call                   |
| `src/app/{about,contact,entrepreneurs,...}/`      | **Deleted** — orphaned pre-i18n root pages                        |

---

## 4. Outstanding Work (at time of implementation)

- [ ] **6 content types** not yet in Strapi i18n: Testimonial, PrivacyPolicy, StaticContent, KPITicker, AcquisitionProcess, Milestones — blocked on CMS migration tickets
- [ ] **Swedish JSON** — `swe_*` placeholder values; awaiting delivery from client translator
- [ ] **Language selector** — UI component exists; end-to-end locale switch not manually tested in staging

---

## 5. Traceability Matrix

| Criterion | File                                                 | Status                            |
| --------- | ---------------------------------------------------- | --------------------------------- |
| AC-001    | `messages/en.json` (438 keys), all components        | ✅ Done                           |
| AC-002    | `messages/sv.json`                                   | ⚠️ Placeholders — awaiting client |
| AC-003    | `src/middleware.ts`, `src/i18n/navigation.ts`        | ✅ Done                           |
| AC-004    | Strapi: news-article, workshop, contact-page schemas | ✅ Done (3/9 types)               |
| AC-005    | `src/lib/cms/article/index.ts`, `workshop/index.ts`  | ✅ Done                           |
| AC-006    | next-intl default behaviour                          | ✅ Done                           |
| AC-007    | All `[locale]` pages with `.catch()` / `notFound()`  | ✅ Done                           |

---

## Sign-off

| Role          | Name            | Date       | Approved   |
| ------------- | --------------- | ---------- | ---------- |
| Product Owner | —               | 2026-05-19 | ✅ (retro) |
| Tech Lead     | Alex Chen       | 2026-05-19 | ✅ (retro) |
| Quality Lead  | Dr. Priya Patel | 2026-05-19 | ✅ (retro) |
