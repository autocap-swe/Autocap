# Bug Post-Mortem: Bug-34 — Web app breaks when switching article language from Swedish to English

**Date:** 2026-05-28
**Severity:** High
**Status:** Fixed

---

## 1. Summary

When a user opened a Swedish article and switched the language to English using the global language selector, the application displayed an error message and the web app functionality broke.

---

## 2. Root Cause (5 Whys)

1. **Why** did the app break when switching from Swedish to English?  
   → Navigating from `/sv/news/slug` to `/news/slug` (after stripping `/sv`) via `next/navigation`'s `router.push` bypasses next-intl's middleware. Without the middleware rewriting `/news/slug` to the internal `/en/news/slug` route, Next.js's `[locale]` segment resolves `locale='news'` (the first path segment), which is invalid.

2. **Why** did the middleware not process the request?  
   → `next/navigation`'s `router.push` sends an RSC navigation request. The middleware matcher `/((?!_next|api|.*\\..*).*)` does not guarantee the next-intl rewrite fires before the App Router resolves the `[locale]` segment for RSC requests when the raw path doesn't include a locale prefix.

3. **Why** did `locale='news'` cause an error?  
   → `setRequestLocale('news')` is called in the layout with a value that next-intl does not recognise as a valid locale, throwing an unhandled error that the `error.tsx` boundary catches and displays.

4. **Why** was `next/navigation`'s router used for the stripping?  
   → Same root cause as Bug-33: the Phase 2 navigation was added using raw Next.js router with manual `pathname.startsWith('/sv')` string manipulation instead of next-intl's locale-aware `router.push(pathname, { locale })`.

5. **Why** wasn't this caught before?  
   → The `LanguageSelector.test.tsx` tests were testing Phase 1 (non-functional) behaviour and the `next/navigation` router was mocked at the `next/navigation` module level, hiding the wrong import at test time.

---

## 3. Fix

**File:** `src/components/layout/LanguageSelector.tsx`

- Replaced `import { useRouter, usePathname } from 'next/navigation'` with `import { useRouter, usePathname } from '@/i18n/navigation'`
- Removed the manual path stripping (`pathname.startsWith('/sv') ? pathname.slice(3) : pathname`)
- Replaced with: `router.push(pathname, { locale: lang })`

next-intl's `usePathname` always returns the path without any locale prefix, so no manual stripping is needed. next-intl's `useRouter` applies the locale prefix (or absence thereof) correctly for both `'en'` and `'sv'` targets.

---

## 4. Tests Added

- `src/components/layout/LanguageSelector.test.tsx` — "Regression: Bug-34 — app breaks when switching article from Swedish to English"
  - Verifies that switching from `locale='sv'` to English calls `router.push(path, { locale: 'en' })` via next-intl rather than manually stripping the `/sv` prefix.
