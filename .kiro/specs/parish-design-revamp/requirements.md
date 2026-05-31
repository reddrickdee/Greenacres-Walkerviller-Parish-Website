# Requirements Document

## Introduction

This document derives the requirements for the **Parish Website Design Revamp** from the approved design document (`design.md`). The revamp is a design-quality upgrade in **"Preserve" mode** for the Greenacres Walkerville Catholic Parish website — an existing React 18 + TypeScript SPA (Vite, Tailwind CSS, Framer Motion). The goal is to lift overall design quality without rewriting the system or eroding its "Sacred Editorial" identity.

The work is organised into five sequential phases:

- **Phase 1 — Consistency Fixes** (Requirement 1): low-risk, non-structural fixes (loading/error standardisation, icon accessibility, focus visibility, search button, spacing).
- **Phase 2 — Layout Architecture** (Requirement 2): decompose the 408-line `RootLayout` monolith into `Header`, `MobileDrawer`, `Footer`; add warm-tinted shadow tokens.
- **Phase 3 — Page Upgrades** (Requirement 3): lift `AboutPage`, `HistoryPage`, `BulletinPage` from 3.5 → 4.5.
- **Phase 4 — Editorial Polish** (Requirement 4): drop caps (scoped), home asymmetry/hover lift, ContactPage map polish.
- **Phase 5 — Pre-Flight & Verification** (Requirement 5): 62-item checklist plus automated lint/tsc/test/build gates and ordered Hard Gates.
- **Cross-cutting Preservation** (Requirement 6): invariants that every phase is verified against.

These requirements are written to be traceable to the **Correctness Properties** already seeded in `design.md`. Requirement numbers `1.1`, `1.2`, `1.3`, `2.1`, `2.2`, `2.3`, `4.1`, `6.1`, `6.2`, `6.3`, `6.4`, `6.5` correspond to the `**Validates: Requirements X.Y**` annotations on Properties 1–12.

### Open Decisions (referenced by these requirements)

Six decisions from the design require user resolution and are referenced where relevant:

- **Decision 1 — Inverse sections** vs taste rubric §4.11 → Requirement 2.4.
- **Decision 2 — Non-functional search button** → Requirement 1.4.
- **Decision 3 — Hero layout** (centered vs subtle asymmetry) → Requirement 4.5.
- **Decision 4 — Council member photo treatment** (`rounded-full` vs `rounded-2xl`) → Requirement 3.2.
- **Decision 5 — Timeline interaction** (hover/expand/static) → Requirement 3.4.
- **Decision 6 — Scripture drop-cap constraint** (parish-authored reflection only, never liturgical text) → Requirement 4.1 (this is a firm constraint, not a toggle).

## Glossary

- **Parish_Website**: The Greenacres Walkerville Catholic Parish React 18 + TypeScript SPA as a whole.
- **RootLayout**: The shell component that composes the page skeleton (skip link, header, scroll-to-top, main outlet, footer).
- **Header**: The extracted component owning the utility strip, main navigation, scroll-aware transparency, and the `MobileDrawer` trigger.
- **MobileDrawer**: The extracted full-screen mobile menu overlay with focus trap.
- **Footer**: The extracted 4-column footer component carrying statutory parish content.
- **ContentStates**: The canonical state components `ContentLoading`, `ContentError`, `ContentEmpty`.
- **PageTemplates**: The existing template system (`StoryPageTemplate`, `UtilityPageTemplate`, `HighlightPageTemplate`, `SectionIntro`, `InfoCard`, `ScriptureBlock`, `ActionBand`).
- **Content_Driven_Pages**: Data-backed pages `AboutPage`, `HistoryPage`, `BulletinPage`.
- **AboutPage / HistoryPage / BulletinPage / DailyReadingsPage / HomePage / ContactPage / VolunteerPage**: The named route pages of the site.
- **Shadow_Token_System**: The warm-tinted shadow CSS variables (`--parish-shadow-color`, `--shadow-sm`, `--shadow-md`, `--shadow-lg`) derived from `--parish-fg`.
- **SectionGap**: The canonical between-section vertical rhythm scale `mt-16 md:mt-24`.
- **Reflection_Prose**: Parish-authored reflection text that is eligible for an editorial drop cap.
- **Liturgical_Reading_Text**: Jerusalem Bible liturgical text that is never drop-capped (reverence + licensing).
- **Pre_Flight_Verification**: The Phase 5 gate combining the 62-item checklist, automated tooling, and manual review.
- **Hard_Gates**: The ordered, non-negotiable sequencing gates G1–G7 defined in the design.
- **parish-* tokens**: The established design tokens (`parish-bg`, `parish-surface`, `parish-elevated`, `parish-fg`, `parish-muted`, `parish-accent`, `parish-secondary`, `parish-brass`, `parish-border`, `parish-inverse`, and shell/overlay surfaces).
- **Allowed_Colour_Exceptions**: The documented colour-literal exceptions — `text-white` on image overlays and the Facebook brand colour `#1877F2`.
- **Liturgical_Season_System**: `useLiturgicalSeason`, `liturgicalColour.ts`, and the footer season dot.

## Requirements

### Requirement 1: Phase 1 — Consistency Fixes

**User Story:** As a parish website maintainer, I want low-risk consistency fixes applied across the data-driven pages and the header, so that loading states, icon accessibility, and focus visibility are uniform without any structural change.

#### Acceptance Criteria

1. WHILE a Content_Driven_Page is loading its content, THE Parish_Website SHALL render the ContentStates `ContentLoading` component and SHALL NOT render ad-hoc loading markup.
2. IF a Content_Driven_Page's content resolves to null after loading completes, THEN THE Parish_Website SHALL render the ContentStates `ContentError` component instead of ad-hoc markup.
3. THE Parish_Website SHALL mark every rendered lucide icon as exactly one of: decorative — carrying `aria-hidden="true"` and no accessible name — or meaningful — carrying an accessible name on the icon or on its parent control — with no icon left unclassified.
4. WHEN a focusable control receives keyboard focus-visible state, THE Parish_Website SHALL display the 3px brass `focus-visible` ring on that control.
5. THE Parish_Website SHALL NOT suppress the brass `focus-visible` ring on any focusable control through outline removal (such as `focus:outline-none`).
6. WHERE Decision 2 resolves to removal, THE Header SHALL omit the non-functional Search control; WHERE Decision 2 resolves to implementation, WHEN a user activates the Search control with a non-empty query, THE Parish_Website SHALL display the results matching that query, and SHALL display an empty-results indication when no content matches.
7. WHERE two adjacent sibling top-level sections follow the hero, THE Parish_Website SHALL apply the SectionGap scale (`mt-16 md:mt-24`) between them and SHALL NOT apply the SubSectionGap scale (`mt-12 md:mt-16`) between top-level sections.

### Requirement 2: Phase 2 — Layout Architecture

**User Story:** As a developer maintaining the codebase, I want the `RootLayout` monolith decomposed into focused components and the shadow system tokenised, so that the shell is maintainable and behaviour is preserved.

#### Acceptance Criteria

1. WHILE the home route is active and the vertical scroll offset is at most 40 pixels, THE Header SHALL render the main navigation bar with a transparent background; WHEN the vertical scroll offset exceeds 40 pixels, THE Header SHALL render the main navigation bar with its blurred surface background.
2. WHEN the layout refactor is complete, THE RootLayout SHALL contain composition-only markup of at most 60 lines, AND THE Header, MobileDrawer, and Footer SHALL each exist as a separate module.
3. WHERE a component defines a box-shadow, THE Parish_Website SHALL reference the Shadow_Token_System tokens (`--shadow-sm`, `--shadow-md`, `--shadow-lg`) derived from `--parish-fg` rather than literal `rgba(0,0,0,…)` values, AND SHALL declare no theme-specific box-shadow override for the dark theme.
4. WHERE inverse sections (`bg-parish-fg text-parish-surface`) are used, per Decision 1 THE Parish_Website SHALL retain them as a bounded "Color Block Story" exception limited to at most two per page.
5. WHILE the MobileDrawer is open, THE MobileDrawer SHALL expose `role="dialog"` and `aria-modal="true"`, AND SHALL confine keyboard focus to descendants of the drawer overlay.
6. WHEN a user presses Escape, clicks outside the MobileDrawer, or navigates to a new route while the MobileDrawer is open, THE Parish_Website SHALL close the MobileDrawer and return keyboard focus to the hamburger trigger control.
7. WHEN the header, drawer, and footer concerns are extracted from RootLayout, THE Parish_Website SHALL preserve exactly one navigation landmark (`role="navigation"` with `aria-label="Main navigation"`), one `main` landmark (`id="main-content"`), and one `contentinfo` landmark.

### Requirement 3: Phase 3 — Page Upgrades

**User Story:** As a parishioner, I want the About, History, and Bulletin pages lifted to the same editorial quality as the gold-standard pages, so that the site feels cohesive and reverent.

#### Acceptance Criteria

1. WHEN AboutPage is upgraded, THE AboutPage SHALL present its leadership and parish council members using the existing card vocabulary (`InfoCard` / `sanctuary-card`) without introducing new card component types, and SHALL apply the SectionGap scale (`mt-16 md:mt-24`) between its top-level sections.
2. WHERE council member photos are displayed, THE AboutPage SHALL render every council member photo with the identical shape treatment resolved by Decision 4 (`rounded-full` or `rounded-2xl`), with no mixing of photo shapes across the page.
3. WHEN HistoryPage is upgraded, THE HistoryPage SHALL render timeline entry headings in `font-display` (Merriweather) and timeline body copy in `font-body` (Outfit), introducing no new font families.
4. WHERE Decision 5 resolves to hover lift, WHEN a user hovers a timeline entry with a pointer, THE HistoryPage SHALL apply a hover lift of `-translate-y-0.5` to that entry.
5. WHERE Decision 5 resolves to click-to-expand, WHEN a user activates a timeline entry, THE HistoryPage SHALL toggle that entry between collapsed and expanded states and SHALL convey the current expanded or collapsed state to assistive technology.
6. WHERE Decision 5 resolves to static, THE HistoryPage SHALL render timeline entries with no interactive hover or expand affordance.
7. WHERE a BulletinPage text block is Reflection_Prose, WHEN BulletinPage renders that block, THE BulletinPage SHALL apply the `::first-letter` drop cap to the block's first paragraph using `parish-accent` and `font-display`.
8. WHERE a BulletinPage text block is Liturgical_Reading_Text, THE BulletinPage SHALL render it as plain reverent prose with no drop cap.
9. THE AboutPage, HistoryPage, and BulletinPage SHALL consume the existing PageTemplates API without requiring any change to template prop signatures.

### Requirement 4: Phase 4 — Editorial Polish

**User Story:** As a parishioner reading reflections and event listings, I want refined editorial typography and subtle interactive polish, so that the content is more inviting while remaining reverent and accessible.

#### Acceptance Criteria

1. WHERE a text block is Reflection_Prose, THE DailyReadingsPage SHALL apply the `::first-letter` drop cap to that block's first paragraph only, using `parish-accent` and `font-display`; WHERE a text block is Liturgical_Reading_Text, THE DailyReadingsPage SHALL render it without a drop cap or any first-letter decoration.
2. WHILE the home `EventsList` renders two or more events, THE HomePage SHALL present exactly one featured card occupying a larger layout span than the remaining uniformly-sized event cards, consistent with the `DESIGN_VARIANCE` 4–5 dial.
3. WHILE a user hovers an interactive `TaskCard` with a pointer, THE HomePage SHALL apply a hover lift of `-translate-y-0.5` to that card, and SHALL revert the lift when the pointer leaves.
4. WHILE a ContactPage Google Maps iframe is loading, THE ContactPage SHALL display a visible loading indicator within a rounded container that uses the Shadow_Token_System tokens, AND SHALL set a non-empty iframe `title` naming the mapped location.
5. WHEN a ContactPage Google Maps iframe finishes loading, THE ContactPage SHALL replace the loading indicator with the loaded map.
6. IF a ContactPage Google Maps iframe fails to load or is blocked, THEN THE ContactPage SHALL display a map-unavailable indication and SHALL retain the visible text address.
7. WHILE `prefers-reduced-motion` is set to `reduce`, THE HomePage SHALL suppress the `TaskCard` hover lift.
8. WHERE Decision 3 selects a hero layout variant, THE HomePage SHALL apply the selected hero layout (centered or subtle asymmetry).

### Requirement 5: Phase 5 — Pre-Flight & Verification

**User Story:** As a release manager, I want each phase verified against a checklist, ordered gates, and automated tooling before it is marked complete, so that the revamp never regresses preservation invariants.

#### Acceptance Criteria

1. WHILE a phase is not yet verified, THE Pre_Flight_Verification SHALL prevent that phase from being marked complete until all 62 checklist items are recorded as pass with zero items in a failed or unresolved state.
2. WHEN the automated verification gate runs for a phase, THE Pre_Flight_Verification SHALL require all four commands to terminate successfully: `npm run lint` exiting 0 with warnings permitted, `npx tsc -b` completing with zero type errors, `npm test` completing with all tests passing, and `npm run build` completing successfully.
3. WHERE a phase modifies layout, WHEN that phase is verified, THE Pre_Flight_Verification SHALL require a keyboard-only walkthrough of every touched page that confirms logical focus order, a visible brass `focus-visible` ring on each interactive control, and the absence of keyboard traps.
4. THE Hard_Gates SHALL be satisfied in their defined order G1 through G7 such that each gate is confirmed satisfied before work on the next gate begins.
5. WHEN Correctness Properties 1–12 are evaluated for a phase, THE Pre_Flight_Verification SHALL require each of the twelve properties to be recorded as pass with verification evidence — an automated test result, static scan output, or manual review note — before the phase may be marked complete.
6. WHERE a phase modifies layout, WHEN that phase is verified, THE Pre_Flight_Verification SHALL require a light-theme and dark-theme screenshot review of every touched page confirming that only the intended changes are present with no unintended visual regressions.
7. IF any of the four automated gate commands terminates with a non-zero exit status, with `npm run lint` warnings excepted, THEN THE Pre_Flight_Verification SHALL keep the phase marked incomplete and record which command failed.

### Requirement 6: Cross-cutting Preservation

**User Story:** As a parish stakeholder, I want the Sacred Editorial identity, accessibility wins, and SEO baseline preserved, so that the revamp upgrades quality without eroding the established system.

#### Acceptance Criteria

1. THE Parish_Website SHALL restrict colour literals — hex values, `rgb()`/`rgba()`, `hsl()`/`hsla()`, and named CSS colours — in `.tsx` files to the Allowed_Colour_Exceptions, using parish-* tokens for every other colour.
2. WHERE a component is changed, WHILE the active theme is light or dark, THE Parish_Website SHALL render the component such that every referenced parish-* token resolves to a defined, non-empty computed value, with no fallback to an unresolved or invalid variable.
3. THE Parish_Website SHALL maintain an 18px base font size.
4. THE Parish_Website SHALL render every interactive control with a touch target of at least 44px in both width and height.
5. IF an interactive control's intrinsic size is below 44px in either dimension, THEN THE Parish_Website SHALL extend its hit area to at least 44px by 44px.
6. WHILE `prefers-reduced-motion` is set to `reduce`, THE Parish_Website SHALL collapse every animation and transition to a duration of at most 0.01 seconds (10 milliseconds).
7. THE Parish_Website SHALL preserve the route set, slugs, `usePageSEO` metadata outputs, and `JsonLdSchema` payloads such that each is byte-for-byte identical to its pre-revamp baseline.
8. THE Footer SHALL preserve the child safeguarding contacts (Child Abuse Report Line, Archdiocese Office) and the Aboriginal/Torres Strait (Kaurna) acknowledgement.
9. THE Parish_Website SHALL preserve the Merriweather (`font-display`) and Outfit (`font-body`) type pairing without introducing new font families.
10. THE Parish_Website SHALL preserve the Liturgical_Season_System.
11. THE Parish_Website SHALL preserve the component class vocabulary (`sanctuary-*`, `pilgrimage-*`, `scripture-panel`, `ornamental-kicker`, `section-label`), extending class names rather than renaming them.
