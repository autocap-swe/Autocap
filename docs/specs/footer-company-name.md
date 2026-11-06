# Spec: Footer – bolagsnamn en gång, svensk positionering

**Status:** Godkänd av David Knape 2026-11-05 (webbtråden)
**Bakgrund:** Bottenraden i sidfoten visade "AutoCap Group Sweden AB · AutoCap Group Sweden AB · Nybrogatan 7…", eftersom komponenten lägger till `COMPANY_INFO.name` och översättningen `footer.bottomBar` också innehöll namnet. Sajten positioneras som svensk ("Swedish"), inte nordisk.

### AC-001: Bolagsnamnet visas en gång
GIVEN sidfoten renderas på engelska eller svenska
WHEN bottenraden visas
THEN står "AutoCap Group Sweden AB" exakt en gång

### AC-002: Adressen visas
GIVEN sidfoten renderas
THEN innehåller bottenraden "Nybrogatan 7, Stockholm"

### AC-003: Engelsk tagline är svensk, inte nordisk
GIVEN den engelska sidfoten och reservtitlarna
THEN innehåller de inte "Nordic"

## Spårbarhet
| Kriterium | Testfil | Test | Status |
|---|---|---|---|
| AC-001 | src/components/layout/Footer.test.ts | shows the company name exactly once | PASSED |
| AC-002 | src/components/layout/Footer.test.ts | shows the street address | PASSED |
| AC-003 | src/components/layout/Footer.test.ts | positions AutoCap as Swedish, not Nordic | PASSED |

**Ändrat 2026-11-06:** David beslutade att AutoCap ska positioneras som nordisk överallt ("The Nordic tire services platform" / "Den nordiska plattformen för däckservice"). AC-003 är ersatt av AC-A5.4 i `fas-a-ratta.md`.
