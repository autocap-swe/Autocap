# Spec: Fas A – rätta (webbutveckling november 2026)

**Status:** Godkänd av David Knape via HQ-uppdraget `claude/hq/uppdrag-till-webb-2026-11-05-utveckling.md`, avsnitt A punkt 1–8. SEO-tekniken (C4) och svenska texter på nyhetsdelen är tillagda på Davids begäran 2026-11-06.
**CMS-spec:** `../AutoCap-cms/docs/specs/fas-a-fields.md` (fälten `email` och `yearFounded`)

### AC-A1: Inga automatiska avstavningar i rubriker
GIVEN en H1–H3
THEN gäller `hyphens: manual` globalt, och klassen `hyphens-auto` används inte

### AC-A2: Inga inskrollningseffekter; nyckeltal står rätt i HTML
GIVEN rubriker, nyckeltal och brödtext
THEN syns de direkt utan fade/slide
AND KPI-raden renderar slutvärdet i HTML utan uppräkning från 0

### AC-A3: Team
GIVEN styrelsesektionen
THEN visas foto eller ingen bild, inga initialcirklar
AND en person som även sitter i ledningen visas med titeln "Board Member"/"Styrelseledamot", utan upprepad bio och e-post
AND ledningskort visar e-post när fältet `email` är ifyllt i CMS

### AC-A4: Portföljkort
THEN visas "In the group since"/"I gruppen sedan" i stället för "Since"
AND "Founded"/"Grundad" visas när `yearFounded` finns

### AC-A5: Sidfot
THEN finns länk till LinkedIn, org.nr 559215-7357 och raden "IR: David Knape, CEO" med e-postlänk (ändrat från CFO enligt David 2026-11-06)

### AC-A6: Kontaktsidan svarar
GIVEN /contact och /sv/contact
THEN är svarstiden under 1 s (uppmätt 0,17–0,55 s 2026-11-06; ingen kodändring behövdes)

### AC-A7: Story och About
THEN visas Story-rubriken inte två gånger
AND About saknar "What makes us different" och visar i stället nyckeltalsraden och kartan

### AC-A8: Meny
THEN ligger Team under About ("Leadership & Board", fanns redan) och Media kit under News & Media

### AC-SEO: SEO-teknik
THEN har varje sida title och description på EN och SV, canonical och hreflang (en, sv, x-default)
AND har varje sida og:image (CMS-bild, annars sidans hero, annars standardbild 1200×630)
AND innehåller Organization-schemat juridiskt namn, org.nr, adress, logotyp och LinkedIn
AND listar sitemap.xml alla sidor på rätt URL (engelska utan prefix, svenska med /sv) och hoppar över saknade översättningar
AND blockerar robots.txt inte /_next/ längre

### AC-SV: Svenska på nyhetsdelen
THEN visas "Senaste nytt", svenska kategorinamn och svenska datum på svenska sidor

## Spårbarhet
| Kriterium | Testfil | Status |
|---|---|---|
| AC-A2 | src/components/home/KpiTicker.test.tsx, src/components/about/SteppedTimeline.test.tsx | PASSED |
| AC-A3 | src/components/team/ProfileCard.test.tsx | PASSED |
| AC-A4 | src/components/portfolio/WorkshopCard.test.tsx | PASSED |
| AC-A5 | src/components/layout/Footer.test.ts | PASSED |
| AC-SEO | src/lib/cms/seo.test.ts | PASSED |
| AC-SV | src/components/news/NewsCategoryBadge.test.tsx, src/components/home/LatestNewsStrip.test.tsx | PASSED |
| AC-A1, A6, A7, A8 | Manuell kontroll (bygge, curl, skärmbilder) | PASSED |
