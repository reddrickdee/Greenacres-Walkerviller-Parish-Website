/**
 * Integration tests using MSW to mock fetch calls.
 *
 * These tests exercise the real `loadParishContent` and `loadNewsletterArchive`
 * functions from api.ts, intercepting the fetch requests with MSW handlers
 * so no dev server or static files are needed.
 */
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/msw';
import { loadParishContent, loadNewsletterArchive } from '../api';
import { buildParishContent, buildNewsletterArchive } from '../../test/fixtures';

// ── MSW lifecycle ────────────────────────────────────────────────────────────

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// ── Tests ────────────────────────────────────────────────────────────────────

describe('loadParishContent (MSW)', () => {
    it('returns parish content from the mocked JSON endpoint', async () => {
        const content = await loadParishContent();
        expect(content.parishName).toBe('Greenacres Walkerville Catholic Parish');
        expect(content.massSchedule.length).toBeGreaterThan(0);
    });

    it('returns custom content when the handler is overridden', async () => {
        const custom = buildParishContent({ tagline: 'Test tagline override' });
        server.use(
            http.get('*/data/parish_content.json', () => {
                return HttpResponse.json(custom);
            }),
        );

        const content = await loadParishContent();
        expect(content.tagline).toBe('Test tagline override');
    });

    it('throws on HTTP error response', async () => {
        server.use(
            http.get('*/data/parish_content.json', () => {
                return new HttpResponse(null, { status: 500 });
            }),
        );

        await expect(loadParishContent()).rejects.toThrow(/500/);
    });
});

describe('loadNewsletterArchive (MSW)', () => {
    it('returns newsletter data from the mocked endpoint', async () => {
        const newsletters = await loadNewsletterArchive();
        expect(newsletters).toBeDefined();
        expect(newsletters.items).toBeDefined();
    });

    it('returns custom newsletter data when overridden', async () => {
        const custom = buildNewsletterArchive({
            items: [{ id: 'n-1', title: 'Test Newsletter', url: '/test.pdf', isCurrent: true }],
        });
        server.use(
            http.get('*/data/newsletters.json', () => {
                return HttpResponse.json(custom);
            }),
        );

        const newsletters = await loadNewsletterArchive();
        expect(newsletters.items).toHaveLength(1);
        expect(newsletters.items[0].title).toBe('Test Newsletter');
    });
});
