/**
 * MSW request handlers for the parish SPA.
 *
 * Intercepts fetch calls to `/data/*.json` so tests can run without
 * serving static files. Supabase API calls are also mocked here.
 *
 * Usage:
 *   import { handlers } from './handlers';
 *   const server = setupServer(...handlers);
 */
import { http, HttpResponse } from 'msw';
import { buildParishContent, buildNewsletterArchive } from '../fixtures';

// ── Default mock data ────────────────────────────────────────────────────────

const defaultParishContent = buildParishContent();
const defaultNewsletters = buildNewsletterArchive();

// ── Handlers ─────────────────────────────────────────────────────────────────

export const handlers = [
    // Parish content JSON (fetched by loadParishContent in api.ts)
    http.get('*/data/parish_content.json', () => {
        return HttpResponse.json(defaultParishContent);
    }),

    // Newsletter archive JSON (fetched by loadNewsletterArchive in api.ts)
    http.get('*/data/newsletters.json', () => {
        return HttpResponse.json(defaultNewsletters);
    }),

    // Supabase RPC / REST fallback — return empty rows so community
    // features degrade gracefully without env vars
    http.get('*supabase.co/rest/v1/*', () => {
        return HttpResponse.json([]);
    }),

    http.post('*supabase.co/rest/v1/*', () => {
        return HttpResponse.json({});
    }),
];
