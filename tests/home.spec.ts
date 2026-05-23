import { test, expect } from '@playwright/test';

test('Home page loads and displays core elements', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.getByText(/A welcoming community of faith in Adelaide/i)).toBeVisible();
  
  // Verify CTA buttons are present
  await expect(page.getByRole('link', { name: /view mass times/i }).first()).toBeVisible();
});
