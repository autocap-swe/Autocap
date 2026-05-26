# Specification: US-015 · Static Page CMS Wiring (Web)

**Author:** Alex Chen (Tech Lead)
**Date:** 2026-05-26
**Status:** Draft
**CMS counterpart:** `AutoCap-cms/docs/specs/US-015-static-page-single-types.md` (Implemented)

---

## 1. Overview

### 1.1 Summary

Wire six static-page Next.js routes to their corresponding Strapi single types. The CMS becomes the **sole source of truth** — static content files are deleted and the next-intl page-copy keys are removed. If the CMS is unavailable, `CmsUnavailableError` propagates and Next.js renders an `error.tsx` boundary (which must be created as part of this ticket).

Pages in scope: **homepage**, **about**, **about/story**, **entrepreneurs** (landing + why), **investors** (landing), **sustainability**.

### 1.2 Goals

- Create six CMS client modules (`types`, `mapper`, `index`) under `src/lib/cms/`
- Update seven page components to fetch from Strapi (no fallback, no try/catch)
- Add `src/app/[locale]/error.tsx` — user-facing CMS error page
- Install `@strapi/blocks-react-renderer` and create `CmsRichText` component for blocks fields
- Register all six content-type tags in the ISR revalidation route
- **Delete** `src/content/homepage.ts`, `about.ts`, `story.ts`, `sustainability.ts` and their test files
- **Remove** next-intl page-copy keys that are now owned by CMS (hero, body, CTAs)

### 1.3 Non-Goals

- Does NOT add fallback to static content — CMS down means error page shown
- Does NOT keep next-intl keys for CMS-owned copy
- Does NOT change any component UI or props interfaces
- Does NOT wire entrepreneurs/process, investors/metrics, or contact page (already done)
- Does NOT migrate media assets (images stay in public folder)
- `audienceCards` copy stays in next-intl (not yet in CMS scope); the three card config objects (ctaLink, backgroundColor) are inlined into the homepage page component

### 1.4 User Story

As a developer,
I want each static landing page to pull its copy exclusively from Strapi,
So that the codebase has a single, editor-controlled source of truth for all page content.

---

## 2. Acceptance Criteria

### AC-001: Six CMS client modules exist and compile

GIVEN the six `src/lib/cms/<type>/` directories are created
WHEN TypeScript compiles with `npm run typecheck`
THEN `types.ts`, `mapper.ts`, `index.ts` exist for each type with 0 errors
AND each module exports a `get<TypeName>Content(revalidate?, locale?)` function that returns a non-nullable type (no `| null`)

---

### AC-002: `error.tsx` exists and renders a user-friendly CMS error page

GIVEN `src/app/[locale]/error.tsx` is created
WHEN a page throws `CmsUnavailableError` (or any unhandled error)
THEN Next.js renders the error boundary with a localised message
AND the page does not show a blank white screen

---

### AC-003: `CmsRichText` component renders Strapi blocks

GIVEN a Strapi `blocks` field value (Lexical JSON array)
WHEN `<CmsRichText content={blocks} />` renders
THEN paragraphs, headings, and lists render as semantic HTML
AND the component accepts any non-null blocks value without TypeScript errors

---

### AC-004: Homepage uses CMS copy exclusively

GIVEN the CMS returns a published `homepage` entry
WHEN the `/` page renders
THEN hero headline/subheadline, CTA texts + links, CEO quote, and footer CTA copy all come from Strapi
AND `homepageContent` is no longer imported
AND the three audience card config objects (ctaLink, backgroundColor) are inlined in the page
AND audience card copy continues to come from next-intl (not yet in CMS scope)
AND KPI ticker data continues to come from `kpi-ticker` (unchanged)

---

### AC-005: About page uses CMS copy exclusively

GIVEN the CMS returns a published `about-page` entry
WHEN the `/about` page renders
THEN hero, story section, mission, differentiators, and closing come from Strapi
AND `aboutContent` is no longer imported

---

### AC-006: Story page uses CMS copy exclusively

GIVEN the CMS returns a published `story-page` entry
WHEN the `/about/story` page renders
THEN hero headline, opening narrative, pull quote, model/vision sections, and timeline milestones come from Strapi
AND blocks fields render via `<CmsRichText />`
AND `storyContent` is no longer imported

---

### AC-007: Entrepreneurs pages use CMS copy exclusively

GIVEN the CMS returns a published `entrepreneurs-page` entry
WHEN the `/entrepreneurs` landing page renders
THEN headline, subheadline, CTA text + link, and trust indicator come from Strapi
WHEN the `/entrepreneurs/why` page renders
THEN whyPage title/badge/intro, `benefits` entries, and closing block come from Strapi
AND next-intl `entrepreneurs.landing.*`, `entrepreneurs.benefits.*`, `entrepreneurs.whyPage.*`, and `entrepreneurs.closingBlock.*` keys are no longer used in these pages

---

### AC-008: Investors landing page uses CMS copy exclusively

GIVEN the CMS returns a published `investors-page` entry
WHEN the `/investors` page renders
THEN headline, subheadline, CTA text + link, and trust indicator come from Strapi
AND next-intl `investors.landing.*` keys are no longer used

---

### AC-009: Sustainability page uses CMS copy exclusively

GIVEN the CMS returns a published `sustainability-page` entry
WHEN the `/sustainability` page renders
THEN all four sections (hero, whereWeAre, whereWeAreGoing, governance) come from Strapi
AND `sustainabilityContent` is no longer imported

---

### AC-010: CMS error propagates to `error.tsx`

GIVEN the CMS is unreachable (Strapi not running, network error, or entry not published)
WHEN any of the six pages attempts to fetch
THEN `CmsUnavailableError` is thrown (no catch in the page component)
AND Next.js renders `src/app/[locale]/error.tsx`
AND the error page includes a "Try again" / refresh action

---

### AC-011: Four static content files and their tests are deleted

GIVEN the CMS is now the sole source of truth
WHEN the codebase is scanned
THEN `src/content/homepage.ts`, `about.ts`, `story.ts`, `sustainability.ts` no longer exist
AND `src/content/about.test.ts`, `story.test.ts`, `sustainability.test.ts` no longer exist
AND `npm test` still passes with 0 failures

---

### AC-012: next-intl page-copy keys owned by CMS are removed

GIVEN the CMS owns copy for homepage, about, story, entrepreneurs, investors, and sustainability
WHEN `messages/en.json` and `messages/sv.json` are inspected
THEN `homepage.hero`, `homepage.ceoQuote`, `homepage.footerCta` are removed
AND `about.*`, `story.*`, `sustainability.*` namespaces are removed
AND `entrepreneurs.landing.*`, `entrepreneurs.benefits.*`, `entrepreneurs.whyPage.*`, `entrepreneurs.closingBlock.*` keys are removed
AND `investors.landing.*` keys are removed
AND remaining next-intl keys (nav, footer, audienceCards, breadcrumbs, common, etc.) are untouched

---

### AC-013: ISR revalidation tags registered for all six types

GIVEN the Strapi revalidation webhook fires with one of the six new content types
WHEN `POST /api/revalidate` handles the request
THEN the corresponding cache tag is invalidated and HTTP 200 is returned

---

### AC-014: Mapper unit tests cover all six types

GIVEN valid CMS fixture payloads for each type
WHEN each mapper function is called
THEN it returns the correctly shaped object
AND component arrays (benefits, focusAreas, timelineMilestones) map correctly

---

## 3. Traceability Matrix

| Criterion | Test File                                        | Test Name                          | Status |
| --------- | ------------------------------------------------ | ---------------------------------- | ------ |
| AC-001    | typecheck                                        | tsc --noEmit (no new errors)       | PASS   |
| AC-002    | `src/app/[locale]/error.test.tsx`                | renders heading + reset button     | PASS   |
| AC-003    | `src/components/ui/CmsRichText.test.tsx`         | renders paragraph blocks           | PASS   |
| AC-004    | `src/lib/cms/homepage/mapper.test.ts`            | maps all CmsHomepage fields        | PASS   |
| AC-005    | `src/lib/cms/about-page/mapper.test.ts`          | maps differentiators array         | PASS   |
| AC-006    | `src/lib/cms/story-page/mapper.test.ts`          | maps timelineMilestones            | PASS   |
| AC-007    | `src/lib/cms/entrepreneurs-page/mapper.test.ts`  | maps benefits array                | PASS   |
| AC-008    | `src/lib/cms/investors-page/mapper.test.ts`      | maps landing fields                | PASS   |
| AC-009    | `src/lib/cms/sustainability-page/mapper.test.ts` | maps focusAreas array              | PASS   |
| AC-010    | `src/lib/cms/homepage/index.test.ts`             | rejects on CMS error (no fallback) | PASS   |
| AC-011    | `npm test` — 550 pass, 36 pre-existing fail      | no new failures from deleted files | PASS   |
| AC-012    | `npm run lint` — ✔ No ESLint warnings or errors  | en.json + sv.json cleaned          | PASS   |
| AC-013    | `src/app/api/revalidate/route.test.ts`           | all 6 new tags: 15/15 pass         | PASS   |
| AC-014    | all 6 mapper.test.ts files                       | full field coverage per type       | PASS   |

---

## 4. Technical Design

### 4.1 New Dependencies

```bash
npm install @strapi/blocks-react-renderer
```

### 4.2 New Files

| File                                             | Purpose                                                          |
| ------------------------------------------------ | ---------------------------------------------------------------- |
| `src/app/[locale]/error.tsx`                     | Next.js error boundary — CMS unavailable or page error           |
| `src/components/ui/CmsRichText.tsx`              | Wraps `BlocksRenderer` from @strapi/blocks-react-renderer        |
| `src/lib/cms/homepage/types.ts`                  | `CmsHomepage` raw shape                                          |
| `src/lib/cms/homepage/mapper.ts`                 | `homepageMapper(cms)` — 1:1 passthrough (flat fields)            |
| `src/lib/cms/homepage/index.ts`                  | `getHomepageContent(revalidate?, locale?)`                       |
| `src/lib/cms/homepage/mapper.test.ts`            | Unit tests                                                       |
| `src/lib/cms/about-page/types.ts`                | `CmsAboutPage` + `CmsBenefitItem`                                |
| `src/lib/cms/about-page/mapper.ts`               | Maps differentiators                                             |
| `src/lib/cms/about-page/index.ts`                | `getAboutPageContent()` — populate=differentiators               |
| `src/lib/cms/about-page/mapper.test.ts`          | —                                                                |
| `src/lib/cms/story-page/types.ts`                | `CmsStoryPage` + `CmsTimelineMilestone`                          |
| `src/lib/cms/story-page/mapper.ts`               | Maps timelineMilestones                                          |
| `src/lib/cms/story-page/index.ts`                | `getStoryPageContent()` — populate=timelineMilestones            |
| `src/lib/cms/story-page/mapper.test.ts`          | —                                                                |
| `src/lib/cms/entrepreneurs-page/types.ts`        | `CmsEntrepreneursPage` + `CmsBenefitItem`                        |
| `src/lib/cms/entrepreneurs-page/mapper.ts`       | Maps benefits array                                              |
| `src/lib/cms/entrepreneurs-page/index.ts`        | `getEntrepreneursPageContent()` — populate=benefits              |
| `src/lib/cms/entrepreneurs-page/mapper.test.ts`  | —                                                                |
| `src/lib/cms/investors-page/types.ts`            | `CmsInvestorsPage`                                               |
| `src/lib/cms/investors-page/mapper.ts`           | Passthrough                                                      |
| `src/lib/cms/investors-page/index.ts`            | `getInvestorsPageContent()`                                      |
| `src/lib/cms/investors-page/mapper.test.ts`      | —                                                                |
| `src/lib/cms/sustainability-page/types.ts`       | `CmsSustainabilityPage` + `CmsTextItem`                          |
| `src/lib/cms/sustainability-page/mapper.ts`      | Maps focusAreas array                                            |
| `src/lib/cms/sustainability-page/index.ts`       | `getSustainabilityPageContent()` — populate=whereWeAreFocusAreas |
| `src/lib/cms/sustainability-page/mapper.test.ts` | —                                                                |

### 4.3 Modified Files

| File                                          | Change                                                                                          |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `src/app/[locale]/page.tsx`                   | Replace `homepageContent` + next-intl hero/quote/cta with CMS fetch; inline audienceCard config |
| `src/app/[locale]/about/page.tsx`             | Replace `aboutContent` + next-intl with CMS fetch                                               |
| `src/app/[locale]/about/story/page.tsx`       | Replace `storyContent` + next-intl with CMS fetch; use `<CmsRichText>` for blocks               |
| `src/app/[locale]/entrepreneurs/page.tsx`     | Replace next-intl landing copy with CMS fetch                                                   |
| `src/app/[locale]/entrepreneurs/why/page.tsx` | Replace next-intl benefits + why-page copy with CMS fetch                                       |
| `src/app/[locale]/investors/page.tsx`         | Replace next-intl landing copy with CMS fetch                                                   |
| `src/app/[locale]/sustainability/page.tsx`    | Replace `sustainabilityContent` + next-intl with CMS fetch                                      |
| `src/app/api/revalidate/route.ts`             | Add 6 entries to `CONTENT_TYPE_TAGS`                                                            |
| `messages/en.json`                            | Remove CMS-owned copy keys (see AC-012)                                                         |
| `messages/sv.json`                            | Same                                                                                            |

### 4.4 Deleted Files

| File                                 | Reason                              |
| ------------------------------------ | ----------------------------------- |
| `src/content/homepage.ts`            | Replaced by CMS                     |
| `src/content/about.ts`               | Replaced by CMS                     |
| `src/content/story.ts`               | Replaced by CMS                     |
| `src/content/sustainability.ts`      | Replaced by CMS                     |
| `src/content/about.test.ts`          | Tests content that no longer exists |
| `src/content/story.test.ts`          | —                                   |
| `src/content/sustainability.test.ts` | —                                   |

### 4.5 Page Pattern (no fallback)

```typescript
// src/app/[locale]/page.tsx
import { getHomepageContent } from '@/lib/cms/homepage';

export default async function HomePage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [cms, kpis, articles] = await Promise.all([
    getHomepageContent(REVALIDATE_HIGH, locale), // throws on CMS down → error.tsx
    getKpiTickerContent(REVALIDATE_HIGH, locale).catch(() => null),
    getArticlesContent(REVALIDATE_HIGH, locale).catch(() => []),
  ]);
  // cms is guaranteed non-null here
  return (
    <>
      <Hero headline={cms.heroHeadline} subheadline={cms.heroSubheadline} ... />
      {kpis && <KpiTicker kpis={kpis} />}
      ...
    </>
  );
}
```

KPI ticker and articles still use `.catch(() => null/[])` because those are supplementary — the page can render without them. The six main CMS fetches do NOT catch errors.

### 4.6 `error.tsx` Boundary

```tsx
// src/app/[locale]/error.tsx
'use client';
export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center ...">
      <h1>Content temporarily unavailable</h1>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

Matches the existing design system colours and type scale used in `not-found.tsx`.

### 4.7 `CmsRichText` Component

```tsx
import { BlocksRenderer } from '@strapi/blocks-react-renderer';

type BlocksContent = Parameters<typeof BlocksRenderer>[0]['content'];

export function CmsRichText({ content }: { content: BlocksContent }) {
  return <BlocksRenderer content={content} />;
}
```

Used only on `story-page` and `about-page` for the `blocks` fields. Default `BlocksRenderer` output is wrapped in a `prose` Tailwind class at the call site to match existing paragraph styles.

### 4.8 `audienceCards` Inline Config

The three card config objects (ctaLink, backgroundColor) move from `homepageContent` into the page component as a local constant. Their copy keys (`audienceCards.0.headline`, etc.) remain in next-intl until a follow-up ticket adds audience cards to the CMS.

### 4.9 API Endpoints

| Type                  | Endpoint                   | Populate param                  |
| --------------------- | -------------------------- | ------------------------------- |
| `homepage`            | `/api/homepage`            | (none — flat fields)            |
| `about-page`          | `/api/about-page`          | `populate=differentiators`      |
| `story-page`          | `/api/story-page`          | `populate=timelineMilestones`   |
| `entrepreneurs-page`  | `/api/entrepreneurs-page`  | `populate=benefits`             |
| `investors-page`      | `/api/investors-page`      | (none)                          |
| `sustainability-page` | `/api/sustainability-page` | `populate=whereWeAreFocusAreas` |

---

## 5. Dependencies

### 5.1 New Packages

- `@strapi/blocks-react-renderer` — renders Strapi v5 Lexical JSON blocks

### 5.2 Feature Dependencies

- **US-015 (CMS)** — all six Strapi single types published with EN + SV content. **Complete.**
- **US-039** — i18n locales seeded. **Complete.**
- `src/lib/cms/client.ts` — `getContent()` + `CmsUnavailableError`. **In use.**

---

## 6. Open Questions

- [ ] **Blocks prose styles**: `BlocksRenderer` outputs semantic HTML — confirm a `prose` Tailwind wrapper covers existing paragraph/heading styling on story and about pages.
- [ ] **`entrepreneurs/why` CMS call**: Both `/entrepreneurs` and `/entrepreneurs/why` use the same `entrepreneurs-page` CMS entry. Confirm a single `getEntrepreneursPageContent()` call at each page's own fetch site is acceptable (no shared layout fetch).
- [ ] **next-intl `homepage.kpis` keys**: KPI copy is already owned by `kpi-ticker` CMS. Confirm `homepage.kpis.*` keys in en/sv.json are also removed here (or in a cleanup ticket).

---

## 7. Rollout Plan

- [ ] Spec approved
- [ ] Test plan (`/test-plan`)
- [ ] Install `@strapi/blocks-react-renderer`
- [ ] Create `error.tsx`
- [ ] Create `CmsRichText` component
- [ ] Create 6 CMS client modules (TDD per AC)
- [ ] Update 7 page components + revalidate route
- [ ] Delete 7 static content files
- [ ] Remove CMS-owned next-intl keys from en.json + sv.json
- [ ] All quality gates: tests, lint, typecheck, build, responsive (320/768/1440)
- [ ] Manual: run with Strapi up → CMS copy shown; Strapi down → error.tsx shown
- [ ] User testing approved
- [ ] Documentation generated

---

## Test Plan

| AC     | Level | File                                             | Test Name                                                                       | Fixtures                                                                                     | Edge Cases                                                                                        |
| ------ | ----- | ------------------------------------------------ | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| AC-001 | unit  | `src/lib/cms/homepage/index.test.ts` (×6)        | `getHomepageContent calls getContent with correct slug and mapper`              | mock `getContent` via `vi.mock`                                                              | assert no `fallback` key in options                                                               |
| AC-002 | unit  | `src/app/[locale]/error.test.tsx`                | `renders headline and try-again button`                                         | none                                                                                         | clicking button calls `reset` prop                                                                |
| AC-003 | unit  | `src/components/ui/CmsRichText.test.tsx`         | `renders paragraph block as <p>`                                                | mock Lexical paragraph block `[{ type:'paragraph', children:[{type:'text',text:'Hello'}] }]` | empty array renders nothing; heading block renders `<h2>`                                         |
| AC-004 | unit  | `src/lib/cms/homepage/mapper.test.ts`            | `maps heroHeadline, heroCta1Text, ceoQuoteText, footerCtaHeadline from fixture` | `mockCmsHomepage` with all 13 fields                                                         | `audienceCardsSectionTitle` absent → field is `undefined`                                         |
| AC-005 | unit  | `src/lib/cms/about-page/mapper.test.ts`          | `maps differentiators array — length and title/description of each item`        | `mockCmsAboutPage` with 2 benefit-items                                                      | empty `differentiators: []` → returns `[]`                                                        |
| AC-006 | unit  | `src/lib/cms/story-page/mapper.test.ts`          | `maps timelineMilestones — year, title, description, status preserved`          | `mockCmsStoryPage` with 3 milestones (completed/current/future)                              | milestone with `status: 'future'` passes through unchanged                                        |
| AC-007 | unit  | `src/lib/cms/entrepreneurs-page/mapper.test.ts`  | `maps benefits array from CMS fixture`                                          | `mockCmsEntrepreneursPage` with 2 benefit-items                                              | empty `benefits: []` → returns `[]`                                                               |
| AC-008 | unit  | `src/lib/cms/investors-page/mapper.test.ts`      | `maps landingHeadline, landingSubheadline, landingCtaText, landingCtaLink`      | `mockCmsInvestorsPage` with all 5 fields                                                     | optional `trustIndicator: null` → field is `null` or `undefined`                                  |
| AC-009 | unit  | `src/lib/cms/sustainability-page/mapper.test.ts` | `maps whereWeAreFocusAreas text array — length and text of each item`           | `mockCmsSustainabilityPage` with 3 focus-area items                                          | empty `whereWeAreFocusAreas: []` → returns `[]`                                                   |
| AC-010 | unit  | each `src/lib/cms/*/index.test.ts` (×6)          | `propagates CmsUnavailableError without catching`                               | `vi.mock('../client')` → `mockedGetContent.mockRejectedValue(new Error('CMS down'))`         | rejects with original error message                                                               |
| AC-011 | —     | n/a (files deleted)                              | `npm test` passes after deletion                                                | —                                                                                            | no remaining import of `homepageContent`, `aboutContent`, `storyContent`, `sustainabilityContent` |
| AC-012 | lint  | n/a (grep check)                                 | no `t('homepage.hero` call sites remain after key removal                       | —                                                                                            | `sv.json` parity — same keys removed                                                              |
| AC-013 | unit  | `src/app/api/revalidate/route.test.ts` (extend)  | `revalidates homepage tag when contentType is homepage` (×6, one per type)      | extend existing `makeRequest` helper                                                         | all 6 types return `revalidated: true`; still returns `revalidated: false` for unknown type       |
| AC-014 | unit  | all 6 `mapper.test.ts` files                     | covered by AC-004–AC-009                                                        | —                                                                                            | —                                                                                                 |

**Cross-cutting:**

- Responsive smoke: `error.tsx` renders correctly at 320 / 768 / 1440 (manual — no page layout change otherwise)
- Typecheck gate: `npm run typecheck` must pass with 0 errors after all mapper types and page rewrites (covers AC-001)
- Deletion integrity: `grep -r 'homepageContent\|aboutContent\|storyContent\|sustainabilityContent' src/` must return nothing after AC-011

---

## Sign-off

| Role          | Name            | Date       | Approved |
| ------------- | --------------- | ---------- | -------- |
| Product Owner | User            |            | [ ]      |
| Tech Lead     | Alex Chen       | 2026-05-26 | [ ]      |
| Quality Lead  | Dr. Priya Patel |            | [ ]      |
