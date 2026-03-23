import { test, expect } from '@playwright/test';
import { gotoRoute } from './support/navigation';

test.describe('Gallery lightbox', () => {
    test('gallery tile opens lightbox via Enter key', async ({ page }) => {
        await gotoRoute(page, '/gallery');
        // Find the first gallery tile button and focus it
        const firstTile = page.locator('button').filter({ has: page.locator('img') }).first();
        await firstTile.focus();
        await page.keyboard.press('Enter');

        // Lightbox overlay should appear
        const lightbox = page.locator('[role="dialog"]');
        await expect(lightbox).toBeVisible({ timeout: 3000 });
    });

    test('gallery tile opens lightbox via Space key', async ({ page }) => {
        await gotoRoute(page, '/gallery');
        const firstTile = page.locator('button').filter({ has: page.locator('img') }).first();
        await firstTile.focus();
        await page.keyboard.press('Space');

        const lightbox = page.locator('[role="dialog"]');
        await expect(lightbox).toBeVisible({ timeout: 3000 });
    });

    test('lightbox closes on Escape', async ({ page }) => {
        await gotoRoute(page, '/gallery');
        const firstTile = page.locator('button').filter({ has: page.locator('img') }).first();
        await firstTile.click();

        const lightbox = page.locator('[role="dialog"]');
        await expect(lightbox).toBeVisible({ timeout: 3000 });

        await page.keyboard.press('Escape');
        await expect(lightbox).not.toBeVisible();
    });
});
