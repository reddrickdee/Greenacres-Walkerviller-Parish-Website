// ── Pure SEO metadata builder ────────────────────────────────────────────────
// Deterministic string generation extracted from usePageSEO so it can be
// unit-tested without DOM manipulation.

export interface SEOInput {
    title: string;
    description: string;
    path?: string;
    ogImage?: string;
    noindex?: boolean;
}

export interface SEOTags {
    title: string;
    meta: Record<string, string>;
    canonical: string;
}

const SITE_NAME = 'Greenacres Walkerville Catholic Parish';
const BASE_URL = 'https://www.gwparish.org.au';
const DEFAULT_OG_IMAGE = '/assets/source/hero_3.webp';

/**
 * Build all SEO tag values from a set of page inputs.
 * Returns plain data; the calling hook applies them to the DOM.
 */
export function buildSEOTags({
    title,
    description,
    path = '/',
    ogImage,
    noindex,
}: SEOInput): SEOTags {
    const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
    const fullUrl = `${BASE_URL}${path}`;
    const imageUrl = `${BASE_URL}${ogImage || DEFAULT_OG_IMAGE}`;

    const meta: Record<string, string> = {
        description,
        'og:title': title,
        'og:description': description,
        'og:url': fullUrl,
        'og:image': imageUrl,
        'og:type': 'website',
        'og:site_name': SITE_NAME,
        'og:locale': 'en_AU',
        'twitter:card': 'summary_large_image',
        'twitter:title': title,
        'twitter:description': description,
        'twitter:image': imageUrl,
    };

    if (noindex) {
        meta.robots = 'noindex, nofollow';
    }

    return { title: fullTitle, meta, canonical: fullUrl };
}
