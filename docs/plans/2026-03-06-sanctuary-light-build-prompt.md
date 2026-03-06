# Sanctuary Light — Full-Site Redesign Build Prompt

> **Purpose**: A self-contained design blueprint that a coding agent can implement against the existing `gw-parish-frontend` React 18 / Vite 5 / Tailwind 3.4 / Framer Motion 11 codebase **without follow-up questions**. Every token, pattern, section, and page is specified below.

---

## 1 — Design Direction

**Mood**: Sanctuary Light — quiet cinematic, photos-first, newcomer-first, explicitly Catholic through subtle sacred cues (cross motifs in dividers, liturgical color accents, scripture typography) rather than heavy devotional imagery.

**Core principles**:

- First-time visitor confidence: Mass times + welcome posture visible within the first two screenfuls.
- Photography as atmosphere: full-bleed panels, parallax overlays, and depth instead of decorative glass-card backgrounds.
- Restrained palette with a single warm metallic accent (brass).
- Light and dark themes with full visual parity — dark mode is not an afterthought.

---

## 2 — Design Tokens

### 2.1 Color Palette

All colors are specified as **space-separated RGB channels** for Tailwind's `rgb(var(…) / <alpha>)` pattern, stored in CSS custom properties on `:root` and `html[data-theme="dark"]`.

```css
/* ── FILE: src/index.css ── */
@layer base {
  :root {
    /* Surfaces */
    --color-parish-bg:              247 244 237;   /* warm parchment #F7F4ED */
    --color-parish-surface:         255 252 247;   /* card white #FFFCF7 */
    --color-parish-elevated:        240 236 228;   /* raised panels #F0ECE4 */

    /* Text */
    --color-parish-fg:              30  28  25;    /* ink #1E1C19 */
    --color-parish-muted:           105 98  85;    /* stone mid #696255 */

    /* Accent — restrained evergreen */
    --color-parish-accent:          36  82  56;    /* forest #245238 */
    --color-parish-accent-hover:    28  68  44;    /* deeper forest #1C442C */

    /* Secondary — liturgical red (martyrs, feasts) */
    --color-parish-secondary:       140 38  48;    /* wine #8C2630 */
    --color-parish-secondary-hover: 118 30  38;    /* deeper wine #761E26 */

    /* Brass — warm metallic for highlights, icons, dividers */
    --color-parish-brass:           45 78% 52%;    /* HSL — antique brass */

    /* Borders & inversion */
    --color-parish-border:          30  28  25;    /* same as fg for outlines */
    --color-parish-inverse:         255 252 247;   /* inverted fg → surface */
    --color-parish-inverse-muted:   175 168 155;   /* inverted muted */
  }

  html[data-theme="dark"] {
    --color-parish-bg:              18  16  14;    /* deep charcoal #12100E */
    --color-parish-surface:         30  27  24;    /* card dark #1E1B18 */
    --color-parish-elevated:        42  38  34;    /* raised dark #2A2622 */

    --color-parish-fg:              237 232 220;   /* warm white #EDE8DC */
    --color-parish-muted:           168 160 148;   /* stone light #A8A094 */

    --color-parish-accent:          82  165 110;   /* lifted green #52A56E */
    --color-parish-accent-hover:    100 185 130;   /* brighter #64B982 */

    --color-parish-secondary:       215 90  100;   /* softer wine #D75A64 */
    --color-parish-secondary-hover: 235 110 120;   /* brighter #EB6E78 */

    --color-parish-brass:           45 78% 58%;    /* brighter brass in dark */

    --color-parish-border:          237 232 220;
    --color-parish-inverse:         18  16  14;
    --color-parish-inverse-muted:   210 205 198;
  }
}
```

### 2.2 Liturgical Season Colors

Kept as static hex values in `tailwind.config.js` (unchanged from current):

| Season      | Hex       |
|-------------|-----------|
| Advent      | `#6B3FA0` |
| Ordinary    | `#2D5F2D` |
| Martyrs     | `#8B2332` |

### 2.3 Typography

**Fonts**: Fraunces (display/serif) + Manrope (body/sans).

```html
<!-- ── FILE: index.html ── Replace existing Google Fonts link -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,300;1,9..144,400;1,9..144,500;1,9..144,600;1,9..144,700&family=Manrope:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<!-- Keep OpenDyslexic CDN link as-is -->
```

```js
// ── FILE: tailwind.config.js (theme.extend.fontFamily) ──
fontFamily: {
    display: ['"Fraunces"', 'serif'],
    serif:   ['"Fraunces"', 'serif'],          // alias for prose contexts
    body:    ['"Manrope"', 'sans-serif'],
    dyslexic: ['"OpenDyslexic"', 'sans-serif'],
},
```

**Type Scale** (base 18 px kept):

| Token        | Size / Leading                           | Use                              |
|--------------|------------------------------------------|----------------------------------|
| `text-body`  | 1.125rem / 1.75                          | Default body copy                |
| `text-body-lg` | 1.25rem / 1.7                          | Emphasized body, card descriptions |
| `text-body-xl` | 1.5rem / 1.65                          | Lead paragraphs, pull quotes     |
| `text-nav`   | 0.8125rem / 1 / tracking 0.12em         | Nav items, labels, timestamps    |
| `text-label` | 0.6875rem / 1 / tracking 0.15em         | Section eyebrow labels           |
| `text-caption` | 0.75rem / 1.4                          | Image captions, footnotes        |

Add `text-label` and `text-caption` to `tailwind.config.js`:

```js
fontSize: {
    'body':     ['1.125rem', { lineHeight: '1.75' }],
    'body-lg':  ['1.25rem',  { lineHeight: '1.7' }],
    'body-xl':  ['1.5rem',   { lineHeight: '1.65' }],
    'nav':      ['0.8125rem', { lineHeight: '1', letterSpacing: '0.12em' }],
    'label':    ['0.6875rem', { lineHeight: '1', letterSpacing: '0.15em' }],
    'caption':  ['0.75rem',  { lineHeight: '1.4' }],
},
```

**Heading hierarchy** (applied via Tailwind utility classes, not new tokens):

| Element | Desktop           | Mobile             |
|---------|-------------------|--------------------|
| h1      | `text-6xl` → 7xl  | `text-4xl`         |
| h2      | `text-4xl` → 5xl  | `text-3xl`         |
| h3      | `text-2xl` → 3xl  | `text-xl` → 2xl   |

All headings use `font-display tracking-tight leading-[1.1]`.

### 2.4 Spacing & Layout

| Token             | Value    | Use                                   |
|-------------------|----------|---------------------------------------|
| Section gap       | `py-24 md:py-32 lg:py-40` | Between major homepage sections |
| Content max-width | `max-w-6xl` (1152px) | Default content container      |
| Wide max-width    | `max-w-7xl` (1280px) | Grid/gallery sections           |
| Narrow max-width  | `max-w-3xl` (768px)  | Editorial/prose reading width    |
| Card radius       | `rounded-2xl`        | Cards, panels                   |
| Hero radius       | `rounded-none`       | Full-bleed hero sections         |
| Button radius     | `rounded-full`       | All CTA buttons                  |
| Page side padding | `px-6 md:px-12 lg:px-20` | Consistent gutters           |

### 2.5 Shadows

```js
// ── FILE: tailwind.config.js (theme.extend.boxShadow) ──
boxShadow: {
    sanctuary: '0 30px 80px -40px rgba(0, 0, 0, 0.35)',
    halo:      '0 20px 50px -28px hsla(var(--color-parish-brass), 0.3)',
    card:      '0 8px 30px -8px rgba(0, 0, 0, 0.08)',
    'card-hover': '0 16px 50px -12px rgba(0, 0, 0, 0.12)',
},
```

### 2.6 Animations

Keep existing `fadeIn` and `fadeInUp` keyframes. Add:

```js
// ── FILE: tailwind.config.js (theme.extend.keyframes + animation) ──
keyframes: {
    fadeIn:    { '0%': { opacity: '0' },                          '100%': { opacity: '1' } },
    fadeInUp:  { '0%': { opacity: '0', transform: 'translateY(24px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
    slideDown: { '0%': { opacity: '0', transform: 'translateY(-8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
},
animation: {
    'fade-in':     'fadeIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
    'fade-in-up':  'fadeInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
    'slide-down':  'slideDown 0.3s ease-out forwards',
},
```

---

## 3 — Reusable Component Patterns

### 3.1 Section Eyebrow Label

A small uppercase label that precedes every major section heading.

```
<div className="font-display tracking-[0.15em] text-label uppercase text-parish-accent mb-4">
    {label}
</div>
```

### 3.2 Pilgrimage CTA Button (`.pilgrim-button`)

Replaces the current `.ethereal-button` with a more intentional, pilgrimage-inspired CTA.

```css
/* ── FILE: src/index.css @layer components ── */
.pilgrim-button {
    @apply rounded-full border border-parish-border/20 px-8 py-4 text-nav text-parish-fg
           transition-all duration-300 font-body font-semibold no-underline inline-flex
           items-center gap-3 uppercase tracking-[0.12em];
}

.pilgrim-button:hover {
    @apply bg-parish-fg text-parish-inverse border-transparent
           shadow-halo scale-[1.02];
}

/* Primary variant — filled */
.pilgrim-button-primary {
    @apply bg-parish-accent text-parish-inverse border-parish-accent;
}

.pilgrim-button-primary:hover {
    @apply bg-parish-accent-hover shadow-halo scale-[1.02];
}

/* Brass accent variant */
.pilgrim-button-brass {
    @apply bg-transparent border-parish-brass/40 text-parish-fg;
    color: hsl(var(--color-parish-brass));
}

.pilgrim-button-brass:hover {
    background: hsl(var(--color-parish-brass));
    @apply text-parish-bg border-transparent shadow-halo scale-[1.02];
}
```

### 3.3 Image Panel

Full-width or inset photographic panel with gradient overlay. Used for hero sections and atmospheric breaks.

```tsx
// Pattern — inline in components, not a separate component file
<div className="relative w-full aspect-[16/7] md:aspect-[21/9] overflow-hidden rounded-2xl">
    <img
        src={imageSrc}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
    />
    {/* sacred gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-parish-bg/80 via-parish-bg/20 to-transparent" />
    {/* optional noise texture */}
    <div className="absolute inset-0 noise-bg opacity-15 mix-blend-overlay pointer-events-none" />
</div>
```

### 3.4 Sacred Card (updated `.sacred-card`)

```css
.sacred-card {
    @apply bg-parish-surface border border-parish-border/8 rounded-2xl p-8
           shadow-card transition-all duration-500
           hover:shadow-card-hover hover:-translate-y-1;
}
```

### 3.5 Information Card

For structured data blocks (Mass times, contact details, school info).

```css
.info-card {
    @apply bg-parish-surface border border-parish-border/6 rounded-2xl p-8 md:p-10
           shadow-card;
}
```

### 3.6 Scripture Block

An inverted full-width block for scripture quotations.

```css
.scripture-block {
    @apply bg-parish-fg text-parish-inverse p-10 md:p-14 rounded-2xl text-center;
}

.scripture-block .scripture-text {
    @apply font-serif text-xl md:text-2xl italic leading-relaxed
           text-parish-inverse/80 max-w-3xl mx-auto;
}

.scripture-block .scripture-ref {
    @apply font-display tracking-[0.15em] text-label uppercase
           mt-5 block;
    color: hsl(var(--color-parish-brass));
}
```

### 3.7 Section Divider

A subtle cross-motif divider as a sacred cue:

```css
.section-divider {
    @apply relative h-px w-full;
    background: linear-gradient(
        to right,
        transparent,
        rgb(var(--color-parish-border) / 0.08) 20%,
        rgb(var(--color-parish-border) / 0.12) 50%,
        rgb(var(--color-parish-border) / 0.08) 80%,
        transparent
    );
}

/* Optional: tiny cross at center */
.section-divider::after {
    content: "✦";
    @apply absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
           text-xs bg-parish-bg px-3;
    color: hsl(var(--color-parish-brass) / 0.4);
}
```

### 3.8 Surface Treatments

```css
/* Noise overlay — reduce from current 0.25 to 0.12 for subtlety */
.noise-bg::before {
    opacity: 0.12;
}

/* Soft vignette for interior page headers */
.vignette-overlay {
    background: radial-gradient(
        ellipse at center,
        transparent 40%,
        rgb(var(--color-parish-bg) / 0.6) 100%
    );
}
```

---

## 4 — Global Shell

### 4.1 Header / Navigation — `RootLayout.tsx`

**Structure**: Fixed top bar with `max-w-7xl` centered content. Desktop shows ~6 top-level items with dropdown submenus. Mobile opens full-screen overlay drawer.

**Desktop Nav (≥ 1280px / `xl` breakpoint — change from current `2xl`)**:

| Top-Level Link    | Dropdown Children                                    |
|-------------------|------------------------------------------------------|
| Home              | *(no dropdown)*                                      |
| Worship           | Mass Times · Sacraments · Homilies · Live Stream     |
| Life              | Community Hub · Volunteer · Giving · News & Events   |
| About             | About Us · History · Gallery                          |
| Contact           | *(no dropdown)*                                      |
| **I'm New Here**  | *(no dropdown — styled as primary CTA button)*       |

**Header behavior**:

- **Transparent** on hero pages (Home), with white/light text
- **Solid surface** (`bg-parish-surface/95 backdrop-blur-md`) on scroll or on interior pages
- Scroll threshold: `50px` (keep current)
- Height: `h-16` (reduced from `h-20` for tighter feel)
- Logo: `h-10 w-10` parish logo + parish name in `font-display text-sm tracking-[0.12em] uppercase`
- Right cluster: Accessibility button · Theme toggle · Hamburger (mobile)

**Dropdown implementation** (desktop):

```tsx
// Hover-triggered dropdown with AnimatePresence
// Each dropdown group is a <div> with onMouseEnter/onMouseLeave
// Dropdown panel: absolute positioned below nav item
// Animation: slideDown (opacity 0→1, y -8→0, 200ms ease-out)
// Panel styling: bg-parish-surface/98 backdrop-blur-lg rounded-xl
//                border border-parish-border/8 shadow-sanctuary p-4
// Links inside: font-body text-sm px-4 py-3 rounded-lg hover:bg-parish-elevated
```

**Mobile drawer** (< xl):

- Full-screen overlay (`fixed inset-0 z-50 bg-parish-bg/98 backdrop-blur-xl`)
- Grouped sections with eyebrow labels ("Worship", "Life", "About")
- Links stacked vertically: `font-display text-lg tracking-wide uppercase py-3`
- Close button: top-right `X` icon
- Animation: fade-in from right (`x: 100% → 0`, 300ms ease-out)

**"I'm New Here" CTA** in nav:

```
className="pilgrim-button-primary text-label py-2.5 px-5 ml-3"
```

### 4.2 Footer — `RootLayout.tsx`

**Layout**: Three-column on desktop (brand · navigation · connect), stacking on mobile.

```
┌─────────────────────────────────────────────────┐
│ FOOTER  bg-parish-fg text-parish-inverse        │
│                                                 │
│ ┌──────────┬──────────────┬──────────────┐      │
│ │ BRAND    │ NAVIGATE     │ CONNECT      │      │
│ │          │              │              │      │
│ │ Logo     │ Worship      │ Phone        │      │
│ │ Parish   │  · Mass Times│ Email        │      │
│ │ Name     │  · Sacraments│ Address      │      │
│ │          │              │              │      │
│ │ Tagline  │ Life         │ Office Hours │      │
│ │ (serif   │  · Community │              │      │
│ │  italic) │  · Volunteer │ ──────────── │      │
│ │          │  · Give      │              │      │
│ │          │              │ Social links │      │
│ │          │ Learn        │ (if any)     │      │
│ │          │  · About     │              │      │
│ │          │  · History   │              │      │
│ │          │  · Gallery   │              │      │
│ │          │  · Contact   │              │      │
│ └──────────┴──────────────┴──────────────┘      │
│                                                 │
│ ─────────── divider ──────────────────────────  │
│                                                 │
│ © 2026 Greenacres Walkerville Catholic Parish   │
│ Safeguarding & Privacy · Acknowledgement of     │
│ Country · "In the Footsteps of Jesus"           │
└─────────────────────────────────────────────────┘
```

**Footer styling**:

- Background: `bg-parish-fg` (inverted — dark in light mode, light in dark mode)
- Text: `text-parish-inverse`
- Section labels: `font-display text-label tracking-[0.15em] uppercase text-parish-brass mb-4`
- Links: `font-body text-body text-parish-inverse/70 hover:text-parish-inverse transition-colors`
- Bottom bar: `border-t border-parish-inverse/10 pt-8 mt-12`
- Padding: `px-6 md:px-12 lg:px-20 py-16 md:py-20`
- Parish prayer quote in Brand column: `font-serif text-body italic text-parish-inverse/60`

---

## 5 — Homepage Architecture

Section order is rebuilt around first-time visitor confidence. Each section is specified with its layout, content source, and styling.

### 5.1 Hero — Atmospheric Full-Screen

**Purpose**: Set the Sanctuary Light mood. Quiet, cinematic, immediately welcoming.

```
┌──────────────────────────────────────────┐
│                                          │
│         (full-screen parallax photo)     │
│                                          │
│      Welcome to                          │
│      Greenacres Walkerville Parish       │
│      (Fraunces italic, brass accent)     │
│                                          │
│      "I can do all things through        │
│       Christ who strengthens me."        │
│       — Philippians 4:13                 │
│                                          │
│      [Mass Times]  [I'm New Here]        │
│                                          │
│              ○ (scroll indicator)        │
└──────────────────────────────────────────┘
```

**Implementation notes**:

- Keep existing `HeroSection.tsx` structure but update:
  - Background: cycle through `hero_1.webp`–`hero_5.webp` (or pick best single)
  - Overlay: `bg-parish-bg/50 mix-blend-multiply` (softer than current 60%)
  - Gradient: `from-transparent via-parish-bg/20 to-parish-bg`
  - H1: `font-display text-5xl md:text-7xl lg:text-8xl font-light leading-[1.05] tracking-tight`
  - Parish name span: `font-serif italic` with brass color `text-[hsl(var(--color-parish-brass)/0.85)]`
  - Scripture: `font-serif text-lg md:text-xl italic text-parish-fg/70`
  - CTAs: Use `.pilgrim-button-brass` (Mass Times) and `.pilgrim-button` (I'm New Here)
  - Scroll indicator: Keep existing animated dot

### 5.2 Visit Info Strip — Practical Immediate Value

**Purpose**: Give newcomers the most critical info within one scroll. Address "When and where can I go?"

```
┌──────────────────────────────────────────┐
│  bg-parish-surface  -mt-8 relative z-20  │
│                                          │
│  ┌────────┐  ┌────────┐  ┌────────┐     │
│  │ NEXT   │  │ ST     │  │ ST     │     │
│  │ MASS   │  │MONICA'S│  │MARTIN'S│     │
│  │        │  │        │  │        │     │
│  │ [day]  │  │ Sat    │  │ Sun    │     │
│  │ [time] │  │ 6:00pm │  │ 9:30am │     │
│  │ [cntdn]│  │ Vigil  │  │        │     │
│  │        │  │ addr.. │  │ addr.. │     │
│  └────────┘  └────────┘  └────────┘     │
│                                          │
│      [View Full Schedule →]              │
└──────────────────────────────────────────┘
```

**Content source**: `content.massSchedule` via existing countdown logic.
**Layout**: 3-column grid (`grid-cols-1 md:grid-cols-3 gap-6`), each an `.info-card`.
**First card**: "Next Mass" with the soonest countdown timer (from `getSoonestCountdown`).
**Second/Third cards**: St Monica's and St Martin's with key Mass time + address.
**CTA**: `pilgrim-button` linking to `/mass-times`.

### 5.3 "You Belong Here" Newcomer Block

**Purpose**: Explicitly welcome first-time visitors. Emotionally anchor them before asking them to explore.

```
┌──────────────────────────────────────────┐
│  max-w-6xl  two-column layout            │
│                                          │
│  ┌──────────────┐  ┌─────────────────┐   │
│  │ PHOTO        │  │ WELCOME label   │   │
│  │ (parish      │  │                 │   │
│  │  community   │  │ You Belong      │   │
│  │  image,      │  │ Here            │   │
│  │  rounded-2xl)│  │ (h2, Fraunces)  │   │
│  │              │  │                 │   │
│  │              │  │ Whether you     │   │
│  │              │  │ have been ...   │   │
│  │              │  │ (serif italic)  │   │
│  │              │  │                 │   │
│  │              │  │ [I'm New Here →]│   │
│  └──────────────┘  └─────────────────┘   │
└──────────────────────────────────────────┘
```

**Content source**: New copy or pull from `content.welcomeExcerpt`.
**Photo**: `welcome_thumb.webp` or `our_parish.webp` — display at `aspect-[4/5]` on desktop so the text has room.
**CTA**: `.pilgrim-button-primary` linking to `/new-here`.
**Animation**: `whileInView` fade-in-up, staggered (image 0ms, text 200ms).

### 5.4 Mass Locations & Times Highlight

**Purpose**: Reinforce where and when. Give both churches equal presence.

```
┌──────────────────────────────────────────┐
│  bg-parish-elevated/50  full-width       │
│  max-w-7xl  two-column                   │
│                                          │
│  SECTION LABEL: "Join Us in Worship"     │
│  H2: "Two Churches, One Parish Family"   │
│                                          │
│  ┌──────────────┐  ┌──────────────┐      │
│  │ St Monica's  │  │ St Martin's  │      │
│  │ (image panel │  │ (image panel │      │
│  │  header)     │  │  header)     │      │
│  │              │  │              │      │
│  │ Saturday     │  │ Sunday       │      │
│  │ Vigil 6pm   │  │ 9:30am       │      │
│  │              │  │              │      │
│  │ Weekday      │  │              │      │
│  │ masses list  │  │              │      │
│  │              │  │              │      │
│  │ Address      │  │ Address      │      │
│  │ [Directions] │  │ [Directions] │      │
│  └──────────────┘  └──────────────┘      │
└──────────────────────────────────────────┘
```

**Content source**: `content.massSchedule` filtered by church.
**Photo headers**: `our_parish.webp` and `our_parish_2.webp` at `aspect-[16/9]` inside each card.
**Cards**: `.info-card` with image at top, data below.
**No countdown timers here** — those are in the visit strip above. This section shows the full schedule summary.

### 5.5 Parish Mission / Story Excerpt

**Purpose**: Give depth to who this community is. Keep it brief — link to About page for full story.

```
┌──────────────────────────────────────────┐
│  max-w-3xl  centered editorial           │
│                                          │
│  SECTION LABEL: "Our Story"              │
│  H2: content.parishName                  │
│                                          │
│  Priest welcome excerpt (first 2-3       │
│  sentences of content.priestWelcome)     │
│  (font-serif, text-body-xl, muted)       │
│                                          │
│  [Learn About Us →]                      │
│                                          │
│  ──────── section-divider ────────       │
│                                          │
│  Scripture block (inverted):             │
│  content.parishPrayerText (first line)   │
└──────────────────────────────────────────┘
```

**Content source**: `content.priestWelcome`, `content.parishPrayerText`.
**Layout**: Narrow-width editorial. Simple, no cards.
**CTA**: `pilgrim-button` linking to `/about`.

### 5.6 Community Life Preview

**Purpose**: Show the parish is alive and active. Preview groups, volunteering, and giving.

```
┌──────────────────────────────────────────┐
│  max-w-7xl  section                      │
│                                          │
│  SECTION LABEL: "Community"              │
│  H2: "Gathered in Prayer & Parish Life"  │
│  Subtitle (serif italic)                 │
│                                          │
│  ┌────────┐ ┌────────┐ ┌────────┐       │
│  │SACRA-  │ │PARISH  │ │ONLINE  │       │
│  │MENTS   │ │LIFE    │ │GIVING  │       │
│  │        │ │        │ │        │       │
│  │icon    │ │icon    │ │icon    │       │
│  │heading │ │heading │ │heading │       │
│  │text    │ │text    │ │text    │       │
│  │[CTA]   │ │[CTA]   │ │[CTA]  │       │
│  └────────┘ └────────┘ └────────┘       │
│                                          │
└──────────────────────────────────────────┘
```

**Content**: Restructured from current 4-card "Worship at a Glance" grid. Keep 3 cards (drop Online Giving to its own section if needed or keep as the third card).
**Cards**: `.sacred-card` with Lucide icon, brass-colored icon at top, heading, description, `.pilgrim-button` CTA.
**Animation**: Staggered `whileInView` fade-in-up (0ms, 150ms, 300ms).

### 5.7 Daily Reflection & Social Proof

**Purpose**: Show daily spiritual content and parish social presence side by side.

```
┌──────────────────────────────────────────┐
│  max-w-7xl  two-column                   │
│                                          │
│  ┌────────────────┐  ┌──────────────┐    │
│  │ DAILY          │  │ PARISH       │    │
│  │ REFLECTION     │  │ UPDATES      │    │
│  │                │  │              │    │
│  │ Date navigator │  │ Facebook     │    │
│  │ Reflection card│  │ Feed embed   │    │
│  │                │  │              │    │
│  └────────────────┘  └──────────────┘    │
│                                          │
└──────────────────────────────────────────┘
```

**Content source**: Existing `DailyReflectionCard` and `FacebookFeed` components.
**Layout**: `grid-cols-1 lg:grid-cols-12 gap-8` — reflection `col-span-7`, feed `col-span-5` (same as current).
**Keep**: `ReflectionDateNavigator`, `DailyReflectionCard`, `FacebookFeed` components unchanged.

### 5.8 Testimonials

**Keep**: Existing `TestimonialsCarousel` component.
**Update**: Wrap in a section with eyebrow label "Parish Voices" and match card styling to new `.sacred-card`.

### 5.9 Prayer Wall

**Keep**: Existing `PrayerWallSection` component with `embedded={true} maxItems={4}`.
**Update**: Wrap in section with eyebrow label. Match card styling.

### 5.10 Final Visit CTA

**Purpose**: Close with a strong invitation to visit.

```
┌──────────────────────────────────────────┐
│  Full-width image panel with overlay     │
│  (parish_prayer.webp or hero_5.webp)     │
│                                          │
│  H2: "Come and See"                      │
│  Subtitle: "Everyone is welcome..."      │
│                                          │
│  [Plan Your Visit]  [Contact Us]         │
│                                          │
└──────────────────────────────────────────┘
```

**Layout**: Full-width image panel with dark overlay (`bg-parish-fg/60`), centered text in `text-parish-inverse`.
**CTAs**: `.pilgrim-button-brass` (Plan Your Visit → `/mass-times`) and `.pilgrim-button` with white text (Contact Us → `/contact`).

---

## 6 — Interior Page Templates

### 6.1 Template: Story / Editorial

**Used by**: About, History, New Here, Safeguarding, Homilies.

```
┌──────────────────────────────────────────┐
│  Page header:                            │
│  · Eyebrow label                         │
│  · H1 (Fraunces, accent word in italic)  │
│  · Optional subtitle (serif italic)      │
│  · Centered, max-w-3xl                   │
│                                          │
│  Content sections:                       │
│  · max-w-3xl for prose                   │
│  · max-w-5xl for cards/grids             │
│  · Alternating full-width image panels   │
│  · Scripture blocks as section breaks    │
│                                          │
│  Optional CTA footer:                    │
│  · Two pilgrim-buttons side by side      │
└──────────────────────────────────────────┘
```

**Padding**: `pt-28 pb-24 px-6 md:px-12 lg:px-20`.
**Page header animation**: `initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}`.

### 6.2 Template: Utility / Service

**Used by**: Mass Times, Contact, Sacraments, Giving, Sacraments Booking, Live Stream.

```
┌──────────────────────────────────────────┐
│  Page header:                            │
│  · Same as Story template                │
│                                          │
│  Primary content:                        │
│  · Two-column grid (md:grid-cols-2)      │
│  · .info-card styling for data blocks    │
│  · Maps, forms, or embedded widgets      │
│                                          │
│  Optional secondary section:             │
│  · Scripture block or related links      │
└──────────────────────────────────────────┘
```

### 6.3 Template: Community / Highlight

**Used by**: Community Hub, Volunteer, News & Events, Gallery, Bulletin.

```
┌──────────────────────────────────────────┐
│  Page header:                            │
│  · Same as Story template                │
│                                          │
│  Content area:                           │
│  · max-w-7xl for wider grid layouts      │
│  · 3-column card grids for listings      │
│  · .sacred-card for featured items       │
│  · .info-card for data items             │
│  · Filter tabs/controls if needed        │
└──────────────────────────────────────────┘
```

---

## 7 — Page-by-Page Template Assignment

| Page                    | Template            | Key Changes                                                      |
|-------------------------|---------------------|------------------------------------------------------------------|
| **Home**                | *(unique — §5)*     | Full rebuild per §5                                              |
| **New Here**            | Story/Editorial     | Add community photo, keep steps + scripture block                |
| **About**               | Story/Editorial     | Add image panels between sections, vision+mission as prose       |
| **Mass Times**          | Utility/Service     | Keep two-column church cards, update to `.info-card`             |
| **Contact**             | Utility/Service     | Keep maps + details, update card styling                         |
| **News & Events**       | Community/Highlight | Card grid for news items, update styling                         |
| **Sacraments**          | Utility/Service     | Keep journey stepper, update cards                               |
| **Community Hub**       | Community/Highlight | Keep existing Supabase features, update card styling             |
| **Giving**              | Utility/Service     | Update card styling, keep payment features                       |
| **Volunteer**           | Community/Highlight | Update card grid styling                                         |
| **Gallery**             | Community/Highlight | Update grid styling                                              |
| **History**             | Story/Editorial     | Timeline as editorial prose with section breaks                  |
| **Homilies**            | Story/Editorial     | Audio player cards with `.info-card` styling                     |
| **Live Stream**         | Utility/Service     | Embed + info cards                                               |
| **Bulletin**            | Story/Editorial     | Keep native bulletin rendering, update typography                |
| **Safeguarding**        | Story/Editorial     | Prose with section breaks                                        |
| **Sacraments Booking**  | Utility/Service     | Form styling with `.info-card`                                   |
| **Admin pages**         | *(unchanged)*       | Internal only — no visual redesign needed                        |

---

## 8 — Asset Manifest

### 8.1 Photography (existing)

| Asset                    | Current Use           | Redesign Use                          |
|--------------------------|-----------------------|---------------------------------------|
| `hero_1.webp`–`hero_5.webp` | Hero background    | Hero rotation or pick best single     |
| `our_parish.webp`        | —                     | St Monica's card header               |
| `our_parish_2.webp`      | —                     | St Martin's card header               |
| `parish_prayer.webp`     | —                     | Final CTA image panel                 |
| `welcome_thumb.webp`     | —                     | "You Belong Here" section photo       |
| `news_*.webp`            | News cards            | News & Events card thumbnails         |
| `council_*.webp`         | About page            | Council member photo cards            |
| `st_*_school.webp`       | Contact page          | School info cards                     |

### 8.2 New Assets Needed

| Asset                    | Placeholder                              |
|--------------------------|------------------------------------------|
| Community life photo     | Use `news_connections.webp` temporarily  |
| Interior church photo    | Use `hero_2.webp` temporarily            |

### 8.3 Fonts

| Font        | Source       | Weights Loaded                  |
|-------------|-------------|---------------------------------|
| Fraunces    | Google Fonts | 300, 400, 500, 600, 700 + ital |
| Manrope     | Google Fonts | 300, 400, 500, 600, 700        |
| OpenDyslexic| CDN          | Regular (accessibility toggle)  |

---

## 9 — Technical Notes

### 9.1 Stack (no changes)

- React 18.3 + React Router 7
- Vite 5.4
- Tailwind CSS 3.4 + PostCSS + Autoprefixer
- Framer Motion 11.9
- Supabase JS SDK
- Lucide React icons

### 9.2 Theme System

- `data-theme="light"` / `data-theme="dark"` on `<html>` element
- Toggle via existing `ThemeToggle` component
- Flash prevention via inline `<script>` in `index.html` (keep as-is)
- `darkMode: ['selector', '[data-theme="dark"]']` in Tailwind config

### 9.3 Data Sources (no changes)

- Static JSON: `parish_content.json`, `mass_schedule.json`, `newsletters.json`, etc.
- Supabase: Daily reflections, community hub, prayer wall
- External: Facebook Feed SDK embed

### 9.4 Routing (no changes)

All existing routes preserved. No new routes required.

### 9.5 Accessibility (maintained + enhanced)

- 18px base font size (unchanged)
- `min-height: 44px` touch targets (unchanged)
- `prefers-reduced-motion` media query (unchanged)
- OpenDyslexic toggle (unchanged)
- Skip navigation link (unchanged)
- WCAG focus rings (unchanged)
- New: Dropdown menus get `aria-expanded`, `aria-haspopup`, `role="menu"` attributes
- New: Mobile drawer gets `aria-modal="true"`, focus trap

### 9.6 Implementation Order (recommended)

1. **Token layer**: Update `index.css` colors + `tailwind.config.js` (fonts, shadows, type scale, animations)
2. **index.html**: Swap Google Fonts link to Fraunces + Manrope
3. **Component patterns**: Update `.sacred-card`, add `.pilgrim-button`, `.info-card`, `.scripture-block`, `.section-divider` in `index.css`
4. **Global shell**: Rebuild `RootLayout.tsx` (header dropdowns, mobile drawer, footer)
5. **Homepage**: Rebuild `HomePage.tsx` + `HeroSection.tsx` per §5
6. **Interior pages**: Apply templates to each page (highest traffic first)
7. **Polish**: Light/dark theme parity pass, animation timing, responsive breakpoints

### 9.7 Files Modified

| File                                      | Change Type |
|-------------------------------------------|-------------|
| `src/index.css`                           | Rewrite     |
| `tailwind.config.js`                      | Rewrite     |
| `index.html`                              | Modify      |
| `src/layouts/RootLayout.tsx`              | Rewrite     |
| `src/components/home/HeroSection.tsx`     | Modify      |
| `src/pages/HomePage.tsx`                  | Rewrite     |
| `src/pages/NewHerePage.tsx`               | Modify      |
| `src/pages/AboutPage.tsx`                 | Modify      |
| `src/pages/MassTimesPage.tsx`             | Modify      |
| `src/pages/ContactPage.tsx`               | Modify      |
| `src/pages/NewsEventsPage.tsx`            | Modify      |
| `src/pages/SacramentsServicesPage.tsx`    | Modify      |
| `src/pages/CommunityHubPage.tsx`          | Modify      |
| `src/pages/GivingPage.tsx`               | Modify      |
| `src/pages/VolunteerPage.tsx`            | Modify      |
| `src/pages/GalleryPage.tsx`              | Modify      |
| `src/pages/HistoryPage.tsx`              | Modify      |
| `src/pages/HomiliesPage.tsx`             | Modify      |
| `src/pages/LiveStreamPage.tsx`           | Modify      |
| `src/pages/BulletinPage.tsx`             | Modify      |
| `src/pages/SafeguardingPage.tsx`         | Modify      |
| `src/pages/SacramentsBookingPage.tsx`    | Modify      |

### 9.8 Files NOT Modified

| File / Area              | Reason                                    |
|--------------------------|-------------------------------------------|
| `src/types.ts`           | No data model changes                     |
| `src/context/*`          | Data loading unchanged                    |
| `src/hooks/*`            | Hooks unchanged                           |
| `src/lib/*`              | API + countdown logic unchanged           |
| `src/components/community/*` | Supabase features unchanged           |
| `src/components/social/*` | Facebook feed unchanged                  |
| `src/components/AccessibilityMenu.tsx` | Functionality unchanged       |
| `src/components/ThemeToggle.tsx` | Functionality unchanged             |
| `src/components/JsonLdSchema.tsx` | SEO schema unchanged               |
| `src/App.tsx`            | Router config unchanged                   |
| `public/data/*`          | JSON data sources unchanged               |
| `supabase/*`             | Database layer unchanged                  |
| Admin pages              | Internal tooling, no visual redesign      |

---

## 10 — Verification Plan

### 10.1 Build Verification

```bash
npx tsc -b          # TypeScript compilation
npm run build        # Vite production build
```

### 10.2 Visual Verification (manual via dev server)

```bash
npm run dev
```

- [ ] Homepage: all 10 sections render in correct order on mobile, tablet, desktop
- [ ] Light theme: check all token colors, card styling, typography
- [ ] Dark theme: toggle and verify full visual parity
- [ ] Navigation: desktop dropdowns open/close, mobile drawer opens/closes
- [ ] Footer: three-column layout, all links work
- [ ] Interior pages: check Home, New Here, About, Mass Times, Contact, News & Events
- [ ] Mass countdown timers: still functional
- [ ] Daily reflection: loads and navigates dates
- [ ] Prayer wall: posts and prayers still work
- [ ] Facebook feed: embeds correctly
- [ ] Accessibility: theme toggle, dyslexic font toggle, keyboard navigation

### 10.3 Responsive Breakpoints

- Mobile: 375px (iPhone SE)
- Tablet: 768px (iPad)
- Desktop: 1280px (xl breakpoint)
- Wide: 1536px (2xl)

---

*End of Build Prompt.*
