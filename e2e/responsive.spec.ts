import { test, expect } from '@playwright/test';

const PAGES_TO_CHECK = ['/', '/mass-times', '/contact', '/giving', '/new-here'];

test.describe('Responsive — no horizontal overflow at 375px', () => {
    for (const path of PAGES_TO_CHECK) {
        test(`no x-overflow on ${path}`, async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 812 });
            await page.goto(path);
            await page.waitForLoadState('networkidle');

            const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
            const viewportWidth = await page.evaluate(() => document.documentElement.clientWidth);
            expect(documentWidth).toBeLessThanOrEqual(viewportWidth);
        });
    }
});
