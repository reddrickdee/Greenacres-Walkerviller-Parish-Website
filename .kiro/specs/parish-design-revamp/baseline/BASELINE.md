# Pre-Revamp Baseline — Parish Design Revamp

**Task:** 0.1 — Capture the pre-revamp baseline and confirm preservation invariants
**Validates Requirements:** 6.7 (SEO baseline preserved), 5.4 (Hard Gates ordering)
**Captured at:** Phase 0, before any revamp code change.
**Git:** branch `main`, commit `c02d6d33`
**Mode:** "Preserve" — design-quality upgrade, no behaviour change in Phase 0.

This document plus `seo-baseline.json` (machine-readable, sibling file) is the reference for **Phase 5 task 5.3** ("Verify SEO baseline preserved — compare route set, slugs, `usePageSEO` outputs, and `JsonLdSchema` payloads against the Phase 0 baseline; confirm byte-for-byte identical"). It also seeds the Hard Gate G7 (SEO preserved) and Property 12 checks.

---

## 1. SEO Baseline (for byte-for-byte comparison in 5.3)

The full structured data lives in **`seo-baseline.json`** alongside this file. Summary below.

### 1.1 Route set & slugs (`src/lib/routes.ts`, `src/App.tsx`)

Static routes (in nav-logical manifest order):

| Path | Label | Section |
| --- | --- | --- |
| `/` | Home | Worship |
| `/mass-times` | Mass Times | Worship |
| `/daily-readings` | Readings & Reflection | Worship |
| `/news-events` | News & Events | Worship |
| `/about` | About Us | Explore |
| `/history` | History | Explore |
| `/new-here` | I'm New Here | Explore |
| `/gallery` | Gallery | Explore |
| `/volunteer` | Volunteer | Community |
| `/contact` | Contact | Community |

Dynamic route: `/news-events/bulletin/:id` (BulletinPage).
Catch-all: `*` → NotFoundPage.

Router children order (App.tsx): index→Home, mass-times, contact, about, history, new-here, news-events, news-events/bulletin/:id, volunteer, gallery, daily-readings, `*`.

### 1.2 `usePageSEO` outputs

`usePageSEO` constants: `SITE_NAME = "Greenacres Walkerville Catholic Parish"`, `BASE_URL = "https://www.gwparish.org.au"`, `DEFAULT_OG_IMAGE = "/assets/source/hero_3.webp"`.
Title rule: `fullTitle = (title === SITE_NAME) ? title : "${title} | ${SITE_NAME}"`.

12 call sites captured (Home, MassTimes, Contact, About, History, NewHere, NewsEvents, Bulletin, Volunteer, Gallery, DailyReadings, NotFound). Exact `title`/`description`/`path`/`ogImage`/`noindex` values for each are recorded in `seo-baseline.json` → `usePageSEO`.

Notable: `NotFoundPage` uses `path: '/404'` and `noindex: true`. `BulletinPage` uses a template-literal path `/news-events/bulletin/${id}`.

### 1.3 JSON-LD payloads

- **`JsonLdSchema` component** (`src/components/JsonLdSchema.tsx`): a large `@graph` payload (Organization, two Church nodes, WebSite, BreadcrumbList of 12 items, two recurring Event nodes). **Currently DEFINED BUT NOT RENDERED** — a grep for `<JsonLdSchema` returns no matches anywhere in `src/`. Recorded verbatim in the JSON artifact regardless; preservation = leave the payload unchanged.
- **`HomePage`** `useJsonLd(..., 'home-church')`: a `Church` node with two postal addresses.
- **`DailyReadingsPage`** `useJsonLd(..., 'daily-readings-page')`: a `WebPage` node `isPartOf` the parish WebSite.

Full payloads byte-captured in `seo-baseline.json` → `jsonLd`.

### 1.4 sitemap.xml (`public/sitemap.xml`)

12 `<url>` entries. Includes `/sacraments`, `/give`, `/safeguarding` which have **no SPA route** in `ROUTE_MANIFEST` but do appear in the JSON-LD `BreadcrumbList`. These pre-existing mismatches are recorded as-is; preservation requires they remain byte-for-byte identical. Full list in `seo-baseline.json` → `sitemap`.

---

## 2. Verification command baseline (observed pass/fail state)

Run at Phase 0 on this VM. Commands per AGENTS.md.

| Command | Result | Exit | Notes |
| --- | --- | --- | --- |
| `npm run lint` | **PASS** | 0 | `eslint .` — clean, no warnings or errors printed. |
| `npx tsc -b` | **PASS** | 0 | Zero type errors. |
| `npm test` | **PASS** | 0 | Vitest: **6 files, 39 tests, all passing** (~0.6s). |
| `npm run build` | **PASS** | 0 | `tsc -b && vite build` — 2143 modules transformed, PWA generated, image optimisation ran. |

### Build summary (selected)
- `vite v5.4.21`, `✓ 2143 modules transformed`.
- Key chunks: `index-*.js` 35.19 kB (gzip 10.46), `HomePage-*.js` 32.05 kB (gzip 7.89), `DailyReadingsPage-*.js` 15.66 kB (gzip 4.90), `vendor-icons-*.js` 23.85 kB (gzip 5.64).
- PWA v1.2.0: 34 precache entries (~3285 KiB); `dist/sw.js` + workbox generated.

### Unit test files (all passing)
`src/lib/liturgicalColour.test.ts` (14), `src/lib/reflectionSources.test.ts` (5), `src/lib/massCountdown.test.ts` (3), `src/lib/adelaideDate.test.ts` (6), `src/hooks/useLiturgicalSeason.test.tsx` (4), `src/hooks/useDailyMassReadings.test.tsx` (7).

### Known / pre-existing issue (recorded exactly as observed)
- **`tests/home.spec.ts` is an E2E (Playwright) test, NOT a unit test.** It is run via `npm run test:e2e` (and inside `npm run verify:release`), **not** via `npm test`. So `npm test` passes cleanly; the documented hero-copy mismatch (`/Catholic Parish in Adelaide/i` vs the actual "Catholic Parish serving Greenacres, Walkerville…") only surfaces under the Playwright E2E suite. The four Phase-gate commands for this revamp (`lint`, `tsc -b`, `test`, `build`) do **not** include the E2E suite, so this known failure does not block the per-phase gates. Out of scope unless the user asks to fix it.

### Environment note
- **Node.js v24.5.0** is installed on this VM. AGENTS.md / CI specify **Node 22**. All four commands pass under v24.5.0, but this is a version discrepancy worth flagging — re-verify on Node 22 if results ever differ.
- `node_modules` was already present (no `npm install` needed).

### Other baseline metrics
- `src/layouts/RootLayout.tsx`: **407 lines** (Phase 2 target ≤60 after Header/MobileDrawer/Footer extraction — Property 4).
- `src/lib/routes.ts`: 85 lines.

---

## 3. Design Brief Dials — confirmed in effect

Per design.md "Design Brief Dials", these are fixed for all subsequent work (Hard Gate G2):

| Dial | Value | In effect |
| --- | --- | --- |
| `DESIGN_VARIANCE` | **4–5** | ✅ Editorial variety/asymmetry welcome, but calm/consistent — not so high it fragments the Sacred Editorial system. |
| `MOTION_INTENSITY` | **3–4** | ✅ Framer Motion reveals + hover lifts on-brand; always respect `prefers-reduced-motion`; no looping/attention-grabbing motion. |
| `VISUAL_DENSITY` | **5–6** | ✅ Moderate-to-high density for content-rich parish pages, without clutter. |

---

## 4. Preservation Rules — confirmed in effect (Hard Gate G4)

These invariants must not change in any phase. Every phase is verified against them.

- **Design tokens:** all `parish-*` tokens preserved. No new hardcoded hex in `.tsx`. Documented exceptions only: `text-white` on image overlays, Facebook brand `#1877F2`. (Property 1)
- **Dark mode ("Sacred Night"):** `data-theme="dark"` strategy, `ThemeContext`, `localStorage` persistence. Every change works in both themes. (Property 2)
- **Type pairing:** Merriweather (`font-display`) + Outfit (`font-body`). No new font families. (Req 6.9)
- **Liturgical season colour system:** `useLiturgicalSeason`, `liturgicalColour.ts`, footer season dot. (Req 6.10)
- **Component vocabulary:** `sanctuary-*`, `pilgrimage-*`, `scripture-panel`, `ornamental-kicker`, `section-label` — extend class names, never rename. (Req 6.11)
- **PageTemplates system:** `StoryPageTemplate`, `UtilityPageTemplate`, `HighlightPageTemplate`, `SectionIntro`, `InfoCard`, `ScriptureBlock`, `ActionBand` — no prop-signature changes. (Req 3.9)
- **ContentStates:** `ContentLoading`, `ContentError`, `ContentEmpty` are the canonical state components. (Property 5)
- **Accessibility wins:** 18px base font, 44px minimum touch targets, `focus-visible` brass ring (3px), `prefers-reduced-motion` honoured. (Properties 7, 10, 11)
- **SEO:** routes/slugs in `routes.ts`, `usePageSEO`, `JsonLdSchema`, `sitemap.xml` — byte-for-byte preserved (this baseline). (Property 12, Req 6.7)

---

## 5. Hard Gate status after Task 0.1

| Gate | Description | Status |
| --- | --- | --- |
| G1 | Design Brief + Design Read before code changes | ✅ Design/requirements/tasks read; dials + preservation understood. |
| G2 | Dial values fixed before any layout decision | ✅ Dials recorded in §3. |
| G3 | Full audit complete before any fix | ✅ Audit (6 issues, per-page scores) already captured in design.md "Current State Assessment". |
| G4 | Preservation Rules confirmed before any modernisation lever | ✅ Confirmed in §4. |
| G5 | Pre-Flight Checklist before phase completion | ⏳ Phase 5. |
| G6 | full-output-enforcement (no placeholder code) | ⏳ Applies during implementation phases. |
| G7 | SEO baseline preserved | ✅ Baseline captured here + in `seo-baseline.json`; verified against in 5.3. |

Phase 0 complete: no code changed; the only files created are this baseline artifact and `seo-baseline.json`.
