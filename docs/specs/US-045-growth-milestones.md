# Specification: US-045 · Growth Milestones — Web CMS Integration

**Author:** Alex Chen (Tech Lead)
**Date:** 2026-05-20
**Status:** Draft

---

## 1. Overview

### 1.1 Summary

Wire the `GrowthTimeline` component on the `/investors/metrics` page to fetch milestone data from Strapi instead of the hardcoded `investorsCaseContent.growthMilestones.milestones` array. The `GrowthTimeline` component already exists — this ticket connects it to the CMS.

### 1.2 Goals

- Create `src/lib/cms/growth-milestones/` (types, mapper, index)
- Update `/investors/metrics/page.tsx` to call `getGrowthMilestonesContent()` and render `GrowthTimeline`
- Register `growth-milestones` in the ISR revalidation route
- Fall back to `investorsCaseContent.growthMilestones.milestones` if CMS returns null

### 1.3 Non-Goals

- Does NOT change the `GrowthTimeline` component UI or its props interface
- Does NOT remove `investors-case.ts` content file (kept as fallback)
- Does NOT manage the section disclaimer text (remains in static content)

### 1.4 User Story

As a developer,
I want the growth milestones on the investors page to pull from Strapi,
So that editors can mark milestones as completed and add new targets without a deployment.

---

## 2. Acceptance Criteria

### AC-001: CMS client module exists

GIVEN the `src/lib/cms/growth-milestones/` directory is created
WHEN TypeScript compiles
THEN `types.ts`, `mapper.ts`, and `index.ts` exist with no type errors
AND `getGrowthMilestonesContent(revalidate?, locale?)` is exported from the index

---

### AC-002: Mapper correctly maps CMS fields to GrowthMilestone shape

GIVEN the CMS returns a `growth-milestones` entry with milestone components
WHEN the mapper processes the response
THEN each milestone maps to `{ period: string, description: string, status: 'completed' | 'target' }`
AND milestones are sorted ascending by `sortOrder`

---

### AC-003: Investors metrics page renders GrowthTimeline with CMS data

GIVEN the CMS is reachable and returns milestones
WHEN the `/investors/metrics` page renders
THEN the `GrowthTimeline` component is rendered below the metric cards
AND it receives CMS-sourced milestones

---

### AC-004: Fallback to static content when CMS is unavailable

GIVEN the CMS request throws or returns null
WHEN the `/investors/metrics` page renders
THEN the page falls back to `investorsCaseContent.growthMilestones.milestones`
AND `GrowthTimeline` still renders with the static data

---

### AC-005: ISR revalidation tag is registered

GIVEN the revalidate webhook fires with `{ contentType: "growth-milestones" }`
WHEN the `/api/revalidate` route handles the request
THEN the `growth-milestones` cache tag is invalidated
AND the next page request fetches fresh CMS data

---

### AC-006: Locale is passed to the CMS client

GIVEN the page renders for the `sv` locale
WHEN `getGrowthMilestonesContent()` is called
THEN the Strapi request includes `locale=sv`
AND Swedish milestone content is displayed if the SV locale is published

---

## 3. Technical Specifications

### 3.1 New Files

```
src/lib/cms/growth-milestones/
  types.ts    — CmsMilestoneEntry, CmsGrowthMilestones, GrowthMilestone interfaces
  mapper.ts   — growthMilestonesMapper()
  index.ts    — getGrowthMilestonesContent()
```

### 3.2 CMS Type Shape

```typescript
interface CmsMilestoneEntry {
  period: string;
  description: string;
  status: 'completed' | 'target';
  sortOrder: number;
}

interface CmsGrowthMilestones {
  milestones: CmsMilestoneEntry[];
}
```

### 3.3 Mapped Type (matches GrowthTimeline props)

```typescript
interface GrowthMilestone {
  period: string;
  description: string;
  status: 'completed' | 'target';
}
```

### 3.4 ISR Tag

- Tag name: `growth-milestones`
- Revalidate strategy: `REVALIDATE_HIGH`

### 3.5 Files Modified

- `src/app/[locale]/investors/metrics/page.tsx` — add CMS fetch, render `GrowthTimeline`
- `src/app/api/revalidate/route.ts` — register `growth-milestones` tag

### 3.6 GrowthTimeline placement on metrics page

Rendered in a new section below the metric cards grid, before the "Road Ahead" CTA section.

---

## 4. Traceability Matrix

| Criterion | Test File                                      | Test Name                          | Status     |
| --------- | ---------------------------------------------- | ---------------------------------- | ---------- |
| AC-001    | `src/lib/cms/growth-milestones/mapper.test.ts` | Module exports                     | ⏳ Pending |
| AC-002    | `src/lib/cms/growth-milestones/mapper.test.ts` | Maps CMS fields to GrowthMilestone | ⏳ Pending |
| AC-002    | `src/lib/cms/growth-milestones/mapper.test.ts` | Sorts by sortOrder                 | ⏳ Pending |
| AC-004    | `investors/metrics/page.test.tsx`              | Fallback to static content         | ⏳ Pending |
| AC-005    | `api/revalidate/route.test.ts`                 | growth-milestones tag fires        | ⏳ Pending |
| AC-006    | `src/lib/cms/growth-milestones/index.test.ts`  | Locale passed to client            | ⏳ Pending |

---

## 5. Dependencies

- **US-045 CMS spec** — Strapi content type must exist before end-to-end testing
- `GrowthTimeline` component at `src/components/investors/GrowthTimeline.tsx` — already built, no changes needed
- `src/lib/cms/client.ts` — reused as-is
- `investorsCaseContent` in `src/content/investors-case.ts` — kept as fallback

---

## 6. Revision History

| Date       | Version | Changes      | Author    |
| ---------- | ------- | ------------ | --------- |
| 2026-05-20 | 1.0     | Initial spec | Alex Chen |
