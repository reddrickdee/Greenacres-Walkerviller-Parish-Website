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
- then move quickly into the latest weekly parish notices
- feel warm and current without being flashy

### 3. The tone should be polished but restrained

The desired voice is:

- professional parish website
- clearly rewritten for the web
- readable and warm
- not gimmicky
- not overly modern
- not pushy
- not obviously AI-generated

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

## Provisional Product Statement

If reduced to one working sentence, the product currently appears to be:

> A calm, trustworthy parish website whose main job is to publish the week's most important bulletin notices in a polished web format, while still providing the full bulletin PDF for download.

## Open Questions

These questions remain unresolved:

- Should each weekly bulletin page be a simple list of 5-8 notices under clear headings, with minimal extra storytelling?
- What exact notice structure should appear every week on the web page?
- How prominent should the PDF download be relative to the rewritten notice content?
- How much visual refinement is welcome before it starts to feel too designed or too modern?
- What should `Volunteer` actually do in the final site: express interest, read opportunities, or simply contact the office?
- Should `News & Events` remain a broader archive page, or become almost entirely a bulletin archive plus current weekly notice landing page?

## Next Step

Resume the interview and continue narrowing:

- the exact weekly bulletin page structure
- the preferred homepage composition
- the amount of visual simplification required
- the final keep/cut decisions for borderline pages
