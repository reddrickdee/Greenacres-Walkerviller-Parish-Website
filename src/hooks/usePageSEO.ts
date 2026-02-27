import { useEffect } from 'react';

interface PageSEOOptions {
    title: string;
    description: string;
    path?: string;
    ogImage?: string;
    noindex?: boolean;
}

const SITE_NAME = 'Greenacres Walkerville Catholic Parish';
const BASE_URL = 'https://www.gwparish.org.au';
const DEFAULT_OG_IMAGE = '/assets/source/hero_3.webp';

/**
 * Custom hook that manages per-page SEO meta tags via direct DOM manipulation.
 * Sets document title, meta description, Open Graph, and Twitter Card tags.
 * Tags are cleaned up on unmount to prevent stale data between navigations.
 */
export function usePageSEO({ title, description, path = '/', ogImage, noindex }: PageSEOOptions) {
    useEffect(() => {
        // --- Document title ---
        const prevTitle = document.title;
        document.title = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;

        // --- Helper to upsert a <meta> tag ---
        const createdTags: HTMLMetaElement[] = [];
        function setMeta(attr: 'name' | 'property', key: string, content: string) {
            let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute(attr, key);
                document.head.appendChild(el);
                createdTags.push(el);
            }
            el.setAttribute('content', content);
        }

        const fullUrl = `${BASE_URL}${path}`;
        const imageUrl = `${BASE_URL}${ogImage || DEFAULT_OG_IMAGE}`;

        // Standard meta
        setMeta('name', 'description', description);
        if (noindex) {
            setMeta('name', 'robots', 'noindex, nofollow');
        }

        // Open Graph
        setMeta('property', 'og:title', title);
        setMeta('property', 'og:description', description);
        setMeta('property', 'og:url', fullUrl);
        setMeta('property', 'og:image', imageUrl);
        setMeta('property', 'og:type', 'website');
        setMeta('property', 'og:site_name', SITE_NAME);
        setMeta('property', 'og:locale', 'en_AU');

        // Twitter Card
        setMeta('name', 'twitter:card', 'summary_large_image');
        setMeta('name', 'twitter:title', title);
        setMeta('name', 'twitter:description', description);
        setMeta('name', 'twitter:image', imageUrl);

        // Canonical link
        let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
        const createdCanonical = !canonical;
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', fullUrl);

        // Cleanup on unmount
        return () => {
            document.title = prevTitle;
            createdTags.forEach(tag => tag.remove());
            if (createdCanonical && canonical) canonical.remove();
        };
    }, [title, description, path, ogImage, noindex]);
}
