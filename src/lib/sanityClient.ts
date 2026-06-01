/**
 * Sanity CMS client — connects to the Sanity Content Lake.
 *
 * The public client uses the CDN for fast cached reads (no auth token needed).
 * For the Sanity Studio or server-side mutations, use a separate authenticated client.
 *
 * Environment-gated: if VITE_SANITY_PROJECT_ID is not set, the client
 * is still created but queries will fail gracefully via useSanityQuery.
 */
import { createClient, type ClientConfig } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';


// ── Configuration ─────────────────────────────────────────────────────────────

const config: ClientConfig = {
    projectId: import.meta.env.VITE_SANITY_PROJECT_ID || '',
    dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
    apiVersion: '2026-06-01',
    useCdn: true, // fast, cached reads — perfect for a public parish site
};

/** Whether Sanity is configured (env vars present). */
export const isSanityConfigured = Boolean(config.projectId);

/** Public Sanity client (read-only, CDN-cached). */
export const sanityClient = createClient(config);

// ── Image URL Builder ─────────────────────────────────────────────────────────

const builder = imageUrlBuilder(sanityClient);

/**
 * Generate optimised image URLs from Sanity image assets.
 *
 * @example
 * ```tsx
 * <img src={urlFor(event.image).width(600).height(400).url()} alt={event.title} />
 * ```
 */
export function urlFor(source: any) {
    return builder.image(source);
}
