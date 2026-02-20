# Brainstorming Design: Interactive Integrations (Hallow & Facebook)

**Date:** 2026-02-20
**Topic:** Hallow App and Facebook Integration

## 1. Overview
This feature introduces interactive and engaging external integrations to the Greenacres Walkerviller Parish Website. Specifically, we will integrate a native Facebook feed experience for the parish's official profile, alongside a dedicated component to showcase spiritual challenges and resources from the Hallow app.

## 2. Facebook Integration
### 2.1 The "Social Hub"
**Requirement:** Provide an authentic, up-to-date look at the parish's Facebook activity (ID: `61584973342464`) without requiring users to log in or leave the site.
**Approach:** We will implement the official **Facebook Page Plugin**. This allows us to embed a localized timeline, including the parish's recent posts, events, and a native "Follow" button.
**Implementation details:**
- Load the async Facebook SDK via our primary `index.html` file.
- Create a dedicated React component (`FacebookFeed.tsx`) that mounts and parses the Page Plugin iframe dynamically.
- Ensure the plugin is responsive and adapts to its container width within our Tailwind styling layout.

### 2.2 Custom Highlights (Future scope/Optional)
**Requirement:** Full stylistic control over key events for a more premium UI.
**Approach:** While the Facebook embed handles real-time social activity, high-level announcements will instead be stored in our Supabase database to populate custom-styled, premium React cards within our existing front-end layout.

## 3. Hallow App Integration
### 3.1 Featured Spiritual Resource Component
**Requirement:** Direct traffic to specific, high-profile Hallow challenges (such as "Lent Pray40: The Return") since Hallow lacks an embeddable developer API.
**Approach:** A premium, visually distinct "Hero" or "Call to Action" banner/card specifically styled with contemplative/dark modes to subtly match Hallow's aesthetics.
**Implementation details:**
- **UI:** A custom React component (`FeaturedResource.tsx`) featuring an image block, title, description, and an external CTA button ("Join the Challenge").
- **Data Management:** A new Supabase table `featured_resources` to quickly swap out the current featured challenge without modifying code. (Fields: `id`, `title`, `description`, `image_url`, `link_url`, `is_active`).

### 3.2 Hallow Daily Gospel Widget (Optional Addition)
**Requirement:** Add persistent daily audio value.
**Approach:** Utilize Hallow's officially supported iframe embed for their Daily Gospel audio player. This can be placed unobtrusively in a sidebar or within the main "God's Word" section.

## 4. Error Handling & Performance
- The Facebook SDK will load asynchronously to prevent blocking the main JS thread for our Vite/React app.
- Content managed in Supabase (the Hallow featured resources) will load gracefully with skeleton states to prevent layout shifts.
- Graceful degradation: If a user has strict ad-blockers that block the Facebook SDK, the UI will fall back to a styled button stating "Visit us on Facebook" to ensure there is no broken white space.
