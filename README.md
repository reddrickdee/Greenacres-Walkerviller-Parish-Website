# Greenacres Walkerville Catholic Parish

A modern, accessible parish website built with React, TypeScript, Tailwind CSS, and Framer Motion. This React application serves as the primary frontend for the parish, having successfully replaced the legacy Flutter project as the root repository.

## Getting Started

```bash
# Install dependencies
npm install

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
- **Typography**: Cinzel (headings), Cormorant Garamond (body serif), Inter (UI)
- **Colors**: Semantic theme tokens replacing hardcoded values. Warm alabaster (`#F9F8F6`), deep slate (`#1C1917`), liturgical gold (`#B8941E`) in light mode; optimized deep tones in "Sacred Night" mode.
- **Modern UI/UX**: Glassmorphism effects (e.g., custom Facebook Widget), tabbed cards for Daily Reflections.
- **Accessibility**: 18px base font, WCAG AA contrast ratios, 44px minimum touch targets, `prefers-reduced-motion` support, ARIA labels throughout.

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
