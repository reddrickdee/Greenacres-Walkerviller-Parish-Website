# Website Cleanup, Bulletin Update & Accessibility Refinement

**Date:** 2026-05-23
**Status:** Approved
**Scope:** Bulletin data update (May 16-17 Connections), route pruning, accessibility improvements, E2E test fix

## Product Direction

The website's core job is to publish the week's most important parish bulletin notices in a polished web format, with the full PDF available for download. The site should be calm, welcoming, and immediately useful. See [parish-website-discovery-2026-03-29.md](../parish-website-discovery-2026-03-29.md) for the full interview and rationale.

## Changes

### 1. Bulletin Data Update — "Connections: The Ascension of the Lord, Year A"

Update `public/data/weekly_notices.json` and `weekly-notices-browser.json` with content extracted from the **Sat 16th & Sun 17th May 2026 Connections PDF** (6 pages).

**Issue metadata:**
- `weekOf`: `"2026-05-17"`
- `issueTitle`: `"Connections — The Ascension of the Lord 2026"`
- `pdfUrl`: `"/bulletins/connections-2026-05-17.pdf"`
- `liturgicalInfo.sundayTitle`: `"The Ascension of the Lord"`
- `liturgicalInfo.weekdayReadings`: `"Easter Season"`
- `liturgicalInfo.note`: `"Year A"`

**Mass schedule (from page 1):**
- St Martin's: Tue 9am, Thu 9am, Sun 9:30am
- St Monica's: Wed 9am, Sat 6pm Vigil, Sun 11am (Ordinariate)
- Reconciliation: 5:15–5:45pm Saturday, 8:45–9:15am Sunday

**Top Notices (3 items):**
1. Parish Breakfast — Saturday 30th May, 9:30am, St Martins Church Hall. RSVP by 17th May.
2. Synod 2026 Liturgies — Ecumenical Taizé Prayer 19 May 7:30pm; Opening Mass 29 May 5:45pm, both at St Francis Xavier Cathedral.
3. Laudato Si' Week — 17–24 May 2026. Global celebration of Pope Francis's encyclical on caring for our common home.

**This Week at the Parish (4 items):**
1. Ninna Marni — Monday 18 May at 1:30pm at St Martin's Church Hall.
2. Parish Pastoral Council — Tuesday 19 May at 7pm at St Martin's School Boardroom.
3. Sacramental Program 2025/2026 — Monday 25 May at 9am at St Martin's School.
4. School Mass — Wednesday 20 May at 9am at St Monica's Church.

**Community & School (3 items):**
1. Lectio Divina — Tuesday 26 May at 9:45am at St Martin's Church Hall.
2. Children's Liturgy — During Masses Saturday 16 and Sunday 17 May.
3. Life in the Spirit Seminar — "Come Holy Spirit, Fall Afresh On Us!" Saturday 6 June 9:15am–4pm and Sunday 7 June 9:30am–3:30pm. Speaker Fr Josy Sebastian MSFS. At Our Lady of the Sacred Heart Church, 420 Seaview Road, Henley Beach.

**Roster (from page 6):**

*This Week 16/17 May:*
- Sat 6pm (St Monica's): Welcomers — Tasha Chye, David Bland; Musicians — CD – Norvin R; Commentator — Max Willmore; Readers — Tasha Chye, Sharon Quinn; Eucharistic Minister — Reg Nye; Hospitality — N/A
- Sun 9:30am (St Martin's): Welcomers — Elaine Prior, Michelle Arthur; Musicians — Emma & Choir; Commentator — Clare Mahony; Readers — Joanitha D'Souza, Peter Higgs; Eucharistic Minister — Michael Downs, Liz Giannetta; Hospitality — N/A

*Next Week 23/24 May:*
- Sat 6pm (St Monica's): Welcomers — Grace & Tristan Banaag; Musicians — CD – Chaz Vidal; Commentator — Christine Wilson; Readers — Eshani Obadage, Kyle Castellino; Eucharistic Minister — Barbara Broadbent; Hospitality — N/A
- Sun 9:30am (St Martin's): Welcomers — Vanessa Dibbens, Samuel Ogola; Musicians — Cd – Deepak R; Commentator — Rose & Jessie; Readers — Riya Shiju, Brendan Mahony; Eucharistic Minister — Peter Higgs, Rita Campbell; Hospitality — Laroza, Vidal, Banaag & Malata Families

**Additional data from page 6 (informational, included in notices where relevant):**
- Our Sick: Mary Fairney, Gemma Manuel, Pearl Mahony, June Mills, Graeme Mills
- Recently Deceased: Kathleen Mayger
- Anniversary of Death: Nicola DiFlorio
- Special Intentions: Holy Souls
- Next Week's Readings: Acts 2:1-11; Corinthians 12:3-7, 12-13; John 20:19-23

### 2. Route Pruning

Remove from the router, navigation, and filesystem:
- `GivePage.tsx` and `/give` route
- `SacramentsPage.tsx` and `/sacraments` route
- `SafeguardingPage.tsx` and `/safeguarding` route (contacts move to global footer)
- `DailyReadingsPage.tsx` and `/daily-readings` route

Keep active:
- Home `/`
- Mass Times `/mass-times`
- Contact `/contact`
- About `/about`
- History `/history`
- I'm New Here `/new-here`
- News & Events `/news-events`
- Bulletin detail `/news-events/bulletin/:id`
- Gallery `/gallery`
- Volunteer `/volunteer`

Update `src/lib/routes.ts`, `src/lib/navigation.ts`, `src/App.tsx`, and `src/layouts/RootLayout.tsx`.

### 3. Accessibility & UI Refinements

- **Touch targets:** Minimum 44×44px on all interactive elements (icon buttons, nav toggles, theme toggle, gallery controls).
- **Focus rings:** Global `*:focus-visible` outline using parish brass colour with 2px offset.
- **Glassmorphism contrast:** Increase backdrop opacity to `bg-white/90 dark:bg-stone-900/90` on frosted panels.
- **Aria labels:** Add `aria-label` to all icon-only buttons; set `aria-hidden="true"` on decorative SVG icons.

### 4. E2E Test Fix

Update `tests/home.spec.ts` to match the actual hero text instead of the outdated assertion string.

### 5. PDF Deployment

Copy `16th and 17th May Connections.pdf` to `public/bulletins/connections-2026-05-17.pdf`.

## Verification

- `npx tsc -b` — clean type check
- `npm run build` — production build
- `npm test` — unit tests
- `npm run test:e2e` — Playwright E2E
- Manual visual check of homepage, weekly notices, navigation, and footer
