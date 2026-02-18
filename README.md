# Greenacres Walkerville Catholic Parish — Web Prototype

A Flutter-web prototype for the Greenacres Walkerville Catholic Parish website, featuring an editorial design aesthetic with liturgical calendar integration, daily readings, and parish content management.

## Prerequisites

- **Flutter SDK** ≥ 3.24 (`flutter --version`)
- **Chrome** (for local development)

## Quick Start

```bash
# Install dependencies
flutter pub get

# Run in Chrome (development)
flutter run -d chrome --web-port=8080

# Production build
flutter build web --release
```

The built output goes to `build/web/`. Serve with any static file server.

## Project Structure

```
lib/
├── app.dart                      # App shell with bootstrap & routing
├── main.dart                     # Entry point
├── core/
│   ├── accessibility/            # Dark mode, font scale, high contrast, reduce motion
│   ├── layout/                   # Breakpoints (375 / 768 / 1440)
│   ├── navigation/               # GoRouter config (10 routes + compat redirect)
│   └── theme/                    # DesignTokens (light + dark), AppTheme
├── data/
│   ├── models/                   # ParishContent, LiturgicalDay, MassSchedule,
│   │                             # NewsletterArchive, NewsletterItem, Bulletin
│   └── repositories/             # Asset-based content + newsletter archive loaders
├── features/                     # Page widgets (home, about, mass, news, bulletin, etc.)
├── services/
│   ├── liturgy/                  # Composite liturgy service (ACBC + Universalis + asset fallback)
│   └── mass/                     # Next-mass countdown logic
└── shared/widgets/               # 15+ reusable editorial widgets
```

## Features

| Feature | Status |
|---|---|
| Dark mode toggle (persisted) | ✅ |
| Accessibility toolbar (font scale, high contrast, reduce motion) | ✅ |
| Liturgical calendar strip | ✅ |
| Live next-mass countdown | ✅ |
| Daily readings (Universalis API + fallback cache) | ✅ |
| Editorial design system (Playfair Display / Inter) | ✅ |
| Responsive layout (mobile / tablet / desktop) | ✅ |
| Google Fonts preloaded in HTML | ✅ |
| Native Digital Bulletin Reader | ✅ |

## Data Files

Content is loaded from JSON files in `assets/data/`:

- `parish_content.json` — Parish info, welcome text, contact, schools
- `mass_schedule.json` — Mass times for both churches
- `history_timeline.json` — Historical milestones
- `newsletters.json` — Newsletter archive with native bulletin support
- `liturgical_seed.json` — Fallback liturgical readings

### Newsletter Archive Schema (`newsletters.json`)

The newsletter archive is the single source of truth for all bulletins:

```jsonc
{
  "lastVerified": "2026-02-12",
  "source": "https://www.gwparish.org.au/News/PastNewsletters.html",
  "items": [
    {
      "id": "1st-sun-lent",           // Stable slug (used in URL path)
      "title": "CONNECTIONS 1ST SUN LENT",
      "url": "https://...pdf",        // PDF fallback (always required)
      "isCurrent": true,              // Exactly one item is current
      "nativeBulletin": {             // null for PDF-only entries
        "date": "February 15, 2026",
        "coverImage": "assets/images/source/our_parish.jpg",
        "priestReflection": "...",
        "sections": [
          { "title": "...", "content": "...", "imageAsset": "..." }
        ]
      }
    }
  ]
}
```

### Weekly Editorial Update Workflow

1. Open `assets/data/newsletters.json`.
2. Set the previous current item's `isCurrent` to `false`.
3. Add a new item at the top with `isCurrent: true`.
4. To publish a native digital edition, populate `nativeBulletin`. Otherwise set it to `null`.
5. Run `flutter build web --release` and deploy.

## Accessibility

Open the floating ♿ button (bottom-right) to access:
- **A− / A+** — Font size scaling (0.9×–1.3×)
- **High contrast** — Stronger borders and dividers
- **Reduce motion** — Disables page transitions and animations
- **Dark mode** — Warm charcoal dark palette, persisted via SharedPreferences

## Offline Behaviour ("Thick Stone Wall" Resilience)

The site works offline after **one connected visit**.  `web/flutter_bootstrap.js` triggers an aggressive precache by sending `downloadOffline` to Flutter's service worker, which caches every asset in its `RESOURCES` map — including:

- `assets/data/liturgy_fallback.json`
- `assets/data/mass_schedule.json`
- `assets/data/parish_content.json`
- App shell (HTML, JS, fonts)

**First-visit requirement:** Parishioners must open the site at least once on Wi-Fi before visiting the church.  After that, the site loads fully offline inside St Monica's stone walls.

### Verification (for parish staff)

1. Open the site in Chrome.
2. Open DevTools → **Application** → **Service Workers**.  Confirm status is "activated and is running".
3. Open **Cache Storage** and verify data JSON files are present.
4. Toggle **Offline** checkbox in DevTools.
5. Reload — the site should load with Mass times and readings visible.

## CMS Architecture

Content loading is abstracted behind `IContentRepository` and `INewsletterRepository` interfaces.  The default implementation reads bundled JSON assets.  The Supabase CMS backend overlays live data with automatic asset fallback.

### Backend Selection

Controlled via build-time environment variables:

| Variable | Values | Default |
|---|---|---|
| `CONTENT_BACKEND` | `asset`, `cms` | `asset` |
| `CMS_ENDPOINT` | Supabase project URL | *(empty)* |
| `CMS_TOKEN` | Supabase anon key | *(empty)* |

```bash
# Asset mode (default — no env vars needed)
flutter run -d chrome --web-port=8080

# CMS mode (Supabase)
flutter run -d chrome --web-port=8080 \
  --dart-define=CONTENT_BACKEND=cms \
  --dart-define=CMS_ENDPOINT=https://xxxx.supabase.co \
  --dart-define=CMS_TOKEN=eyJhbGciOiJIUzI1NiIs...

# Production build with CMS
flutter build web --release \
  --dart-define=CONTENT_BACKEND=cms \
  --dart-define=CMS_ENDPOINT=https://xxxx.supabase.co \
  --dart-define=CMS_TOKEN=eyJhbGciOiJIUzI1NiIs...
```

### Supabase Setup

1. Create a new Supabase project.
2. Open **SQL Editor** → **New query** and run `scripts/supabase_schema.sql`.
3. Create storage buckets: `bulletins` (public) and `bulletin-images` (public).
4. Seed data from existing JSON:
   ```bash
   dart run scripts/seed_supabase.dart \
     --endpoint=https://xxxx.supabase.co \
     --token=YOUR_SERVICE_ROLE_KEY
   ```

### Fallback Behaviour

When `CONTENT_BACKEND=cms`:
- The app fetches from Supabase on load.
- If the request fails (network, auth, malformed response), bundled JSON assets are used silently.
- No widget, route, or theme changes are required.
- To roll back: redeploy with `CONTENT_BACKEND=asset` (or omit the variable).

### Staff Weekly Update Workflow (Supabase Studio)

**Mass Schedule Changes:**
1. Open Supabase Dashboard → **Table Editor** → `mass_schedule_entries`.
2. Edit the row (e.g. change `start_time`).
3. Visitors see the updated time on their next page load.

**New Bulletin:**
1. Open **Table Editor** → `newsletter_items`.
2. Set the previous current item's `is_current` to `false`.
3. Insert a new row with `is_current: true` and the PDF URL.
4. For a native digital edition: populate `native_date`, `priest_reflection`, `cover_image`, then add rows to `bulletin_sections`.
5. Upload images to the `bulletin-images` storage bucket.

### Scope

This CMS integration covers:
- Mass schedule (`mass_schedule_entries` table)
- Newsletter archive (`newsletter_items` + `bulletin_sections` tables)

All other parish content (welcome text, councils, history, etc.) remains asset-backed.

## Deployment

### Building for Production

```bash
flutter build web --release
```

The output in `build/web/` is a fully static site that can be served from any static file host.

### Hosting Options

| Host | Command / Steps |
|---|---|
| **Firebase Hosting** | `firebase init hosting` → set public dir to `build/web` → `firebase deploy` |
| **Cloudflare Pages** | Connect GitHub repo → build command: `flutter build web --release` → output: `build/web` |
| **Netlify** | Drag-and-drop `build/web/` folder, or connect GitHub |
| **Any static server** | Serve `build/web/` with any HTTP server (nginx, Apache, Caddy) |

### Post-Deploy Checklist

1. Verify site loads at production URL
2. Check `robots.txt` and `sitemap.xml` are accessible
3. Confirm service worker activates (DevTools → Application → Service Workers)
4. Test offline mode after first visit
5. Verify `lang="en"` and CSP meta tag in page source
6. Test contact form `mailto:` link opens email client
7. Navigate to `/privacy` and confirm footer link works
8. Visit a non-existent route and confirm 404 page appears

### CI/CD

A GitHub Actions workflow (`.github/workflows/ci.yml`) runs on push to `main` and PRs:
- Installs dependencies → runs tests → builds release → uploads artifact.

