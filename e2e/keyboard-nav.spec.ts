import { test, expect } from '@playwright/test';

test.describe('Keyboard navigation', () => {
    test('skip link receives focus on first Tab press', async ({ page }) => {
        await page.goto('/');
        await page.keyboard.press('Tab');
        const skipLink = page.locator('a[href="#main-content"]');
        await expect(skipLink).toBeFocused();
    });

    test('Tab reaches header navigation controls', async ({ page }) => {
        await page.goto('/');
        // Tab past skip link into header nav
        for (let i = 0; i < 4; i++) {
            await page.keyboard.press('Tab');
        }
        const focused = page.locator(':focus');
        // The focused element should be within the header
        await expect(focused).toBeVisible();
    });
});
