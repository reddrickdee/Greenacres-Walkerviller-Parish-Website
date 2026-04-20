// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useLiturgicalSeason } from './useLiturgicalSeason';

describe('useLiturgicalSeason', () => {
    it('returns christmas season on Christmas Day', () => {
        const { result } = renderHook(() => useLiturgicalSeason(new Date('2026-12-25T10:00:00Z')));
        expect(result.current.season).toBe('christmas');
    });

    it('returns advent season before Christmas', () => {
        // Advent starts 4 Sundays before Dec 25. For 2026, Dec 25 is Friday, so Sunday before is Dec 20, 13, 6, Nov 29.
        const { result } = renderHook(() => useLiturgicalSeason(new Date('2026-12-01T10:00:00Z')));
        expect(result.current.season).toBe('advent');
    });

    it('returns easter season on Easter Sunday', () => {
        // 2026 Easter is April 5
        const { result } = renderHook(() => useLiturgicalSeason(new Date('2026-04-05T10:00:00Z')));
        expect(result.current.season).toBe('easter');
    });

    it('returns ordinary time in November', () => {
        const { result } = renderHook(() => useLiturgicalSeason(new Date('2026-11-01T10:00:00Z')));
        expect(result.current.season).toBe('ordinary');
    });
});
