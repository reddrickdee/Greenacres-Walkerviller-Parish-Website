import { describe, it, expect } from 'vitest';
import { resolveLiturgicalColour, getColourInfo } from './liturgicalColour';
import type { LiturgicalColour, ColourOverrides } from './liturgicalColour';

describe('liturgicalColour', () => {
    describe('resolveLiturgicalColour', () => {
        it('returns green for ordinary season with no overrides', () => {
            const info = resolveLiturgicalColour('2026-07-15', 'ordinary');
            expect(info.colour).toBe('green');
            expect(info.label).toBe('Green');
            expect(info.cssColor).toBe('#2D5F2D');
        });

        it('returns purple for advent season', () => {
            const info = resolveLiturgicalColour('2026-12-10', 'advent');
            expect(info.colour).toBe('purple');
        });

        it('returns purple for lent season', () => {
            const info = resolveLiturgicalColour('2026-03-10', 'lent');
            expect(info.colour).toBe('purple');
        });

        it('returns white for easter season', () => {
            const info = resolveLiturgicalColour('2026-04-10', 'easter');
            expect(info.colour).toBe('white');
            expect(info.label).toBe('White / Gold');
        });

        it('returns white for christmas season', () => {
            const info = resolveLiturgicalColour('2026-12-26', 'christmas');
            expect(info.colour).toBe('white');
        });

        it('uses override when present', () => {
            const overrides: ColourOverrides = {
                '2026-07-15': 'red',
            };
            const info = resolveLiturgicalColour('2026-07-15', 'ordinary', overrides);
            expect(info.colour).toBe('red');
            expect(info.label).toBe('Red');
        });

        it('falls back to season when override date does not match', () => {
            const overrides: ColourOverrides = {
                '2026-07-16': 'red',
            };
            const info = resolveLiturgicalColour('2026-07-15', 'ordinary', overrides);
            expect(info.colour).toBe('green');
        });

        it('handles rose override', () => {
            const overrides: ColourOverrides = {
                '2026-12-13': 'rose',
            };
            const info = resolveLiturgicalColour('2026-12-13', 'advent', overrides);
            expect(info.colour).toBe('rose');
            expect(info.label).toBe('Rose');
        });

        it('falls back to green for unknown season key', () => {
            const info = resolveLiturgicalColour('2026-07-15', 'unknown_season');
            expect(info.colour).toBe('green');
        });
    });

    describe('getColourInfo', () => {
        const allColours: LiturgicalColour[] = ['white', 'green', 'purple', 'red', 'rose'];

        it.each(allColours)('returns info for %s', (colour) => {
            const info = getColourInfo(colour);
            expect(info.colour).toBe(colour);
            expect(info.label).toBeTruthy();
            expect(info.cssColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
            expect(info.textClass).toBeTruthy();
            expect(info.bgClass).toBeTruthy();
        });
    });
});
