# Specification: Hybrid i18n — next-intl + Strapi i18n

**Author:** Amar Smajlovic
**Date:** 2026-05-08
**Status:** Draft

---

## 1. Overview

### 1.1 Summary

AutoCap Group's website currently has no internationalisation support. All copy
lives in hardcoded TypeScript content files (`src/content/*.ts`) and dynamic
content is fetched from Strapi in English only. This feature introduces a hybrid
i18n architecture:

- **next-intl** handles static UI strings via flat JSON message files.
- **Strapi's built-in i18n plugin** handles localised dynamic content
  (`news-article`, `workshop`), letting editors author English and Swedish
  content directly in the CMS admin.
- URL routing follows the next-intl "path prefix" strategy: Swedish at `/sv/…`,
  English at the root `/…` (no `/en/` prefix).

### 1.2 Goals

- Serve the full site in English (default) and Swedish via URL-based locale switching.
- Extract every user-facing static string from `src/content/*.ts` into
  `messages/en.json` and provide a `messages/sv.json` with placeholder values
  (`sve_` + English value) for the client to fill in.
- Enable Strapi i18n on `news-article` and `workshop` so editors can create per-locale entries.
- Pass an optional `locale` parameter through all CMS fetch wrappers.
- Keep existing ISR / `CmsUnavailableError` behaviour intact.

### 1.3 Non-Goals (v1)

- Machine translation or auto-translation.
- Locale detection via `Accept-Language` header or geo-IP.
- i18n on `contact-submission` or `contact-page` content types.
- `hreflang` tags, localised `<meta>` (follow-on ticket).
- Strapi GraphQL locale support.
- Swedish route publicly accessible by default (`NEXT_PUBLIC_ENABLE_SV=false` gates it).

### 1.4 User Story

As a Swedish visitor,
I want to browse the site at `/sv/…` and read all content in Swedish,
So that the site feels native and relevant without needing to understand English.

---

## 2. Acceptance Criteria

### AC-001: English root URL serves English content

GIVEN a visitor requests `/` (no locale prefix)
WHEN the page renders
THEN all static strings come from `messages/en.json`
AND dynamic CMS content is fetched with `locale=en`
AND `<html lang="en">` is set

---

### AC-002: Swedish prefix URL serves Swedish content

GIVEN a visitor requests `/sv/`
WHEN the page renders
THEN all static strings come from `messages/sv.json`
AND dynamic CMS content is fetched with `locale=sv`
AND `<html lang="sv">` is set

---

### AC-003: Unknown locale prefix returns 404

GIVEN a visitor requests `/fr/` or any unsupported prefix
WHEN Next.js middleware processes the request
THEN the visitor receives a 404 response

---

### AC-004: Swedish message file has sve\_ placeholder values

GIVEN `messages/sv.json` is loaded
WHEN next-intl renders a Swedish page
THEN every key present in `messages/en.json` also exists in `messages/sv.json`
AND every string value is the English value prefixed with `"sve_"`

---

### AC-005: CMS wrappers accept and forward a locale parameter

GIVEN `getArticlesContent` or `getWorkshopsContent` is called with `locale="sv"`
WHEN the Strapi request is made
THEN the query includes `locale=sv`
AND when called without locale it defaults to `locale=en`

---

### AC-006: Strapi admin shows locale tabs for news articles and workshops

GIVEN i18n is enabled on both content types
WHEN an editor opens a News Article or Workshop entry
THEN they see an `en` tab and an `sv` tab and can publish independently per locale

---

### AC-007: contact-submission and contact-page are NOT localised

GIVEN the Strapi i18n plugin is active
WHEN `contact-submission` or `contact-page` content types are inspected
THEN neither has `"i18n": true` in `pluginOptions`

---

### AC-008: Existing ISR and error-handling behaviour is preserved

GIVEN the CMS is unreachable during revalidation
WHEN `CmsUnavailableError` is thrown
THEN Next.js serves the previously cached HTML
AND all existing CMS tests continue to pass

---

## 3. Traceability Matrix

| Criterion | Test File                            | Test Name                                 | Status |
| --------- | ------------------------------------ | ----------------------------------------- | ------ |
| AC-001    | `src/app/[locale]/page.test.tsx`     | renders English homepage with en messages | ⏳     |
| AC-002    | `src/app/[locale]/page.test.tsx`     | renders Swedish homepage with sv messages | ⏳     |
| AC-003    | `src/middleware.test.ts`             | unknown locale prefix returns 404         | ⏳     |
| AC-004    | messages key audit                   | all sv values prefixed with sve\_         | ⏳     |
| AC-005    | `src/lib/cms/article/index.test.ts`  | forwards locale param to getContent       | ⏳     |
| AC-005    | `src/lib/cms/workshop/index.test.ts` | forwards locale param to getContent       | ⏳     |
| AC-006    | Manual — Strapi admin walkthrough    | locale tabs visible                       | ⏳     |
| AC-007    | `src/lib/cms/contact/index.test.ts`  | contact wrapper does not append locale    | ⏳     |
| AC-008    | existing CMS tests                   | CmsUnavailableError path unchanged        | ⏳     |

---

## 4. Technical Design

### 4.1 Files to Create or Modify

| File                                                              | Action | Notes                                                                            |
| ----------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------- |
| `messages/en.json`                                                | Create | All static strings from `src/content/*.ts`, namespaced                           |
| `messages/sv.json`                                                | Create | Same keys, all values = `"sve_" + English value`                                 |
| `src/i18n/request.ts`                                             | Create | next-intl `getRequestConfig`                                                     |
| `src/middleware.ts`                                               | Create | next-intl locale routing middleware                                              |
| `next.config.ts`                                                  | Modify | Wrap with `withNextIntl(...)`                                                    |
| `src/app/[locale]/layout.tsx`                                     | Create | Replaces `src/app/layout.tsx` — sets `lang`, provides `NextIntlClientProvider`   |
| `src/app/[locale]/page.tsx` + all routes                          | Create | All existing routes move under `[locale]`                                        |
| `src/lib/cms/client.ts`                                           | Modify | Add `locale` to `GetContentOptions`, append query param                          |
| `src/lib/cms/article/index.ts`                                    | Modify | Accept and forward `locale` param                                                |
| `src/lib/cms/workshop/index.ts`                                   | Modify | Accept and forward `locale` param                                                |
| `cms/src/api/news-article/content-types/news-article/schema.json` | Modify | `"i18n": true` on content type + `"localized": true` on every translatable field |
| `cms/src/api/workshop/content-types/workshop/schema.json`         | Modify | Same as above                                                                    |
| Language selector component                                       | Modify | Make locale switcher functional (`/` ↔ `/sv/`)                                   |
| `.env.example` (Autocap)                                          | Modify | Add `NEXT_PUBLIC_ENABLE_SV=false`                                                |
| `.env.local` (Autocap)                                            | Modify | Add `NEXT_PUBLIC_ENABLE_SV=false`                                                |

### 4.2 App Directory Restructure

```
Before                              After
─────────────────────────────────── ────────────────────────────────────────
src/app/layout.tsx                  src/app/layout.tsx  (minimal shell)
src/app/page.tsx                    src/app/[locale]/layout.tsx
src/app/about/page.tsx              src/app/[locale]/page.tsx
src/app/news/page.tsx               src/app/[locale]/about/page.tsx
src/app/news/[slug]/page.tsx        src/app/[locale]/news/page.tsx
... all other routes                src/app/[locale]/news/[slug]/page.tsx
                                    ... all other routes under [locale]
src/app/api/  (stays at root — excluded from middleware matcher)
```

### 4.3 next-intl Setup (pseudocode)

**`src/i18n/request.ts`:**

```
getRequestConfig:
  locale = requestLocale or fallback 'en'
  assert locale in ['en', 'sv']
  return { locale, messages: import(`messages/${locale}.json`) }
```

**`src/middleware.ts`:**

```
createMiddleware({
  locales: ['en', 'sv'],
  defaultLocale: 'en',
  localePrefix: 'as-needed'   // English at '/', Swedish at '/sv/...'
})
matcher: exclude _next, api, static files
```

**`messages/en.json` structure:**

```
{
  "homepage": { "hero.headline": "...", "hero.cta1Text": "...", ... },
  "about": { ... },
  "entrepreneurs": { ... },
  "investors": { ... },
  "team": { ... },
  "common": { "nav.home": "Home", "nav.about": "About", ... }
}
```

**`messages/sv.json` rule:**
Every value = `"swe_" + <English value>` (e.g. `"swe_Home"`, `"swe_About us"`).
Purpose: proves the correct key is being picked up without hiding the English
meaning. Client replaces `swe_*` values with real Swedish. Arrays expanded to
indexed keys (`kpis.0.label`, `kpis.1.label`, …). Numeric-only data props not
extracted.

### 4.4 CMS Client Locale Changes

**`client.ts` — add to `GetContentOptions`:**

```
locale?: string   // defaults to 'en'
```

Inside `getContent`: `url.searchParams.set('locale', options.locale ?? 'en')`

**Article and Workshop wrappers:**

```
getArticlesContent(revalidate?, locale?) — forwards locale to getContent
getWorkshopsContent(revalidate?, locale?) — forwards locale to getContent
```

**Page usage pattern:**

```
// src/app/[locale]/news/page.tsx
const { locale } = await params
const articles = await getArticlesContent(REVALIDATE_LOW, locale)
```

**Contact wrapper** — no change, no locale param.

### 4.5 Strapi Schema Changes

For every content type that has translatable content (`news-article`, `workshop`
and any other Strapi-managed types):

**Content type level** — enable i18n on the collection:

```json
"pluginOptions": {
  "i18n": { "localized": true }
}
```

**Per translatable field** — mark each field that the client needs to translate:

```json
"title": {
  "type": "string",
  "pluginOptions": { "i18n": { "localized": true } }
}
```

Fields that are NOT locale-specific (e.g. `slug`, `publishDate`, numeric
values, relations) do NOT get `"localized": true` — they are shared across
locales.

Existing entries become `en`-locale entries automatically on Strapi restart —
no data loss, no manual migration needed.

### 4.6 Language Selector (functional)

The existing language selector component renders a dropdown/toggle. It needs to:

- Detect current locale from `useLocale()` (next-intl)
- Render links using `usePathname()` + next-intl's locale-aware path helpers
- English option → strips `/sv` prefix (navigates to `/...`)
- Swedish option → adds `/sv` prefix (navigates to `/sv/...`)
- When `NEXT_PUBLIC_ENABLE_SV` is `"false"`, hide the selector entirely

### 4.7 NEXT_PUBLIC_ENABLE_SV Feature Flag

Added to `.env.example` and `.env.local` as `NEXT_PUBLIC_ENABLE_SV=false`.

In middleware: if `NEXT_PUBLIC_ENABLE_SV !== "true"`, exclude `sv` from the
supported locales array so `/sv/...` returns 404 and the selector is hidden.

When client is ready to go live with Swedish: set `NEXT_PUBLIC_ENABLE_SV=true`
on the hosting platform.

---

## 5. Open Questions

| #    | Question                                                                                                                                                                                                 |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| OQ-1 | Long-form prose content (`testimonials.ts`, `investors-case.ts`) — extract to messages JSON or migrate to Strapi in a later phase? Recommend: messages JSON for v1, Strapi migration as separate ticket. |

---

## 6. Sign-off

| Role   | Name           | Date       | Approved |
| ------ | -------------- | ---------- | -------- |
| Author | Amar Smajlovic | 2026-05-08 | [ ]      |
