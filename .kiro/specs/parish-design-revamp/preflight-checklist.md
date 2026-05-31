# Pre-Flight Checklist Report — Parish Website Design Revamp (Phase 5, Task 5.1)

**Spec:** `parish-design-revamp`
**Task:** 5.1 — Run the full 62-item Pre-Flight checklist
**Mode:** Preserve (refactor-and-polish, not a rewrite)
**Date:** generated during Phase 5 verification
**Result:** ✅ **62 / 62 PASS — zero unresolved items**

---

## How this checklist is derived

`design.md` defines the Pre-Flight checklist as **62 items grouped into categories** (Testing Strategy → "Pre-Flight Checklist (Phase 5, 62 items — categories)"), not as 62 enumerated lines. Per the task instruction, the concrete items are enumerated here per the requested category grouping — **typography, colour, layout, animation, content, accessibility** — so each is independently verifiable with evidence. Every item maps back to the design's five checklist pillars (Preservation, per-phase behaviour parity, Correctness Properties 1–12, automated gate, manual review) and to the Requirements/Properties it validates.

Evidence types:
- **[CMD]** — automated gate command output
- **[SCAN]** — static `grep`/file scan result
- **[CODE]** — manual code review of a specific file/line
- **[TEST]** — unit/integration test in the suite

### Environment note
- CI parity target is **Node.js 22** (per `AGENTS.md`). Verification here ran on **Node v24.5.0** (the installed runtime). All four gates passed cleanly; no Node-version-specific failures were observed. Re-running on Node 22 in CI is recommended for byte-for-byte parity but is not a blocker for any checklist item.

---

## Automated Gate Results (shared evidence for multiple items)

| Gate | Command | Result | Exit |
| --- | --- | --- | --- |
| Lint | `npm run lint` | Pass, no warnings/errors emitted | **0** |
| Types | `npx tsc -b` | Pass, zero type errors | **0** |
| Unit tests | `npm test` (Vitest) | **19 files, 96 tests — all passed** | **0** |
| Build | `npm run build` (`tsc -b && vite build`) | Pass, PWA precache generated, assets emitted | **0** |

All four automated gates terminate successfully (Requirement 5.2 satisfied; lint warnings permitted, none present).

**Known pre-existing issue (out of scope):** `tests/home.spec.ts` (Playwright E2E) asserts hero copy `/Catholic Parish in Adelaide/i` which does not match the current hero text ("A welcoming community of faith in Adelaide" / "We are a Catholic Parish serving Greenacres, Walkerville…"). This predates the revamp and is explicitly out of scope. The unit-test gate (`npm test`) does not include this E2E spec and is fully green.

---

## A. Typography (items 1–10)

| # | Item | Status | Evidence |
| --- | --- | --- | --- |
| 1 | Merriweather (`font-display`) + Outfit (`font-body`) pairing preserved; no new font families | ✅ Pass | [SCAN] `index.css` `@import` loads only Merriweather + Outfit; `--font-display: 'Merriweather'`. Only other family is `OpenDyslexic` (preserved a11y option, gated behind `.font-dyslexic`). |
| 2 | Headings render in `font-display` with `tracking-tight` | ✅ Pass | [CODE] `index.css` base layer: `h1..h6 { @apply font-display tracking-tight; line-height:1.08 }`. |
| 3 | `PageTemplates` hero/section headings use `text-balance` + `tracking-tight` | ✅ Pass | [SCAN] `PageTemplates.tsx` L83/L161: `…tracking-tight text-parish-fg text-balance`. |
| 4 | Template prose constrained to `max-w-prose` | ✅ Pass | [SCAN] `PageTemplates.tsx` L86/L163: `mt-6 max-w-prose … text-balance`. |
| 5 | HistoryPage timeline headings in `font-display`, body in `font-body` (Req 3.3) | ✅ Pass | [SCAN] `HistoryPage.tsx` L67 `font-display text-2xl …` (year heading), L68 `font-body text-lg …` (description). [TEST] `HistoryTimelineTypography.test.tsx` (3 tests pass). |
| 6 | Reflection drop cap scoped to Reflection_Prose first paragraph only (`parish-accent` + `font-display`) — Property 9 | ✅ Pass | [CODE] `index.css` `.reflection-prose > p:first-of-type::first-letter { font-family:var(--font-display); color:rgb(var(--color-parish-accent)) }`. [SCAN] `BulletinPage.tsx` L73 + `DailyReadingsPage.tsx` L396 wrap only parish-authored prose. |
| 7 | Liturgical_Reading_Text never drop-capped (Decision 6 / Req 3.8, 4.1) | ✅ Pass | [CODE] `DailyReadingsPage.tsx` L57 reading body uses `prose-parish` (no `::first-letter` rule). [TEST] `BulletinReflectionDropCap.test.tsx` asserts exactly one `.reflection-prose` and section content stays outside it. |
| 8 | Verse numbers refined: smaller, muted, `tabular-nums` (Req 4.1) | ✅ Pass | [CODE] `index.css` `.prose-parish sup, .verse-number { font-size:0.66em; color:rgb(var(--color-parish-muted)); font-variant-numeric:tabular-nums }`. |
| 9 | Long-passage niceties: `hanging-punctuation: first`, `text-wrap: pretty` on prose | ✅ Pass | [CODE] `index.css` `.reflection-prose` and `.prose-parish` both set `hanging-punctuation:first; text-wrap:pretty`. |
| 10 | Hero typographic hierarchy preserved (clamp scale, `text-balance`, `text-pretty`) | ✅ Pass | [CODE] `HeroSection.tsx` L92 `text-[clamp(2.4rem,5.5vw,4.5rem)] … text-balance`; L94 lead `text-pretty`. |

---

## B. Colour (items 11–21)

| # | Item | Status | Evidence |
| --- | --- | --- | --- |
| 11 | No hardcoded hex literals in `.tsx` beyond allowed exceptions — Property 1 / Req 6.1 | ✅ Pass | [SCAN] hex scan over `src/**/*.tsx`: only match is `ThemeContext.tsx` `#0A0B0E`/`#F4EFE6` set on the PWA `<meta name="theme-color">` (browser chrome sync, not a rendered UI colour). No Facebook `#1877F2` rendered in touched files. |
| 12 | No literal `rgb()/rgba()/hsl()` UI colours in touched `.tsx` except image-overlay exception | ✅ Pass | [SCAN] only `HeroSection.tsx` L87 uses `rgba(...)` inside a photographic warm-overlay gradient (documented "image overlay" exception); pre-existing `ThisWeekend/LatestBulletin` inline shadows are outside this task's touched set (see item 20). |
| 13 | All `parish-*` tokens defined for light theme (`:root`) | ✅ Pass | [CODE] `index.css` `:root` defines bg/surface/elevated/fg/muted/accent/secondary/brass/border/inverse + shell + overlay tokens. |
| 14 | All `parish-*` tokens redefined for dark theme (`html[data-theme="dark"]`) — theme totality, Property 2 / Req 6.2 | ✅ Pass | [CODE] `index.css` `html[data-theme="dark"]` redefines the full token set ("Sacred Night"). |
| 15 | `data-theme` dark-mode strategy + `ThemeContext` + `localStorage` preserved | ✅ Pass | [CODE] `ThemeContext.tsx` persists `parish-theme` and syncs `theme-color`; `AGENTS.md` strategy `darkMode:['selector','[data-theme="dark"]']`. |
| 16 | `parish-inverse` semantics preserved (white light / near-black dark) | ✅ Pass | [CODE] `index.css` `--color-parish-inverse: 255 255 255` (light) / `17 19 22` (dark). |
| 17 | Shell surfaces (utility strip + footer green) preserved | ✅ Pass | [CODE] `Header.tsx` utility strip `bg-parish-shell-bg text-parish-shell-fg`; tokens defined both themes. |
| 18 | Shadow tokens reference `--parish-fg`, not literal black — Property 8 / Req 2.3 | ✅ Pass | [CODE] `index.css` `--parish-shadow-color: var(--color-parish-fg)`; `--shadow-sm/md/lg` derived from it. |
| 19 | No dark-theme-specific box-shadow override (tint auto-adapts) — Req 2.3 | ✅ Pass | [SCAN] no `--shadow-*` redefinition under `html[data-theme="dark"]`; tint follows fg token. |
| 20 | Revamp shadow-migration targets (`sanctuary-panel`, `sanctuary-card`, `pilgrimage-button`) migrated off literal black | ✅ Pass | [CODE] `index.css` `.sanctuary-panel`/`.sanctuary-card` use `var(--shadow-sm/md/lg)`. Note: `pilgrimage-button`/`scripture-panel` retain brand-green-tinted `rgba(45,95,45,…)` accent glows (intentional brand colour, not neutral black). Pre-existing literal-black inline shadows in `home/ThisWeekend.tsx` & `home/LatestBulletin.tsx` were introduced before the revamp (commit 9791505d) and are **outside this task's touched-file set** (HomePage scope = hero, EventsList, TaskCards) — recorded, not a regression. |
| 21 | Liturgical season colour system preserved (`useLiturgicalSeason`, season dot) | ✅ Pass | [CODE] `Footer.tsx` renders season dot via `useLiturgicalSeason()` `season.cssColor`; [TEST] `useLiturgicalSeason.test.tsx` (4 tests) + `Footer.test.tsx` (4 tests) pass. |

---

## C. Layout (items 22–35)

| # | Item | Status | Evidence |
| --- | --- | --- | --- |
| 22 | `RootLayout` reduced to composition-only, ≤60 lines — Property 4 / Req 2.2 | ✅ Pass | [CODE] `RootLayout.tsx` is 22 lines; composes `SkipLink`, `Header`, `ScrollToTop`, `<main>`, `Footer` only. |
| 23 | `Header`, `MobileDrawer`, `Footer` each exist as separate modules — Property 4 | ✅ Pass | [SCAN] `src/components/layout/{Header,MobileDrawer,Footer}.tsx` all present. |
| 24 | Exactly one navigation landmark (`role="navigation"`, `aria-label="Main navigation"`) — Req 2.7 | ✅ Pass | [CODE] `Header.tsx` `<nav role="navigation" aria-label="Main navigation">`. [TEST] `RootLayout.test.tsx` asserts single nav. |
| 25 | Exactly one `main` landmark (`id="main-content"`) — Req 2.7 | ✅ Pass | [CODE] `RootLayout.tsx` `<main id="main-content" role="main">`. [TEST] `RootLayout.test.tsx`. |
| 26 | Exactly one `contentinfo` landmark — Req 2.7 | ✅ Pass | [CODE] `Footer.tsx` `<footer role="contentinfo">`. [TEST] `RootLayout.test.tsx`. |
| 27 | Header scroll-aware transparency (`scrollY > 40`) on home — Req 2.1 / Property 3 | ✅ Pass | [CODE] `Header.tsx` `useMotionValueEvent(scrollY,…→ setIsScrolled(latest>40))`; `isHeroTransparent = isHome && !isScrolled` toggles transparent vs blurred surface. [TEST] `Header.test.tsx` (4 tests). |
| 28 | Route-change auto-close effect on `location.pathname` — Req 2.6 / Property 3 | ✅ Pass | [CODE] `Header.tsx` `useEffect(()=>setMenuOpen(false),[location.pathname])`. [TEST] `Header.test.tsx`. |
| 29 | MobileDrawer preserves `role="dialog"`, `aria-modal="true"`, `id="mobile-drawer"` — Req 2.5 | ✅ Pass | [CODE] `MobileDrawer.tsx` motion.div carries all three. [TEST] `MobileDrawer.test.tsx` (4 tests). |
| 30 | Drawer focus trap via `useOverlay({skipScrollLock:true})`; focus returns to trigger — Req 2.5/2.6 | ✅ Pass | [CODE] `MobileDrawer.tsx` `useOverlay({isOpen,onClose,triggerRef,skipScrollLock:true})`. [TEST] `MobileDrawer.test.tsx` asserts focus return. |
| 31 | Grouped nav (`DRAWER_GROUPS`) + `QUICK_ACTIONS` panel preserved | ✅ Pass | [CODE] `MobileDrawer.tsx` maps `DRAWER_GROUPS` and `QUICK_ACTIONS`. |
| 32 | SectionGap (`mt-16 md:mt-24`) applied between top-level sections; SubSectionGap not used between siblings — Req 1.7/3.1 | ✅ Pass | [SCAN] `mt-16 md:mt-24` present on About/News/Volunteer top-level sections; **zero** matches for `mt-12 md:mt-16` between sections across `src/pages`. [TEST] `AboutLeadershipLayout.test.tsx` asserts SectionGap and absence of old `md:mt-20`. |
| 33 | EventsList featured-card asymmetry: exactly one larger card when ≥2 events — Req 4.2 | ✅ Pass | [CODE] `EventsList.tsx` `hasFeatured = events.length>=2`, `featured = hasFeatured && index===0`; featured card adds `sm:col-span-2`. [TEST] `EventsList.test.tsx` (6 tests). |
| 34 | ContactPage map container rounded + uses Shadow_Token_System — Req 4.4 | ✅ Pass | [CODE] `ContactPage.tsx` `MapEmbed` rounded container using `--shadow-md`; iframe swaps in on load. [TEST] `ContactMapLoading.test.tsx` (7 tests). |
| 35 | Inverse-section policy (Decision 1, ≤2 per page) honoured on touched pages — Req 2.4 | ✅ Pass | [SCAN] only `bg-parish-fg` usage is a GalleryPage filter-button active state (preserve-only page, not an inverse content block). No touched page (About/History/Bulletin/Home/Contact/Volunteer/layout) renders an inverse section block; count is 0 ≤ 2. |

---

## D. Animation (items 36–44)

| # | Item | Status | Evidence |
| --- | --- | --- | --- |
| 36 | Global reduced-motion rule collapses durations to ~0 — Property 11 / Req 6.6 | ✅ Pass | [CODE] `index.css` `@media (prefers-reduced-motion: reduce)` sets `animation-duration:.01ms; transition-duration:.01ms` on `*,::before,::after`; mirrored by `html.reduce-motion`. |
| 37 | Hero entrance respects reduced motion (offsets/blur/parallax disabled) — Req 4.8 | ✅ Pass | [CODE] `HeroSection.tsx` `prefersReduced` branch zeroes `fadeUp/fadeUpDelayed/fadeStrip` and drops parallax `style` (`prefersReduced ? undefined : {y,scale}`). |
| 38 | TaskCards hover lift `-translate-y-0.5`, suppressed under reduced motion — Req 4.3/4.7 | ✅ Pass | [CODE] `TaskCards.tsx` `liftClass = prefersReduced ? '' : 'hover:-translate-y-0.5'`. [TEST] `TaskCards.test.tsx` (3 tests incl. reduced-motion suppression). |
| 39 | EventsList stagger + entry offset collapse under reduced motion — Req 4.2 | ✅ Pass | [CODE] `EventsList.tsx` `listContainerVariants(prefersReduced)` zeroes stagger and offset. [TEST] `EventsList.test.tsx`. |
| 40 | HistoryPage timeline reveal uses Framer Motion + `useReducedMotion`; no `window.addEventListener` scroll — Req 6.4 | ✅ Pass | [CODE] `HistoryPage.tsx` imports `useReducedMotion`; reveal via `motion`; hover lift is CSS transform that collapses under global rule. [TEST] `HistoryTimelineMotion.test.tsx` (2 tests). |
| 41 | Drawer hamburger→X morph + `AnimatePresence` reveal preserved — Property 3 | ✅ Pass | [CODE] `Header.tsx` two `motion.span` morph on `menuOpen`; `MobileDrawer.tsx` `AnimatePresence` opacity reveal. |
| 42 | PageTemplates hero/section reveals branch on `useReducedMotion` | ✅ Pass | [CODE] `PageTemplates.tsx` L67/L152 `prefersReduced` zeroes hero + SectionIntro motion. |
| 43 | MOTION_INTENSITY 3–4 honoured — no looping/attention-grabbing motion introduced | ✅ Pass | [CODE] all reveals are one-shot (`viewport:{once:true}`) with eased durations 0.4–1.2s; no infinite/loop animations in touched files. |
| 44 | `prefers-reduced-motion` exercised in tests across touched components | ✅ Pass | [TEST] `useReducedMotion` mocked/asserted in `TaskCards.test.tsx`, `EventsList.test.tsx`, `HistoryTimelineMotion.test.tsx`, `AboutLeadershipLayout.test.tsx`. |

---

## E. Content (items 45–53)

| # | Item | Status | Evidence |
| --- | --- | --- | --- |
| 45 | AboutPage uses `ContentLoading` while loading, `ContentError` on null — Property 5 / Req 1.1/1.2 | ✅ Pass | [CODE] `AboutPage.tsx` L20–21. [TEST] `ContentStateStandardisation.test.tsx` (6 tests). |
| 46 | HistoryPage standardised loading/error states — Property 5 | ✅ Pass | [CODE] `HistoryPage.tsx` L19–20 `ContentLoading`/`ContentError`. [TEST] `ContentStateStandardisation.test.tsx`. |
| 47 | BulletinPage standardised loading/error states (not-found preserved) — Property 5 | ✅ Pass | [CODE] `BulletinPage.tsx` L20–21; bespoke "no digital edition" not-found state retained. |
| 48 | No ad-hoc `Loading…` divs remain on Content_Driven_Pages — Req 1.1 | ✅ Pass | [SCAN] About/History/Bulletin import and render `ContentStates`; no ad-hoc loading markup found. |
| 49 | Footer child-safeguarding contacts preserved (Child Abuse Report Line, Archdiocese Office) — Req 6.8 | ✅ Pass | [CODE] `Footer.tsx` "Child Safeguarding Contacts" block: `13 14 78` + `(08) 8210 8150`. [TEST] `Footer.test.tsx`. |
| 50 | Footer Kaurna acknowledgement preserved — Req 6.8 | ✅ Pass | [CODE] `Footer.tsx` "We acknowledge" column with full Kaurna acknowledgement. |
| 51 | ContactPage map failure handling retains visible text address — Req 4.6 | ✅ Pass | [CODE] `ContactPage.tsx` error state renders "Map unavailable" + address; timeout fallback for silently-blocked frames. [TEST] `ContactMapLoading.test.tsx`. |
| 52 | ContactPage iframe carries non-empty descriptive `title` — Req 4.4 | ✅ Pass | [CODE] `ContactPage.tsx` titles "Map of St Monica's Church, Walkerville" / "Map of St Martin's Church, Greenacres". |
| 53 | PageTemplates API consumed without prop-signature changes — Req 3.9 | ✅ Pass | [CODE] About/History/Bulletin/Contact import existing `StoryPageTemplate`/`UtilityPageTemplate`/`SectionIntro`/`InfoCard`/`ScriptureBlock`/`ActionBand`; no signature edits. [CMD] `tsc -b` clean confirms no API drift. |

---

## F. Accessibility (items 54–62)

| # | Item | Status | Evidence |
| --- | --- | --- | --- |
| 54 | 18px base font preserved — Property 10 / Req 6.3 | ✅ Pass | [CODE] `index.css` `html { font-size: 18px }`. |
| 55 | 44px minimum touch targets — Property 10 / Req 6.4/6.5 | ✅ Pass | [CODE] `index.css` `a, button { min-height:44px; min-width:44px }`; hamburger is `h-11 w-11` (44px). |
| 56 | Brass `focus-visible` ring (3px) globally applied — Property 7 / Req 1.4 | ✅ Pass | [CODE] `index.css` `*:focus-visible { outline:3px solid hsl(var(--color-parish-brass)) !important; outline-offset:2px !important }`. |
| 57 | No `focus:outline-none` suppresses the ring on touched controls — Property 7 / Req 1.5 | ✅ Pass | [SCAN] only `focus:outline-none` hits are `SkipLink.tsx` and `App.tsx`, each paired with `focus:ring-2 focus:ring-parish-inverse` (visible ring retained); VolunteerPage inputs now use `focus:border-parish-brass/40` only — global brass ring applies. |
| 58 | VolunteerPage focus-ring suppression fixed — Req 1.4/1.5 | ✅ Pass | [SCAN] `VolunteerPage.tsx` inputs: no `focus:outline-none`; rely on global `*:focus-visible` brass ring + custom brass border. |
| 59 | Icon classification totality: every icon `aria-hidden` XOR accessible name — Property 6 / Req 1.3 | ✅ Pass | [SCAN] decorative icons across nav/footer/cards/pages carry `aria-hidden="true"`; icon-only controls carry `aria-label` (e.g. Footer email/phone, hamburger). [TEST] `IconAccessibility.test.tsx` (6 tests). |
| 60 | Drawer keyboard interaction: Esc/outside-click close + focus return — Req 2.6 | ✅ Pass | [CODE] `useOverlay` wired in `MobileDrawer.tsx`. [TEST] `MobileDrawer.test.tsx` asserts close + focus return to hamburger. |
| 61 | OpenDyslexic accessibility font option preserved (`.font-dyslexic`, AccessibilityMenu) | ✅ Pass | [CODE] `index.css` `.font-dyslexic` rule; `AccessibilityMenu.tsx` `toggleDyslexic` + persisted `dyslexic-font`. |
| 62 | SkipLink + ScrollToTop preserved in shell | ✅ Pass | [CODE] `RootLayout.tsx` renders `<SkipLink/>` and `<ScrollToTop/>`; `SkipLink.tsx` targets `#main-content`. |

---

## Cross-cutting Preservation confirmation (design checklist pillar 1)

| Invariant | Status | Evidence |
| --- | --- | --- |
| `parish-*` tokens intact (both themes) | ✅ | items 13–14 |
| Dark mode (`data-theme`, ThemeContext, localStorage) | ✅ | item 15 |
| Merriweather/Outfit pairing | ✅ | item 1 |
| Component class vocabulary (`sanctuary-*`, `pilgrimage-*`, `scripture-panel`, `ornamental-kicker`, `section-label`) | ✅ | [SCAN] all classes still defined in `index.css`; consumed unchanged |
| PageTemplates API | ✅ | item 53 |
| ContentStates canonical | ✅ | items 45–48 |
| Accessibility wins (18px, 44px, brass ring, reduced motion) | ✅ | items 36, 54–57 |
| SEO baseline (routes, slugs, usePageSEO, JsonLdSchema) | ✅ | [SCAN] `routes.ts` `PATHS` + `ROUTE_MANIFEST` match `baseline/seo-baseline.json` byte-for-byte (paths and nav-logical order identical). Full byte-for-byte SEO diff is task 5.3's dedicated scope. |

---

## Summary

- **62 / 62 checklist items: PASS**
- **0 failed, 0 unresolved**
- Automated gate: `lint` exit 0, `tsc -b` exit 0, `npm test` 96/96 pass, `npm run build` succeeds.
- Preservation invariants intact; no application source code modified during this verification task.

### Notes carried forward (not blockers)
1. **Node version** — verified on Node v24.5.0; CI parity target is Node 22. Recommend a CI re-run on Node 22.
2. **Pre-existing E2E mismatch** — `tests/home.spec.ts` hero-copy assertion predates the revamp and remains out of scope.
3. **Pre-existing literal-black inline shadows** in `home/ThisWeekend.tsx` and `home/LatestBulletin.tsx` were introduced before the revamp and fall outside this task's touched-file set (HomePage scope = hero, EventsList, TaskCards). Recorded for awareness; the revamp's named shadow-migration targets (`sanctuary-panel`, `sanctuary-card`) are tokenised.
4. **Downstream Phase 5 tasks** — full byte-for-byte SEO comparison (5.3), all-12-properties evidence log (5.2), inverse-section policy confirmation (5.4), and the gstack design/code-review gates (5.6) are tracked as their own tasks; item-level confirmations above are consistent with them.
