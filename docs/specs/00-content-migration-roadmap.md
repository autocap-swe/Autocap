# Content Migration Roadmap — `src/content/*.ts` → Strapi

**Author:** Amar Smajlovic (Full Stack Dev)
**Date:** 2026-05-05
**Status:** Approved (architecture + ordering); per-page specs pending

---

## 1. Architecture decisions (locked)

1. **No runtime fallback.** Pages call `getContent` → render. On failure, Next.js
   ISR keeps the last-known-good cached HTML serving (default behaviour). Real
   outages bubble to `error.tsx`. Hardcoded `src/content/*.ts` files **are
   deleted page-by-page** as each one migrates.
2. **One generic client** at `src/lib/cms/client.ts` (`getContent` —
   `fallback` option _removed_; only `params`, `revalidate`, optional `mapper`).
3. **One folder per page** under `src/lib/cms/<page>/` with `index.ts`,
   `mapper.ts`, `types.ts`, `index.test.ts`.
4. **Pages call `get<Page>Content()`**, never the generic directly.
5. **Public read for every CMS-exposed content-type** (US-005). Documented as a
   per-content-type checklist in Section 6 below — runs once per migration.

> Spec `cms-integration.md` is being revised to match decision #1 (no fallback)
> and #5 (US-005 checklist). The pre-revision contact pilot is the only place
> that still has fallback wiring; it will be cleaned up as part of the contact
> migration in Phase A below.

---

## 2. Source of truth

- Frontend shapes: `Autocap/src/content/*.ts` (TypeScript interfaces define
  exactly what each page expects).
- Endpoints + data semantics: `Autocap/docs/MOCKED_DATA_STRUCTURE.md`
  (already documents the migration target shapes).
- Prototype-only assumptions to revisit (mock state, hardcoded admin email,
  no pagination, etc.): `MOCKED_DATA_STRUCTURE.md` Section "Mock-Specific
  Assumptions to Revisit".

---

## 3. Strapi content-types to create

13 content-types total, plus 6 reusable components and 1 dynamic-zone for
news article bodies.

### 3.1 Single-types (one entry each — "page" content)

| #   | Strapi UID                                     | Slug                  | Frontend shape                             | Replaces                               |
| --- | ---------------------------------------------- | --------------------- | ------------------------------------------ | -------------------------------------- |
| 1   | `api::contact-page.contact-page`               | `contact-page`        | `ContactContent`                           | `src/content/contact.ts` ✅ scaffolded |
| 2   | `api::homepage.homepage`                       | `homepage`            | `HomepageContent`                          | `src/content/homepage.ts`              |
| 3   | `api::about-page.about-page`                   | `about-page`          | `AboutContent`                             | `src/content/about.ts`                 |
| 4   | `api::story-page.story-page`                   | `story-page`          | `StoryContent`                             | `src/content/story.ts`                 |
| 5   | `api::entrepreneurs-page.entrepreneurs-page`   | `entrepreneurs-page`  | `EntrepreneursContent`                     | `src/content/entrepreneurs.ts`         |
| 6   | `api::investors-page.investors-page`           | `investors-page`      | `InvestorsContent`                         | `src/content/investors.ts`             |
| 7   | `api::investors-case-page.investors-case-page` | `investors-case-page` | `InvestorsCaseContent`                     | `src/content/investors-case.ts`        |
| 8   | `api::sustainability-page.sustainability-page` | `sustainability-page` | `sustainabilityContent`                    | `src/content/sustainability.ts`        |
| 9   | `api::privacy-policy.privacy-policy`           | `privacy-policy`      | `PrivacyPolicyContent`                     | `src/content/privacyPolicy.ts`         |
| 10  | `api::media-kit-page.media-kit-page`           | `media-kit-page`      | `MediaKitContent` (page-level fields only) | `src/content/media-kit.ts`             |

### 3.2 Collection-types (many entries each — real entities)

| #   | Strapi UID                           | Slug               | Frontend shape  | Replaces                       | Relations                                                                      |
| --- | ------------------------------------ | ------------------ | --------------- | ------------------------------ | ------------------------------------------------------------------------------ |
| 11  | `api::workshop.workshop`             | `workshops`        | `Workshop`      | `src/content/workshops.ts`     | referenced by news articles & testimonials                                     |
| 12  | `api::news-article.news-article`     | `news-articles`    | `NewsArticle`   | `src/content/news.ts`          | belongsTo `Author` (team-member); manyToMany `Tag`; oneToMany related-articles |
| 13  | `api::team-member.team-member`       | `team-members`     | `TeamMember`    | `src/content/team.ts`          | sorted by `order`; category enum (management/board)                            |
| 14  | `api::testimonial.testimonial`       | `testimonials`     | `Testimonial`   | `src/content/testimonials.ts`  | weak link to workshop via `workshopName`                                       |
| 15  | `api::media-asset.media-asset`       | `media-assets`     | `MediaAsset`    | nested in media-kit categories | belongsTo `MediaCategory`                                                      |
| 16  | `api::media-category.media-category` | `media-categories` | `AssetCategory` | nested in media-kit            | hasMany `MediaAsset`                                                           |

### 3.3 Components (reusable field groups)

| Component UID               | Used in                                  | Fields                                                                                         |
| --------------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `shared.cta`                | many                                     | `text: string`, `link: string`                                                                 |
| `shared.kpi`                | homepage, investors, investors-case      | `value: integer`, `label: string`, `prefix?: string`, `suffix?: string`                        |
| `shared.timeline-milestone` | about, story                             | `year: string`, `title: string`, `description: text`, `status: enum(completed,current,future)` |
| `shared.pillar`             | investors, investors-case, entrepreneurs | `title: string`, `description: text`, `icon?: string`                                          |
| `shared.privacy-section`    | privacy-policy                           | `id: string`, `title: string`, `content: text[]` (use rich text)                               |
| `shared.form-labels`        | contact + future contact-style pages     | all label/placeholder strings                                                                  |

### 3.4 Dynamic Zone

| Zone          | Used in      | Components allowed                                                                                                                                              |
| ------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `articleBody` | news-article | `article.paragraph`, `article.heading`, `article.image`, `article.quote`, `article.list`, `article.callout` (1 component per content-block type from `news.ts`) |

---

## 4. Migration phases (suggested order)

Single-types first (low risk, no relations), then collections, then the
relation-heavy ones at the end.

### Phase A — Pilot (in flight)

- **A1.** `contact-page` — already scaffolded in Strapi with one field. Finish: add remaining fields, drop fallback, delete `src/content/contact.ts`. (1 spec, ~half-day.)

### Phase B — Easy single-types (sequential, ~1 spec/day)

- **B1.** `sustainability-page` (smallest; no nested arrays except `focusAreas: string[]`)
- **B2.** `privacy-policy` (legal; uses `shared.privacy-section` component for sections)
- **B3.** `homepage` (hero + KPI repeatable + ceoQuote + footerCta)
- **B4.** `about-page` (hero + story + mission + values[] + timeline[] + differentiators + closing)
- **B5.** `story-page` (similar to about; reuses `shared.timeline-milestone`)
- **B6.** `entrepreneurs-page` (landing + benefits[] + closing + process + contact)
- **B7.** `investors-page` (mirror of entrepreneurs; reuses `shared.pillar`)
- **B8.** `investors-case-page` (sixPillars + growthMilestones + marketOpportunity)

### Phase C — Collection-types

- **C1.** `team-member` (collection-type; category enum; ordered)
- **C2.** `testimonial` (collection-type; ordered)
- **C3.** `workshop` (collection-type; geo coords; status enum)
- **C4.** `media-category` + `media-asset` + `media-kit-page` together (one spec — they're tightly coupled)
- **C5.** `news-article` (most complex: dynamic-zone body, relations to team-member as author, related-articles, tags, slug-based routing)

### Phase D — Cleanup

- **D1.** Delete `src/content/index.ts` once all imports are gone.
- **D2.** Delete `src/content/` folder entirely.
- **D3.** Update `MOCKED_DATA_STRUCTURE.md` — mark each entity "MIGRATED" with the spec link; the doc becomes a historical handoff reference, not an active spec.

---

## 5. Per-page mapping (sample — homepage)

To make Phase B concrete, here's the mapping for the homepage. Each Phase B spec
will produce one of these tables before implementation.

**Strapi UID:** `api::homepage.homepage` (single-type)
**Frontend shape:** `HomepageContent` from `src/content/homepage.ts`
**Page consumer:** `src/app/page.tsx` (root)

| Frontend field                                              | Strapi field          | Type                  | Component?          |
| ----------------------------------------------------------- | --------------------- | --------------------- | ------------------- |
| `hero.headline`                                             | `heroHeadline`        | string                | —                   |
| `hero.subheadline`                                          | `heroSubheadline`     | text                  | —                   |
| `hero.backgroundImage`                                      | `heroBackgroundImage` | media (single, image) | —                   |
| `hero.cta1Text` / `hero.cta1Link`                           | `heroCta1`            | component             | `shared.cta`        |
| `hero.cta2Text` / `hero.cta2Link`                           | `heroCta2`            | component             | `shared.cta`        |
| `kpis[]`                                                    | `kpis`                | repeatable component  | `shared.kpi`        |
| `ceoQuote.text` / `.attribution` / `.photoUrl`              | `ceoQuote`            | component             | `shared.ceo-quote`  |
| `footerCta.headline` / `.subtext` / `.ctaText` / `.ctaLink` | `footerCta`           | component             | `shared.footer-cta` |

The mapper in `src/lib/cms/homepage/mapper.ts` reshapes Strapi's flat output
back to the nested `HomepageContent` interface.

---

## 6. US-005 — Public Read Permissions Checklist

Runs **once per content-type** at the end of each migration spec.

For each new content-type:

- [ ] Strapi admin → **Settings → Users & Permissions Plugin → Roles → Public**
- [ ] Find the new content-type in the list
- [ ] Tick `find` (collection-type) or `findOne` (single-type) **and only that**
- [ ] Save
- [ ] Verify with curl: `curl -i http://localhost:1337/api/<slug>` → expect `200`
- [ ] Confirm a `POST` returns `401` or `403`: `curl -i -X POST http://localhost:1337/api/<slug>`
- [ ] Document the curl outputs in the spec's traceability matrix

This satisfies US-005 acceptance criteria (GET no-auth, POST requires auth,
Users & Permissions plugin configured, curl test).

---

## 7. Per-page spec template (use for B1 onwards)

Each Phase B/C spec follows this skeleton — small, focused, one-page-at-a-time:

```
# Specification: <Page> CMS Migration

## 1. Overview
- Single-type or collection-type
- Frontend shape replaced
- src/content/<file>.ts deleted at end

## 2. Acceptance Criteria
- AC-001: Strapi content-type matches the field mapping (Section 5 in roadmap)
- AC-002: get<Page>Content() returns the page-shaped data
- AC-003: Page renders identical output (visual diff or test)
- AC-004: Public role grants find/findOne; POST returns 401/403
- AC-005: src/content/<file>.ts deleted; no remaining imports
- AC-006: Page passes existing tests (or tests updated)

## 3. Strapi changes
- Schema changes (add/remove fields)
- Content-type permissions
- Components/relations to add

## 4. Frontend changes
- New folder: src/lib/cms/<page>/
- Page imports get<Page>Content() instead of hardcoded import
- Old src/content/<file>.ts deleted

## 5. Tests
- Unit: mapper
- Wrapper: get<Page>Content with mocked client
- Page: render with mocked wrapper
```

---

## 8. Dependencies + ordering rules

- **Components ship with the first content-type that uses them.** When `homepage`
  introduces `shared.cta`, that component lands then; `entrepreneurs-page` later
  reuses it without redefining.
- **`team-member` ships before `news-article`** (news has author relation).
- **`workshop` ships before `news-article`** if/when articles relate to workshops.
- **No spec implements two content-types at once**, except media-kit
  (page + categories + assets are tightly nested and dependency-cyclic).

---

## 9. Out of scope of this roadmap

- **Translations / i18n.** Future spec `cms-locales.md` flips i18n on the
  content-types and updates `getContent` for locale.
- **Form submissions** (POST /api/contact/\*). Custom Next.js routes — separate
  spec per form.
- **Strapi → Next.js publish webhook** (`REVALIDATE_SECRET` env var lives in
  `.env.example` already; wiring is its own spec).
- **Production deploy** of the CMS (DB, hosting, domain, SSL).
- **Search & pagination** for news/workshops. Their specs decide pagination
  defaults (page-size, sort) when they get there.

---

## 10. Effort estimate (rough)

- Phase A: half-day
- Phase B: 8 specs × ~half-day each = ~4 days
- Phase C: 5 specs × ~1 day each = ~5 days (collections + relations are bigger)
- Phase D: half-day cleanup
- **Total: ~10 working days** for a fully CMS-driven site (excluding translations
  and form submissions).

---

## 11. Sign-off

| Role          | Name           | Date       | Approved |
| ------------- | -------------- | ---------- | -------- |
| Product Owner | Amar Smajlovic | 2026-05-05 | [x]      |
| Tech Lead     | Amar Smajlovic | 2026-05-05 | [x]      |
