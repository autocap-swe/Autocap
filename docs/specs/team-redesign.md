# Spec: Team page redesign – Group management, Group functions, Board

**Status:** Approved by David Knape 2026-11-06 ("Ja gör det"), preview before publish.
**Reference:** humblegroup.com/sv/about-us/management (list + detail panel, team card row). No shareholdings shown.

## Scope
- Management section becomes a master–detail showcase on large screens: list of names on the left, one selected profile in a dark panel on the right (photo, title, bio, education, e-mail, LinkedIn). Below `lg` every profile is shown in full, stacked.
- New section "Group functions / Koncernfunktioner": team members that are neither management nor board. Portrait cards with name and title only.
- Board section unchanged in behaviour.
- Headings: EN "Group management", "Group functions", "Board of Directors"; SV "Koncernledning", "Koncernfunktioner", "Styrelse".
- No CMS schema change: group functions = `!isManagement && !isBoard`.

## Acceptance criteria

### AC-T1: Team is split into three groups
GIVEN team members from the CMS
WHEN the page groups them
THEN management = isManagement, board = isBoard, group functions = neither
AND each group keeps CMS order

### AC-T2: First manager is selected by default
GIVEN the management showcase with several members
WHEN it renders
THEN the first member's bio is shown in the detail panel
AND the first list item is marked as selected (aria-pressed=true)

### AC-T3: Selecting another manager
GIVEN the management showcase
WHEN the visitor clicks another name in the list
THEN that member's bio, title and e-mail are shown in the panel

### AC-T4: Group function card
GIVEN a group function member
WHEN the card renders
THEN name and title are shown, bio is not
AND a photo is shown when present, otherwise initials

### AC-T5: Empty group is hidden
GIVEN no group function members
WHEN the page renders
THEN the Group functions section is not rendered

## Traceability
| Criterion | Test File | Test Name | Status |
|-----------|-----------|-----------|--------|
| AC-T1 | src/components/team/split-team.test.ts | splits members into management, functions and board | PASSED |
| AC-T2 | src/components/team/ManagementShowcase.test.tsx | selects the first member by default | PASSED |
| AC-T3 | src/components/team/ManagementShowcase.test.tsx | shows another member when clicked | PASSED |
| AC-T4 | src/components/team/GroupFunctionCard.test.tsx | shows name and title, no bio | PASSED |
| AC-T5 | src/components/team/split-team.test.ts | returns empty functions list when none | PASSED |
