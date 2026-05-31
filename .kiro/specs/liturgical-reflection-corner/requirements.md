# Requirements Document

## Introduction

The Liturgical Reflection Corner refines the existing Daily Readings feature (`DailyReadingsPage.tsx`, route `/daily-readings`) rather than replacing it. The existing page already loads Australia – Adelaide Mass readings from Universalis via JSONP, displays the liturgical day and colour, links from a home card, and shows source attribution.

This feature reframes that page as a clearer "Today's Readings & Reflection" experience for a parish audience. It keeps the same route and the same Universalis readings source, but replaces the current generic reflection-links list with a typed, permission-aware source model. The model curates Australian Catholic reflection sources first, records each source's copyright permission status, and renders reproduced excerpts only where written permission has been documented in the source data. Where permission is absent, the page shows concise parish-written context and a clear link to read the reflection at its original source.

The feature also adds a short, parish-written reflection prompt for the day, derived only from the loaded Gospel reference and liturgical day — never from third-party reflection text. No written permission for third-party excerpts exists at the time of the first release, so the first release ships the excerpt-capable structure with link-only source cards; approved excerpts can be added later by updating source data once permission is documented.

This is a frontend-only refinement. It introduces no new UI framework and no new runtime dependency, and continues to use the project's existing React 18 + Vite + Tailwind + Framer Motion patterns, `parish-*` theme tokens, and `data-theme` dark mode.

## Glossary

- **Reflection_Corner**: The reframed `/daily-readings` page that presents the daily Mass readings together with a curated set of permission-aware reflection sources and a parish-written prompt.
- **Readings_Loader**: The existing readings retrieval mechanism (`useDailyMassReadings` hook) that loads Universalis Mass readings via JSONP for the Australia – Adelaide calendar.
- **Reflection_Source**: A single curated reflection or readings resource described by the typed source model (see Requirement 3).
- **Source_Model**: The TypeScript type describing the fields of a Reflection_Source.
- **Permission_Status**: A field on a Reflection_Source recording its copyright/reproduction permission state. One of: `approved`, `permission_required`, `link_only`.
- **Excerpt**: A short block of reproduced reflection text supplied within a Reflection_Source, displayed only when its Permission_Status is `approved`.
- **Source_Badge**: A short visible label on a Reflection_Source card indicating its character (for example "Australian Jesuit", "Diocesan", "Email reflection").
- **Reflection_Prompt**: A short parish-written prompt for the day, derived only from the loaded Gospel reference and the liturgical day.
- **Liturgical_Day**: The named liturgical day and season for the current Adelaide calendar date, as loaded with the readings.
- **Gospel_Reference**: The Gospel citation (book, chapter, verses) loaded with the readings.
- **Region**: A classification of a Reflection_Source as `Australia` or `Global`.
- **Kind**: A classification of a Reflection_Source as `readings`, `daily-prayer`, `gospel-reflection`, or `email-signup`.
- **Adelaide_Calendar**: The Australia – Adelaide liturgical calendar used to resolve the current liturgical day and readings.

## Requirements

### Requirement 1: Page Copy and Positioning

**User Story:** As a parishioner, I want the page to be clearly presented as today's readings and a reflection space, so that I understand it offers both Scripture and guided reflection without the route or my bookmarks changing.

#### Acceptance Criteria

1. THE Reflection_Corner SHALL be served at the route `/daily-readings` as the canonical path, with no redirect or rewrite to an alternate route, so existing bookmarks to `/daily-readings` continue to resolve to the Reflection_Corner.
2. WHEN the Reflection_Corner renders, THE Reflection_Corner SHALL display exactly one primary (top-level) page heading whose visible text contains both the word "Readings" and the word "Reflection".
3. WHEN the route `/daily-readings` is navigated to, THE Reflection_Corner SHALL load the page component via route-level lazy loading, such that the component is not loaded before that navigation.
4. WHEN the Reflection_Corner loads, THE Reflection_Corner SHALL set the page metadata title and the page metadata description so that each contains at least one term referring to Scripture readings and at least one term referring to reflection.
5. WHERE a home page card links to the readings page, WHEN the card is activated, THE home page card SHALL navigate to the route `/daily-readings`.

### Requirement 2: Readings Source

**User Story:** As a parish web maintainer, I want the daily readings to keep coming from Universalis through its supported approach, so that we display accurate readings without scraping or violating Universalis terms.

#### Acceptance Criteria

1. THE Readings_Loader SHALL retrieve the daily Mass readings from Universalis using its JSONP / webmaster-supported approach within 10 seconds of retrieval beginning.
2. THE Readings_Loader SHALL request readings for the Adelaide_Calendar.
3. THE Readings_Loader SHALL resolve the requested calendar date in the Australia/Adelaide timezone.
4. THE Reflection_Corner SHALL NOT obtain readings by scraping Universalis web pages.
5. WHEN the Readings_Loader receives a parseable Universalis response containing the First Reading, the Responsorial Psalm, and the Gospel within the timeout, THE Reflection_Corner SHALL display the First Reading, the Responsorial Psalm, and the Gospel.
6. WHERE the loaded readings include a Second Reading or a Gospel Acclamation, THE Reflection_Corner SHALL display that section.
7. WHEN the Readings_Loader receives a parseable Universalis response within the timeout, THE Reflection_Corner SHALL display the Liturgical_Day and the liturgical colour for the current Adelaide_Calendar date.
8. THE Reflection_Corner SHALL display Universalis source attribution and the Universalis copyright notice supplied with the readings.
9. IF the Readings_Loader receives no response within the timeout, THEN THE Reflection_Corner SHALL display a message indicating that the readings are unavailable AND SHALL NOT display any reading section.
10. IF the Readings_Loader receives a parseable response that does not contain the First Reading, the Responsorial Psalm, and the Gospel, THEN THE Reflection_Corner SHALL display a message indicating that the readings are incomplete AND SHALL NOT present the partial set as complete.

### Requirement 3: Typed Reflection Source Model

**User Story:** As a parish web maintainer, I want each reflection source described by a structured, typed model that records permission status, so that the page can curate sources consistently and only reproduce text we are permitted to reproduce.

#### Acceptance Criteria

1. THE Source_Model SHALL define a required `name` field of type string containing between 1 and 100 characters.
2. THE Source_Model SHALL define a required `url` field of type string containing between 1 and 2048 characters that is a well-formed absolute URL.
3. THE Source_Model SHALL define a required `kind` field constrained to exactly one of: `readings`, `daily-prayer`, `gospel-reflection`, `email-signup`.
4. THE Source_Model SHALL define a required `region` field constrained to exactly one of: `Australia`, `Global`.
5. THE Source_Model SHALL define a required `description` field of type string containing between 1 and 500 characters.
6. THE Source_Model SHALL define a required `permissionStatus` field constrained to exactly one of: `approved`, `permission_required`, `link_only`.
7. THE Source_Model SHALL define an optional `excerpt` field of type string containing between 1 and 2000 characters when present.
8. IF a Reflection_Source has a Permission_Status other than `approved`, THEN THE Reflection_Corner SHALL NOT render that source's Excerpt.
9. WHEN the Reflection_Corner renders a Reflection_Source whose Permission_Status is `approved` and that supplies a non-empty Excerpt, THE Reflection_Corner SHALL render that Excerpt.
10. IF a Reflection_Source fails Source_Model validation due to a missing required field, an out-of-set enum value, an over-length string, or a malformed URL, THEN THE Reflection_Corner SHALL exclude that Reflection_Source, record a validation error identifying the offending field, and retain the remaining valid Reflection_Sources.
11. WHEN the Reflection_Corner renders a Reflection_Source whose Permission_Status is `approved` but that supplies no Excerpt or an empty Excerpt, THE Reflection_Corner SHALL render the source without an Excerpt.

### Requirement 4: Initial Curated Source Set

**User Story:** As a parishioner, I want the reflection sources to lead with Australian Catholic resources, so that the guidance reflects our local Church before pointing to global options.

#### Acceptance Criteria

1. THE Reflection_Corner SHALL include Universalis Australia – Adelaide as a Reflection_Source with Kind `readings` and Region `Australia`.
2. THE Reflection_Corner SHALL include Pray.com.au Daily Prayer as a Reflection_Source with Kind `daily-prayer` and Region `Australia`.
3. WHILE written permission for the Pray.com.au Daily Prayer Reflection_Source is not documented in the source data, THE Reflection_Corner SHALL set its Permission_Status to `link_only`.
4. THE Reflection_Corner SHALL include Canberra & Goulburn Living Word as a Reflection_Source with Kind `email-signup` and Region `Australia`.
5. THE Reflection_Corner SHALL include Bathurst Connect@home as a Reflection_Source with Kind `email-signup` and Region `Australia`.
6. THE Reflection_Corner SHALL include at least one and at most two global backup Reflection_Sources with Region `Global`.
7. WHEN the Reflection_Corner displays a Reflection_Source with Region `Global`, THE Reflection_Corner SHALL present a Source_Badge that identifies the source as global rather than Australian.
8. WHEN the Reflection_Corner presents its Reflection_Sources, THE Reflection_Corner SHALL order all Reflection_Sources with Region `Australia` before any Reflection_Source with Region `Global`.

### Requirement 5: Reflection Corner Section

**User Story:** As a parishioner, I want a clearly organised reflection section below the readings, so that I can find a trustworthy daily reflection, see what each source is, and read it at its source when reproduction is not permitted.

#### Acceptance Criteria

1. THE Reflection_Corner SHALL display the reflection section positioned directly below the readings section rendered by the Readings_Loader.
2. THE Reflection_Corner SHALL order Reflection_Sources so that all Region `Australia` sources appear before all Region `Global` sources, AND THE Reflection_Corner SHALL preserve the order in which the Source_Model provides Reflection_Sources that share the same Region.
3. THE Reflection_Corner SHALL display exactly one Source_Badge for each displayed Reflection_Source.
4. WHEN a Reflection_Source has Permission_Status `approved` AND supplies a non-empty Excerpt, THE Reflection_Corner SHALL display that Excerpt within the source's card.
5. IF a Reflection_Source does not display an Excerpt AND the Reflection_Source supplies a url, THEN THE Reflection_Corner SHALL display the source's description and a "Read at Source" link to that url within the source's card.
6. WHEN a parishioner activates a Reflection_Source's "Read at Source" link, THE Reflection_Corner SHALL open the source's url in a new browsing context with `rel="noopener noreferrer"`.
7. IF no Reflection_Source is available, THEN THE Reflection_Corner SHALL display a message indicating that no daily reflection is currently available AND THE Reflection_Corner SHALL NOT display any Source_Badge or source card.
8. IF a Reflection_Source does not display an Excerpt AND the Reflection_Source supplies no url, THEN THE Reflection_Corner SHALL display the source's description without a "Read at Source" link.

### Requirement 6: Parish-Written Reflection Prompt

**User Story:** As a parishioner, I want a short reflection prompt written by the parish for today, so that I have a starting point for prayer that does not depend on copyrighted third-party text.

#### Acceptance Criteria

1. WHEN the readings load successfully, THE Reflection_Corner SHALL display exactly one Reflection_Prompt for the current Liturgical_Day.
2. THE Reflection_Prompt SHALL be derived only from the loaded Gospel_Reference and the current Liturgical_Day.
3. THE Reflection_Corner SHALL NOT derive the Reflection_Prompt from any third-party reflection text.
4. IF the readings have not loaded successfully, THEN THE Reflection_Corner SHALL NOT display a Reflection_Prompt and SHALL display a message indicating that the reflection is unavailable.
5. THE Reflection_Prompt SHALL contain no fewer than 20 and no more than 500 characters.
6. IF the readings load successfully but a Reflection_Prompt cannot be derived from the Gospel_Reference and the current Liturgical_Day, THEN THE Reflection_Corner SHALL NOT display a Reflection_Prompt and SHALL display a message indicating that the reflection is unavailable.

### Requirement 7: Loading and Error States

**User Story:** As a parishioner, I want clear feedback while readings load or when they fail, so that I always know what is happening and how to reach the readings another way.

#### Acceptance Criteria

1. WHILE readings are loading, THE Reflection_Corner SHALL display a textual loading status indicating that today's readings are being retrieved.
2. IF readings fail to load, THEN THE Reflection_Corner SHALL display a textual error message indicating that the readings could not be loaded.
3. IF readings do not load within 10 seconds of retrieval beginning, THEN THE Reflection_Corner SHALL display a textual timeout message indicating that the readings could not be loaded within the time limit.
4. IF readings fail to load or do not load within 10 seconds, THEN THE Reflection_Corner SHALL display a control to retry loading the readings.
5. WHEN the retry control is activated, THE Reflection_Corner SHALL re-initiate loading of the readings and display the loading status.
6. IF readings fail to load or do not load within 10 seconds, THEN THE Reflection_Corner SHALL display a link that opens today's readings on Universalis.
7. WHERE JavaScript is disabled, THE Reflection_Corner SHALL provide a link to read today's readings on Universalis.

### Requirement 8: Accessibility

**User Story:** As a parishioner using assistive technology or a keyboard, I want the reflection corner to be perceivable and operable, so that I can read and navigate it independently.

#### Acceptance Criteria

1. THE Reflection_Corner SHALL give each external link a visible text label that identifies the link's destination or purpose and is understandable without relying on surrounding context.
2. WHEN an interactive link or button receives keyboard focus, THE Reflection_Corner SHALL display a focus indicator that is visually distinct from the element's unfocused appearance with a contrast ratio of at least 3:1 against adjacent colours.
3. THE Reflection_Corner SHALL hide decorative icons from assistive technologies so that they are not announced, except where an icon is the only label for a control.
4. WHERE an icon is the only label for a control, THE Reflection_Corner SHALL provide a text label that is announced by assistive technologies and identifies the control's action.
5. THE Reflection_Corner SHALL render long Source_Model descriptions using `break-words` and `min-w-0` so that the text remains fully within its container without horizontal overflow at all viewport widths of 320px and above.
6. THE Reflection_Corner SHALL render navigation targets as semantic link elements and action triggers as semantic button elements, each exposing its corresponding role to assistive technologies.
7. WHILE a parishioner has reduced-motion preferences enabled, THE Reflection_Corner SHALL suppress all non-essential animations and transitions via the existing `useReducedMotion` handling, retaining only motion required to convey state changes.
8. WHEN a parishioner activates a focused link or button using the Enter or Space key, THE Reflection_Corner SHALL perform the same action as a pointer click on that control.
9. WHEN a parishioner navigates the Reflection_Corner using the Tab key, THE Reflection_Corner SHALL move keyboard focus through every interactive control in visual reading order.

### Requirement 9: Theming and Responsive Layout

**User Story:** As a parishioner on any device or theme, I want the reflection corner to look consistent and readable, so that it matches the rest of the parish site in light mode, dark mode, and on mobile.

#### Acceptance Criteria

1. THE Reflection_Corner SHALL style new and modified UI using `parish-*` theme tokens.
2. THE Reflection_Corner SHALL NOT use hardcoded colour values for new or modified UI, except for text on image overlays and documented third-party brand colours.
3. WHILE the root element's `data-theme` attribute is set to `dark`, THE Reflection_Corner SHALL render all text, surfaces, and borders using dark-theme token values with no light-theme colour remaining visible.
4. WHILE the viewport width is 640px or less, THE Reflection_Corner SHALL present a single-column layout with no horizontal scrolling and all content fitting within the viewport.
5. WHEN the active theme changes, THE Reflection_Corner SHALL update its colours within 1 second without reloading the page.
6. THE Reflection_Corner SHALL render body text with a contrast ratio of at least 4.5:1 against its background in both light and dark themes.

### Requirement 10: Implementation Constraints

**User Story:** As a parish web maintainer, I want this feature to stay within our established frontend patterns and dependencies, so that the codebase remains consistent and easy to maintain.

#### Acceptance Criteria

1. THE Reflection_Corner SHALL implement its user interface using only the UI frameworks already present in the project's dependency manifest, and SHALL NOT add any UI framework that is not already listed in that manifest.
2. THE Reflection_Corner SHALL NOT add the `react-use` dependency to the project's dependency manifest.
3. WHERE a copy or share control is added, THE Reflection_Corner SHALL implement clipboard behaviour using a clipboard hook defined within the project codebase, and SHALL NOT add a dependency that is not already present in the project's dependency manifest to provide that behaviour.
4. WHERE a new or modified UI element defines a CSS transition, THE Reflection_Corner SHALL name each animated CSS property explicitly in the transition declaration and SHALL NOT use the `transition-all` shorthand.
5. THE Reflection_Corner SHALL reuse the existing readings hook, liturgical season hook, liturgical colour resolution utility, and Adelaide date utilities, and SHALL NOT create duplicate implementations of that functionality.

### Requirement 11: Copy Tone and Permission Discipline

**User Story:** As a parishioner, I want the wording to sound like our parish and respect copyright, so that the page feels authentic and the parish does not reproduce text it is not permitted to reproduce.

#### Acceptance Criteria

1. THE Reflection_Corner SHALL publish source descriptions and section copy only after the copy has recorded reviewer approval, and that copy SHALL exclude promotional calls to action, superlative marketing claims, and placeholder or template text.
2. THE Reflection_Corner SHALL render reproduced Excerpt text only for Reflection_Sources whose Permission_Status is `approved`, AND SHALL NOT render Excerpt text for any Reflection_Source whose Permission_Status is not `approved`.
3. WHERE no Reflection_Source has Permission_Status `approved`, THE Reflection_Corner SHALL present every Reflection_Source as a link-only card showing the source's description and a "Read at Source" link and rendering no Excerpt text.
4. IF a Reflection_Source's Permission_Status is not `approved` WHILE one or more other Reflection_Sources have Permission_Status `approved`, THEN THE Reflection_Corner SHALL present that source as a link-only card and SHALL NOT render its Excerpt.
5. WHEN source data is loaded or refreshed so a Reflection_Source has Permission_Status `approved` and supplies a non-empty Excerpt, THE Reflection_Corner SHALL display that Excerpt on the next render without requiring any code change or redeployment.
