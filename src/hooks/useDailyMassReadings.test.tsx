// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDailyMassReadings, type UniversalisData } from './useDailyMassReadings';

/* ------------------------------------------------------------------ */
/*  Stub adelaideDate so tests don't depend on wall-clock timezone      */
/* ------------------------------------------------------------------ */
vi.mock('../lib/adelaideDate', () => ({
    getAdelaideDateKey: () => '20260510',
    buildUniversalisUrl: (dateKey: string, cb: string) =>
        `https://universalis.com/Australia.Adelaide/${dateKey}/jsonpmass.js?callback=${cb}`,
}));

/* ---------- helpers ---------- */

/** Minimal valid payload the JSONP callback would deliver. */
const fakePayload: UniversalisData = {
    number: 1,
    date: '2026-05-10',
    day: 'Sunday',
    Mass_R1: { source: 'Acts 1:1-11', text: '…' },
    Mass_Ps: { source: 'Ps 47:2-3', text: '…' },
    Mass_G: { source: 'Luke 24:46-53', text: '…' },
    copyright: { text: '© 2026' },
};

/** Fire the JSONP global callback that the hook registered. */
function fireJsonpCallback(payload: UniversalisData = fakePayload) {
    const cbName = Object.keys(window).find(k => k.startsWith('__universalisCb_'));
    if (!cbName) throw new Error('No JSONP callback found on window');
    (window as any)[cbName](payload);
}

/** Simulate the injected <script> firing its onerror. */
function fireScriptError() {
    const script = document.head.querySelector('script[id^="universalis-jsonp-"]');
    if (!script) throw new Error('No JSONP script found in <head>');
    script.dispatchEvent(new Event('error'));
}

/* ------------------------------------------------------------------ */
/*  Tests                                                              */
/* ------------------------------------------------------------------ */

describe('useDailyMassReadings', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        // Clean up any leftover scripts
        document.head
            .querySelectorAll('script[id^="universalis-jsonp-"]')
            .forEach(s => s.remove());
        // Clean up any leftover global callbacks
        Object.keys(window)
            .filter(k => k.startsWith('__universalisCb_'))
            .forEach(k => delete (window as any)[k]);
    });

    it('starts in loading status after mount', () => {
        const { result } = renderHook(() => useDailyMassReadings());
        expect(result.current.status).toBe('loading');
        expect(result.current.data).toBeNull();
    });

    it('transitions to success when JSONP callback fires', () => {
        const { result } = renderHook(() => useDailyMassReadings());

        act(() => fireJsonpCallback());

        expect(result.current.status).toBe('success');
        expect(result.current.data).toEqual(fakePayload);
    });

    it('transitions to error when script onerror fires', () => {
        const { result } = renderHook(() => useDailyMassReadings());

        act(() => fireScriptError());

        expect(result.current.status).toBe('error');
        expect(result.current.data).toBeNull();
    });

    it('transitions to timeout after 10 s when script never loads or errors', () => {
        const { result } = renderHook(() => useDailyMassReadings());

        // Advance just under 10 s — should still be loading
        act(() => vi.advanceTimersByTime(9_999));
        expect(result.current.status).toBe('loading');

        // Advance past the 10 s mark — should timeout
        act(() => vi.advanceTimersByTime(1));
        expect(result.current.status).toBe('timeout');
    });

    it('does NOT timeout if JSONP callback fires before 12 s', () => {
        const { result } = renderHook(() => useDailyMassReadings());

        // Callback fires at 5 s
        act(() => vi.advanceTimersByTime(5_000));
        act(() => fireJsonpCallback());
        expect(result.current.status).toBe('success');

        // Advance past 10 s — status must stay 'success'
        act(() => vi.advanceTimersByTime(6_000));
        expect(result.current.status).toBe('success');
    });

    it('does NOT timeout if script errors before 12 s', () => {
        const { result } = renderHook(() => useDailyMassReadings());

        act(() => fireScriptError());
        expect(result.current.status).toBe('error');

        act(() => vi.advanceTimersByTime(15_000));
        expect(result.current.status).toBe('error');
    });

    it('keeps stale callback harmless on unmount and then removes it', () => {
        const { unmount } = renderHook(() => useDailyMassReadings());

        const hasCb = () => Object.keys(window).some(k => k.startsWith('__universalisCb_'));
        expect(hasCb()).toBe(true);

        const cbName = Object.keys(window).find(k => k.startsWith('__universalisCb_'));
        unmount();
        expect(hasCb()).toBe(true);

        act(() => {
            (window as any)[cbName!](fakePayload);
        });
        expect(hasCb()).toBe(false);
    });
});
