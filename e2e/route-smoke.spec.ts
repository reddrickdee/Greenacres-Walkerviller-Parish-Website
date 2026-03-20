import { test, expect } from '@playwright/test';

/**
 * Route smoke tests — verify every public route loads without a React error
 * boundary and renders meaningful content.
 */
const PUBLIC_ROUTES = [
    '/',
    '/about',
    '/history',
    '/gallery',
    '/new-here',
    '/mass-times',
    '/sacraments',
    '/live',
    '/homilies',
    '/news-events',
    '/volunteer',
    '/giving',
    '/contact',
    '/safeguarding',
];

test.describe('Route smoke — public pages', () => {
    for (const route of PUBLIC_ROUTES) {
        test(`${route} renders without error`, async ({ page }) => {
            await page.goto(route);
            // Wait for the app shell to mount
            await page.locator('main, footer').first().waitFor({ state: 'visible' });

            // No React error boundary message
            const body = await page.textContent('body');
            expect(body).not.toContain('Something went wrong');
            expect(body).not.toContain('chunk load error');

            // Page should have meaningful content (not blank)
            expect((body ?? '').length).toBeGreaterThan(50);
        });
    }
});
