# Greenacres Walkerville Catholic Parish

A modern, accessible parish website built with React, TypeScript, Tailwind CSS, and Framer Motion.

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

## Design System

The "Sacred Editorial" design system is built around:

- **Typography**: Cinzel (headings), Cormorant Garamond (body serif), Inter (UI)
- **Colors**: Warm alabaster (`#F9F8F6`), deep slate (`#1C1917`), liturgical gold (`#B8941E`)
- **Accessibility**: 18px base font, WCAG AA contrast ratios, 44px minimum touch targets, `prefers-reduced-motion` support, ARIA labels throughout

## Pages

| Route | Page |
|---|---|
| `/` | Home — Hero, welcome, worship glance, prayer wall |
| `/about` | About — Priest welcome, pastoral council, vision & mission |
| `/history` | History — Interactive timeline (1912–present) |
| `/mass-times` | Mass Times — Schedules grouped by church |
| `/sacraments` | Sacraments — Details, preparation pathways, community services |
| `/news-events` | News & Events — Bulletins, events calendar, newsletter archive |
| `/contact` | Contact — Office info, Google Maps, parish schools |
| `/new-here` | I'm New Here — Welcome steps, welcoming CTA |
| `/news-events/bulletin/:id` | Bulletin — Native newsletter viewer |

## Data Layer

- JSON data files served from `public/data/`
- React Context (`ParishDataContext`) loads all data on mount
- Optional Supabase CMS overlay for mass schedules (env-gated via `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`)

## Deployment

The `vercel.json` is configured for Vercel deployment with SPA fallback routing.
