# Specification: US-044 · Acquisition Process — Web CMS Integration

**Author:** Alex Chen (Tech Lead)
**Date:** 2026-05-20
**Status:** Draft

---

## 1. Overview

### 1.1 Summary

Wire the `/entrepreneurs/process` page to fetch acquisition process steps from Strapi instead of the hardcoded `entrepreneursContent.process.steps` array. The CMS becomes the single source of truth for step content; the page falls back to the static data if CMS is unreachable.

### 1.2 Goals

- Create `src/lib/cms/acquisition-process/` (types, mapper, index) following the existing CMS client pattern
- Update `/entrepreneurs/process/page.tsx` to call `getAcquisitionProcessContent()`
- Register `acquisition-process` in the ISR revalidation route
- Fall back to `entrepreneursContent.process.steps` if CMS returns null

### 1.3 Non-Goals

- Does NOT change the `ProcessTimeline` or `ProcessStep` component UI
- Does NOT remove the hardcoded `entrepreneurs.ts` content file (kept as fallback)
- Does NOT change the CTA link or total timeline summary string

### 1.4 User Story

As a developer,
I want the acquisition process page to pull step content from Strapi,
So that editors can update steps without a code deployment.

---

## 2. Acceptance Criteria

### AC-001: CMS client module exists

GIVEN the `src/lib/cms/acquisition-process/` directory is created
WHEN TypeScript compiles
THEN `types.ts`, `mapper.ts`, and `index.ts` exist with no type errors
AND `getAcquisitionProcessContent(revalidate?, locale?)` is exported from the index

---

### AC-002: Types match the CMS schema

GIVEN the CMS returns an `acquisition-process` entry
WHEN the mapper processes the response
THEN each step is mapped to `{ number, title, description, timeline }` matching `ProcessTimeline` props
AND steps are sorted ascending by `stepNumber`

---

### AC-003: Process page uses CMS data when available

GIVEN the CMS is reachable and returns 6 steps
WHEN the `/entrepreneurs/process` page renders
THEN the steps displayed come from Strapi
AND the `ProcessTimeline` component receives CMS-sourced step data

---

### AC-004: Fallback to static content when CMS is unavailable

GIVEN the CMS request throws or returns null
WHEN the `/entrepreneurs/process` page renders
THEN the page falls back to `entrepreneursContent.process.steps`
AND no error is shown to the user

---

### AC-005: ISR revalidation tag is registered

GIVEN the revalidate webhook fires with `{ contentType: "acquisition-process" }`
WHEN the `/api/revalidate` route handles the request
THEN the `acquisition-process` cache tag is invalidated
AND the next page request fetches fresh CMS data

---

### AC-006: Locale is passed to the CMS client

GIVEN the page renders for the `sv` locale
WHEN `getAcquisitionProcessContent()` is called
THEN the Strapi request includes `locale=sv`
AND Swedish step content is displayed if the SV locale is published

---

## 3. Technical Specifications

### 3.1 New Files

```
src/lib/cms/acquisition-process/
  types.ts    — CmsProcessStep, CmsAcquisitionProcess, ProcessStep interfaces
  mapper.ts   — acquisitionProcessMapper()
  index.ts    — getAcquisitionProcessContent()
```

### 3.2 CMS Type Shape

```typescript
interface CmsProcessStep {
  stepNumber: number;
  title: string;
  description: string;
  timelineDuration: string;
}

interface CmsAcquisitionProcess {
  steps: CmsProcessStep[];
}
```

### 3.3 Mapped Type (matches ProcessTimeline props)

```typescript
interface ProcessStep {
  number: number;
  title: string;
  description: string;
  timeline: string;
}
```

### 3.4 ISR Tag

- Tag name: `acquisition-process`
- Revalidate strategy: `REVALIDATE_HIGH` (same as KPI ticker)

### 3.5 Files Modified

- `src/app/[locale]/entrepreneurs/process/page.tsx` — add CMS fetch + fallback
- `src/app/api/revalidate/route.ts` — register `acquisition-process` tag

---

## 4. Traceability Matrix

| Criterion | Test File                                        | Test Name                      | Status     |
| --------- | ------------------------------------------------ | ------------------------------ | ---------- |
| AC-001    | `src/lib/cms/acquisition-process/mapper.test.ts` | Module exports                 | ⏳ Pending |
| AC-002    | `src/lib/cms/acquisition-process/mapper.test.ts` | Maps CMS fields to ProcessStep | ⏳ Pending |
| AC-003    | `src/lib/cms/acquisition-process/mapper.test.ts` | Sorts by stepNumber            | ⏳ Pending |
| AC-004    | `entrepreneurs/process/page.test.tsx`            | Fallback to static content     | ⏳ Pending |
| AC-005    | `api/revalidate/route.test.ts`                   | acquisition-process tag fires  | ⏳ Pending |
| AC-006    | `src/lib/cms/acquisition-process/index.test.ts`  | Locale passed to client        | ⏳ Pending |

---

## 5. Dependencies

- **US-044 CMS spec** — Strapi content type must exist and be published before this can be tested end-to-end
- Existing `ProcessTimeline` and `ProcessStep` components — no changes needed
- `src/lib/cms/client.ts` — reused as-is

---

## 6. Revision History

| Date       | Version | Changes      | Author    |
| ---------- | ------- | ------------ | --------- |
| 2026-05-20 | 1.0     | Initial spec | Alex Chen |
