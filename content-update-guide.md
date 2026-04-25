# Content Update Guide — Greenacres Walkerville Parish Website

This guide explains how to update the main content areas of the parish website without needing to write code.

---

## Weekly Bulletin (Connections)

**Location:** The bulletin is loaded from existing parish infrastructure (gwparish.org.au).  
**How it updates:** The website automatically detects the latest bulletin using the newsletters data context. No action required — it pulls from the same place you already publish bulletins.

---

## Upcoming Events

**File:** `public/data/events.json`

### How to edit
1. Open the file in any text editor
2. Each event has these fields:

```json
{
    "date": "2026-05-04",           // YYYY-MM-DD format
    "title": "Mother's Day Morning Tea",
    "time": "After 9:30am Mass",
    "location": "St Monica's Church Hall",
    "description": "Join us for a special morning tea...",
    "category": "Community"
}
```

### Categories
- `Mass` — Regular Mass services
- `Sacrament` — Reconciliation, Baptism, etc.
- `Meeting` — Parish Council, committees
- `Feast` — Feast days and holy days
- `Devotion` — Rosary, adoration
- `Community` — Social events, fundraisers
- `Youth` — Youth group activities

### Rules
- Keep the date in `YYYY-MM-DD` format (e.g., `2026-05-04`)
- Past events are automatically hidden
- Events are sorted by date (earliest first)
- The homepage shows the next 5 events

---

## Liturgical Calendar

**File:** `public/data/liturgical_calendar.json`

### How to edit
Update once per week with the new Sunday readings:

```json
{
    "currentWeek": {
        "season": "Easter",
        "week": "4th Week of Easter",
        "sundayTitle": "Fourth Sunday of Easter",
        "sundayReadings": {
            "first": "Acts 4:8-12",
            "psalm": "Psalm 117",
            "second": "1 John 3:1-2",
            "gospel": "John 10:11-18"
        },
        "feastDays": [
            {
                "date": "2026-04-29",
                "name": "St Catherine of Siena",
                "optional": false
            }
        ],
        "liturgicalColor": "white",
        "note": "Good Shepherd Sunday"
    }
}
```

---

## Mass Times

**File:** `public/data/parish_data.json` → `massSchedule` array

Each Mass entry has:
- `id` — unique identifier
- `church` — "St Monica's" or "St Martin's"
- `dayOfWeek` — 1=Monday through 7=Sunday
- `startTime` — 24-hour format "18:00"
- `type` — "Weekend Vigil Mass", "Sunday Mass", etc.

> ⚠️ Changes to Mass times should be made carefully. The website countdown and "This Weekend" section both depend on this data being accurate.

---

## Parish Contact Information

**File:** `public/data/parish_data.json` → `contact` object

Fields: `phone`, `email`, `address`, `postalAddress`, `officeHours`

---

## Gallery Photos

**Folder:** `public/assets/gallery/`

To add photos:
1. Place the image file in `public/assets/gallery/`
2. Update the `GALLERY_IMAGES` array in `src/pages/GalleryPage.tsx`
3. Choose an appropriate category: `Church`, `Community`, `Sacraments`, or `Events`

---

## Theme Colours

The site uses these core colours (defined in `src/index.css`):

| Token | Light Mode | Purpose |
|-------|-----------|---------|
| `parish-bg` | Cream (#F5F1E9) | Page background |
| `parish-surface` | Off-white (#FAFAF7) | Card surfaces |
| `parish-fg` | Dark (#1B1F23) | Main text |
| `parish-accent` | Forest green (#2D5F2D) | Buttons, links |
| `parish-brass` | Gold (#B59C50) | Decorative accents |

> ℹ️ To change these, edit the CSS custom properties in `src/index.css` under `:root`.

---

## Need Help?

If you're unsure about any update, contact the website maintainer. Always test changes locally with `npm run dev` before deploying.
