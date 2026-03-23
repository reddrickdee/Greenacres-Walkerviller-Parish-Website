import { expect, type Page } from '@playwright/test';

const APP_SHELL_SELECTOR = 'main, footer';
const LOADING_SKELETON_SELECTOR = '[role="status"][aria-label="Loading page"]';

export async function gotoRoute(page: Page, path: string) {
    await page.goto(path, { waitUntil: 'domcontentloaded' });

    // The SPA is ready when the shell is visible; waiting for `load` is flaky
    // on pages with large media assets and optional analytics/PWA hooks.
    await expect(page.locator(APP_SHELL_SELECTOR).first()).toBeVisible();

    const loadingSkeleton = page.locator(LOADING_SKELETON_SELECTOR);
    if (await loadingSkeleton.count()) {
        await expect(loadingSkeleton).toHaveCount(0);
    }
}
