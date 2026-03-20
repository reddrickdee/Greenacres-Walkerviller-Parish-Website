import { describe, it, expect } from 'vitest';
import { buildSEOTags } from '../../lib/seo';

const SITE_NAME = 'Greenacres Walkerville Catholic Parish';
const BASE_URL = 'https://www.gwparish.org.au';

describe('buildSEOTags', () => {
    it('appends site name to title unless already the site name', () => {
        const result = buildSEOTags({ title: 'Mass Times', description: 'test' });
        expect(result.title).toBe(`Mass Times | ${SITE_NAME}`);
    });

    it('does not duplicate site name when title equals site name', () => {
        const result = buildSEOTags({ title: SITE_NAME, description: 'test' });
        expect(result.title).toBe(SITE_NAME);
    });

    it('builds canonical URL from path', () => {
        const result = buildSEOTags({ title: 'About', description: 'test', path: '/about' });
        expect(result.canonical).toBe(`${BASE_URL}/about`);
    });

    it('defaults path to /', () => {
        const result = buildSEOTags({ title: 'Home', description: 'test' });
        expect(result.canonical).toBe(`${BASE_URL}/`);
    });

    it('uses custom ogImage when provided', () => {
        const result = buildSEOTags({
            title: 'Gallery',
            description: 'test',
            ogImage: '/assets/gallery.webp',
        });
        expect(result.meta['og:image']).toBe(`${BASE_URL}/assets/gallery.webp`);
        expect(result.meta['twitter:image']).toBe(`${BASE_URL}/assets/gallery.webp`);
    });

    it('falls back to default OG image when ogImage is not provided', () => {
        const result = buildSEOTags({ title: 'Home', description: 'test' });
        expect(result.meta['og:image']).toContain('/assets/source/hero_3.webp');
    });

    it('includes the description in both standard and OG meta', () => {
        const result = buildSEOTags({ title: 'Test', description: 'A parish in Adelaide.' });
        expect(result.meta.description).toBe('A parish in Adelaide.');
        expect(result.meta['og:description']).toBe('A parish in Adelaide.');
        expect(result.meta['twitter:description']).toBe('A parish in Adelaide.');
    });

    it('sets og:type to "website"', () => {
        const result = buildSEOTags({ title: 'Test', description: 'test' });
        expect(result.meta['og:type']).toBe('website');
    });

    it('sets og:locale to "en_AU"', () => {
        const result = buildSEOTags({ title: 'Test', description: 'test' });
        expect(result.meta['og:locale']).toBe('en_AU');
    });

    it('adds robots noindex meta when noindex is true', () => {
        const result = buildSEOTags({ title: 'Admin', description: 'test', noindex: true });
        expect(result.meta.robots).toBe('noindex, nofollow');
    });

    it('does not include robots meta when noindex is false or unset', () => {
        const result = buildSEOTags({ title: 'Public', description: 'test' });
        expect(result.meta.robots).toBeUndefined();
    });

    it('includes twitter:card as summary_large_image', () => {
        const result = buildSEOTags({ title: 'Test', description: 'test' });
        expect(result.meta['twitter:card']).toBe('summary_large_image');
    });
});
