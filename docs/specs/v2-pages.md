# Spec: v2 pages (home, Investors, Leadership & Board, Our companies, Entrepreneurs)

**Status:** Built on `feat/v2-design-system` for preview. Not approved for production.
**Mandate:** HQ brief `claude/hq/uppdrag-till-webb-2026-11-11-v2-natt.md` (run without phase-gate stops, branch and preview only).
**Design source:** design sketch (Main, Investors, Team, Companies) and `claude/hq/2026-11-06-webb-designspec.md`.
**Builds on:** `docs/specs/v2-design-system.md`.

## Frames

- Figures come from the CMS (workshop count, brands, regions, employees, revenue). A missing figure renders `[CFO]`, never an estimate.
- "Nordic", not "Swedish". Nothing about financing processes, purchase prices or negotiations.
- No new environment variables, no CMS schema changes, no production migration.
- Careers is not built.

## Acceptance criteria

### AC-001: Home fact band shows CMS figures as text
GIVEN the CMS returns 13 workshops in two regions
WHEN the home page renders
THEN the fact band shows the workshop, brand and region counts as HTML text
AND no figure is baked into an image

### AC-002: Logo wall filters by region and tire hotel
GIVEN the logo wall shows all brands
WHEN the visitor selects "East", "West / Central" or "Tire hotel"
THEN only matching brands remain
AND the selected chip is marked with `aria-pressed="true"`

### AC-003: Workshops group into brands
GIVEN the 13 CMS workshops
WHEN they are grouped
THEN Däckgruppen's sites form one brand and every workshop belongs to exactly one brand
AND "Stockholm" maps to East and "Västra Götaland" to West / Central

### AC-004: Leadership panel shows one person at a time
GIVEN the Leadership & Board page
WHEN the visitor selects a name in the list
THEN that person's portrait, title, bio and e-mail show on the black panel
AND the selected name is marked with `aria-current`

### AC-005: Investors page has no open document download
GIVEN the Investors page
WHEN it renders
THEN investor material is offered only through the request form
AND the IR contact is the CEO

### AC-006: Seller form asks for revenue in SEK
GIVEN the entrepreneur contact form
WHEN the revenue options render and are validated
THEN all four ranges are in SEK
AND a EUR range is rejected

### AC-007: Owner quotes are unchanged
GIVEN the CMS testimonials
WHEN home and Entrepreneurs render
THEN the quotes are shown in full, unedited, with name, workshop and date

## Traceability

| Criterion | Test file | Test name | Status |
|-----------|-----------|-----------|--------|
| AC-001 | `src/components/ds/FactBand.test.tsx` | renders each fact as text | PASSED |
| AC-002 | `src/components/ds/LogoWall.test.tsx` | filter chips | PASSED |
| AC-003 | `src/lib/v2/companies.test.ts` | groupCompanies / regionOf / countByRegion | PASSED |
| AC-004 | `src/components/ds/LeadershipPanel.test.tsx` | selects a leader | PASSED |
| AC-005 | — | verified on preview (manual) | MANUAL |
| AC-006 | `src/lib/contact/schema.test.ts` | offers the seller form ranges in SEK, not EUR | PASSED |
| AC-007 | — | verified on preview (manual); quote text comes straight from CMS | MANUAL |

## Known gaps

- Swedish copy and the Entrepreneurs process texts (weeks 1–12, 100 days, comparison) are placeholders pending Kommunikation and Head of M&A.
- Logos are text tiles until logo files exist.
- Portraits and management e-mails are code fallbacks until the CMS is filled in.
