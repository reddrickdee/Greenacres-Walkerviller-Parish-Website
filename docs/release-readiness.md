# Release Readiness

This checklist turns the completed audit remediation work into a repeatable release process.

## Local Gates

Install dependencies and Playwright once:

```bash
npm install
npx playwright install chromium
```

Run the local release gate:

```bash
npm run verify:release
```

That command enforces:

- `npm run lint`
- `npm test`
- `npm run test:e2e`
- `npm run build`

## Live Verification

Run the automated production-domain checks:

```bash
# Existing Playwright suite against gwparish.org.au
npm run test:e2e:live

# Lighthouse reports for key visitor journeys
npm run verify:lighthouse:live
```

To target a different deployed environment:

```bash
PLAYWRIGHT_BASE_URL=https://staging.example.org npm run test:e2e:live
LIGHTHOUSE_BASE_URL=https://staging.example.org npm run verify:lighthouse:live
```

Artifacts:

- Playwright HTML report: `playwright-report/`
- Lighthouse reports: `output/lighthouse/home.html`, `output/lighthouse/contact.html`, `output/lighthouse/giving.html`

GitHub Actions automation:

- [ci.yml](/Users/reddrick/Greenacres%20Walkerviller%20Parish%20Website/.github/workflows/ci.yml) enforces lint, unit tests, Playwright E2E, and build on push/PR
- [live-verification.yml](/Users/reddrick/Greenacres%20Walkerviller%20Parish%20Website/.github/workflows/live-verification.yml) runs the live-site suite on demand and uploads the reports as artifacts

## Manual Release Checks

Complete these against the deployed build before sign-off:

- Keyboard-only navigation on Home, Mass Times, Contact, Giving, and Gallery
- Drawer, modal, and lightbox focus return behaviour
- Gallery lightbox open/close via keyboard
- Breadcrumb rendering on deeper pages
- Reduced-motion behaviour with OS preference enabled
- Dark and light theme contrast sanity pass
- VoiceOver/Safari smoke test on the main visitor journey
- Giving page truthfulness: no Stripe, receipt, or charge language

## PR / Release Summary

Use this structure in the release note or PR description:

1. Accessibility and overlay semantics
2. Interaction fixes and truthful giving flow
3. Responsive/performance updates
4. Typography, motion, and wayfinding improvements
5. Validation evidence

Suggested validation evidence block:

```text
- npm run lint
- npm test
- npm run test:e2e
- npm run build
- npm run test:e2e:live
- npm run verify:lighthouse:live
- Manual checks completed: keyboard, VoiceOver smoke test, dark mode, reduced motion
```

## Known Non-Blocking Follow-Up

- Large gallery source images and PWA/icon assets should continue to be reviewed if Lighthouse flags them on the live site.
- When the project upgrades to React 19, re-check whether any custom `fetchpriority` handling can be simplified.

## Rollback

If release verification finds a blocking regression in overlays, navigation, or form flows, roll back by redeploying the previous known-good build. Do not hot-edit content or revert unrelated changes in the same release window.
