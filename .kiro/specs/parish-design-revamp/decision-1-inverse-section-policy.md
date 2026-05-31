# Decision 1 — Inverse-Section Policy (Phase 5, Task 5.4)

**Spec:** `parish-design-revamp`
**Task:** 5.4 — Confirm inverse-section policy (Decision 1)
**Validates Requirements:** 2.4
**Mode:** Preserve (refactor-and-polish, not a rewrite)

---

## Decision

**Option A — CONFIRMED (resolved by the user).**

Keep inverse / "color block" sections, justified under the `design-taste-frontend` v2 §4.11
**"Color Block Story"** exception, limited to **at most two per page**.

Option B (redesign inverse sections with `parish-elevated` shades) was **not** chosen and is not
applied.

This preserves the Sacred Editorial identity with a bounded, intentional exception rather than
flattening the parish's signature green scripture panels into neutral surface shades.

> **Requirement 2.4:** WHERE inverse sections (`bg-parish-fg text-parish-surface`) are used, per
> Decision 1 THE Parish_Website SHALL retain them as a bounded "Color Block Story" exception
> limited to at most two per page.

---

## What counts as a "Color Block Story" / inverse section

| Element | CSS class | Background | Treatment | Counts? |
| --- | --- | --- | --- | --- |
| Strict inverse section | `bg-parish-fg text-parish-surface` | foreground (dark in light theme / light in dark theme) | full theme-flip block | **Yes** |
| `ScriptureBlock` | `.scripture-panel` | green/gold gradient (`parish-accent` → deep green) + `text-white` | full color-block panel | **Yes** |
| `ActionBand` | `.sanctuary-panel` | `bg-parish-surface` (neutral, same theme family) | elevated neutral card | **No** — same-theme surface tint, not a color block |
| `InfoCard` / `sanctuary-card` | `.sanctuary-card` | `bg-parish-surface` | neutral elevated card | **No** |
| Gallery category filter (active) | `bg-parish-fg text-parish-inverse` | foreground | a **control** (button), not a section | **No** — not a page section |

Rationale: §4.11 forbids flipping a section into a *different theme family* mid-scroll. A
`bg-parish-surface` band (`ActionBand`) stays within the active theme family, so it is a permitted
section-level tint, not a "Color Block Story". Only the green gradient `ScriptureBlock` (and any
strict `bg-parish-fg text-parish-surface` block, of which there are none) flips into a distinct
color-block treatment and therefore counts toward the ≤2 limit.

---

## Per-page audit (static scan of `src/pages/**` and `src/components/**`)

Method: `grep` for `bg-parish-fg`, `bg-parish-inverse`, `text-parish-surface`, `scripture-panel`,
`ScriptureBlock`, `ActionBand`, and accent-gradient section backgrounds across all `.tsx` sources.

| Page | Color-Block Story sections | Detail | Within ≤2? |
| --- | --- | --- | --- |
| HomePage (`HomePage.tsx` + `components/home/*`) | **0** | No `ScriptureBlock`, no strict inverse section. | ✅ |
| AboutPage | **1** | `ScriptureBlock` "Parish Prayer" (`AboutPage.tsx:76`). `ActionBand` present but neutral (not counted). | ✅ |
| HistoryPage | **0** | Only a neutral `ActionBand` (not counted). | ✅ |
| BulletinPage | **0** | Only a neutral `ActionBand` (not counted). | ✅ |
| DailyReadingsPage | **0** | No color-block sections. | ✅ |
| ContactPage | **0** | Only a neutral `ActionBand` (not counted). | ✅ |
| VolunteerPage | **1** | `ScriptureBlock` "1 Peter 4:10" (`VolunteerPage.tsx:106`). `ActionBand` neutral (not counted). | ✅ |
| NewHerePage | **1** | `ScriptureBlock` "Matthew 11:28" (`NewHerePage.tsx:65`). `ActionBand` neutral (not counted). | ✅ |
| NewsEventsPage | **0** | Only a neutral `ActionBand` (not counted). | ✅ |
| MassTimesPage | **0** | Only a neutral `ActionBand` (not counted). | ✅ |
| GalleryPage | **0** | `bg-parish-fg text-parish-inverse` is the active **filter button** (a control), not a section. `ActionBand` neutral. | ✅ |
| NotFoundPage | **0** | No color-block sections. | ✅ |

**Maximum on any page: 1** (AboutPage, VolunteerPage, NewHerePage). Every page is within the
Option A limit of ≤ 2 per page.

### Strict inverse-section pattern (`bg-parish-fg text-parish-surface`)

Not used as a page section anywhere in the codebase. The only `bg-parish-fg` occurrence is the
GalleryPage category-filter active state on a button control, which is out of scope for the
section-level policy.

---

## Outcome

- **No code changes required.** The codebase is already compliant with Option A: every page has at
  most one Color-Block Story section (well under the limit of two), and no page renders the strict
  inverse-section theme-flip pattern.
- This task is a **confirm-and-document** decision checkpoint. The bounded "Color Block Story"
  exception is hereby recorded as the project policy for Requirement 2.4.
- Cross-reference: Pre-Flight checklist item 35 already records this policy as Pass; this document
  is the authoritative Decision 1 record it points to.

## Verification (per AGENTS.md)

| Gate | Command | Result | Exit |
| --- | --- | --- | --- |
| Lint | `npm run lint` (`eslint .`) | Pass — no warnings or errors | **0** |
| Types | `npx tsc -b` | Pass — zero type errors | **0** |
| Unit tests | `npm test` (Vitest) | **19 files, 96 tests — all passed** (~2.3s) | **0** |
| Build | `npm run build` (`tsc -b && vite build`) | Pass — 2146 modules, PWA precache (34 entries) | **0** |

No production source was modified for this confirm-and-document task, so the baseline green state is
preserved and light/dark theme behaviour is unchanged.

**Known pre-existing issue (out of scope):** `tests/home.spec.ts` (Playwright E2E, run via
`npm run test:e2e`, not `npm test`) asserts hero copy `/Catholic Parish in Adelaide/i` that does not
match the current hero text. This predates the revamp and does not affect the four gate commands.
