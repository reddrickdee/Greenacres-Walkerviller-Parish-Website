import { describe, expect, it } from 'vitest';
import {
    getSourceBadge,
    orderReflectionSources,
    shouldRenderExcerpt,
    validateReflectionSources,
    type ReflectionSource,
} from './reflectionSources';

const validSource: ReflectionSource = {
    name: 'Pray.com.au Daily Prayer',
    url: 'https://www.pray.com.au/daily-prayer/',
    kind: 'daily-prayer',
    region: 'Australia',
    description: 'Australian daily prayer and Gospel reflection.',
    permissionStatus: 'link_only',
};

describe('reflectionSources', () => {
    it('validates and orders Australian sources before global sources', () => {
        const result = validateReflectionSources({
            sources: [
                {
                    ...validSource,
                    name: 'Sacred Space',
                    url: 'https://www.sacredspace.ie/daily-prayer',
                    region: 'Global',
                },
                validSource,
            ],
        });

        expect(result.errors).toEqual([]);
        expect(result.sources.map(source => source.region)).toEqual(['Australia', 'Global']);
    });

    it('excludes malformed sources and keeps valid ones', () => {
        const result = validateReflectionSources({
            sources: [
                validSource,
                {
                    name: 'Broken',
                    url: 'not-a-url',
                    kind: 'newsletter',
                    region: 'Australia',
                    description: 'Invalid source.',
                    permissionStatus: 'link_only',
                },
            ],
        });

        expect(result.sources).toHaveLength(1);
        expect(result.sources[0].name).toBe('Pray.com.au Daily Prayer');
        expect(result.errors.map(error => error.field)).toEqual(['url', 'kind']);
    });

    it('only renders excerpts with approved permission', () => {
        expect(shouldRenderExcerpt({ ...validSource, excerpt: 'Hidden excerpt.' })).toBe(false);
        expect(shouldRenderExcerpt({
            ...validSource,
            permissionStatus: 'approved',
            excerpt: 'Approved excerpt.',
        })).toBe(true);
    });

    it('derives a single visible badge for sources without a custom badge', () => {
        expect(getSourceBadge(validSource)).toBe('Australian daily prayer source');
        expect(getSourceBadge({ ...validSource, region: 'Global' })).toBe('Global daily prayer source');
        expect(getSourceBadge({ ...validSource, badge: 'Australian Jesuit prayer' })).toBe('Australian Jesuit prayer');
    });

    it('preserves original order within the same region', () => {
        const ordered = orderReflectionSources([
            { ...validSource, name: 'Second Australian source' },
            { ...validSource, name: 'First Australian source' },
        ]);

        expect(ordered.map(source => source.name)).toEqual([
            'Second Australian source',
            'First Australian source',
        ]);
    });
});
