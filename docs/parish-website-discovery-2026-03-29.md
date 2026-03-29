# Parish Website Discovery Notes

Date: 2026-03-29
Status: In progress
Project: Greenacres Walkerville Catholic Parish website

## Purpose

This document captures the discovery interview so far: the user's concerns, the questions asked, the user's responses, and the current direction emerging from those responses.

The goal is to clarify what the public website should actually be before any redesign or pruning work begins.

## Initial User Concerns

The user opened with these main concerns and instincts:

- In the real world, there would be substantial engagement and daily visits to the website.
- The site should serve the current parishioners of the church.
- Regular parishioners should visit daily, feel accommodated, and feel that the website is for them and by them.
- The current version feels too old, outdated, and lacking the current church spirit.
- A section about communions exists, but the user does not feel they know enough about that area.
- The user would be embarrassed if parishioners felt the site was too much, too gimmicky, too modern, too out of touch with the elderly population, or too obviously AI-coded.
- The user is inclined to cut the social features that were added, including creative/community spaces for prayers, words of hope, and parishioner-published articles.

## Current Site Observations

Before asking targeted questions, the existing site was reviewed.

Observed current scope:

- Home
- Mass Times
- Contact
- About
- History
- I'm New Here
- News & Events
- Bulletin detail page
- Sacraments & Services
- Request a Sacrament
- Gallery
- Safeguarding
- Community Hub
- Community article page
- Giving
- Volunteer
- Live Stream
- Homilies

Observed product tension in the current build:

- The site currently tries to be several things at once: parish welcome site, practical information site, bulletin/news platform, sacramental explainer, livestream/homilies hub, giving page, volunteer page, and social/community platform.
- The visual and UX direction is polished and expressive, but this carries risk against the user's concerns about feeling gimmicky, too modern, or AI-coded.
- The current native bulletin implementation is more editorial and publication-like than a simple weekly parish noticeboard.
- The Community Hub is a significant product area and directly conflicts with the user's instinct to remove social posting features.

## Reference Bulletin Reviewed

The user supplied a sample PDF:

- `/Users/reddrick/Downloads/Connections 28th_29th March 2026.pdf`

Observed characteristics of the sample bulletin:

- It reads as a practical parish noticeboard rather than a magazine or promotional site.
- The front page prioritizes:
  - church addresses
  - parish office details
  - mass times
  - important parish dates
- Later pages include:
  - stewardship/spiritual reflection
  - parish events and notices
  - Holy Week and liturgical schedule information
  - diocesan/charity appeals
  - community reminders

This sample became the reference point for the discussion about how notices should work on the website.

## Interview Log

### 1. Core job of the website

Question:
If the public website could do only one job exceptionally well for the next 12 months, what would that one job be?

User response:

> give weekly updates on the parish's happenings as provided in the bulletins we receive at mass

Working interpretation:

- The website's core job is not primarily community interaction or broad digital engagement.
- Its central value is reliable weekly parish updates based on the printed bulletin.

### 2. Format of the weekly bulletin content

Question:
Should parishioners see the bulletin PDF itself, a cleaned-up web version of the key notices, or both?

User response:

> a cleaned-up web version of the key notices

Follow-up response:

> with a bulletin PDF available for download

Working interpretation:

- The website should present a cleaned-up web version first.
- The PDF should remain available as a secondary/download option.

### 3. Tone of the weekly notices

Question:
Should the notices keep the same factual bulletin tone, or be rewritten into polished marketing-style web copy?

User response:

> I PREFFER IT REWRITTEN INTO POLISHED MARKETING-STYLE WEB COPY

Follow-up question:
Which tone is closest?

- A. Plain parish voice
- B. Professional parish website
- C. Strong marketing voice

User response:

> B

Working interpretation:

- The content should be clearly rewritten for the web.
- It should feel warmer, more structured, and more polished than the bulletin.
- It should still remain restrained and recognisably parish-based, not slick or commercial.

### 4. Homepage priority

Question:
What should a regular parishioner see first on the home page?

- A. Latest weekly notices immediately
- B. A short, calm parish welcome first, then the latest weekly notices directly below
- C. A broader homepage first, with weekly notices as one section among many

User response:

> B

Working interpretation:

- The homepage should still carry a welcome and parish identity.
- Weekly notices should sit immediately below that welcome and function as the real destination.

### 5. Essential public pages

The full current public page list was shown to the user and they were asked to mark each page as keep, maybe, or cut.

User response:

> keep....home, mass times, contact, about, history, news and events, bulletin detail page, gallery, volunteer

Follow-up clarification:
The remaining pages were treated as likely cuts, with an explicit check on `I'm New Here`.

User response:

> i may need i'm new here...the rest, not likely to make the cut

Working interpretation:

Likely keep:

- Home
- Mass Times
- Contact
- About
- History
- News & Events
- Bulletin detail page
- Gallery
- Volunteer
- I'm New Here (probable keep, but with a very specific purpose)

Likely cut:

- Sacraments & Services
- Request a Sacrament
- Safeguarding
- Community Hub
- Community article page
- Giving
- Live Stream
- Homilies

### 6. Purpose of `I'm New Here`

Question:
What is the real purpose of `I'm New Here`?

- A. Help completely new visitors know what to expect at Mass
- B. Help returning Catholics or local residents reconnect with the parish
- C. Mostly reassurance and hospitality
- D. Not sure, but it feels expected

User response:

> A

Working interpretation:

- `I'm New Here` is justified because it serves a real newcomer task.
- It is not just a decorative or expected page.

### 7. Priority audience

Question:
Who matters most to satisfy on launch day?

- A. Existing older parishioners who already attend Mass
- B. Existing parishioners across all ages
- C. First-time or returning visitors deciding whether to come
- D. Parish leadership/staff who want it to look current

User initially responded:

> A. B and C

When forced to identify what criticism would be most troubling, the user responded:

> B and A

The critique options were:

- A. Older parishioners can't find what they need.
- B. Regular parishioners don't feel this site reflects parish life.
- C. New visitors still don't know how to take the first step.

Working interpretation:

- The highest priority is that regular parishioners feel the site reflects actual parish life.
- The second priority is usability and clarity for older parishioners.
- New visitors still matter, but not at the cost of alienating the core parish community.

### 8. Weekly publishing workload

Question:
Who will prepare the weekly web notices, and how much time is realistic?

- A. I will do it myself, and it needs to take about 15-30 minutes
- B. I will do it myself, but I can spend up to 1-2 hours
- C. A parish staff member or volunteer will do it
- D. Not sure yet

User response:

> A

Working interpretation:

- The weekly publishing workflow must be simple.
- It cannot rely on heavy formatting or high editorial overhead.
- The content model should support fast weekly entry and publication.

### 9. Mandatory weekly notice categories

Question:
Which categories are mandatory on the weekly web update, even on a short week?

Options:

- A. Mass or schedule changes
- B. Important parish dates and events
- C. Sacramental or family notices
- D. Parish groups and devotions
- E. Volunteer or service appeals
- F. Stewardship reflection / spiritual message
- G. External diocesan or charity appeals
- H. School/community notices
- I. Death, funeral, or prayer notices
- J. Everything else can live only in the PDF

User response:

> A, B, D, E, F, G, H, I, J, C

Working interpretation:

- Nearly every major bulletin category may matter.
- The real constraint is not topic coverage but how much of it gets surfaced on the page each week.

### 10. Amount of weekly content to surface on the website

Question:
On a typical week, how much of the bulletin should be rewritten onto the website?

- A. Only the top 5-8 notices
- B. Most notices, but condensed into short web summaries
- C. Nearly the whole bulletin in web form, with the PDF just as backup

User response:

> A

Working interpretation:

- The weekly page should be selective.
- It should not attempt to reproduce the whole bulletin in web form.
- The PDF exists to cover the rest.

### 11. Bulletin page structure

After reviewing the current `News & Events` and `BulletinPage` implementation, a direct structure question was asked.

Question:
Should each weekly bulletin page be mostly a straightforward list of 5-8 key notices under clear headings, with the PDF download attached, and no extra editorial storytelling unless it is already in the bulletin?

User response:

> yes, each weekly bulletin page be mostly a straightforward list of 5–8 key notices under clear headings, with the PDF download attached, and no extra editorial storytelling unless it is already in the bulletin

Working interpretation:

- This is now explicitly confirmed.
- Weekly bulletin pages should be simple, selective, and practical.
- The page should surface only the key notices in a clear structure.
- The PDF remains attached as supporting access to the full bulletin.

### 12. Consistency of weekly section headings

Question:
Should the weekly bulletin page use the same section headings every week, mostly the same headings with some flexibility, or different headings each week?

User response:

> B

Working interpretation:

- The weekly bulletin page should have a recognisable default structure.
- It should still allow some headings to change when the week's bulletin needs it.

### 13. Preferred starter structure for weekly bulletin pages

Question:
Which starter structure feels closest?

- A. `This Week`, `Coming Up`, `Parish Notices`, `Download PDF`
- B. `Mass & Liturgy`, `Important Dates`, `Parish Groups`, `Other Notices`, `Download PDF`
- C. `Top Notices`, `This Week at the Parish`, `Community & School`, `Download PDF`

User response:

> C

Working interpretation:

- The preferred default structure is more editorially simple and reader-friendly than a formal ministry-by-ministry bulletin structure.
- A likely default weekly page shape is:
  - `Top Notices`
  - `This Week at the Parish`
  - `Community & School`
  - `Download PDF`
- This should remain flexible rather than forced every single week.

### 14. Homepage treatment of weekly notices

Question:
Should parishioners see the full weekly notice content on the homepage, or just a short preview linking to the full weekly bulletin page?

- A. Full weekly notices on the homepage
- B. A short preview on the homepage, with a link to the full weekly bulletin page

User response:

> A

Working interpretation:

- The homepage should function as the primary weekly bulletin destination.
- The current week's key notices should appear in full on the homepage, not merely as a teaser.
- The dedicated bulletin detail page can still exist for archive, sharing, and older issues.

### 15. Role of `News & Events`

Question:
If the homepage carries the full current week's notices, what should `News & Events` mainly become?

- A. An archive of past weekly bulletins and PDFs
- B. An archive of past bulletins plus occasional special event/news posts
- C. A broader mixed news page, separate from the homepage bulletin role

User response:

> A

Working interpretation:

- `News & Events` should primarily become the bulletin archive.
- It does not need to remain a broad mixed-content news page.

### 16. Prominence of the PDF download

Question:
How prominent should the PDF download be on the weekly homepage bulletin?

- A. Near the top, visible without much scrolling
- B. After the web notices, as a secondary option
- C. At both the top and bottom

User response:

> A

Working interpretation:

- The PDF download should be available near the top of the homepage bulletin.
- Parishioners should be able to choose the PDF format immediately if they prefer it.

### 17. Length of each weekly notice

Question:
For each notice on the weekly page, what length feels right?

- A. One short paragraph per notice
- B. A heading plus 2-4 short sentences
- C. A heading plus a longer mini-article if needed

User response:

> B

Working interpretation:

- Each notice should have a short heading and a small body of supporting copy.
- The intended unit is concise but not skeletal.
- Weekly notices should read like clean web summaries, not article features.

### 18. Use of dates and times inside notices

Question:
When a notice involves an action or event, should the exact date and time usually be written inside the notice itself?

- A. Yes, usually repeat the exact date/time for clarity
- B. Only if the notice would be confusing without it
- C. No, keep most notices cleaner and lighter

User response:

> A and B

Working interpretation:

- Dates and times should usually be written directly into notices when they help parishioners act quickly or avoid confusion.
- They do not need to be forced into every notice if the item is already clear without them.
- Clarity takes priority over minimalism.

### 19. Preferred visual direction

Question:
Which visual direction would worry you least for launch?

- A. Very plain and quiet, almost bulletin-board simple
- B. Clean and modern, but restrained and familiar
- C. Visibly designed and elegant, with strong photography and atmosphere

User response:

> C

Working interpretation:

- The user does not want the site to be visually flat or purely utilitarian.
- A designed, elegant presentation is welcome.
- The risk is not design itself, but design that feels showy, gimmicky, insincere, or disconnected from parish life.

### 20. What makes the site feel "too much"

Question:
What is most likely to make an elegant parish site feel "too much"?

- A. Too much animation or motion
- B. Too much branding language or polished copy
- C. Too many sections, cards, or features competing for attention
- D. Photography/design that feels fake, trendy, or AI-made

User response:

> C and D

Working interpretation:

- The biggest visual risks are clutter and inauthenticity.
- The site should avoid crowded homepage composition and excessive feature blocks.
- Photography and design choices must feel real, grounded, and parish-specific.

### 21. Homepage hero scale

Question:
For launch, should the homepage hero area be:

- A. Short and calm, then quickly into the weekly notices
- B. Visually rich and atmospheric, but still compact
- C. Large and cinematic, with the weekly notices starting further down the page

User response:

> B

Working interpretation:

- The homepage should retain a designed top section.
- That top section should still be compact enough that weekly notices remain close to the top of the experience.

### 22. Hero image treatment

Question:
Should there be one clear photo-led hero image at the top, or should the design stay mostly typographic?

- A. One strong photo-led hero image
- B. Mostly typographic, with smaller supporting imagery
- C. No strong preference

User response:

> A

Working interpretation:

- The homepage should use one strong, authentic parish image as the leading visual.
- The top of the site should feel grounded in real parish photography rather than abstract styling.

### 23. Homepage placement of Mass Times

Question:
Where should `Mass Times` appear in the homepage hierarchy?

- A. Inside the hero/top area because parishioners need it constantly
- B. Near the top, but below the weekly notices
- C. Only as a separate page in navigation, not a homepage priority

User response:

> A

Working interpretation:

- Mass times are a top-level homepage need.
- The hero/top area should include clear access to regular Mass information.

## Direction Emerging So Far

This is the strongest current read of the intended product direction.

### 1. The website should primarily function as a weekly parish update site

Its core public job is:

- to publish the week's most important parish notices in a cleaner web format derived from the printed bulletin

Not the primary job:

- community posting
- social interaction features
- a highly editorial digital magazine
- a broad feature-rich parish platform

### 2. The homepage should be calm, welcoming, and immediately useful

The homepage should likely:

- open with a short, calm parish welcome
- then move quickly into the latest weekly parish notices in full
- include Mass Times in the top/hero area
- feel warm and current without being flashy
- use one strong parish image in a visually rich but compact hero

### 3. The tone should be polished but restrained

The desired voice is:

- professional parish website
- clearly rewritten for the web
- readable and warm
- not gimmicky
- not overly modern
- not pushy
- not obviously AI-generated

### 3A. The visual language should be elegant, not plain

The desired visual feel is:

- visibly designed
- elegant
- atmospheric
- supported by strong photography
- still restrained enough to avoid feeling gimmicky or inauthentic
- not crowded with too many competing sections or cards
- not reliant on fake, trendy, or AI-looking imagery

### 4. The public site should be narrower than the current build

The current likely public core is:

- Home
- Mass Times
- Contact
- About
- History
- News & Events
- Bulletin detail page
- Gallery
- Volunteer
- I'm New Here

Likely removals:

- Community/social publishing features
- sacrament-heavy sections not confidently owned by the user
- livestream/homily/giving/adminjacent content that does not support the core weekly-update model

### 5. The site must feel true to parish life

The user is especially trying to avoid a launch where parishioners say:

- this does not feel like us
- this is too modern or showy
- this is too gimmicky
- this feels AI-made
- this does not serve older parishioners well

### 6. The weekly workflow must be sustainable

Because the user expects to do the updates personally in about 15-30 minutes:

- the website needs a simple weekly publishing structure
- the notices should be limited to the top 5-8 items
- the rest can remain in the PDF download
- weekly bulletin pages should avoid magazine-style editorial expansion
- weekly bulletin pages should feel familiar from week to week without becoming formulaic
- `News & Events` should mostly function as an archive, not an active mixed-content newsroom
- the PDF should be available near the top of the weekly homepage bulletin
- each notice should usually be a heading plus 2-4 short sentences
- dates and times should be written directly into notices when that improves clarity

## Provisional Product Statement

If reduced to one working sentence, the product currently appears to be:

> A calm, trustworthy parish website whose main job is to publish the week's most important bulletin notices in a polished web format, while still providing the full bulletin PDF for download.

## Wrap-Up Synthesis

### What the user actually wants

The website should stop trying to be a large parish platform and instead become a smaller, clearer parish website built around the weekly bulletin.

The desired public experience is:

- a compact but elegant homepage
- one authentic parish image at the top
- a short welcome that feels real rather than branded
- regular Mass Times and parish office contact details visible near the top
- the full current week's key notices on the homepage
- a PDF download visible near the top for parishioners who prefer the bulletin as-is
- a simple archive page for older bulletins

The site is not trying to be:

- a social network for parishioners
- a feature-rich digital ministry platform
- an online community publishing space
- a magazine-style editorial experience

### The key design tension

The user does want the site to feel designed and current.

The user does not want it to feel:

- cluttered
- over-featured
- fake
- trendy for its own sake
- AI-made
- disconnected from the real parish

So the correct direction is:

- elegant but compact
- polished but restrained
- warm but not promotional
- practical first, atmospheric second

## Recommended Execution Plan

This is the recommended version of the task tracker based on the interview and the current codebase.

### Phase 1: Route and Navigation Cleanup

- Update [src/lib/routes.ts](/Users/reddrick/Greenacres-Walkerviller-Parish-Website/src/lib/routes.ts) so only the intended public pages remain in the manifest.
- Update [src/lib/navigation.ts](/Users/reddrick/Greenacres-Walkerviller-Parish-Website/src/lib/navigation.ts) to reflect the smaller site and remove dead-end navigation paths.
- Update [src/App.tsx](/Users/reddrick/Greenacres-Walkerviller-Parish-Website/src/App.tsx) to remove any remaining cut routes and route imports.
- Update [src/layouts/RootLayout.tsx](/Users/reddrick/Greenacres-Walkerviller-Parish-Website/src/layouts/RootLayout.tsx) to remove `Community` and `Give` emphasis and simplify the footer around the new core site.

Implementation note:

- `AuthProvider` is not currently mounted in [src/main.tsx](/Users/reddrick/Greenacres-Walkerviller-Parish-Website/src/main.tsx), so "remove AuthProvider" is no longer an active task.
- `App.tsx` has already been partly simplified compared with the wider route list in the repository, so route cleanup should start from the actual current router rather than an older assumption.

### Phase 2: Bulletin-First Data Model

- Create `public/data/weekly_notices.json` for the current homepage bulletin content.
- Seed that file from the March 28-29, 2026 `Connections` bulletin.
- Keep [public/data/newsletters.json](/Users/reddrick/Greenacres-Walkerviller-Parish-Website/public/data/newsletters.json) as the archive source, but simplify its role toward archive metadata rather than rich editorial content.
- Prefer a reusable `WeeklyNotices` component instead of hard-coding the bulletin structure directly into the homepage.

Recommended content shape for the current weekly bulletin:

- issue title/date
- PDF URL
- top Mass/liturgy summary
- top notices
- this week at the parish
- community and school notices

### Phase 3: Homepage Transformation

- Rewrite [src/pages/HomePage.tsx](/Users/reddrick/Greenacres-Walkerviller-Parish-Website/src/pages/HomePage.tsx) around the current weekly bulletin rather than reflections, prayer-wall, Facebook, testimonial, and other mixed homepage modules.
- Use one strong, authentic parish image.
- Keep the hero compact but atmospheric.
- Include:
  - short welcome copy
  - weekend and key weekday Mass Times
  - parish office phone/email
  - PDF download near the top
  - full weekly notices on the homepage

Recommended homepage order:

1. Hero with parish image, welcome, Mass Times, and office contact
2. PDF download and current issue metadata
3. `Top Notices`
4. `This Week at the Parish`
5. `Community & School`
6. Link into the archive

### Phase 4: Archive Simplification

- Rework [src/pages/NewsEventsPage.tsx](/Users/reddrick/Greenacres-Walkerviller-Parish-Website/src/pages/NewsEventsPage.tsx) so it primarily becomes the bulletin archive.
- Rework [src/pages/BulletinPage.tsx](/Users/reddrick/Greenacres-Walkerviller-Parish-Website/src/pages/BulletinPage.tsx) so archived issues follow the same practical notice structure instead of the current magazine-style template.

### Phase 5: Dead Code Cleanup

- Remove homepage dependencies that no longer fit the bulletin-first model, especially reflections, prayer-wall, Facebook feed, testimonials, and related hooks/components if they become unused.
- Remove cut-route components and their dead imports once the kept pages are stable.
- Remove community/auth/admin code only after route cleanup is complete and the build is green, because that code is spread across pages, components, API helpers, and Supabase utilities.

Implementation note:

- Supabase is still used by shared API code in [src/lib/api.ts](/Users/reddrick/Greenacres-Walkerviller-Parish-Website/src/lib/api.ts) for optional overlays and reflections. Do not rip out Supabase wholesale in the first pass unless you intentionally replace or remove those features.

### Phase 6: Content and Copy Audit

- Soften branded or abstract copy that currently feels more like a design system demo than a parish website.
- Prioritize fixes in:
  - [src/pages/HomePage.tsx](/Users/reddrick/Greenacres-Walkerviller-Parish-Website/src/pages/HomePage.tsx)
  - [src/layouts/RootLayout.tsx](/Users/reddrick/Greenacres-Walkerviller-Parish-Website/src/layouts/RootLayout.tsx)
  - [src/pages/NewsEventsPage.tsx](/Users/reddrick/Greenacres-Walkerviller-Parish-Website/src/pages/NewsEventsPage.tsx)
  - [src/pages/BulletinPage.tsx](/Users/reddrick/Greenacres-Walkerviller-Parish-Website/src/pages/BulletinPage.tsx)

The target voice is:

- warm
- plain enough to trust
- polished enough to feel current
- never salesy
- never ornate for its own sake

### Phase 7: Verification

- `npx tsc -b`
- `npm run build`
- local dev-server visual check with attention to:
  - homepage hierarchy
  - readability for older parishioners
  - PDF prominence
  - archive usability
  - navigation simplicity

## Decision Log

- Core website job chosen: publish weekly parish happenings from the bulletin in web form.
- Homepage chosen as the primary current-week destination.
- `News & Events` chosen as the archive, not the main live bulletin surface.
- Weekly notices limited to roughly 5-8 key items.
- Notice tone chosen: polished parish-website copy, not raw bulletin text and not strong marketing copy.
- Weekly notice structure chosen: mostly consistent, with a default rhythm close to `Top Notices`, `This Week at the Parish`, `Community & School`, plus PDF access.
- PDF download chosen to be near the top.
- Dates and times chosen to appear directly in notices when they improve clarity.
- Visual direction chosen: elegant and photo-led, but compact and authentic.
- Primary risks identified: clutter and fake/trendy/AI-looking design.

## Open Questions

These questions remain unresolved:

- What exact notice structure should appear every week on the web page?
- How much visual refinement is welcome before it starts to feel too designed or too modern?
- How visually plain or refined should the final site feel?
- How much Mass Times information should appear in the homepage top area versus the dedicated page?
- What should `Volunteer` actually do in the final site: express interest, read opportunities, or simply contact the office?
- Should `News & Events` remain a broader archive page, or become almost entirely a bulletin archive plus current weekly notice landing page?

## Next Step

Resume the interview and continue narrowing:

- the exact weekly bulletin page structure
- the preferred homepage composition
- the amount of visual simplification required
- the final keep/cut decisions for borderline pages
