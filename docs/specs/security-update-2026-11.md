# Spec: Säkerhetsuppdatering Next.js och Sentry (november 2026)

**Status:** Godkänd av David Knape 2026-11-05 (webbtråden)
**Bakgrund:** `npm audit` visade 22 sårbarheter i produktionsberoenden. Två var kritiska: Next.js (DoS via Server Components, cache-förgiftning av middleware-redirects) och @sentry/nextjs (middleware-bypass via tunnel route).
**Omfattning:** patch- och minor-uppgraderingar inom samma huvudversion, inga kodändringar. next 15.5.15 → 15.5.29, eslint-config-next → 15.5.29, @sentry/nextjs 10.56 → 10.78, plus `npm audit fix` utan brytande ändringar.

### AC-001: Inga kritiska sårbarheter kvar
GIVEN produktionsberoendena efter uppgraderingen
WHEN `npm audit --omit=dev` körs
THEN finns 0 kritiska sårbarheter

### AC-002: Inget annat ändras
GIVEN samma kod och samma CMS-innehåll
WHEN `npm run build`, lint, typecheck och testsviten körs
THEN bygget lyckas och lint är rent
AND typfel och testresultat är oförändrade mot main (55 typfel och 50 röda tester, alla i testfiler; de lagas i ett separat steg)

## Resultat
- Sårbarheter: 22 (2 kritiska, 8 höga) → 7 (0 kritiska, 1 hög). Den höga gäller postcss som följer med Next.js och kräver Next 16, en huvudversion. Den tas i ett eget steg.
- Bygget fungerar. Lint: 0 fel. Tester: 628 gröna och 50 röda, oförändrat mot main.

## Spårbarhet
| Kriterium | Kontroll | Status |
|---|---|---|
| AC-001 | `npm audit --omit=dev` | PASSED |
| AC-002 | `next build`, `next lint`, `tsc`, `jest` | PASSED |
