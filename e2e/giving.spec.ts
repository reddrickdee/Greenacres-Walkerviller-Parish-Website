import { test, expect } from '@playwright/test';
import { gotoRoute } from './support/navigation';

test.describe('Giving page (pledge/enquiry)', () => {
    test('page does not contain Stripe or payment processing language', async ({ page }) => {
        await gotoRoute(page, '/giving');
        const body = await page.textContent('body');
        expect(body?.toLowerCase()).not.toContain('stripe');
        expect(body?.toLowerCase()).not.toContain('receipt');
        expect(body?.toLowerCase()).not.toContain('card will be charged');
        expect(body?.toLowerCase()).not.toContain('payment will be processed');
    });

    test('page frames giving as a pledge or enquiry', async ({ page }) => {
        await gotoRoute(page, '/giving');
        const title = await page.title();
        expect(title.toLowerCase()).toMatch(/pledge|enquir/);
    });

    test('form shows error summary when submitted without email', async ({ page }) => {
        await gotoRoute(page, '/giving');
        // Find and click the submit button
        const submitBtn = page.locator('button').filter({ hasText: /submit|send|pledge/i }).first();
        if (await submitBtn.isVisible()) {
            await submitBtn.click();
            // Error summary should appear
            const alert = page.locator('div[role="alert"]').filter({ hasText: /please fix the following/i });
            await expect(alert).toBeVisible({ timeout: 2000 });
        }
    });
});
