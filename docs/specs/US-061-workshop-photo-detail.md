# Specification: US-061 · Workshop Photo on Workshop Detail Page

**Author:** Alex Chen (Tech Lead)
**Date:** 2026-05-19
**Status:** Approved

---

## 1. Overview

### 1.1 Summary

Show a workshop photo on the workshop detail page. The `imageUrl` field already exists in the `Workshop` frontend type (and is used on workshop cards) but the Strapi schema has no image field and the mapper doesn't populate it. This ticket adds the media field to the CMS schema, updates the mapper, and renders the image on the detail page.

### 1.2 Goals

- Add a single `image` media field to the Strapi Workshop content type
- Map it through `workshopMapper` to the existing `Workshop.imageUrl` field
- Render the photo on `/portfolio/[slug]` above or below the description
- Show `WorkshopImagePlaceholder` until the client supplies real photos

### 1.3 Non-Goals

- Multiple images / gallery
- Image upload UI changes in Strapi admin

### 1.4 User Story

As a website visitor,
I want to see a photo of the workshop on the detail page,
So that the portfolio feels tangible and authentic.

---

## 2. Acceptance Criteria

### AC-001: Workshop photo renders on detail page

GIVEN a workshop with an image uploaded in Strapi
WHEN a visitor opens `/portfolio/[slug]`
THEN the workshop photo is displayed above the description
AND it is responsive and fills the container width

---

### AC-002: Placeholder shown when no image is set

GIVEN a workshop with no image in Strapi
WHEN a visitor opens that workshop's detail page
THEN `WorkshopImagePlaceholder` is rendered in place of the photo
AND no broken image or empty gap appears

---

### AC-003: Strapi Workshop content type has an image field

GIVEN the Strapi admin panel
WHEN an editor opens a Workshop entry
THEN a single-image media field is visible and uploadable

---

### AC-004: Image field is shared (not localised)

GIVEN the Workshop content type has i18n enabled
WHEN the image field is inspected in the schema
THEN `pluginOptions.i18n.localized` is `false` for the image field
AND the same photo is served for both EN and SV locales

---

## 3. Traceability Matrix

| Criterion | File                                                              | Status |
| --------- | ----------------------------------------------------------------- | ------ |
| AC-001    | `src/app/[locale]/portfolio/[slug]/page.tsx`                      | ⏳     |
| AC-002    | `src/app/[locale]/portfolio/[slug]/page.tsx`                      | ⏳     |
| AC-003    | `AutoCap-cms/src/api/workshop/content-types/workshop/schema.json` | ⏳     |
| AC-004    | `AutoCap-cms/src/api/workshop/content-types/workshop/schema.json` | ⏳     |

---

## 4. Technical Design

### 4.1 Files to modify

| File                                                              | Change                                                |
| ----------------------------------------------------------------- | ----------------------------------------------------- |
| `AutoCap-cms/src/api/workshop/content-types/workshop/schema.json` | Add `image` media field (single, not localised)       |
| `src/lib/cms/workshop/types.ts`                                   | Add `image: { url: string } \| null` to `CmsWorkshop` |
| `src/lib/cms/workshop/mapper.ts`                                  | Map `cms.image?.url` → `imageUrl` via `resolveUrl`    |
| `src/app/[locale]/portfolio/[slug]/page.tsx`                      | Render image / placeholder above description          |

---

## Sign-off

| Role          | Name      | Date       | Approved |
| ------------- | --------- | ---------- | -------- |
| Product Owner | —         | 2026-05-19 | ✅       |
| Tech Lead     | Alex Chen | 2026-05-19 | ✅       |
