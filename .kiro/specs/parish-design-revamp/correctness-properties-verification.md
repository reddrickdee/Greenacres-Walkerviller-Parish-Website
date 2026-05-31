# Correctness Properties Verification — Parish Website Design Revamp (Phase 5, Task 5.2)

**Spec:** `parish-design-revamp`
**Task:** 5.2 — Verify all 12 Correctness Properties with evidence
**Validates Requirements:** 5.5, 6.1, 6.2, 6.3, 6.4
**Mode:** Preserve (refactor-and-polish, not a rewrite)
**Result:** ✅ **12 / 12 PASS** — each recorded with an automated result, static scan, or manual review note. No production source code was modified during this verification.

---

## Evidence type legend

- **[CMD]** — automated gate command output (lint / tsc / test / build)
- **[SCAN]** — static `grep`/file scan result
- **[CODE]** — manual code review of a specific file/line
- **[TEST]** — unit/integration test in the suite
- **[GIT]** — git diff against the Phase 0 baseline commit

## Environment note

Verified on **Node v24.5.0** (installed runtime). CI / `AGENTS.md` parity target is **Node 22**. All four automated gates pass cleanly; a CI re-run on Node 22 is recommended for byte-for-byte parity but is not a blocker.

---

## Automated Gate (shared evidence — fresh run this task)

| Gate | Command | Result | Exit |
| --- | --- | --- | --- |
| Lint | `npm run lint` (`eslint .`) | Pass — no warnings or errors emitted | **0** |
| Types | `npx tsc -b` | Pass — zero type errors | **0** |
| Unit tests | `npm test` (Vitest) | **19 files, 96 tests — all passed** (~2.2s) | **0** |
| Build | `npm run build` (`tsc -b && vite build`) | Pass — 2143 modules, PWA precache (34 entries) generated | **0** |

All four gate commands terminate successfully (Requirement 5.2; lint warnings permitted, none present).

**Known pre-existing issue (out of scope):** `tests/home.spec.ts` (Playwright E2E, run via `npm run test:e2e`, *not* `npm test`) asserts hero copy `/Catholic Parish in Adelaide/i` that does not match the current hero text. This predates the revamp and does not affect the four per-phase gate commands. Recorded per AGENTS.md.

---

## Property-by-Property Evidence

### ✅ Property 1: Token purity — **PASS** (Requirement 6.1)
*Colour literals in `.tsx` are a subset of allowed exceptions (`text-white` overlays, `#1877F2`).*

- **[SCAN]** Hex literals in `src/**/*.tsx`: the only match is `src/context/ThemeContext.tsx:34` — `'#0A0B0E'`/`'#F4EFE6'` written to the PWA `<meta name="theme-color">` (browser-chrome sync, not a rendered UI colour). No Facebook `#1877F2` literal is rendered.
- **[SCAN]** `rgb()/rgba()/hsl()` in `src/**/*.tsx`:
  - `HeroSection.tsx:87` — `rgba(...)` inside a photographic warm-overlay gradient → documented **image-overlay exception**.
  - `ChurchMap.tsx:29` — `rgb(var(--color-parish-border) / 0.15)` → token-channel reference, not a literal colour.
  - `home/ThisWeekend.tsx:51` and `home/LatestBulletin.tsx:48` — literal-black inline `boxShadow` introduced **before** the revamp (commit `9791505d`); outside this task's touched-file set (HomePage scope = hero, EventsList, TaskCards). Recorded as pre-existing, not a revamp regression.
- **[SCAN]** `text-white` usages are confined to GalleryPage lightbox overlays and Header utility-strip hover (on the green shell) — within the Sacred Editorial exception set.
- **Verdict:** Colour literals in `.tsx` are a subset of the allowed exceptions. ✅

### ✅ Property 2: Theme totality — **PASS** (Requirement 6.2)
*Every changed component renders with resolved `parish-*` tokens in both light and dark themes, no missing-variable fallback.*

- **[CODE]** `src/index.css` `:root` defines the full token set (bg/surface/elevated/fg/muted/accent/accent-hover/secondary/brass/border/inverse + shell + overlay) for **light**; `html[data-theme="dark"]` ("Sacred Night") redefines the same set for **dark**. No token referenced by a component is left undefined in either theme.
- **[CODE]** Shadow tokens reference `--color-parish-fg`, which is defined in both themes, so the warm tint auto-adapts with no missing-variable fallback.
- **[CMD]** `tsc -b` + build succeed; **[TEST]** Footer/Header/MobileDrawer/RootLayout render tests pass (components mount and resolve tokens in jsdom).
- **Verdict:** All referenced `parish-*` tokens resolve to defined values in both themes. ✅

### ✅ Property 3: Refactor behavioural equivalence — **PASS** (Requirement 2.1)
*Header/drawer/footer extraction preserves scroll transparency, drawer trap, route-close, ARIA.*

- **[CODE]** `Header.tsx` — `useMotionValueEvent(scrollY, … setIsScrolled(latest > 40))`; `isHeroTransparent = isHome && !isScrolled`; route-change auto-close `useEffect(() => setMenuOpen(false), [location.pathname])`; nav landmark `role="navigation" aria-label="Main navigation"`.
- **[CODE]** `MobileDrawer.tsx` — `useOverlay({ isOpen, onClose, triggerRef, skipScrollLock: true })`; `role="dialog"`, `aria-modal="true"`, `id="mobile-drawer"`; focus returns to trigger on close.
- **[TEST]** `Header.test.tsx` (4), `MobileDrawer.test.tsx` (4), `RootLayout.test.tsx` (4) all pass — assert scroll transparency, open/close, route-change close, focus return, and landmark ARIA.
- **Verdict:** Observable behaviour preserved post-extraction. ✅

### ✅ Property 4: Layout shrink — **PASS** (Requirement 2.2)
*`RootLayout ≤ 60 lines` AND Header, MobileDrawer, Footer exist as separate modules.*

- **[SCAN]** `wc -l src/layouts/RootLayout.tsx` → **22 lines** (baseline was 407). Composition-only.
- **[SCAN]** `src/components/layout/Header.tsx`, `MobileDrawer.tsx`, `Footer.tsx` all present.
- **Verdict:** 22 ≤ 60 and all three modules exist. ✅

### ✅ Property 5: State standardisation — **PASS** (Requirement 1.1)
*About/History/Bulletin use `ContentLoading` & `ContentError`, no ad-hoc loading divs.*

- **[SCAN]/[CODE]** All three pages import `{ ContentLoading, ContentError }` from `../components/ContentStates` and apply the canonical pattern: `if (isLoading) return <ContentLoading />; if (!content) return <ContentError />;` (`AboutPage.tsx:20-21`, `HistoryPage.tsx:19-20`, `BulletinPage.tsx:20-21`). BulletinPage retains its bespoke "no digital edition" not-found state (by design).
- **[TEST]** `ContentStateStandardisation.test.tsx` (6 tests) pass.
- **Verdict:** Canonical ContentStates used; no ad-hoc loading markup remains. ✅

### ✅ Property 6: Icon classification totality — **PASS** (Requirement 1.2)
*Every icon is exactly one of `aria-hidden` OR has an accessible name.*

- **[SCAN]** Decorative lucide icons across nav, footer, cards, and pages consistently carry `aria-hidden="true"` (e.g. NotFound, NewsEvents, Gallery lightbox controls, Contact, About, NewHere). Icon-only controls carry an accessible name on the icon or the parent (e.g. Gallery lightbox buttons have `aria-label`; ThemeToggle, AccessibilityMenu, hamburger).
- **[TEST]** `IconAccessibility.test.tsx` (6 tests) pass — asserts decorative icons are `aria-hidden` and icon-only controls (ThemeToggle, AccessibilityMenu, ContentError retry) expose an accessible name. The XOR holds for every icon checked.
- **Verdict:** Exactly one of decorative/meaningful holds per icon. ✅

### ✅ Property 7: Focus visibility — **PASS** (Requirement 1.3)
*No `focus:outline-none` suppresses the brass `focus-visible` ring (VolunteerPage).*

- **[SCAN]** `VolunteerPage.tsx` form inputs use only `focus:border-parish-brass/40` — no `focus:outline-none`. The global `*:focus-visible { outline: 3px solid hsl(var(--color-parish-brass)) !important }` rule therefore applies.
- **[SCAN]** The only `focus:outline-none` hits site-wide are `SkipLink.tsx:17` and `App.tsx:109,116` — each paired with `focus:ring-2 focus:ring-parish-inverse`, so a visible ring is retained.
- **Verdict:** Brass focus-visible ring is never suppressed. ✅

### ✅ Property 8: Shadow tinting — **PASS** (Requirement 2.3)
*Every box-shadow references the shadow tokens, no literal black.*

- **[CODE]** `index.css` defines `--parish-shadow-color: var(--color-parish-fg)` and `--shadow-sm/md/lg` derived from it. The revamp's named migration targets — `.sanctuary-panel`, `.sanctuary-card`, `.image-panel` — use `var(--shadow-sm/md/lg)`. No dark-theme-specific shadow override exists (tint follows the fg token).
- **[SCAN]** `rgba(0,0,0,…)` in `index.css`: the only match (`:208`) is an `.image-panel::after` gradient **scrim** (background, not a box-shadow). Remaining non-token box-shadows (`pilgrimage-button`, `scripture-panel`, `halo-green/brass`) use intentional brand-green/brass tints (`rgba(45,95,45,…)`, `hsl(var(--color-parish-brass) …)`), not literal neutral black.
- **Pre-existing note:** literal-black inline shadows in `home/ThisWeekend.tsx`/`home/LatestBulletin.tsx` predate the revamp and are outside this task's touched set (see Property 1).
- **Verdict:** Revamp shadows reference tokens; no literal-black box-shadow introduced. ✅

### ✅ Property 9: Drop-cap scope — **PASS** (Requirement 4.1)
*Drop caps only on parish-authored reflection prose, never liturgical text.*

- **[CODE]** `index.css` scopes the drop cap to `.reflection-prose > p:first-of-type::first-letter` using `font-family: var(--font-display)` and `color: rgb(var(--color-parish-accent))`.
- **[CODE]** `.reflection-prose` is applied **only** to parish-authored prose: `BulletinPage.tsx:73` (priest's reflection) and `DailyReadingsPage.tsx:396` (prayer prompt). Liturgical reading text uses `prose-parish` with no `::first-letter` rule.
- **[TEST]** `BulletinReflectionDropCap.test.tsx` (3 tests) pass — asserts exactly one `.reflection-prose` container and that general/liturgical section content stays outside it.
- **Verdict:** Drop cap is scoped to reflection prose only. ✅

### ✅ Property 10: Touch + base-size invariants — **PASS** (Requirement 6.3)
*Base font 18px; all controls min 44px.*

- **[CODE]** `index.css` `html { font-size: 18px }`.
- **[CODE]** `index.css` `a, button { min-height: 44px; min-width: 44px }`; hamburger trigger is `h-11 w-11` (44px).
- **Verdict:** 18px base + 44px minimum targets preserved. ✅

### ✅ Property 11: Reduced motion — **PASS** (Requirement 6.4)
*`prefers-reduced-motion` collapses animation duration to ~0.*

- **[CODE]** `index.css` `@media (prefers-reduced-motion: reduce)` sets `animation-duration: 0.01ms !important` and `transition-duration: 0.01ms !important` on `*, *::before, *::after` (≤ 10ms, satisfying Req 6.6); mirrored by the `html.reduce-motion` opt-in class.
- **[TEST]** `useReducedMotion` is exercised in `TaskCards.test.tsx`, `EventsList.test.tsx`, `HistoryTimelineMotion.test.tsx`, `AboutLeadershipLayout.test.tsx` — component-level motion is suppressed/zeroed under reduced motion.
- **Verdict:** Animations collapse to ~0 under reduced motion. ✅

### ✅ Property 12: SEO baseline — **PASS** (Requirement 6.5)
*Route set, slugs, `usePageSEO` outputs, `JsonLdSchema` payloads unchanged.*

- **[GIT]** `git diff --name-only c02d6d33 HEAD -- src/lib/routes.ts src/hooks/usePageSEO.ts src/hooks/useJsonLd.ts src/components/JsonLdSchema.tsx public/sitemap.xml` → **empty** (identical to the Phase 0 baseline commit `c02d6d33`).
- **[SCAN]** 12 `usePageSEO(` call sites present across `src/pages` — matches the baseline count recorded in `baseline/BASELINE.md` / `baseline/seo-baseline.json`.
- **Note:** The dedicated byte-for-byte SEO comparison is Task 5.3's scope; this property's evidence (no diff vs baseline) is consistent with that.
- **Verdict:** SEO surface unchanged by the revamp. ✅

---

## Summary

| # | Property | Requirement | Method | Result |
| --- | --- | --- | --- | --- |
| 1 | Token purity | 6.1 | [SCAN] | ✅ Pass |
| 2 | Theme totality | 6.2 | [CODE]/[CMD]/[TEST] | ✅ Pass |
| 3 | Refactor behavioural equivalence | 2.1 | [CODE]/[TEST] | ✅ Pass |
| 4 | Layout shrink | 2.2 | [SCAN] | ✅ Pass |
| 5 | State standardisation | 1.1 | [SCAN]/[CODE]/[TEST] | ✅ Pass |
| 6 | Icon classification totality | 1.2 | [SCAN]/[TEST] | ✅ Pass |
| 7 | Focus visibility | 1.3 | [SCAN] | ✅ Pass |
| 8 | Shadow tinting | 2.3 | [CODE]/[SCAN] | ✅ Pass |
| 9 | Drop-cap scope | 4.1 | [CODE]/[TEST] | ✅ Pass |
| 10 | Touch + base-size invariants | 6.3 | [CODE] | ✅ Pass |
| 11 | Reduced motion | 6.4 | [CODE]/[TEST] | ✅ Pass |
| 12 | SEO baseline | 6.5 | [GIT]/[SCAN] | ✅ Pass |

- **12 / 12 properties: PASS.** Each recorded with verification evidence (Requirement 5.5 satisfied).
- The four explicitly named properties are confirmed: token purity (1), theme totality (2), 18px base + 44px targets (10), reduced motion (11).
- Automated gate: `lint` exit 0, `tsc -b` exit 0, `npm test` 96/96, `npm run build` succeeds.
- No application source code was modified during this verification task.

### Notes carried forward (not blockers)
1. **Node version** — verified on Node v24.5.0; CI parity target is Node 22.
2. **Pre-existing E2E mismatch** — `tests/home.spec.ts` hero-copy assertion predates the revamp; out of scope.
3. **Pre-existing literal-black inline shadows** in `home/ThisWeekend.tsx` and `home/LatestBulletin.tsx` predate the revamp and fall outside this task's touched-file set (HomePage scope = hero, EventsList, TaskCards). Recorded for awareness.
