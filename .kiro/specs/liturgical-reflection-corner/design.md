# Design Document: Liturgical Reflection Corner

## Overview

The Liturgical Reflection Corner **refines** the existing `/daily-readings` page (`src/pages/DailyReadingsPage.tsx`). It is not a new page and not a replacement — the route, the home card link, the Universalis readings pipeline, and the liturgical day/colour panel all stay. What changes is the framing and the reflection section.

Three things are added or reframed:

1. **Page positioning** — the page is presented as "Today's Readings & Reflection" so the heading, SEO metadata, and JSON-LD describe both Scripture and guided reflection.
2. **A typed, permission-aware source model** — the current ad-hoc `REFLECTION_LINKS` array is replaced by a typed `ReflectionSource` model that records each source's copyright permission status. Reproduced `excerpt` text is rendered **only** when a source is explicitly `approved`. Australian Catholic sources are curated first, global backups last. Invalid source entries are excluded at runtime (with a recorded validation error) while valid entries are retained.
3. **A parish-written reflection prompt** — a short prompt for the day, derived **only** from the loaded Gospel reference and the liturgical day/season, never from third-party reflection text.

This is a **frontend-only** refinement. It introduces no new UI framework and **no new runtime dependency**. It continues the project's React 18 + Vite + Tailwind + Framer Motion + TypeScript patterns, `parish-*` theme tokens, and `data-theme` dark mode. At first release, no third-party excerpt permission is documented, so every reflection source ships as a **link-only** card; approved excerpts can be added later purely by editing source data.

### Notation

The repository is TypeScript (React 18 + Vite). All interfaces, functions, and examples in this document use TypeScript syntax to match the existing codebase. No pseudocode is used.

### Known constant discrepancy to resolve (TIMEOUT_MS)

`useDailyMassReadings.ts` currently sets `const TIMEOUT_MS = 12_000;` (12 seconds). Requirements 2.1 and 7.3 specify a **10 second** limit. This design recommends aligning the constant to `10_000` so the implemented timeout matches the specified behaviour. This is the one change to an existing hook; everything else reuses the hook unchanged. The alternative (loosening the requirement to 12s) is rejected because the requirement is explicit and the change is a one-line constant edit with no API impact.

---

## Architecture

The Reflection Corner is a composition of one page container, the existing readings/season/colour data layer, a new typed source-data module with runtime validation, a pure prompt-derivation function, and a small set of presentational components extracted from the current monolithic page.

```mermaid
graph TD
    subgraph Data Layer (reused, unchanged except TIMEOUT_MS)
        UDR[useDailyMassReadings\nJSONP → Universalis]
        ULS[useLiturgicalSeason]
        RLC[resolveLiturgicalColour]
        ADL[adelaideDate helpers]
    end

    subgraph Source Data (new, build-time typed)
        SRC[reflectionSources.ts\ntyped ReflectionSource entries]
        VAL[validateReflectionSource\nruntime guard]
        SRC --> VAL
    end

    subgraph Pure Logic (new)
        BADGE[deriveSourceBadge\nkind + region → label]
        PROMPT[deriveReflectionPrompt\nGospel ref + liturgical day]
    end

    subgraph Page (refined DailyReadingsPage)
        PAGE[DailyReadingsPage\n＂Today's Readings & Reflection＂]
        RC[ReflectionCorner section]
        RSC[ReflectionSourceCard]
        SB[SourceBadge]
        RP[ReflectionPrompt]
    end

    UDR --> PAGE
    ULS --> PAGE
    RLC --> PAGE
    ADL --> PAGE

    PAGE --> RC
    VAL --> RC
    RC --> RSC
    RSC --> SB
    BADGE --> SB
    PAGE --> RP
    PROMPT --> RP
    UDR -. Gospel ref + day .-> PROMPT
    ULS -. season .-> PROMPT

    SEO[usePageSEO + useJsonLd]
    PAGE --> SEO

    HOME[TodaysReadingsCard\nhome card] -. links via PATHS.DAILY_READINGS .-> PAGE
```

### Data flow summary

1. `DailyReadingsPage` mounts via `React.lazy` from `src/App.tsx` (route `PATHS.DAILY_READINGS = '/daily-readings'`). Route-level lazy loading is already in place and is preserved (Req 1.3).
2. `useDailyMassReadings()` loads the Universalis JSONP payload for the Adelaide calendar and exposes `{ data, status, dateKey, universalisUrl, retry }`.
3. `useLiturgicalSeason()` + `resolveLiturgicalColour(getAdelaideISODate(), season.season, overrides)` resolve the liturgical day colour exactly as today.
4. The reflection source list is read from the typed module, filtered through `validateReflectionSource`, then ordered (Australia before Global, stable within region) before render.
5. On `status === 'success'`, `deriveReflectionPrompt(gospelReference, liturgicalDay, season)` produces a parish-written prompt; otherwise an "unavailable" message is shown.

### Reuse map (Req 10.5 — no duplicate implementations)

| Concern | Existing artifact | Reused as-is? |
| --- | --- | --- |
| Readings retrieval (JSONP, timeout, retry) | `useDailyMassReadings()` (`src/hooks/useDailyMassReadings.ts`) | Reused; only `TIMEOUT_MS` changes 12_000 → 10_000 |
| Liturgical season | `useLiturgicalSeason()` (`src/hooks/useLiturgicalSeason.ts`) | Reused unchanged |
| Liturgical colour | `resolveLiturgicalColour()` (`src/lib/liturgicalColour.ts`) | Reused unchanged |
| Adelaide date | `getAdelaideISODate()`, `getAdelaideDateKey()`, `buildUniversalisUrl()` (`src/lib/adelaideDate.ts`) | Reused unchanged |
| SEO metadata | `usePageSEO()` (`src/hooks/usePageSEO.ts`) | Reused; new title/description values |
| Structured data | `useJsonLd()` (`src/hooks/useJsonLd.ts`) | Reused; updated schema fields |
| Reduced motion | `useReducedMotion()` (framer-motion) + `reveal`/`noMotion` variants | Reused unchanged |
| HTML helpers | `decodeHtmlEntities`, `sanitiseReadingHtml`, `ReadingBlock` | Reused; extracted alongside the page |
| Utility classes | `page-shell`, `page-section(-inner)`, `sanctuary-panel`, `ornamental-kicker`, `section-divider`, `prose-parish`, `pilgrimage-button(-secondary/-ghost)`, `shadow-card-hover` | Reused unchanged |

---

## File Plan

### New files

| File | Purpose |
| --- | --- |
| `src/data/reflectionSources.ts` | Typed `ReflectionSource[]` source-of-truth + the `validateReflectionSource` guard, `getValidReflectionSources()` helper, and `orderReflectionSources()` ordering helper. |
| `src/lib/reflectionPrompt.ts` | Pure `deriveReflectionPrompt(...)` plus the curated parish-written prompt templates and length constants. |
| `src/lib/sourceBadge.ts` | Pure `deriveSourceBadge(kind, region)` mapping `kind`+`region` to a badge label/variant. |
| `src/components/readings/ReflectionCorner.tsx` | Section component: validates/orders sources, renders the heading, the prompt, the card list, and the empty-state message. |
| `src/components/readings/ReflectionSourceCard.tsx` | Single source card: badge, name, description, optional excerpt (approved only), and "Read at Source" link. |
| `src/components/readings/SourceBadge.tsx` | Small presentational badge. |
| `src/components/readings/ReflectionPrompt.tsx` | Presentational prompt block + unavailable fallback. |

> `ReadingBlock`, `decodeHtmlEntities`, and `sanitiseReadingHtml` move out of the page into `src/components/readings/ReadingBlock.tsx` (or a shared `src/components/readings/readingHelpers.ts`) so the page stays maintainable. This is a mechanical extraction; behaviour is unchanged.

### Modified files

| File | Change |
| --- | --- |
| `src/pages/DailyReadingsPage.tsx` | New heading "Today's Readings & Reflection"; updated `usePageSEO`/`useJsonLd`; replace inline `REFLECTION_LINKS` + reflection markup with `<ReflectionCorner />` and `<ReflectionPrompt />`; replace `transition-all` on touched elements with explicit transition properties. |
| `src/hooks/useDailyMassReadings.ts` | `TIMEOUT_MS` 12_000 → 10_000 (align with Req 2.1 / 7.3). |
| `src/components/home/TodaysReadingsCard.tsx` | Replace `transition-all duration-500` with explicit `transition-[transform,box-shadow] duration-500` on the touched anchor elements (Req 10.4). Route link unchanged (Req 1.5). |
| `tests/daily-readings.spec.ts` | Update assertions to new heading/section copy (see Testing Strategy). |

### Data-location decision (Req 3): typed TS module vs `public/data/*.json`

**Decision: use a typed TS module — `src/data/reflectionSources.ts`.** The model needs enum-constrained fields (`kind`, `region`, `permissionStatus`) that are compile-checked, and the curated set is small, parish-authored, and reviewed before publication (Req 11.1). A TS module gives compile-time safety, IDE autocomplete, and tree-shaking with no runtime fetch.

The project convention for static content is `public/data/*.json` (per AGENTS.md), so that option was weighed. It is rejected here because JSON gives no compile-time enum guarantees and would require a runtime fetch + loading state for content that never changes between deploys. **Runtime validation is implemented regardless** (Req 3.10), so even though entries are authored in TypeScript, every entry passes through `validateReflectionSource` before render; this guards against hand-edit mistakes and keeps the door open to a future JSON/Supabase source without changing the rendering contract. If a future maintainer moves the data to JSON, the validation function is mandatory and already in place.

---

## Data Models

### `ReflectionSource` (Req 3)

```typescript
// src/data/reflectionSources.ts

export type ReflectionKind =
    | 'readings'
    | 'daily-prayer'
    | 'gospel-reflection'
    | 'email-signup';

export type ReflectionRegion = 'Australia' | 'Global';

export type PermissionStatus =
    | 'approved'
    | 'permission_required'
    | 'link_only';

export interface ReflectionSource {
    /** Display name. Required. 1–100 chars. (Req 3.1) */
    name: string;
    /** Absolute URL. Required. 1–2048 chars, well-formed absolute URL. (Req 3.2) */
    url: string;
    /** Source character. Required, enum-constrained. (Req 3.3) */
    kind: ReflectionKind;
    /** Region classification. Required, enum-constrained. (Req 3.4) */
    region: ReflectionRegion;
    /** Parish-written description. Required. 1–500 chars. (Req 3.5) */
    description: string;
    /** Copyright/reproduction state. Required, enum-constrained. (Req 3.6) */
    permissionStatus: PermissionStatus;
    /** Reproduced reflection text. Optional. 1–2000 chars when present. (Req 3.7) */
    excerpt?: string;
}
```

#### Field validation rules (Req 3.1–3.7)

| Field | Type | Rule |
| --- | --- | --- |
| `name` | string | required, length 1–100 |
| `url` | string | required, length 1–2048, parses as absolute `http(s)` URL |
| `kind` | enum | required, ∈ {`readings`, `daily-prayer`, `gospel-reflection`, `email-signup`} |
| `region` | enum | required, ∈ {`Australia`, `Global`} |
| `description` | string | required, length 1–500 |
| `permissionStatus` | enum | required, ∈ {`approved`, `permission_required`, `link_only`} |
| `excerpt` | string? | optional; if present, length 1–2000 |

#### Runtime validation (Req 3.10)

```typescript
export interface ReflectionValidationError {
    /** Index of the offending entry in the source array. */
    index: number;
    /** The field that failed (e.g. 'url', 'kind', 'name'). */
    field: keyof ReflectionSource | '(root)';
    /** Human-readable reason for logging. */
    reason: string;
}

export interface ReflectionSourcesResult {
    valid: ReflectionSource[];
    errors: ReflectionValidationError[];
}

/**
 * Validate a single candidate entry. Returns the offending field on first
 * failure, or null when the entry is valid.
 * Pure, dependency-free — uses the global URL constructor for URL checks.
 */
export function validateReflectionSource(
    candidate: unknown,
): { field: keyof ReflectionSource | '(root)'; reason: string } | null;

/**
 * Validate the curated list. Excludes invalid entries, records a validation
 * error identifying the offending field for each, and retains valid ones.
 * (Req 3.10)
 */
export function getValidReflectionSources(
    sources?: unknown[],
): ReflectionSourcesResult;
```

**Validation behaviour (Req 3.10):**
- Invalid entry → excluded from `valid`, a `ReflectionValidationError` recorded in `errors` naming the first offending `field`, remaining valid entries retained.
- Recorded errors are surfaced to developers via `console.warn` in `getValidReflectionSources` (dev-time signal); they are never rendered to parishioners.
- URL well-formedness uses `new URL(value)` inside a `try/catch` and additionally requires an `http:`/`https:` protocol so a non-absolute or non-web URL is treated as malformed.

#### Ordering (Req 4.8, 5.2)

```typescript
/**
 * Stable order: all Region 'Australia' before any Region 'Global',
 * preserving the authored order within each region.
 */
export function orderReflectionSources(
    sources: ReflectionSource[],
): ReflectionSource[];
```

Implementation note: use a **stable** partition (filter Australia, then filter Global, then concat) rather than `Array.prototype.sort`, because `sort` stability is guaranteed by modern engines but partition makes the intent explicit and the within-region authored order is preserved by construction.

---

## Components and Interfaces

### Initial curated source set (Req 4)

Authored in `reflectionSources.ts` in this order (Australia first, then Global). At first release every entry is `link_only` and carries **no** `excerpt`, per Req 4.3 / Req 11.3.

| # | name | kind | region | permissionStatus | excerpt |
| --- | --- | --- | --- | --- | --- |
| 1 | Universalis — Australia – Adelaide | `readings` | Australia | `link_only` | none |
| 2 | Pray.com.au Daily Prayer | `daily-prayer` | Australia | `link_only` (Req 4.3) | none |
| 3 | Canberra & Goulburn Living Word | `email-signup` | Australia | `link_only` | none |
| 4 | Bathurst Connect@home | `email-signup` | Australia | `link_only` | none |
| 5 | Sacred Space (Irish Jesuits) | `gospel-reflection` | Global | `link_only` | none |
| 6 | The Word Among Us *(optional 2nd global backup)* | `gospel-reflection` | Global | `link_only` | none |

This satisfies Req 4.1, 4.2, 4.4, 4.5 (the four required Australian sources), and Req 4.6 (one or two Global backups). All Australia entries precede all Global entries (Req 4.8). Descriptions are parish-written and reviewer-approved, free of promotional calls to action and placeholder text (Req 11.1).

> Permission note: because all entries are `link_only`, none render an excerpt at first release (Req 11.3). When permission for a source is later documented, a maintainer edits that entry's `permissionStatus` to `approved` and adds an `excerpt`; the excerpt then renders on the next render with no code change (Req 11.5 / 3.5 of the JSON-vs-TS discussion — note a TS-module edit is a content edit, not a logic change).

### Source badge derivation (Req 4.7, 5.3)

A single badge is derived for each source from `kind` + `region`. Region `Global` always produces a badge that marks the source as global (Req 4.7).

```typescript
// src/lib/sourceBadge.ts

export interface SourceBadgeInfo {
    /** Visible label text. */
    label: string;
    /** Token variant for styling (parish-* class selection only). */
    variant: 'australia' | 'global';
}

export function deriveSourceBadge(
    kind: ReflectionKind,
    region: ReflectionRegion,
): SourceBadgeInfo;
```

**Mapping:**

| region | kind | label | variant |
| --- | --- | --- | --- |
| `Global` | *(any)* | `Global` | `global` |
| `Australia` | `readings` | `Australian readings` | `australia` |
| `Australia` | `daily-prayer` | `Australian Jesuit` | `australia` |
| `Australia` | `gospel-reflection` | `Diocesan` | `australia` |
| `Australia` | `email-signup` | `Email reflection` | `australia` |

Rules:
- Region `Global` takes precedence over `kind` so every global source is unmistakably labelled global (Req 4.7).
- `deriveSourceBadge` is a pure total function — every `(kind, region)` pair yields exactly one badge, satisfying "exactly one Source_Badge for each displayed source" (Req 5.3).
- The `variant` only selects between `parish-*` token combinations (e.g. accent vs muted surface); it never introduces hardcoded colours (Req 9.1, 9.2).

> The "Australian Jesuit" label is mapped to `daily-prayer` because Pray.com.au is the Australian Jesuit daily-prayer source; "Diocesan" maps to `gospel-reflection` for diocesan Living-Word style sources. Labels are reviewer-approved copy (Req 11.1) and can be refined during implementation without changing the function's shape.

### Permission-gated rendering (Req 3.8, 3.9, 3.11, 5.4, 5.5, 5.6, 5.8, 11.2, 11.4)

`ReflectionSourceCard` decides what to render with a single derived predicate:

```typescript
const showsExcerpt =
    source.permissionStatus === 'approved' &&
    typeof source.excerpt === 'string' &&
    source.excerpt.trim().length > 0;
```

Decision table:

| Condition | Rendered |
| --- | --- |
| `permissionStatus === 'approved'` AND non-empty `excerpt` | Badge + name + excerpt (Req 3.9, 5.4) |
| `permissionStatus === 'approved'` AND empty/missing `excerpt` | Badge + name + description, no excerpt (Req 3.11) |
| `permissionStatus !== 'approved'` (any non-approved) | Badge + name + description, **never** excerpt (Req 3.8, 11.2, 11.4) |
| not showing excerpt AND `url` present | description + "Read at Source" link → `target="_blank" rel="noopener noreferrer"` (Req 5.5, 5.6) |
| not showing excerpt AND no `url` | description only, no link (Req 5.8) |

Because `showsExcerpt` requires `approved`, a non-approved source can never leak excerpt text even if an `excerpt` value is present in data (Req 11.2, 11.4). At first release all sources are `link_only`, so every card is a link-only card (Req 11.3).

### Reflection prompt generation (Req 6)

```typescript
// src/lib/reflectionPrompt.ts

export const REFLECTION_PROMPT_MIN = 20;   // Req 6.5
export const REFLECTION_PROMPT_MAX = 500;  // Req 6.5

export interface ReflectionPromptInput {
    /** From data.Mass_G.source (decoded, HTML stripped). May be empty. */
    gospelReference: string;
    /** From data.day (HTML stripped) — the named liturgical day. */
    liturgicalDay: string;
    /** Season key from useLiturgicalSeason (e.g. 'lent'). */
    season: LiturgicalSeason;
}

/**
 * Pure function. Returns a parish-written prompt (20–500 chars) derived ONLY
 * from the Gospel reference and liturgical day/season, or null when a prompt
 * cannot be derived (Req 6.2, 6.3, 6.6).
 */
export function deriveReflectionPrompt(
    input: ReflectionPromptInput,
): string | null;
```

**Approach — deterministic selection from parish-written templates:**

- A small set of **parish-authored, reviewer-approved** prompt templates is keyed by `season` (advent, christmas, ordinary, lent, easter), with a neutral default set. Each template is written so that, once the Gospel reference is interpolated, the result lands within 20–500 chars.
- Selection is **deterministic** (no randomness): an index is computed from a stable hash of `gospelReference + liturgicalDay` modulo the number of templates for the resolved season. The same day always yields the same prompt (idempotent, testable).
- The Gospel **reference** (citation only, e.g. "Luke 4:1-13") and the liturgical day/season are the only inputs. The function **never** reads `Mass_G.text` or any third-party reflection text (Req 6.2, 6.3).
- After interpolation the function clamps/validates length: if the produced string is `< 20` or `> 500` chars, or if `gospelReference` is empty/whitespace (no citation to anchor the prompt), it returns `null` (Req 6.5, 6.6).

**Rendering (`ReflectionPrompt.tsx`):**
- `status === 'success'` AND `deriveReflectionPrompt(...) !== null` → render exactly one prompt for the day (Req 6.1).
- `status === 'success'` AND result is `null` → render the unavailable message (Req 6.6).
- `status !== 'success'` → render the unavailable message and no prompt (Req 6.4).

> Example template (ordinary time): `"In today's Gospel ({{gospelReference}}), where is Christ inviting you to follow more closely? Carry one line with you into prayer today."` — `{{gospelReference}}` is replaced with the decoded citation.

### Page composition (`DailyReadingsPage.tsx`)

The page keeps its current hero → liturgical-day panel → readings → source/copyright → no-JS fallback structure, with these changes:

1. **Heading (Req 1.2):** the single `<h1>` becomes `Today's Readings & Reflection` (contains both "Readings" and "Reflection"). Hero copy updated to reference both Scripture and reflection.
2. **SEO (Req 1.4):**
   ```typescript
   usePageSEO({
       title: "Today's Readings & Reflection",
       description:
           'Daily Mass readings for the Australia – Adelaide liturgical calendar, ' +
           'with a parish reflection prompt and trusted Catholic reflection sources.',
       path: '/daily-readings',
   });
   ```
   Both title and description contain a Scripture-reading term ("Readings"/"Mass readings") and a reflection term ("Reflection").
3. **JSON-LD (`useJsonLd`):** update `name`/`description` to match the new positioning; keep `@type: 'WebPage'`, `url`, and `isPartOf`.
4. **Reflection section:** the inline `REFLECTION_LINKS` array and its markup are removed and replaced with `<ReflectionPrompt ... />` followed by `<ReflectionCorner ... />`, positioned directly below the readings section (Req 5.1).
5. **Route + lazy loading:** unchanged — `React.lazy` registration in `App.tsx` and `PATHS.DAILY_READINGS` stay (Req 1.1, 1.3). Home card link unchanged (Req 1.5).

### Component interfaces (new presentational components)

```typescript
// ReflectionCorner.tsx
interface ReflectionCornerProps {
    motionProps: typeof reveal | typeof noMotion;
    prefersReduced: boolean;
}
// Internally: getValidReflectionSources() → orderReflectionSources()
//   - empty list → render "no daily reflection is currently available", no badges/cards (Req 5.7)
//   - otherwise → map to <ReflectionSourceCard />

// ReflectionSourceCard.tsx
interface ReflectionSourceCardProps {
    source: ReflectionSource;
    motionProps: typeof reveal | typeof noMotion;
}

// SourceBadge.tsx
interface SourceBadgeProps {
    kind: ReflectionKind;
    region: ReflectionRegion;
}

// ReflectionPrompt.tsx
interface ReflectionPromptProps {
    status: ReadingsStatus;
    gospelReference: string | null;
    liturgicalDay: string | null;
    season: LiturgicalSeason;
    motionProps: typeof reveal | typeof noMotion;
}
```

---

## Loading, Error, Timeout, and Fallback States (Req 7, Req 2.9, Req 2.10)

These map directly to the existing `ReadingsStatus` union: `'idle' | 'loading' | 'success' | 'error' | 'timeout'`.

| Status / condition | Rendered behaviour | Requirement |
| --- | --- | --- |
| `loading` (and `idle`) | Textual loading indicator: "Loading today's readings…" | 7.1 |
| `error` | Textual error: "Unable to load today's readings" + retry control + Universalis link | 7.2, 7.4, 7.6 |
| `timeout` | Textual timeout: "The readings took too long to load" + retry + Universalis link | 7.3, 7.4, 7.6 |
| retry control activated | Calls `retry()` → hook re-initiates load → status returns to `loading` | 7.5 |
| no response within 10s | `status === 'timeout'` → unavailable message, **no** reading section rendered | 2.9 |
| `success` with R1 + Ps + G present | Render First Reading, Psalm, Gospel (+ R2/GA when present) | 2.5, 2.6 |
| `success` but missing R1, Ps, or G | **Incomplete** message; do **not** present the partial set as complete | 2.10 |
| JavaScript disabled | `<noscript>` block with link to Universalis Adelaide Mass page | 7.7 |
| any failure | Universalis attribution + copyright still rendered where available | 2.8 |

**Incomplete-data handling (Req 2.10) — new logic.** Today the page renders readings whenever `status === 'success' && data`. The refinement adds a completeness guard:

```typescript
function readingsAreComplete(data: UniversalisData | null): boolean {
    return Boolean(
        data &&
        data.Mass_R1?.text?.trim() &&
        data.Mass_Ps?.text?.trim() &&
        data.Mass_G?.text?.trim(),
    );
}
```

- `status === 'success'` AND `readingsAreComplete(data)` → render readings (and the prompt).
- `status === 'success'` AND NOT `readingsAreComplete(data)` → render an "incomplete" message; do not render reading blocks; do not render the prompt as if readings succeeded.

The 10-second behaviour for Req 2.1 / 7.3 depends on `TIMEOUT_MS = 10_000` (see the discrepancy note in Overview).

---

## Error Handling

This section also covers the validation strategy, since validation failures are handled as recoverable errors (exclude-and-continue) rather than fatal ones.

| Failure mode | Detection | Handling |
| --- | --- | --- |
| Universalis no response / network error | `status === 'error' \| 'timeout'` from hook | Error/timeout panel with retry + Universalis link (Req 7.2–7.6) |
| Parseable but incomplete payload | `readingsAreComplete(data) === false` | Incomplete message, no partial render (Req 2.10) |
| Invalid source entry (bad enum, over-length, malformed URL, missing required field) | `validateReflectionSource` | Exclude entry, record error naming the field, retain valid entries (Req 3.10) |
| All sources invalid / empty list | `getValidReflectionSources().valid.length === 0` | "No daily reflection is currently available" message, no badges/cards (Req 5.7) |
| Prompt not derivable (empty Gospel ref, length out of bounds) | `deriveReflectionPrompt(...) === null` | Reflection-unavailable message (Req 6.6) |
| Reading HTML injection | `sanitiseReadingHtml` (reused) | Strips `<script>`, inline handlers, embeds before `dangerouslySetInnerHTML` |

Validation errors are developer-facing only (`console.warn`), never surfaced to parishioners. Excerpt and description text authored by the parish is plain text and is not passed through `dangerouslySetInnerHTML`; only the Universalis readings HTML continues to use the existing sanitiser.

---

## Accessibility (Req 8)

| Concern | Approach | Req |
| --- | --- | --- |
| Visible, self-describing link labels | Each source card's link text is the source name + "Read at Source"; no "click here" | 8.1 |
| Focus indicator ≥ 3:1 | Rely on the global `*:focus-visible { outline: 3px solid hsl(var(--color-parish-brass)); outline-offset: 2px }` already in `src/index.css`; do not remove outlines on new controls | 8.2 |
| Decorative icons hidden | All Lucide icons used as decoration get `aria-hidden="true"` (matches existing usage) | 8.3 |
| Icon-only controls labelled | Any icon-only control gets `aria-label`; the first-release design uses text+icon controls, so this mainly applies to the existing retry/external-link affordances | 8.4 |
| Long descriptions don't overflow | Card description containers use `break-words` and `min-w-0` (cards use `flex flex-col` with `min-w-0`) so text wraps at ≥320px | 8.5 |
| Semantic elements | Navigation targets are `<a>` (react-router `<Link>` for internal, plain `<a>` for external); action triggers (retry) are `<button>` | 8.6 |
| Reduced motion | `useReducedMotion()` selects `noMotion` variants; staggered card entrance is suppressed when reduced motion is on | 8.7 |
| Keyboard activation | Native `<a>`/`<button>` give Enter/Space activation for free; no custom key handlers needed | 8.8 |
| Tab order = reading order | DOM order matches visual order (prompt → source cards in display order); no `tabindex > 0` | 8.9 |

---

## Theming and Responsive Layout (Req 9)

| Concern | Approach | Req |
| --- | --- | --- |
| `parish-*` tokens only | All new UI uses `text-parish-fg`, `text-parish-muted`, `text-parish-accent`, `bg-parish-surface`, `border-parish-border`, `parish-inverse`, etc. | 9.1 |
| No hardcoded colours | No hex/rgb literals in new UI. Documented exceptions only: the existing liturgical-colour gradient/dot uses `colourInfo.cssColor` (data-driven liturgical vestment colour, not a brand colour) — this is pre-existing and out of scope for new badges/cards, which use tokens exclusively | 9.2 |
| Dark mode | Tokens resolve via `data-theme="dark"` CSS variables in `src/index.css`; no light-only literals in new components | 9.3 |
| Single column ≤640px | Card grid is `grid gap-5 sm:grid-cols-2` → single column below the `sm` (640px) breakpoint; `min-w-0`/`break-words` prevent horizontal scroll | 9.4 |
| Theme switch < 1s | Colours come from CSS variables that flip with `data-theme`; no reload, no JS recompute needed | 9.5 |
| Body text ≥ 4.5:1 | Body copy uses `text-parish-fg`/`text-parish-muted` token pairs already tuned for ≥4.5:1 in both themes | 9.6 |

### `transition-all` removal (Req 10.4) — required fix

The current code uses the forbidden `transition-all` shorthand in two touched places. Both must use explicit transition properties:

- `DailyReadingsPage.tsx` reflection link cards:
  `... transition-all duration-500 hover:-translate-y-0.5 ...`
  → `... transition-[transform,box-shadow,border-color] duration-500 hover:-translate-y-0.5 ...`
- `TodaysReadingsCard.tsx` anchors (3 occurrences):
  `... transition-all duration-500 hover:-translate-y-0.5 ...`
  → `... transition-[transform,box-shadow] duration-500 ...` (drop the unused `border-color` where the element has no border-colour hover).

Each animated property is named explicitly; `transition-all` does not appear in any new or modified UI. (The `.pilgrimage-button*` classes in `index.css` use `transition: all` in CSS, but those are pre-existing shared utilities, not new/modified UI added by this feature, so they are out of scope. If a maintainer chooses to harden them, that is a separate change.)

### Optional copy/share control (Req 10.3) — out of scope for first release

No copy/share control is required by the current plan, so none is added. If one is later added (e.g. "copy today's prompt"), Req 10.3 requires a **local** clipboard hook (`src/hooks/useClipboard.ts` using the native `navigator.clipboard` API) and forbids adding any new dependency (and specifically forbids `react-use`, Req 10.2). This is documented here so a future addition stays compliant; it is not implemented now.

---

## Correctness Properties

These are universally-quantified invariants the implementation must uphold. Each is checkable by unit/component tests (see Testing Strategy).

### Property 1: Excerpt safety
For every `ReflectionSource s` rendered, an excerpt is shown **iff** `s.permissionStatus === 'approved'` AND `s.excerpt` is a non-empty (trimmed) string. No non-approved source ever renders excerpt text.

**Validates: Requirements 3.8, 3.9, 3.11, 11.2, 11.4**

### Property 2: Validation total and lossless for valid entries
For every input list `L`, `getValidReflectionSources(L).valid` contains exactly the entries of `L` that pass `validateReflectionSource`, in original order, and `errors` contains exactly one entry (naming a real offending field) for each excluded entry. valid ∪ excluded partitions `L`.

**Validates: Requirements 3.10**

### Property 3: Region ordering
For every validated list, in the rendered output every `region === 'Australia'` source precedes every `region === 'Global'` source, and the authored order is preserved among sources sharing a region.

**Validates: Requirements 4.8, 5.2**

### Property 4: Exactly one badge per source
`deriveSourceBadge` is total — for every `(kind, region)` it returns exactly one `SourceBadgeInfo`, and `region === 'Global'` always yields `variant === 'global'`. Each rendered card shows exactly one badge.

**Validates: Requirements 4.7, 5.3**

### Property 5: Prompt provenance and length bounds
`deriveReflectionPrompt` reads only `gospelReference`, `liturgicalDay`, and `season` (its input type cannot reference `Mass_G.text`). When it returns a string, `20 ≤ length ≤ 500`; otherwise it returns `null`. Same input → same output (deterministic).

**Validates: Requirements 6.2, 6.3, 6.5, 6.6**

### Property 6: Readings completeness
Reading blocks and the prompt render **only** when `status === 'success'` AND `readingsAreComplete(data)`; a partial payload never renders as complete.

**Validates: Requirements 2.5, 2.10**

### Property 7: Link safety
Every external "Read at Source" link renders with `target="_blank"` and `rel="noopener noreferrer"`.

**Validates: Requirements 5.6**

### Property 8: No `transition-all`
No new or modified UI element uses the `transition-all` shorthand; every transition names its animated properties explicitly.

**Validates: Requirements 10.4**

---

## Testing Strategy

### Unit tests (Vitest + Testing Library, jsdom)

| Target | Cases |
| --- | --- |
| `validateReflectionSource` | valid entry → `null`; missing each required field → error names that field; out-of-set enum (`kind`/`region`/`permissionStatus`) → error; over-length `name`/`description`/`url`/`excerpt` → error; malformed/relative URL → error on `url`; valid optional `excerpt` omitted → `null` |
| `getValidReflectionSources` | mixed valid/invalid list → invalid excluded, valid retained, one error per invalid entry naming the offending field (Req 3.10) |
| `orderReflectionSources` | all Australia precede all Global; within-region authored order preserved (Req 4.8, 5.2); empty list → empty |
| `deriveSourceBadge` | every `(kind, region)` pair returns exactly one badge; any Global → `Global` label/variant (Req 4.7, 5.3); Australia kinds map to documented labels |
| `deriveReflectionPrompt` | success path returns 20–500 char string (Req 6.5); deterministic for same input; empty `gospelReference` → `null` (Req 6.6); never references `Mass_G.text` (input shape excludes it, Req 6.2/6.3); length-bound clamp returns `null` when out of range |
| Permission gating (component test of `ReflectionSourceCard`) | `approved` + excerpt → excerpt rendered; `approved` + empty excerpt → no excerpt (Req 3.11); non-approved + excerpt present → excerpt NOT rendered (Req 3.8, 11.2, 11.4); no url → no "Read at Source" link (Req 5.8); url present → link with `rel="noopener noreferrer"` `target="_blank"` (Req 5.6) |
| `ReflectionCorner` empty state | no valid sources → "no daily reflection currently available", no badges/cards (Req 5.7) |
| `readingsAreComplete` | full payload → true; missing R1/Ps/G → false (Req 2.10) |

### End-to-end (Playwright) — `tests/daily-readings.spec.ts` MUST be updated

The existing E2E test asserts copy that this feature changes. The following assertions **will break and must be updated**:

- `await expect(page.locator('h1')).toContainText(/Today.s Readings/);`
  → update to match the new heading, e.g. `/Today.s Readings & Reflection/` (the heading now contains both "Readings" and "Reflection", Req 1.2).
- `await expect(page.getByText('Reflection Links')).toBeVisible();`
  → the "Reflection Links" heading is replaced by the Reflection Corner section copy; update to the new section heading.
- `await expect(page.getByText('Pray.com.au')).toBeVisible();` and `await expect(page.getByText('Sacred Space')).toBeVisible();`
  → these sources remain in the curated set (names may be presented as full source names like "Pray.com.au Daily Prayer" / "Sacred Space"); update the matchers to the new card names.

Assertions that remain valid: the `/daily-readings` route loads, Universalis source attribution + the `Universalis` link, the Adelaide calendar reference, and the "Open on Universalis" fallback link.

New E2E coverage to add: the page shows exactly one `<h1>` containing both "Readings" and "Reflection"; each visible source card shows exactly one badge; Australian sources appear before Global ones in DOM order.

> **Pre-existing, unrelated:** `tests/home.spec.ts` is known to fail out of the box (hero copy mismatch documented in AGENTS.md). That failure is unrelated to this feature and is not introduced or fixed here.

### Verification commands

Run `npm run lint`, `npx tsc -b`, `npm test`, and `npm run test:e2e` (note the known unrelated `home.spec.ts` failure) before considering the work complete; `npm run verify:release` runs the full gate.

---

## Dependencies

No new runtime dependencies (Req 10.1, 10.2). Everything uses what is already present:

- **React 18**, **react-router-dom** (`Link`, lazy routing)
- **framer-motion** (`motion`, `useReducedMotion`, existing `reveal`/`noMotion` variants)
- **lucide-react** (decorative icons, `aria-hidden`)
- **Tailwind CSS** with `parish-*` tokens and `data-theme` dark mode
- Existing hooks/utils: `useDailyMassReadings`, `useLiturgicalSeason`, `resolveLiturgicalColour`, `adelaideDate` helpers, `usePageSEO`, `useJsonLd`
- Test tooling already configured: **Vitest** + Testing Library (jsdom), **Playwright** (Chromium)

---

## Requirements Traceability

| Requirement | Design element |
| --- | --- |
| 1.1 Canonical `/daily-readings`, no redirect | Route unchanged in `App.tsx`; `PATHS.DAILY_READINGS` reused |
| 1.2 One heading with "Readings" + "Reflection" | `<h1>Today's Readings & Reflection` |
| 1.3 Route-level lazy loading | `React.lazy` registration preserved |
| 1.4 SEO title + description (Scripture + reflection terms) | Updated `usePageSEO({ title, description })` |
| 1.5 Home card navigates to `/daily-readings` | `TodaysReadingsCard` link via `PATHS.DAILY_READINGS` (unchanged) |
| 2.1 ≤10s retrieval | `useDailyMassReadings`; `TIMEOUT_MS` → 10_000 |
| 2.2–2.4 Adelaide calendar, Adelaide TZ, no scraping | `buildUniversalisUrl` (JSONP) + `getAdelaideDateKey` reused |
| 2.5–2.6 Display R1/Ps/G (+R2/GA) | `ReadingBlock` rendering + completeness guard |
| 2.7 Liturgical day + colour | `useLiturgicalSeason` + `resolveLiturgicalColour` panel (reused) |
| 2.8 Attribution + copyright | Source/copyright section retained |
| 2.9 No response → unavailable, no readings | `timeout`/`error` states gate readings |
| 2.10 Incomplete → incomplete message | `readingsAreComplete()` guard |
| 3.1–3.7 Typed model + field rules | `ReflectionSource` interface + validation table |
| 3.8 Non-approved → no excerpt | `showsExcerpt` predicate |
| 3.9 Approved + excerpt → render excerpt | `showsExcerpt` predicate |
| 3.10 Invalid excluded, error recorded, valid retained | `validateReflectionSource` + `getValidReflectionSources` |
| 3.11 Approved + empty excerpt → render w/o excerpt | `showsExcerpt` predicate |
| 4.1–4.6 Curated set incl. required AU sources + 1–2 Global | Initial curated source set table |
| 4.3 Pray.com.au `link_only` | Source set table |
| 4.7 Global badge | `deriveSourceBadge` (Global precedence) |
| 4.8 Australia before Global | `orderReflectionSources` |
| 5.1 Reflection section below readings | Page composition order |
| 5.2 Region order + stable within region | `orderReflectionSources` (stable partition) |
| 5.3 Exactly one badge per card | `deriveSourceBadge` total function + `SourceBadge` |
| 5.4 Approved + excerpt rendered in card | `ReflectionSourceCard` |
| 5.5 No excerpt + url → description + Read at Source | Card decision table |
| 5.6 Read at Source → new context, `noopener noreferrer` | Card link attributes |
| 5.7 No source → message, no badges/cards | `ReflectionCorner` empty state |
| 5.8 No excerpt + no url → description only | Card decision table |
| 6.1 One prompt on success | `ReflectionPrompt` |
| 6.2–6.3 Derived only from Gospel ref + day, not third-party text | `deriveReflectionPrompt` input shape |
| 6.4 Not loaded → no prompt + unavailable message | `ReflectionPrompt` status gate |
| 6.5 20–500 chars | `REFLECTION_PROMPT_MIN/MAX` + clamp |
| 6.6 Underivable → unavailable message | `deriveReflectionPrompt` returns `null` |
| 7.1–7.7 Loading/error/timeout/retry/Universalis/no-JS | States table + `<noscript>` |
| 8.1–8.9 Accessibility | Accessibility table |
| 9.1–9.6 Theming + responsive | Theming table |
| 10.1–10.2 No new UI framework / no `react-use` | Dependencies section |
| 10.3 Local clipboard hook if copy/share added | Out-of-scope note (compliant pattern documented) |
| 10.4 No `transition-all` | Explicit `transition-[...]` fix in page + home card |
| 10.5 Reuse existing hooks/utils | Reuse map |
| 11.1 Reviewer-approved, non-promotional copy | Source descriptions authored + reviewed |
| 11.2 Excerpt only when approved | `showsExcerpt` predicate |
| 11.3 All non-approved → link-only cards | First-release set all `link_only` |
| 11.4 Mixed approval → non-approved stays link-only | Per-source `showsExcerpt` |
| 11.5 Approved excerpt shows on next render, no redeploy logic change | Data-driven rendering (edit data → renders) |
