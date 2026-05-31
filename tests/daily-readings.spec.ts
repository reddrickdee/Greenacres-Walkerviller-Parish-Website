import { test, expect, type Page } from '@playwright/test';

const completePayload = {
    number: 1,
    date: 'Sunday 31 May 2026',
    day: '<b>The Most Holy Trinity</b>',
    Mass_R1: {
        source: 'Proverbs 8:22-31',
        heading: 'Wisdom was born before the earth was made.',
        text: '<p>First reading text.</p>',
    },
    Mass_Ps: {
        source: 'Psalm 8',
        text: '<p>Responsorial psalm text.</p>',
    },
    Mass_R2: {
        source: 'Romans 5:1-5',
        text: '<p>Second reading text.</p>',
    },
    Mass_GA: {
        source: 'See Revelation 1:8',
        text: '<p>Alleluia text.</p>',
    },
    Mass_G: {
        source: 'John 16:12-15',
        heading: 'When the Spirit comes, he will guide you.',
        text: '<p>Gospel text.</p>',
    },
    copyright: {
        text: '<p>Universalis copyright notice.</p>',
    },
};

async function mockUniversalis(page: Page, payload: Record<string, unknown>) {
    await page.route('https://universalis.com/**/jsonpmass.js?callback=*', async route => {
        const url = new URL(route.request().url());
        const callback = url.searchParams.get('callback') ?? 'callback';
        await route.fulfill({
            contentType: 'application/javascript',
            body: `${callback}(${JSON.stringify(payload)});`,
        });
    });
}

test('Daily Readings page displays the reflection corner and curated sources', async ({ page }) => {
    await mockUniversalis(page, completePayload);
    await page.goto('/daily-readings');

    await expect(page.locator('h1')).toContainText(/Readings.*Reflection/);
    await expect(page.getByText(/Australia.*Adelaide/).first()).toBeVisible();
    await expect(page.getByText('Liturgical colour:')).toBeVisible();

    await expect(page.getByRole('heading', { name: 'First Reading' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Responsorial Psalm' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Gospel', exact: true })).toBeVisible();

    await expect(page.getByText('Liturgical Reflection Corner')).toBeVisible();
    await expect(page.getByText('Prayer for Today')).toBeVisible();
    await expect(page.getByText(/For the Most Holy Trinity, spend/)).toBeVisible();

    await expect(page.getByText('Daily Prayer & Reflection Sources')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Pray.com.au Daily Prayer' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Canberra & Goulburn Living Word' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Bathurst Connect@home' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Sacred Space' })).toBeVisible();
    await expect(page.getByText('Global prayer source')).toBeVisible();

    await expect(
        page.getByRole('link', { name: /Read at Source: Pray\.com\.au Daily Prayer/i }),
    ).toBeVisible();
    await expect(page.locator('blockquote')).toHaveCount(0);

    await expect(page.getByText(/Source/i).last()).toBeVisible();
    await expect(
        page.getByRole('link', { name: /Open Today.s Readings on Universalis/i }).first(),
    ).toBeVisible();
});

test('Daily Readings page does not present incomplete readings as complete', async ({ page }) => {
    await mockUniversalis(page, {
        ...completePayload,
        Mass_G: undefined,
    });
    await page.goto('/daily-readings');

    await expect(page.getByText('The readings came through incomplete')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'First Reading' })).not.toBeVisible();
    await expect(page.getByText(/reflection prompt will appear once/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Try Again/i })).toBeVisible();
});
