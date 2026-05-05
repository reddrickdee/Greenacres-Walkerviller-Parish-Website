import { describe, it, expect } from 'vitest';
import { getAdelaideDateKey, getAdelaideISODate, buildUniversalisUrl } from './adelaideDate';

describe('adelaideDate', () => {
    describe('getAdelaideDateKey', () => {
        it('returns an 8-digit YYYYMMDD string', () => {
            const key = getAdelaideDateKey();
            expect(key).toMatch(/^\d{8}$/);
        });

        it('returns a valid date range', () => {
            const key = getAdelaideDateKey();
            const year = parseInt(key.slice(0, 4));
            const month = parseInt(key.slice(4, 6));
            const day = parseInt(key.slice(6, 8));
            expect(year).toBeGreaterThanOrEqual(2024);
            expect(month).toBeGreaterThanOrEqual(1);
            expect(month).toBeLessThanOrEqual(12);
            expect(day).toBeGreaterThanOrEqual(1);
            expect(day).toBeLessThanOrEqual(31);
        });
    });

    describe('getAdelaideISODate', () => {
        it('returns YYYY-MM-DD format', () => {
            const iso = getAdelaideISODate();
            expect(iso).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        });

        it('is consistent with getAdelaideDateKey', () => {
            const key = getAdelaideDateKey();
            const iso = getAdelaideISODate();
            expect(iso).toBe(`${key.slice(0, 4)}-${key.slice(4, 6)}-${key.slice(6, 8)}`);
        });
    });

    describe('buildUniversalisUrl', () => {
        it('builds URL with Adelaide calendar and callback', () => {
            const url = buildUniversalisUrl('20260505', 'myCallback');
            expect(url).toBe(
                'https://universalis.com/Australia.Adelaide/20260505/jsonpmass.js?callback=myCallback',
            );
        });

        it('encodes the date and callback into the URL', () => {
            const url = buildUniversalisUrl('20261225', 'cb_42');
            expect(url).toContain('/20261225/');
            expect(url).toContain('callback=cb_42');
            expect(url).toContain('Australia.Adelaide');
        });
    });
});
