## 1. OVERVIEW
Sanctuary Light is a quiet cinematic redesign for Greenacres Walkerville Catholic Parish: reverent, premium, and newcomer-first. The site should feel like entering a calm church foyer at golden hour, with practical direction surfaced immediately for first-time visitors while parishioners still feel the dignity and continuity of parish life.

## 2. DESIGN SYSTEM (index.css / tailwind tokens)
### 2.1 Color Palette
- `--background: 41 24% 93%`
- `--foreground: 45 8% 10%`
- `--primary: 34 22% 29%`
- `--primary-foreground: 39 35% 96%`
- `--accent: 41 72% 58%`
- `--accent-warm: 25 40% 37%`
- `--accent-cool: 31 12% 52%`
- `--surface: 38 33% 97%`
- `--surface-elevated: 37 24% 87%`
- `--border: 28 11% 22%`
- Dark mode:
  - `--background: 215 15% 6%`
  - `--foreground: 39 30% 89%`
  - `--primary: 31 23% 60%`
  - `--primary-foreground: 215 14% 10%`
  - `--accent: 41 78% 67%`
  - `--surface: 213 14% 10%`
  - `--surface-elevated: 215 14% 15%`
  - `--border: 34 20% 80%`
- Opacity variants used throughout:
  - `primary/10` for subtle panels
  - `primary/35` for image overlays
  - `accent/20` for borders and halo glows
  - `foreground/88` for hero overlay depth

### 2.2 Typography
- Display font: `Fraunces`, fallback `serif`
- Body / UI font: `Manrope`, fallback `sans-serif`
- Hero heading: `clamp(3.4rem, 8vw, 7.4rem)`, weight `500`, letter-spacing `-0.04em`, line-height `0.9`
- Section heading: `clamp(2rem, 4vw, 3.6rem)`, weight `500`, letter-spacing `-0.03em`, line-height `1.02`
- Card heading: `1.75rem` to `2rem`, weight `500`, letter-spacing `-0.025em`, line-height `1.08`
- Body large: `1.125rem` to `1.25rem`, weight `500`, line-height `1.75`
- Body default: `1rem`, weight `500`, line-height `1.75`
- Small / caption / nav: `0.72rem`, weight `700`, uppercase, letter-spacing `0.28em`
- Serif emphasis inside headings uses `Fraunces` italic, never a separate font family

### 2.3 Spacing & Layout
- Section padding:
  - Mobile: `px-6 py-16`
  - Tablet: `px-10 py-20`
  - Desktop: `px-16 py-24`
- Max content widths:
  - Main shell: `max-w-[1480px]`
  - Page content: `max-w-7xl`
  - Reading column: `max-w-3xl`
- Standard gaps:
  - Tight: `gap-4`
  - Content: `gap-6`
  - Section grid: `gap-8`
  - Large split layouts: `gap-10` to `gap-12`

### 2.4 Reusable Patterns
- Label pattern:
  - Horizontal 40px line + uppercase text
  - `font-size: 0.72rem`, `letter-spacing: 0.34em`, `font-weight: 600`
  - Used in hero, section intros, footer headings
- Badge / pill pattern:
  - `rounded-full`, border `1px solid accent/20`, background `surface/70`, backdrop blur `12px`
  - Used for nav chips, quick stats, schedule badges
- CTA button pattern:
  - Primary: `rounded-full`, dark gradient fill, `px-6 py-3.5`, uppercase tracking `0.28em`
  - Secondary: `rounded-full`, border `border/15`, `surface/70`, backdrop blur `12px`
  - Used in hero, action bands, footer
- Card pattern:
  - Radius `1.75rem`, border `1px solid border/10`, background `surface/94`, shadow `0 24px 55px -40px rgba(0,0,0,0.4)`
  - Hover lift `translateY(-4px)` with brass halo
  - Used for info cards, event cards, council profiles
- Panel pattern:
  - Radius `2rem`, border `1px solid border/10`, background `surface/92`, backdrop blur `20px`
  - Used for hero side panel, major content bands, sticky archive rail
- Scripture block:
  - Radius `2rem`, border `1px solid accent/20`, dark gradient background, brass radial bloom top-left
  - Used on Home, About, New Here
- Image panel:
  - Radius `2rem`, overflow hidden, border `1px solid border/10`, dark bottom gradient overlay
  - Used for hero media, parish imagery, resource cards

## 3. SECTIONS (in display order)
### Section 1: Global Navigation
- Layout: fixed top nav with two tiers; slim dark top strip and main navigation bar beneath
- Background: transparent at top, then `surface/88` with heavy blur and shadow after scroll
- Content hierarchy: logo / parish name / tagline strip / primary nav / give CTA / accessibility + theme / mobile drawer
- Typography per element:
  - Logo title: `1.25rem` to `1.5rem`, display font, `500`
  - Top strip: `0.68rem`, uppercase, tracking `0.28em`
  - Nav links: `0.72rem`, uppercase, tracking `0.24em`, `600`
- Interactive states:
  - Active link becomes filled dark pill with inverse text
  - Hover link gains subtle `border/6` background
  - Drawer links slide into rounded cards with trailing arrow
- Responsive behavior:
  - Desktop shows 6 primary links and `Give`
  - Mobile collapses to circular menu trigger with grouped drawer sections and quick actions
- Icons: `Menu`, `X`, `CalendarClock`, `MapPinned`, `Mail`, `Church`, `HeartHandshake`, `ArrowRight` from `lucide-react`
- Animations/transitions: nav blur and shadow on scroll, drawer fade/slide `280ms`

### Section 2: Homepage Hero
- Layout: full-height cinematic header with left-aligned text and right-side glass information slab
- Background: `/assets/source/hero_4.webp` with dark multi-stop overlay and noise layer
- Content hierarchy:
  - Label: `Catholic Parish in Adelaide`
  - Heading: `Walk gently. / Belong deeply.`
  - Body: welcome and positioning copy
  - CTAs: `Start Your First Visit`, `This Weekend's Mass Times`
  - Side panel: weekend Mass snapshot + visitor help summary
- Typography per element:
  - Hero heading: `clamp(3.4rem, 8vw, 7.4rem)`, white, display font
  - Body: `1.125rem` to `1.25rem`, `white/78`
  - Panel kicker: `0.72rem`, uppercase, `white/65`
- Interactive states:
  - Buttons lift slightly on hover
  - Hero background parallax translates `0%` to `24%` on scroll
- Responsive behavior:
  - Mobile stacks panel below copy
  - Desktop uses `7/5` split
- Animations/transitions: staggered reveal `0.9s` with cinematic easing

### Section 3: Homepage Quick Start
- Layout: overlapping panel pulled upward over the hero
- Background: `surface/92`
- Content hierarchy:
  - Heading: `First things first: know where to go and when to arrive.`
  - Three cards: weekend Masses, visit planning, newcomer guide
- Component details:
  - 3 cards, `1 col mobile`, `3 cols md+`
  - Each card uses `InfoCard` pattern, icon badge, short copy, CTA
- Icons: `CalendarClock`, `MapPinned`, `HeartHandshake`

### Section 4: Homepage Newcomer Block
- Layout: `5/7` split with image panel on one side and stacked steps on the other
- Background: site background with individual image/card surfaces
- Content hierarchy:
  - Heading: `You do not need to know everything before you arrive.`
  - Three newcomer steps
  - CTAs: `See The Full Welcome Guide`, `Contact The Parish Office`
- Responsive behavior: image stacks above steps on mobile

### Section 5: Homepage Mass Locations
- Layout: intro + two large church cards + sacrament action band below
- Background: neutral page surface
- Content hierarchy:
  - Heading: `Worship across two churches, each with a clear rhythm and place.`
  - St Monica's card
  - St Martin's card
  - Weekday rhythm + sacrament grid
- Component details:
  - 2 major cards, `1 col mobile`, `2 cols lg`
  - Each major card has image top, church metadata, schedule rows, countdown line
  - Sacrament grid: 4 items, `1 col mobile`, `2 cols md+`
- Icons: `Church`, `Clock3`

### Section 6: Homepage Parish Story
- Layout: `5/7` editorial split
- Background: neutral page surface
- Content hierarchy:
  - Heading: `A parish identity shaped by welcome, worship, and shared responsibility.`
  - Parish and council excerpts
  - Vision scripture block
  - Mission commitments list

### Section 7: Homepage Community Life
- Layout: one large image panel + four supporting cards
- Background: neutral page surface
- Content hierarchy:
  - Heading: `Parish life is more than Sunday attendance.`
  - Cards: belonging, faith formation, service, staying connected
- Component details:
  - `5/7` split desktop, stacked mobile
  - Supporting grid `1 col mobile`, `2 cols md+`
- Icons: `Users`, `BookOpenText`, `HeartHandshake`, `MapPinned`

### Section 8: Homepage Daily Reflection / Social Proof
- Layout: `7/5` split with reflection module and rationale card, followed by testimonial band
- Background: neutral page surface then sanctuary panel for testimonials
- Content hierarchy:
  - Reflection navigator + reflection card
  - Why people stay card
  - Testimonials heading and carousel
- Animations/transitions: carousel horizontal motion `400ms`

### Section 9: Homepage Community Pulse
- Layout: `7/5` split
- Background: sanctuary panels wrapping each module
- Content hierarchy:
  - Prayer wall
  - Facebook feed
- Responsive behavior: stacked on mobile; Facebook rail sticky on large screens only if content allows

### Section 10: Homepage Final CTA
- Layout: wide action band with message left, stacked CTAs right
- Content hierarchy:
  - Heading: `If this is your first visit, start with Mass times and let the rest unfold from there.`
  - CTAs: `View This Weekend's Mass Times`, `Read The First-Visit Guide`

### Section 11: Story / Editorial Interior Template
- Layout: hero image on one side, narrative headline on the other, then spacious editorial sections
- Applies to: About, History, similar story-driven pages
- Content hierarchy: hero, longform voice blocks, scripture or prayer block, profile gallery, concluding CTA
- Responsive behavior: image stacks above text on mobile

### Section 12: Utility / Service Interior Template
- Layout: clear service hero + compact metadata panel + card-based utility sections
- Applies to: Mass Times, Contact, Sacraments, service-style pages
- Content hierarchy: practical headline, service CTAs, key info cards, maps or lists, CTA band

### Section 13: Highlight / Community Interior Template
- Layout: more visual hero, editorial cards, event/news modules, sticky secondary rail where appropriate
- Applies to: New Here, News & Events, Community-style pages
- Content hierarchy: welcoming narrative, highlighted content blocks, archive or utility rail, CTA band

### Section 14: Footer
- Layout: dark footer with strong statement block left and three info columns right
- Background: `foreground`
- Content hierarchy:
  - Statement headline
  - Intro paragraph
  - CTAs
  - Visit / Explore / Belong columns
  - Copyright and acknowledgement line
- Typography:
  - Footer headline: `2.5rem` to `3.125rem`
  - Column labels: `0.72rem` uppercase
  - Links: `0.875rem`, uppercase tracking `0.18em`

## 4. ASSET MANIFEST
### Videos
- None required for v1

### Images
- `assets/source/hero_4.webp` — homepage hero background, full-bleed, `object-cover`
- `assets/source/hero_2.webp` — contact/service hero, `object-cover`
- `assets/source/welcome_thumb.webp` — newcomer imagery, `object-cover`
- `assets/source/our_parish.webp` — about/story imagery and resource fallback
- `assets/source/our_parish_2.webp` — community life image
- `assets/source/news_connections.webp` — news hero and resource card
- `assets/refurbishment/st_monica_4.webp` — Mass Times feature image
- `assets/refurbishment/st_monica_5.webp` — second Mass Times card image
- `assets/profiles/*.webp` — pastoral council grid
- Existing gallery/poster assets remain for Gallery and Bulletin pages

### Fonts
- `Fraunces` — Google Fonts, weights `300,400,500,600,700`
- `Manrope` — Google Fonts, weights `400,500,600,700,800`

### Icons
- `lucide-react`
- `Menu`, `X` — mobile nav
- `ArrowRight` — CTAs and drawer links
- `CalendarClock`, `Clock3` — schedules and timing
- `MapPinned` — directions and contact
- `Church` — church cards and footer visit section
- `HeartHandshake`, `Users`, `BookOpenText`, `CalendarRange`, `Phone`, `Mail` — supporting information cards

## 5. KEY DESIGN PATTERNS SUMMARY
- Use dark-over-photo cinematic heroes with left-aligned copy and one glass side panel.
- Keep accents restrained: brass appears on lines, icon rings, small text, and active controls.
- Every major page ends with an action band, not a dead stop.
- Story pages use editorial pacing and large text blocks; utility pages use service cards; highlight pages use editorial cards plus a secondary rail.
- Buttons are always rounded-full with high tracking and deliberate contrast.
- Image panels always include a bottom gradient overlay for text legibility.

## 6. TECHNICAL NOTES (optional)
- Framework: React 18 + Vite + TypeScript
- Styling: Tailwind CSS with semantic `parish-*` tokens and custom component classes in `src/index.css`
- Animation: Framer Motion for hero reveal, drawer motion, section reveals, and testimonial transitions
- Accessibility:
  - Maintain 18px base text size
  - Preserve theme toggle, skip link, accessibility menu, and focus outlines
  - Maintain 44px minimum touch targets
- Performance:
  - Reuse existing local assets from `public/assets/`
  - Keep route-level code splitting
  - Continue using static imagery instead of video for the primary atmosphere
