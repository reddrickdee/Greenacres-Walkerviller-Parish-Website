import { test, expect } from '@playwright/test';

test('Daily Readings page loads and displays core elements', async ({ page }) => {
    await page.goto('/daily-readings');

    // Page title (uses typographic right single quote)
    await expect(page.locator('h1')).toContainText(/Today.s Readings/);

    // Source attribution section
    await expect(page.getByText(/Source/i).first()).toBeVisible();
    await expect(
        page.getByRole('link', { name: 'Universalis', exact: true }),
    ).toBeVisible();

    // Adelaide calendar reference
    await expect(page.getByText(/Adelaide/).first()).toBeVisible();

    // Reflection links section
    await expect(page.getByText('Reflection Links')).toBeVisible();
    await expect(page.getByText('Pray.com.au')).toBeVisible();
    await expect(page.getByText('Sacred Space')).toBeVisible();

    // Fallback link for Universalis
    await expect(
        page.getByRole('link', { name: /Open on Universalis/i }).first(),
    ).toBeVisible();
});
