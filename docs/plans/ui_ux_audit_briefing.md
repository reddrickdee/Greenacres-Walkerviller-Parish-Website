# Greenacres Walkerville Catholic Parish: UI/UX Audit Briefing

## Executive Summary

The Greenacres Walkerville Parish website shows a strong foundation with its thoughtful "Sacred Editorial" aesthetic and elderly-friendly defaults (like the 18px base font). However, to truly serve a community with varying digital skills and age ranges (50–80+), we must prioritize removing invisible barriers. The most critical findings require us to urgently enlarge mobile touch targets so they are easy to tap, ensure all interactive elements (like icon-only buttons) are clearly labeled for screen readers, and provide obvious visual indicators representing where the keyboard focus currently sits. By addressing these foundational accessibility and touch interaction gaps, the site will transform from a beautiful brochure into a truly inclusive digital front door for the parish.

---

## Findings by Priority

### Priority 1 — CRITICAL

#### 1. Accessibility (WCAG 2.2 AA)

**Current State:** The site does well by offering an accessibility menu (font scaling, dyslexia font) and enforcing a 4.5:1 contrast ratio. However, it likely falls short on the less obvious mechanics: `aria-label` tags on icon-only buttons, visible keyboard focus indicators, and strict focus trapping for users who can't use a mouse.

**Research Says:** The Web Content Accessibility Guidelines (WCAG) 2.2 update (active standard through 2025/2026) emphasizes that keyboard "Focus Visible" (Requirement 2.4.7) is non-negotiable. If you press "Tab" on a keyboard, there must be a highly visible outline showing what element you are on, and it must never be hidden behind sticky headers (Requirement 2.4.11). Furthermore, for screen reader users, an icon without text is a dead end; adding `aria-label="Search"` to a magnifying glass icon tells the device exactly what the button does.
*In plain English: People navigating without a mouse need a glowing box to show them where they are and hidden name tags to tell them what buttons do.*

**Recommendations:**

1. **High Impact/Low Effort:** Add `aria-label` tags to all icon-only buttons (like social media links or mobile menu toggles) and set `aria-hidden="true"` on the SVG shapes themselves.
2. **High Impact/High Effort:** Implement a global custom focus ring using Tailwind (`focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary`) that works across both light and dark modes.

**Benchmark:** The UK Government website (GOV.UK) is the gold standard; try tabbing through their site to see unmistakably clear, high-contrast yellow/black focus rings.

#### 2. Touch & Interaction

**Current State:** The design uses large rounded corners and Tailwind utilities, but buttons—especially icon buttons in navigation or the gallery—may be too small to tap easily on a phone, creating frustration for elderly parishioners.

**Research Says:** Both Apple and WCAG standard 2.5.5 dictate that touch targets must be at least 44x44 pixels (or points). Think of this as the size of an average adult fingertip. If buttons are smaller than this, or packed too tightly (needing about 8-16px of gap), users will accidentally tap the wrong thing.
*In plain English: Make buttons big enough for a clumsy thumb to hit without accidentally pressing the link next to it.*

**Recommendations:**

1. **High Impact/Low Effort:** Add padding or minimum dimension utilities (`min-h-[44px] min-w-[44px]`) to all icon-only buttons, particularly in mobile headers and footers.
2. **Medium Impact/Low Effort:** Ensure every clickable item has `cursor-pointer` so mouse users know it's a link.

**Benchmark:** The Apple Store app is an excellent example of spacious, 44x44px minimum touch targets that ensure no accidental taps.

---

### Priority 2 — HIGH

#### 3. Performance & Perceived Speed

**Current State:** Being a static Vite/React site loading JSON, it's likely fast. However, loading times for the Supabase backend features (like the Community Hub) or heavy Gallery images might cause layout shifts or show frustrating "loading..." text.

**Research Says:** 2025 UX research emphasizes "perceived performance." A screen that shows a wireframe outline of where content *will* appear (a "skeleton screen") makes waiting feel 30% shorter than a spinning circle. Spinners draw attention to the wait; skeletons draw attention to the progress. Additionally, async buttons must immediately show they've been clicked (disabling the button) to prevent double-submissions.
*In plain English: Show people a grey outline of the final content while it loads so they feel like things are happening instantly.*

**Recommendations:**

1. **High Impact/Low Effort:** Disable forms and submission buttons immediately upon click, adding a small loading spinner inside the button itself.
2. **High Impact/Medium Effort:** Replace text-based "Loading..." indicators with animated skeleton UI components (`animate-pulse` in Tailwind) for the Community Hub and Article pages.

#### 4. Layout & Responsive Design

**Current State:** The app uses Tailwind, so it's inherently responsive. However, complex layouts (like modals or sticky navigation drawers) might overlap content or cause horizontal scrolling on very small screens (375px wide).

**Research Says:** Content jumping (Cumulative Layout Shift) and horizontal scrolling are major usability offenses. Furthermore, Z-index (layering) conflicts often happen when sticky headers inadvertently cover up dropdown menus or modals.
*In plain English: Websites should only scroll up and down, never left and right, and pop-ups shouldn't get hidden behind headers.*

**Recommendations:**

1. **High Impact/Low Effort:** Establish a strict, documented z-index scale (e.g., `z-10` for sticky headers, `z-40` for overlays, `z-50` for modals) in the Tailwind config to prevent layering bugs.
2. **Medium Impact/Low Effort:** Verify `overflow-x-hidden` on the main wrapper body to prevent accidental horizontal scrolling caused by animations.

---

### Priority 3 — MEDIUM

#### 5. Typography & Readability

**Current State:** The site correctly uses an 18px base size. It pairs Merriweather (serif) for a traditionally sacred feel in headings, and Inter (sans-serif) for clean body text readability.

**Research Says:** For elderly users in 2026, 16px is the absolute minimum, making the 18px choice excellent. However, Web Content Accessibility Guidelines (WCAG) specifically dictate that the space *between* lines of text (line-height) must be at least 1.5 times the font size to prevent users from losing their place while reading.
*In plain English: Leave enough blank horizontal space between lines of text so aging eyes don't accidentally skip a line while reading.*

**Recommendations:**

1. **High Impact/Low Effort:** Ensure tailwind's `leading-relaxed` (1.625) or `leading-loose` (2.0) is applied to all long-form paragraph text, specifically on the About and Article pages.
2. **Medium Impact/Low Effort:** Limit paragraph width to a maximum of 65-75 characters per line using Tailwind's `max-w-prose` utility to prevent reading fatigue.

#### 6. Animation & Motion

**Current State:** The site uses Framer Motion, which can easily be overused, resulting in long, distracting animations that trigger motion sickness.

**Research Says:** The sweet spot for a digital animation (like a menu sliding open or a button changing color) is between 150 and 300 milliseconds. Faster feels broken; slower feels sluggish. More importantly, modern OS settings allow users to request "reduced motion," which must be respected.
*In plain English: Animations should feel like a quick heartbeat—fast enough to be snappy, but slow enough to be noticed, and they should turn off entirely for users who get dizzy.*

**Recommendations:**

1. **High Impact/Low Effort:** Audit all Framer Motion components to ensure they check the `useReducedMotion` hook and gracefully fall back to instant transitions if the user has requested it.
2. **Medium Impact/Low Effort:** Standardize micro-interactions (like hover coloring) to Tailwind's `duration-200` (200ms).

#### 7. Visual Consistency & Style (Glassmorphism)

**Current State:** The site uses glassmorphism (frosted glass) containers. The challenge is maintaining contract and legibility across both light mode and dark mode.

**Research Says:** Glassmorphism inherently reduces contrast due to background blurring. 2025 accessibility audits frequently flag transparent cards for falling below the 4.5:1 text contrast ratio, especially when light text sits on a lightly frosted dark background.
*In plain English: Frosted glass looks pretty, but if the background behind the glass is messy, the text on top of the glass becomes impossible to read.*

**Recommendations:**

1. **High Impact/Medium Effort:** Ensure the "frosted" layer (`bg-white/70` in light mode, `bg-gray-900/80` in dark mode) has a high enough opacity that the text contrast passes WCAG AA regardless of the image sitting underneath it. Add a subtle solid `border` to give the glass distinct edges.

---

### Priority 4 — SITUATIONAL

#### 8. Information Architecture & Wayfinding

**Current State:** The site has 21 pages. The core visitor journey expects people to click Home → Mass Times → New Here.

**Research Says:** Usability studies for church and non-profit websites show that first-time visitors primarily seek two things: service times and "what to expect." If this information is buried or uses insider jargon, they leave.
*In plain English: First-time guests are nervous; your menu should act like a friendly greeter pointing them exactly where to go without using confusing church terminology.*

**Recommendations:**

1. **High Impact/Low Effort:** Ensure "Plan Your Visit" or "I'm New" is visually styled as the primary Call To Action (a solid button, not just a text link) in the main navigation header.

#### 9. Content, Empty States, & Editorial Voice

**Current State:** As a community site holding dynamic articles and events, there will occasionally be no news or no events to show.

**Research Says:** 2025 UX research labels "Empty States" as critical touchpoints. Saying "No Events Found" feels like an error. Best practices dictate explaining *why* it's empty and suggesting a next step.
*In plain English: Never hit a user with a dead end. If there are no events, say "There aren't any events this week, but check out our previous Homilies!"*

**Recommendations:**

1. **Medium Impact/Medium Effort:** Create a reusable `<EmptyState />` component that features a friendly icon, a brief positive explanation, and a button guiding them to another area of the site.

#### 10. Trust & Credibility

**Current State:** A community and volunteer-driven site must project safety and transparency, especially regarding Safeguarding (child protection) and Giving.

**Research Says:** Trust is built through transparency and prominent contact paths. Hiding Safeguarding policies or using vague language on donation pages hurts credibility.
*In plain English: People need to explicitly see that your community is safe and that you are easy to get in touch with.*

**Recommendations:**

1. **High Impact/Low Effort:** Ensure the Safeguarding policy link and physical church addresses are anchored globally in the footer, visible from every single page.

---

## Where Experts Disagree

**Skeleton Screens vs. Progressive Loading:** While UX researchers unanimously agree that spinners are bad for long loads, there is debate over *how* to implement placeholders. Some argue that highly detailed skeleton screens (which perfectly mirror the final UI) set overly strict expectations and cause "layout thrashing" if the loaded content doesn't perfectly match the skeleton. Others argue that simple, generic pulsing boxes (Progressive UI) are better and easier to maintain. *Given your use of Tailwind, opting for simple, generic `animate-pulse` boxes is the safest, most maintainable route.*

## Gaps & Follow-Up Questions

1. **Real-World Elderly Testing:** The 18px font and high contrast *theoretically* work, but digital confidence varies wildly among the 70+ demographic.
   **Action Required:** Conduct a "5-second test". Open the live mobile site, hand the phone to 3 different parishioners over 65, and ask them to "Find the Sunday mass time for St. Monica's." Watch where their thumbs fumble.
2. **Keyboard Navigation Audit:** We cannot effectively research how well your specific Vite/React components trap focus without manually scanning the DOM.
   **Action Required:** Unplug your mouse, open the live site, and attempt to navigate the entire "Sacraments Booking" process using exclusively the `Tab`, `Enter`, and arrow keys.
3. **Contrast Verification:** Glassmorphism contrast depends inherently on the changing photos underneath it.
   **Action Required:** Run a tool like Lighthouse or Axe DevTools on the live pages to formally verify that text on top of frosted containers securely passes the 4.5:1 ratio threshold.
