# Specification: Portfolio Map — Coincident Marker Grouping

**Author:** Amar Smajlovic (Full Stack Dev)
**Date:** 2026-08-24
**Status:** Draft

---

## 1. Overview

### 1.1 Summary

Workshops that share identical coordinates currently render as stacked Mapbox markers on the portfolio map. Only the last marker in the array is clickable; every other workshop at that coordinate is visually and functionally unreachable. Three workshops in the current dataset sit on `57.6557, 12.0138` (Däckpoint i Mölndal, Mölndals Däckservice, Mölndals Bilverkstad) — and two of those are genuinely co-located at Kråketorpsgatan 16, so coordinate precision alone cannot fix this. This spec groups workshops by coordinate into a single marker that carries a count badge and a popup listing every workshop at that location.

### 1.2 Goals

- Every workshop on the map is reachable, regardless of coordinate collisions
- Co-located workshops are represented honestly — one place, multiple businesses
- No fabricated geography (no jitter, no offsetting pins to addresses that don't exist)
- No new runtime dependency

### 1.3 Non-Goals

- Marker clustering by zoom level (a scale feature for 50+ workshops; does not solve identical coordinates)
- Spiderfy / fan-out interaction (overkill at 3 workshops per point)
- Map ↔ `WorkshopGrid` hover sync (separate follow-up)
- Fixing the underlying coordinate data in Strapi, or adding an `address` field to the workshop content type (separate CMS-side spec)

### 1.4 User Story

As a visitor browsing the AutoCap portfolio map,
I want to see and open every workshop at a given location,
So that co-located workshops are not hidden behind one another.

---

## 2. Acceptance Criteria

### AC-001: Single workshop at a coordinate renders unchanged

GIVEN a workshop whose coordinate is not shared by any other workshop
WHEN the portfolio map renders
THEN one marker is placed at that workshop's coordinate
AND the marker shows no count badge
AND clicking the marker opens a popup with that workshop's name, city, region, and a "View details" link to `/portfolio/[slug]`

---

### AC-002: Multiple workshops at one coordinate render as a single grouped marker

GIVEN three workshops share the coordinate `57.6557, 12.0138`
WHEN the portfolio map renders
THEN exactly one marker is placed at that coordinate
AND the marker displays a count badge reading `3`
AND no workshop is rendered as a separate overlapping marker

---

### AC-003: Grouped marker popup lists every workshop at that location

GIVEN a grouped marker representing three workshops
WHEN the user clicks the marker
THEN the popup lists all three workshops
AND each entry shows the workshop name and its own "View details" link to that workshop's `/portfolio/[slug]`
AND the popup shows the shared city and region once as a heading

---

### AC-004: Total marker count equals the number of distinct coordinates

GIVEN a dataset of 12 workshops occupying 10 distinct coordinates
WHEN the portfolio map renders
THEN 10 markers are added to the map
AND the sum of all grouped-marker counts equals 12

---

### AC-005: Coordinate grouping tolerates float representation

GIVEN two workshops with coordinates `57.6557, 12.0138` and `57.65570, 12.01380`
WHEN grouping is applied
THEN both workshops are placed in the same group
AND the group is positioned at the first workshop's coordinate

---

### AC-006: Edge Case — empty workshop list

GIVEN the portfolio page receives an empty workshops array
WHEN the map component renders
THEN the map does not attempt to compute an average centre from zero workshops
AND the map initialises at a default Sweden centre without producing `NaN` coordinates
AND no markers are added

---

### AC-007: Popup content is escaped

GIVEN a workshop whose CMS-authored name contains HTML characters (e.g. `Däck & Co <test>`)
WHEN the marker popup is rendered
THEN the characters are displayed as literal text
AND no markup from the CMS field is executed as HTML

---

### AC-008: Grouped marker is keyboard accessible

GIVEN a grouped marker on the map
WHEN the user tabs to the marker and presses Enter or Space
THEN the popup opens
AND the marker exposes an accessible label describing the location and workshop count

---

### AC-009: Map rebuilds when the workshops prop changes

GIVEN the map has already initialised
WHEN the `workshops` prop changes identity (e.g. future city filtering)
THEN the previous map instance is torn down cleanly
AND a new map is initialised with markers for the new workshop set
AND the map does not remain permanently blank

---

## 3. Traceability Matrix

| Criterion | Test File                                                     | Test Name                                                             | Status |
| --------- | ------------------------------------------------------------- | --------------------------------------------------------------------- | ------ |
| AC-001    | `src/components/portfolio/groupWorkshopsByCoordinate.test.ts` | returns a single-workshop group for a unique coordinate               | ⏳     |
| AC-002    | `src/components/portfolio/groupWorkshopsByCoordinate.test.ts` | groups workshops sharing a coordinate into one entry                  | ⏳     |
| AC-003    | `src/components/portfolio/WorkshopMap.test.tsx`               | grouped popup renders a details link per workshop                     | ⏳     |
| AC-004    | `src/components/portfolio/groupWorkshopsByCoordinate.test.ts` | group count matches distinct coordinates and preserves every workshop | ⏳     |
| AC-005    | `src/components/portfolio/groupWorkshopsByCoordinate.test.ts` | treats equal coordinates with differing precision as one group        | ⏳     |
| AC-006    | `src/components/portfolio/groupWorkshopsByCoordinate.test.ts` | returns no groups for an empty list                                   | ⏳     |
| AC-007    | `src/components/portfolio/WorkshopMap.test.tsx`               | escapes HTML characters in popup content                              | ⏳     |
| AC-008    | `src/components/portfolio/WorkshopMap.test.tsx`               | marker element is focusable and exposes an accessible label           | ⏳     |
| AC-009    | `src/components/portfolio/WorkshopMap.test.tsx`               | reinitialises the map when workshops change                           | ⏳     |

**Status:** ⏳ Pending | ✅ Passed | ❌ Failed

---

## 4. Technical Design

### 4.1 Components/Files to Create or Modify

| File                                                          | Action | Description                                                                                   |
| ------------------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------- |
| `src/components/portfolio/groupWorkshopsByCoordinate.ts`      | Create | Pure grouping helper — buckets workshops by rounded coordinate key                            |
| `src/components/portfolio/groupWorkshopsByCoordinate.test.ts` | Create | Unit tests for grouping logic (AC-001, 002, 004, 005, 006)                                    |
| `src/components/portfolio/WorkshopMap.tsx`                    | Modify | Render one marker per group, add count badge, multi-entry escaped popup, fix effect lifecycle |
| `src/components/portfolio/WorkshopMap.test.tsx`               | Create | Component tests with a mocked `mapbox-gl` (AC-003, 007, 008, 009)                             |

### 4.2 Data Model

```typescript
// src/components/portfolio/groupWorkshopsByCoordinate.ts
export interface WorkshopLocationGroup {
  /** Stable key derived from the rounded coordinate, e.g. "57.65570,12.01380" */
  key: string;
  latitude: number;
  longitude: number;
  workshops: Workshop[];
}

export function groupWorkshopsByCoordinate(workshops: Workshop[]): WorkshopLocationGroup[];
```

Grouping key: coordinates are rounded to 5 decimal places (~1.1 m precision) and formatted with `toFixed(5)`, so float representation differences collapse into one bucket (AC-005). The group's position is taken from the first workshop in the bucket, preserving CMS ordering.

### 4.3 API Endpoints (if applicable)

None. Rendering-only change; the existing `getWorkshopContent()` data flow is untouched.

### 4.4 State Management

Local to `WorkshopMap`: existing `mapError` / `mapLoaded` state plus the `map` ref. Groups are derived from the `workshops` prop via `useMemo` — no new state.

Lifecycle fix for AC-009: the effect currently early-returns on `if (map.current) return` while depending on `workshops`, and its cleanup calls `map.current?.remove()` without nulling the ref — so a prop change destroys the map permanently. Cleanup will set `map.current = null` after `remove()`.

---

## 5. UI/UX Requirements

### 5.1 Mobile Requirements (320px - 767px)

- Marker hit area at least 24×24 px; grouped markers render at 28 px to fit the badge
- Popup width capped so it does not overflow the map container at 320 px
- Grouped popup list scrolls internally if it exceeds the popup max-height

### 5.2 Tablet Requirements (768px - 1023px)

- Same behaviour as mobile; map height follows the existing `md:h-[600px]`

### 5.3 Desktop Requirements (1024px+)

- Hover state on markers retained from current implementation

### 5.4 Interactions

- Marker hover: existing shadow lift and border-width change, applied to grouped markers too
- Count badge: small circle at the marker's top-right, brand red `#C8102E` background, white text, `11px`, `600` weight
- Click: opens the Mapbox popup (single or grouped list); no close button, consistent with current behaviour
- Grouped popup entries separated by a hairline divider

### 5.5 Accessibility

- Marker element gets `role="button"`, `tabIndex={0}`, and an `aria-label`: single → `"<name>, <city>"`; grouped → `"<count> workshops at <city>, <region>"`
- Enter and Space open the popup (AC-008)
- Count badge marked `aria-hidden` since the label already states the count
- Popup links are real anchors, keyboard reachable once the popup is open

---

## 6. Error Handling

| Error Scenario                     | User Message                                                            | Technical Handling                                                     |
| ---------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Missing `NEXT_PUBLIC_MAPBOX_TOKEN` | "We're having trouble loading the map. Please try refreshing the page." | Existing `mapError` fallback, unchanged                                |
| Mapbox runtime error               | Same as above                                                           | Existing `map.on('error')` handler, unchanged                          |
| Empty workshops array              | No message; empty map at default centre                                 | Guard the average-centre calculation against division by zero (AC-006) |

---

## 7. Performance Considerations

- Grouping is O(n) over a dataset of ~12 workshops; memoised on the `workshops` prop
- Marker count drops from workshop count to distinct-coordinate count — strictly fewer DOM nodes than today
- No new dependency, so zero bundle-size impact
- `mapbox-gl` remains client-side only via the existing `'use client'` boundary

---

## 8. Security Considerations

- Popup HTML currently interpolates `workshop.name`, `city`, `region` unescaped into `setHTML()`. Replace with escaped text insertion (build the popup via DOM nodes / `textContent`, or escape before interpolation) — AC-007
- Slugs are used in `href` values; they are CMS-controlled and remain URL-path-only
- No user input reaches the map

---

## 9. Testing Strategy

### 9.1 Unit Tests

`groupWorkshopsByCoordinate` — unique coordinates, collisions, precision tolerance, empty input, workshop-count preservation, ordering.

### 9.2 Integration Tests

`WorkshopMap` with `mapbox-gl` mocked: assert marker count equals group count, badge text, popup HTML content per group, escaping, accessibility attributes, and re-initialisation on prop change.

### 9.3 Manual Testing

1. `npm run dev` → open `/portfolio`
2. Confirm the Mölndal area shows one marker with a `3` badge instead of three stacked pins
3. Click it — all three workshops listed, each link navigates to the correct detail page
4. Confirm the nine other locations render as plain single markers
5. Check 320 / 375 / 768 / 1024 / 1440 px
6. Tab to a marker, press Enter, confirm the popup opens

---

## 10. Dependencies

### 10.1 New Dependencies

None.

### 10.2 Feature Dependencies

- Existing portfolio map (`WorkshopMap`) and `getWorkshopContent()` CMS integration
- Related but independent: CMS-side coordinate accuracy — `Däckpoint i Mölndal` currently shares the Kråketorpsgatan coordinate although it is a different site. After this change it will appear inside the grouped popup. Correcting it (and adding an `address` field plus a duplicate-coordinate warning) belongs in a separate CMS spec.

---

## 11. Rollout Plan

### 11.1 Tile-less fallback

The Mapbox public token is URL-restricted to `autocapgroup.se`,
`www.autocapgroup.se` and `autocapgroup.ministryofprogramming.io`, so the map
canvas cannot render on a preview deployment — a reviewer opening `/portfolio`
would only see the "We're having trouble loading the map" box.

When the map fails and `NEXT_PUBLIC_VERCEL_ENV` is not `production`,
`WorkshopMap` renders `WorkshopPinPlane` instead: the same pins and popups,
built by the same `buildMarkerElement` and `buildPopupHtml`, positioned by a
linear projection of the workshop coordinates rather than by map tiles. In
production the plain error message is unchanged.

Marker and popup markup moved to `workshopMarkerContent.ts` so the map and the
fallback share one implementation rather than a lookalike copy.

The popup anchors the way Mapbox GL does when no `anchor` is set: below the pin
while it fits, above it otherwise, and pulled towards the nearer side when
centring would push it past a horizontal edge, with a pointer tip that stays
over the pin. `resolvePopupAnchor` in `popupAnchor.ts` holds that rule as a pure
function so it is unit-tested without a layout engine.

### 11.2 Checklist

- [ ] Implementation complete
- [ ] All tests passing
- [ ] Quality gates passed
- [ ] User testing approved
- [ ] Documentation generated
- [ ] Ready for commit

---

## 12. Open Questions

- [ ] Should the grouped popup show each workshop's status badge (acquired / pending / target), or keep it to name + link?
- [ ] Should `Däckpoint i Mölndal` be re-geocoded now, or intentionally left grouped until the CMS spec lands?

---

## Sign-off

| Role          | Name            | Date       | Approved |
| ------------- | --------------- | ---------- | -------- |
| Product Owner | Amar Smajlovic  | 2026-08-24 | [x]      |
| Tech Lead     | Alex Chen       | 2026-08-24 | [x]      |
| Quality Lead  | Dr. Priya Patel |            | [ ]      |
