# Greenacres Walkerville Catholic Parish

A modern, accessible parish website built with React, TypeScript, Tailwind CSS, and Framer Motion. The current frontend serves St Monica's Walkerville and St Martin's Greenacres, with release-readiness checks for accessibility, interaction, responsive behaviour, and truthful community-facing content.

## Getting Started

```bash
# Install dependencies
npm install

# Install Playwright browser binaries for E2E checks
npx playwright install chromium

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Tech Stack

- **React 18** + **TypeScript** — Component-based UI with full type safety
- **Vite** — Fast dev server and production bundler
- **Tailwind CSS** — Utility-first styling with custom parish design tokens
- **Framer Motion** — Smooth scroll-driven animations
- **React Router** — Client-side routing for all pages
- **Supabase** — Backend-as-a-Service for Daily Reflections ("God's Word"), Community Hub, and mass schedules

## Design System & Theming

The "Sacred Editorial" design system features a robust, token-based theme engine:

- **Themes**: Full support for Light and "Sacred Night" Dark modes, matching OS preferences with user overrides via `localStorage` and a modern React Context toggle.
- **Typography**: Merriweather (display headings) and Inter (body/UI), tuned for parishioners with varying digital confidence.
- **Colors**: Semantic theme tokens replacing hardcoded values. Warm alabaster (`#F9F8F6`), deep slate (`#1C1917`), liturgical gold (`#B8941E`) in light mode; optimized deep tones in "Sacred Night" mode.
- **Modern UI/UX**: Glassmorphism effects (e.g., custom Facebook Widget), tabbed cards for Daily Reflections.
- **Accessibility**: 18px base font, WCAG-aligned contrast and focus treatment, 44px minimum touch targets, reduced-motion support, semantic overlays/dialogs, and breadcrumb-based wayfinding.

## Pages & Routes

| Route | Page |
|---|---|
| `/` | Home — Hero, welcome, worship glance, daily reflections, facebook feed |
| `/about` | About — Priest welcome, pastoral council, vision & mission |
| `/history` | History — Interactive timeline (1912–present) |
| `/mass-times` | Mass Times — Schedules grouped by church |
| `/sacraments` | Sacraments — Details, preparation pathways, community services |
| `/news-events` | News & Events — Bulletins, events calendar, newsletter archive |
| `/news-events/bulletin/:id` | Bulletin — Native newsletter viewer |
| `/contact` | Contact — Office info, Google Maps, parish schools |
| `/new-here` | I'm New Here — Welcome steps, welcoming CTA |
| `/gallery` | Gallery — Visual parish history and event photos |
| `/safeguarding` | Safeguarding — Child protection policies and resources |
| `/community` | Community Hub — Parishioner posts, prayer requests, interactive community |
| `/admin/community` | Admin Community — Moderation and management (protected) |

## Data Layer

- JSON data files served from `public/data/`
- React Context (`ParishDataContext`, `ThemeContext`, `AuthContext`) manages global state.
- **Supabase Integration**: Powers the "God's Word - Daily Reflections" (using the Jerusalem Bible translation), Community Hub posts, and optional mass schedules (env-gated via `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`).

## Deployment

The `vercel.json` is configured for Vercel deployment with SPA fallback routing.

## Verification

Local release checks:

```bash
npm run lint
npm test
npm run test:e2e
npm run build
```

Or run the combined local gate:

```bash
npm run verify:release
```

Live deployment checks against `https://www.gwparish.org.au`:

```bash
# Runs the Playwright suite against production and writes an HTML report
npm run test:e2e:live

# Captures Lighthouse HTML reports for Home, Contact, and Giving
npm run verify:lighthouse:live
```

You can target another deployed environment by setting `PLAYWRIGHT_BASE_URL` and `LIGHTHOUSE_BASE_URL`.

The Playwright HTML report is written to `playwright-report/`. Lighthouse reports are written to `output/lighthouse/`.

GitHub Actions automation:

- [ci.yml](/Users/reddrick/Greenacres%20Walkerviller%20Parish%20Website/.github/workflows/ci.yml) runs lint, unit tests, Playwright E2E, and production build on push, pull request, and manual dispatch
- [live-verification.yml](/Users/reddrick/Greenacres%20Walkerviller%20Parish%20Website/.github/workflows/live-verification.yml) runs the deployed-site Playwright and Lighthouse checks on demand against a chosen public URL

See [docs/release-readiness.md](/Users/reddrick/Greenacres%20Walkerviller%20Parish%20Website/docs/release-readiness.md) for the full release checklist, manual validation steps, PR summary outline, and rollback notes.
