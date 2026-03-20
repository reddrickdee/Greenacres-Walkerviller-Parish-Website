import { describe, it, expect } from 'vitest';
import {
    formatCountdown,
    isWeekdayMass,
    isSaturdayMonicaMass,
    isSundayMartinMass,
    isCoreCountdownMass,
    getNextOccurrence,
    getSoonestCountdown,
    PARISH_TIME_ZONE,
} from '../../lib/massCountdown';
import { buildMassEntry } from '../../test/fixtures';

// ── formatCountdown ──────────────────────────────────────────────────────────

describe('formatCountdown', () => {
    it('returns "0s" for zero or negative ms', () => {
        expect(formatCountdown(0)).toBe('0s');
        expect(formatCountdown(-1000)).toBe('0s');
    });

    it('formats seconds only', () => {
        expect(formatCountdown(45_000)).toBe('45s');
    });

    it('formats minutes and seconds', () => {
        expect(formatCountdown(125_000)).toBe('2m 5s');
    });

    it('formats hours, minutes, and seconds', () => {
        expect(formatCountdown(3_723_000)).toBe('1h 2m 3s');
    });

    it('formats days', () => {
        expect(formatCountdown(90_061_000)).toBe('1d 1h 1m 1s');
    });

    it('omits zero-value segments', () => {
        expect(formatCountdown(86_400_000)).toBe('1d');
        expect(formatCountdown(3_600_000)).toBe('1h');
        expect(formatCountdown(60_000)).toBe('1m');
    });
});

// ── Filter helpers ───────────────────────────────────────────────────────────

describe('isWeekdayMass', () => {
    it('returns true for type "Weekday Mass"', () => {
        expect(isWeekdayMass(buildMassEntry({ type: 'Weekday Mass' }))).toBe(true);
    });

    it('returns false for other types', () => {
        expect(isWeekdayMass(buildMassEntry({ type: 'Vigil Mass' }))).toBe(false);
        expect(isWeekdayMass(buildMassEntry({ type: 'Sunday Mass' }))).toBe(false);
    });
});

describe('isSaturdayMonicaMass', () => {
    it('returns true for Saturday at St Monica\'s', () => {
        expect(isSaturdayMonicaMass(buildMassEntry({ dayOfWeek: 6, church: "St Monica's Walkerville" }))).toBe(true);
    });

    it('returns false for Saturday at St Martin\'s', () => {
        expect(isSaturdayMonicaMass(buildMassEntry({ dayOfWeek: 6, church: "St Martin's Greenacres" }))).toBe(false);
    });

    it('returns false for Sunday at St Monica\'s', () => {
        expect(isSaturdayMonicaMass(buildMassEntry({ dayOfWeek: 7, church: "St Monica's Walkerville" }))).toBe(false);
    });
});

describe('isSundayMartinMass', () => {
    it('returns true for Sunday at St Martin\'s without Ordinariate', () => {
        expect(isSundayMartinMass(buildMassEntry({ dayOfWeek: 7, church: "St Martin's Greenacres" }))).toBe(true);
    });

    it('returns false when notes include "ordinariate"', () => {
        expect(isSundayMartinMass(buildMassEntry({
            dayOfWeek: 7,
            church: "St Martin's Greenacres",
            notes: 'Ordinariate community',
        }))).toBe(false);
    });

    it('returns false for weekday at St Martin\'s', () => {
        expect(isSundayMartinMass(buildMassEntry({ dayOfWeek: 3, church: "St Martin's Greenacres" }))).toBe(false);
    });
});

describe('isCoreCountdownMass', () => {
    it('returns true for any of the three core types', () => {
        expect(isCoreCountdownMass(buildMassEntry({ type: 'Weekday Mass' }))).toBe(true);
        expect(isCoreCountdownMass(buildMassEntry({ dayOfWeek: 6, church: "St Monica's Walkerville" }))).toBe(true);
        expect(isCoreCountdownMass(buildMassEntry({ dayOfWeek: 7, church: "St Martin's Greenacres" }))).toBe(true);
    });

    it('returns false for non-core types', () => {
        expect(isCoreCountdownMass(buildMassEntry({
            type: 'Vigil Mass',
            dayOfWeek: 3,
            church: 'Unknown Church',
        }))).toBe(false);
    });
});

// ── getNextOccurrence ────────────────────────────────────────────────────────

describe('getNextOccurrence', () => {
    it('returns null for invalid startTime', () => {
        const entry = buildMassEntry({ startTime: 'invalid' });
        expect(getNextOccurrence(entry, new Date())).toBeNull();
    });

    it('returns null for empty startTime', () => {
        const entry = buildMassEntry({ startTime: '' });
        expect(getNextOccurrence(entry, new Date())).toBeNull();
    });

    it('returns a Date in the future for a valid entry', () => {
        const now = new Date('2026-03-20T08:00:00+10:30'); // Friday ACDT
        const entry = buildMassEntry({ dayOfWeek: 6, startTime: '18:00' }); // Saturday
        const result = getNextOccurrence(entry, now, PARISH_TIME_ZONE);
        expect(result).toBeInstanceOf(Date);
        expect(result!.getTime()).toBeGreaterThan(now.getTime());
    });

    it('returns next week if same-day mass has passed', () => {
        // Saturday 19:00 ACDT — Saturday 18:00 mass already passed
        const now = new Date('2026-03-21T19:00:00+10:30');
        const entry = buildMassEntry({ dayOfWeek: 6, startTime: '18:00' });
        const result = getNextOccurrence(entry, now, PARISH_TIME_ZONE);
        expect(result).not.toBeNull();
        // Should be ~7 days later
        const diffDays = (result!.getTime() - now.getTime()) / 86_400_000;
        expect(diffDays).toBeGreaterThanOrEqual(6.5);
        expect(diffDays).toBeLessThanOrEqual(7.5);
    });
});

// ── getSoonestCountdown ──────────────────────────────────────────────────────

describe('getSoonestCountdown', () => {
    it('returns null for an empty entries list', () => {
        expect(getSoonestCountdown([], new Date())).toBeNull();
    });

    it('picks the entry with the smallest msUntil', () => {
        const now = new Date('2026-03-20T08:00:00+10:30'); // Friday
        const entries = [
            buildMassEntry({ id: 'sat', dayOfWeek: 6, startTime: '18:00', church: "St Monica's Walkerville" }),
            buildMassEntry({ id: 'sun', dayOfWeek: 7, startTime: '09:30', church: "St Martin's Greenacres" }),
        ];
        const result = getSoonestCountdown(entries, now, PARISH_TIME_ZONE);
        expect(result).not.toBeNull();
        // Saturday 18:00 is sooner than Sunday 09:30 from Friday 08:00
        expect(result!.entry.id).toBe('sat');
    });

    it('includes a non-empty display string', () => {
        const now = new Date('2026-03-20T08:00:00+10:30');
        const entries = [buildMassEntry({ dayOfWeek: 6, startTime: '18:00' })];
        const result = getSoonestCountdown(entries, now, PARISH_TIME_ZONE);
        expect(result).not.toBeNull();
        expect(result!.countdown.display.length).toBeGreaterThan(0);
    });
});
