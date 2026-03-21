/**
 * MSW test server — starts/stops an in-process HTTP interceptor for vitest.
 *
 * Import this wherever you need MSW in a test:
 *   import { server } from '../test/msw/server';
 *   beforeAll(() => server.listen());
 *   afterEach(() => server.resetHandlers());
 *   afterAll(() => server.close());
 *
 * Or let the global setup handle it (see setup.ts integration).
 */
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
