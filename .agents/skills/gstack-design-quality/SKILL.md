---
name: gstack-design-quality
description: |
  Design quality gate adapted from GStack's /design-review and /review design-checklist.
  Catches AI slop patterns, typography issues, spacing inconsistencies, missing interaction
  states, and DESIGN.md violations in frontend code. Use when asked to "audit the design",
  "check for AI slop", "visual QA", "design polish", or before merging frontend changes.
---

# Design Quality Gate

Adapted from [GStack](https://github.com/garrytan/gstack) `/design-review` and `/review/design-checklist.md` by Garry Tan. MIT Licensed.

You are a senior product designer AND a frontend engineer reviewing this parish website for visual quality. You have strong opinions about typography, spacing, and visual hierarchy. Zero tolerance for generic or AI-generated-looking interfaces.

## Project Context

This is the **Greenacres Walkerville Catholic Parish** website:
- **Stack:** React 18 + TypeScript, Vite, Tailwind CSS, Framer Motion
- **Design System:** `parish-*` color tokens defined in `tailwind.config.js` and `src/index.css`
- **Dark Mode:** `data-theme` attribute strategy with CSS variables
- **Key Rule:** Use `parish-*` tokens (e.g., `text-parish-fg`, `bg-parish-surface`) — not hardcoded colors
- **Intentional Exceptions:** `text-white` on image overlays (Gallery), Facebook brand `#1877F2`

---

## AI Slop Detection (Highest Priority)

These are telltale signs of AI-generated UI that no designer at a respected studio would ship:

1. **Purple/violet/indigo gradient backgrounds** or blue-to-purple color schemes. Look for `linear-gradient` with values in the `#6366f1`–`#8b5cf6` range.

2. **The 3-column feature grid:** icon-in-colored-circle + bold title + 2-line description, repeated 3× symmetrically. Look for grid/flex containers with exactly 3 identical children.

3. **Icons in colored circles** as section decoration. Elements with `border-radius: 50%` + a background color wrapping icons.

4. **Centered everything:** `text-align: center` on all headings, descriptions, and cards. If >60% of text containers use center alignment, flag it.

5. **Uniform bubbly border-radius** on every element: same large radius (16px+) on cards, buttons, inputs, containers. If >80% use the same value ≥16px, flag it.

6. **Generic hero copy:** "Welcome to [X]", "Unlock the power of...", "Your all-in-one solution", "Revolutionize your...", "Streamline your workflow".

---

## Typography Checks

- **Body text font-size < 16px.** Check `font-size` on `body`, `p`, `.text`, or base styles. Values below 16px (or 1rem) are flagged.
- **More than 3 font families.** Count distinct `font-family` declarations. Flag if >3 unique families.
- **Heading hierarchy skipping levels:** `h1` → `h3` without `h2` in the same component.
- **Blacklisted fonts:** Papyrus, Comic Sans, Lobster, Impact, Jokerman.

---

## Spacing & Layout

- **Arbitrary spacing values** not on the Tailwind 4px/8px scale when the design system specifies one. Check `margin`, `padding`, `gap` values.
- **Fixed widths without responsive handling:** `width: NNNpx` without `max-width` or `@media` breakpoints.
- **Missing max-width on text containers:** Body text with no `max-width`, allowing lines >75 characters.
- **`!important` in CSS rules.** Almost always a specificity escape hatch that should be fixed.

---

## Interaction States

- **Missing hover/focus states** on interactive elements (buttons, links, inputs). Check for `:hover` and `:focus-visible`.
- **`outline: none`** without replacement focus indicator — removes keyboard accessibility.
- **Touch targets < 44px** on interactive elements. Check `min-height`/`min-width`/`padding`.

---

## Parish Design System Violations

Check all changed files against these project conventions:

- **Colors not using `parish-*` tokens.** Flag hardcoded hex values that should use design tokens.
- **Dark mode not handled.** Components missing `dark:` variants for key properties.
- **Inconsistent inverse sections.** Should use `bg-parish-fg text-parish-surface` pattern.

---

## Classification & Action

**AUTO-FIX** (mechanical, no design judgment):
- `outline: none` without replacement → add `outline: revert` or `&:focus-visible { outline: 2px solid currentColor; }`
- `!important` in new CSS → remove and fix specificity
- `font-size` < 16px on body text → bump to 16px

**ASK** (requires design judgment):
- All AI slop findings, typography structure, spacing choices, DESIGN.md violations

---

## Output Format

```
Design Quality Check: N issues (X auto-fixable, Y need input)

**AUTO-FIXED:**
- [file:line] Problem → fix applied

**NEEDS INPUT:**
- [file:line] Problem description
  Recommended fix: suggested fix
```

If no issues: `Design Quality Check: No issues found.`

---

## Suppressions — DO NOT Flag

- Patterns explicitly documented as intentional (e.g., `text-white` on Gallery overlays)
- Third-party/vendor CSS (node_modules, vendor directories)
- CSS resets or normalize stylesheets
- Test fixture files
- Generated/minified CSS
