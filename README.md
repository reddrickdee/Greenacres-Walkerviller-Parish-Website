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

Content loading is abstracted behind `IContentRepository` (with a `ContentRepository` typedef for compatibility).  The default implementation reads bundled JSON assets.

To swap to a headless CMS post-approval, change one line in `app.dart`:

```dart
// Before:
final contentRepo = ContentRepositoryFactory.create();

// After:
final contentRepo = ContentRepositoryFactory.create(
  backend: 'cms',
  cmsEndpoint: 'https://your-project.api.sanity.io/v1/data/query/production',
  cmsToken: const String.fromEnvironment('CMS_TOKEN'),
);
```

No widget, route, or theme changes are required.

