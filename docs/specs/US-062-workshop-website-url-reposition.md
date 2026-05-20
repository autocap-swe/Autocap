# Specification: US-062 · Reposition Workshop Website URL

**Author:** Alex Chen (Tech Lead)
**Date:** 2026-05-19
**Status:** Approved

---

## 1. Overview

### 1.1 Summary

The workshop's external website link currently sits below the description and group blurb, far from the workshop name. Move it to the info panel near the workshop name, location, and year badge so visitors can find it immediately.

### 1.2 Goals

- Move the website link to the top info section, near the workshop name
- Keep the same link style (red, with ExternalLink icon)

### 1.3 Non-Goals

- Redesigning the info panel layout
- Adding additional external links

### 1.4 User Story

As a website visitor,
I want to see the workshop's website link near the workshop name,
So that I can visit it easily without scrolling past the full description.

---

## 2. Acceptance Criteria

### AC-001: Website link appears in the top info section

GIVEN a workshop with a `localWebsite` URL set
WHEN a visitor opens `/portfolio/[slug]`
THEN the website link is visible in the info panel near the workshop name, city, and year
AND it is no longer positioned after the description and group blurb

---

### AC-002: Link is not shown when no website is set

GIVEN a workshop with no `localWebsite`
WHEN a visitor opens that workshop's detail page
THEN no empty link or broken element appears in the info panel

---

## 3. Traceability Matrix

| Criterion | File                                         | Status |
| --------- | -------------------------------------------- | ------ |
| AC-001    | `src/app/[locale]/portfolio/[slug]/page.tsx` | ⏳     |
| AC-002    | `src/app/[locale]/portfolio/[slug]/page.tsx` | ⏳     |

---

## 4. Technical Design

### 4.1 Files to modify

| File                                         | Change                                                                                                    |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `src/app/[locale]/portfolio/[slug]/page.tsx` | Move `localWebsite` link from after group blurb into the info panel block (alongside MapPin and Calendar) |

---

## Sign-off

| Role          | Name      | Date       | Approved |
| ------------- | --------- | ---------- | -------- |
| Product Owner | —         | 2026-05-19 | ✅       |
| Tech Lead     | Alex Chen | 2026-05-19 | ✅       |
