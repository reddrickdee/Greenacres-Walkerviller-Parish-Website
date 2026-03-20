import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5173';
const shouldStartWebServer =
    !process.env.PLAYWRIGHT_SKIP_WEBSERVER &&
    (baseURL.startsWith('http://localhost:') || baseURL.startsWith('http://127.0.0.1:'));

export default defineConfig({
    testDir: './e2e',
    outputDir: 'test-results',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    timeout: 30_000,
    reporter: [
        ['list'],
        ['html', { open: 'never' }],
    ],
    use: {
        baseURL,
        actionTimeout: 10_000,
        navigationTimeout: 15_000,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },
    projects: [
        {
            name: 'mobile',
            use: { ...devices['iPhone SE'], browserName: 'chromium' },
        },
        {
            name: 'tablet',
            use: { ...devices['iPad Mini'], browserName: 'chromium' },
        },
        {
            name: 'desktop',
            use: { ...devices['Desktop Chrome'], browserName: 'chromium' },
        },
    ],
    webServer: shouldStartWebServer
        ? {
            command: 'npm run dev -- --host 127.0.0.1',
            url: baseURL,
            reuseExistingServer: !process.env.CI,
        }
        : undefined,
});
