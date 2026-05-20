# Specification: US-059 · Article Hero Image in Article Header

**Author:** Alex Chen (Tech Lead)
**Date:** 2026-05-19
**Status:** Approved

---

## 1. Overview

### 1.1 Summary

Display the article's hero image prominently at the top of the article detail page, above the title block. The `imageUrl` field already exists in the `NewsArticle` type and is populated by the CMS mapper — only the `ArticleHeader` component needs updating to render it.

### 1.2 Goals

- Render hero image above the title on every `/news/[slug]` page
- Maintain correct aspect ratio across all breakpoints
- Show a neutral fallback when no hero image exists

### 1.3 Non-Goals

- Changing the CMS schema (field already exists)
- Lazy-loading strategies beyond Next.js `Image` defaults

### 1.4 User Story

As a website visitor,
I want to see the article's hero image at the top of the article page,
So that articles have strong visual context before I read the title.

---

## 2. Acceptance Criteria

### AC-001: Hero image renders above the title block

GIVEN an article with a `heroImage` set in Strapi
WHEN a visitor opens `/news/[slug]`
THEN the hero image is displayed at the top of the article header
AND it appears above the category badge, title, and author line

---

### AC-002: Image is responsive across breakpoints

GIVEN the hero image is rendered
WHEN viewed at 375px, 768px, and 1440px viewport widths
THEN the image fills the full width of its container at all sizes
AND the aspect ratio is 16:9
AND the image never overflows or distorts

---

### AC-003: Fallback when no hero image is set

GIVEN an article with no `heroImage` in Strapi
WHEN a visitor opens that article
THEN no broken image or empty space appears
AND the header renders normally with only the gradient background

---

## 3. Traceability Matrix

| Criterion | File                                    | Status |
| --------- | --------------------------------------- | ------ |
| AC-001    | `src/components/news/ArticleHeader.tsx` | ⏳     |
| AC-002    | `src/components/news/ArticleHeader.tsx` | ⏳     |
| AC-003    | `src/components/news/ArticleHeader.tsx` | ⏳     |

---

## 4. Technical Design

### 4.1 Files to modify

| File                                    | Change                                                                      |
| --------------------------------------- | --------------------------------------------------------------------------- |
| `src/components/news/ArticleHeader.tsx` | Add `<Image>` block above header content, conditional on `article.imageUrl` |

### 4.2 No data layer changes needed

`NewsArticle.imageUrl` is already populated by `articleMapper` from `cms.heroImage?.url`.

---

## Sign-off

| Role          | Name      | Date       | Approved |
| ------------- | --------- | ---------- | -------- |
| Product Owner | —         | 2026-05-19 | ✅       |
| Tech Lead     | Alex Chen | 2026-05-19 | ✅       |
