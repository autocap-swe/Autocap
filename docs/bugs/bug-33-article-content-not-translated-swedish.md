# Bug Post-Mortem: Bug-33 — Article content not translated after switching to Swedish

**Date:** 2026-05-28
**Severity:** High
**Status:** Fixed

---

## 1. Summary

When a user opened an article in English and switched to Swedish using the global language selector, the article detail page continued showing English content instead of the Swedish translation.

---

## 2. Root Cause (5 Whys)

1. **Why** was English content shown after switching to Swedish?  
   → The `getArticleBySlugContent` fell back to English because the CMS returned no Swedish article for the given slug.

2. **Why** did the CMS return no Swedish article?  
   → The URL still used the English slug (e.g. `/sv/news/english-slug`). If the Swedish version has a different slug, the CMS finds nothing and falls back via the `!results[0] && locale !== 'en'` guard.

3. **Why** did the URL use the English slug after switching?  
   → `LanguageSelector` used `next/navigation`'s `useRouter` and `usePathname` and manually constructed the Swedish URL as `` `/sv${pathname}` ``. This bypasses next-intl's locale-aware routing.

4. **Why** was `next/navigation` used instead of `@/i18n/navigation`?  
   → The language switcher was built as a Phase 1 visual component (no navigation) and Phase 2 navigation was added using the raw Next.js router instead of next-intl's recommended routing utilities.

5. **Why** didn't `generateStaticParams` catch this at build time?  
   → It only fetched English article slugs, so Swedish-specific slugs were never pre-rendered. Any slug-mismatch between locales silently fell back to English at render time.

---

## 3. Fix

**File:** `src/components/layout/LanguageSelector.tsx`

- Replaced `import { useRouter, usePathname } from 'next/navigation'` with `import { useRouter, usePathname } from '@/i18n/navigation'`
- Replaced the manual `/sv${pathname}` / `pathname.slice(3)` path manipulation with a single next-intl call: `router.push(pathname, { locale: lang })`

This ensures next-intl's router correctly resolves the locale-prefixed URL and updates the locale context for all client components.

**File:** `src/app/[locale]/news/[slug]/page.tsx`

- Updated `generateStaticParams` to fetch both English and Swedish article slugs, ensuring all locale-specific slugs are pre-rendered.

---

## 4. Tests Added

- `src/components/layout/LanguageSelector.test.tsx` — "Regression: Bug-33 — article locale not updated on language switch"
  - Verifies `router.push` is called with `{ locale: 'sv' }` via next-intl, not with a manually prefixed `/sv/` path.
- Phase 2 navigation tests for `AC-006` replacing the Phase 1 "non-functional" tests.
