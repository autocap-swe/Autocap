# Spec: Design system v2

**Source:** `claude/hq/2026-11-06-webb-designspec.md` (decided by David 2026-11-06) and the design sketch "AutoCap webb – designskiss", artboards 0–4.
**Approved:** David via HQ 2026-11-06 ("Bygg designsystemet först").

## Scope
Tokens (colour, Manrope, typography roles), Container, Section tones, Eyebrow, RedRule, PageHeader, ButtonLink, ArrowLink, FactBand, TwoDoors, new Header (wordmark, flat menu, overlay variant, EN/SV toggle) and Footer (four columns, large wordmark). A preview-only reference page at `/design-system`. Pages are rebuilt one by one on their own branches.

Deviations from the sketch, by earlier decisions:
- "Nordic" instead of "Sweden's" in the positioning line (David 2026-11-06).
- IR contact in the footer is David Knape, CEO (David 2026-11-05).
- "Careers" is left out of the menu until the page exists.

## Acceptance criteria

### AC-DS1: Tokens and type
GIVEN any page
WHEN it renders
THEN the font is Manrope 300/400/500/600 and the colour tokens ink, red, birch, fjord, rule and text-2/3 are available as utilities
AND headings never hyphenate automatically

### AC-DS2: Page header
GIVEN a sub-page
WHEN PageHeader renders
THEN it shows an eyebrow, one h1 with the t-h1 role, the red rule and the lead

### AC-DS3: Fact band
GIVEN figures
WHEN FactBand renders
THEN each figure is plain text in the HTML with its unit beside it, and no counter animation

### AC-DS4: Section tones
GIVEN a section tone white, ink, birch or fjord
WHEN Section renders
THEN the matching background token is applied

### AC-DS5: Reference page is preview-only
GIVEN the production deployment
WHEN /design-system is requested
THEN it returns 404 and is never indexed

## Traceability
| Criterion | Test File | Test Name | Status |
|---|---|---|---|
| AC-DS1 | manual, screenshots in daily preview report | – | – |
| AC-DS2 | src/components/ds/PageHeader.test.tsx | renders eyebrow, a single h1 and the lead | PASSED |
| AC-DS3 | src/components/ds/FactBand.test.tsx | renders each figure as plain text with its unit beside it | PASSED |
| AC-DS4 | src/components/ds/PageHeader.test.tsx | tone %s sets %s | PASSED |
| AC-DS5 | manual check on production after merge | – | – |
