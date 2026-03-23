import { test, expect } from '@playwright/test';
import { gotoRoute } from './support/navigation';

test.describe('Forms accessibility', () => {
    test('giving form fields have associated labels', async ({ page }) => {
        await gotoRoute(page, '/giving');
        // All visible labels should have a matching input via htmlFor/id
        const labels = page.locator('label[for]');
        const count = await labels.count();
        expect(count).toBeGreaterThan(0);

        for (let i = 0; i < count; i++) {
            const forAttr = await labels.nth(i).getAttribute('for');
            if (forAttr) {
                const input = page.locator(`[id="${forAttr}"]`);
                await expect(input).toBeAttached();
            }
        }
    });

    test('volunteer form fields have associated labels', async ({ page }) => {
        await gotoRoute(page, '/volunteer');
        const labels = page.locator('label[for]');
        const count = await labels.count();
        expect(count).toBeGreaterThan(0);

        for (let i = 0; i < count; i++) {
            const forAttr = await labels.nth(i).getAttribute('for');
            if (forAttr) {
                const input = page.locator(`[id="${forAttr}"]`);
                await expect(input).toBeAttached();
            }
        }
    });
});
