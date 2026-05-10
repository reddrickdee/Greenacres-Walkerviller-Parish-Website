# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Greenacres Walkerville Catholic Parish — a React 18 + TypeScript SPA built with Vite, Tailwind CSS, and Framer Motion. See `README.md` for the full tech stack, pages/routes, and getting started commands.

### Running the application

- **Dev server:** `npm run dev` (Vite on port 5173 by default; add `-- --host 0.0.0.0` for network access)
- **Build:** `npm run build` (runs `tsc -b && vite build`)
- **Preview production build:** `npm run preview`

### Lint and type checking

- **Lint:** `npm run lint` — uses `eslint.config.js` (flat config for ESLint v9). Currently passes (exit 0) with warnings only.
- **TypeScript:** `npx tsc -b` — passes cleanly as of initial setup.

### Supabase (backend)

The app uses Supabase for Daily Reflections, Community Hub, and authentication. These features are env-gated: without `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, the app falls back to static JSON data from `public/data/`. Informational pages (Home, About, Mass Times, History, etc.) work fully offline without Supabase.

### Data files

Static parish content lives in `public/data/*.json`. Supabase SQL schema files are at the repo root (`supabase_*.sql`). Edge functions are in `supabase/functions/`.

### Dark mode / theming

The app uses a `data-theme` attribute on `<html>` (not Tailwind's default `media` or `class` strategy). The Tailwind config has `darkMode: ['selector', '[data-theme="dark"]']` to enable `dark:` variants. Theme CSS variables are defined in `src/index.css` under `:root` and `html[data-theme="dark"]`. Theme state is managed via `ThemeContext` and persisted to `localStorage`.

Key conventions:
- Use `parish-*` color tokens (e.g., `text-parish-fg`, `bg-parish-surface`) instead of hardcoded colors.
- `parish-inverse` = white in light mode, near-black in dark mode — used for text on accent-colored buttons.
- For "inverse sections" (dark bg in light mode, light bg in dark mode), use `bg-parish-fg text-parish-surface`.
- Intentional exceptions: `text-white` on image overlays (Gallery), Facebook brand color `#1877F2`.

### Testing

- **Unit tests:** `npm test` (Vitest with jsdom, Testing Library)
- **E2E tests:** `npm run test:e2e` (Playwright with Chromium)
- **Live E2E:** `npm run test:e2e:live` (runs against production `gwparish.org.au`)
- **Coverage:** `npm run test:coverage`
- **Full verification:** `npm run verify:release` (lint + typecheck + unit + E2E + build)

### Known pre-existing test issues

- **E2E test (`tests/home.spec.ts`):** The test asserts text `/Catholic Parish in Adelaide/i` but the actual hero copy reads "Catholic Parish serving Greenacres, Walkerville…". This causes `npm run test:e2e` to fail out of the box. The failure is **not** caused by environment setup.
- **Node.js 22** is required (matches CI). The Cloud VM does not ship Node pre-installed; the update script handles `npm install` and `npx playwright install chromium`.

### GStack Quality Gates (extracted skills)

Three quality gate skills adapted from [GStack](https://github.com/garrytan/gstack) (Garry Tan's AI development toolkit, MIT licensed):

- **`gstack-design-quality`** — AI slop detection, typography checks, spacing/layout audit, interaction state verification, parish design system compliance. Use before merging frontend changes.
- **`gstack-security-audit`** — Supabase RLS verification, secrets archaeology, dependency supply chain, OWASP Top 10 adapted for SPA + Supabase, STRIDE threat model. Use before deploying auth or data changes.
- **`gstack-code-review`** — Two-pass review (critical + informational), Fix-First methodology (auto-fix mechanical issues, ask about ambiguous ones), documentation staleness detection. Use before merging any branch.
