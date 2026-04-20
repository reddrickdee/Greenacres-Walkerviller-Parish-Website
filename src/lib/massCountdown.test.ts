import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { 
    isCoreCountdownMass, 
    formatCountdown, 
    getSoonestCountdown 
} from './massCountdown';
import type { MassScheduleEntry } from '../types';

describe('massCountdown', () => {
    beforeAll(() => {
        vi.useFakeTimers();
        // 2026-04-20 is Monday
        vi.setSystemTime(new Date('2026-04-20T10:00:00Z'));
    });

    afterAll(() => {
        vi.useRealTimers();
    });

    it('formats countdown correctly', () => {
        expect(formatCountdown(90061000)).toBe('1d 1h 1m 1s');
        expect(formatCountdown(1000)).toBe('1s');
        expect(formatCountdown(0)).toBe('0s');
        expect(formatCountdown(-500)).toBe('0s');
    });

    it('identifies core countdown masses correctly', () => {
        const sundayMartin = {
            id: '1', church: 'St Martin', dayOfWeek: 7, startTime: '09:00', type: 'Sunday Mass'
        } as MassScheduleEntry;
        
        const ordinarily = {
            id: '2', church: 'St Martin', dayOfWeek: 7, startTime: '09:00', type: 'Sunday Mass', notes: 'Ordinariate'
        } as MassScheduleEntry;
        
        const weekday = {
            id: '3', church: 'St Monica', dayOfWeek: 3, startTime: '09:00', type: 'Weekday Mass'
        } as MassScheduleEntry;

        expect(isCoreCountdownMass(sundayMartin)).toBe(true);
        expect(isCoreCountdownMass(ordinarily)).toBe(false);
        expect(isCoreCountdownMass(weekday)).toBe(true);
    });

    it('finds the soonest countdown correctly', () => {
        const entries = [
            { id: '1', church: 'St Martin', dayOfWeek: 2, startTime: '18:00', type: 'Weekday Mass' } as MassScheduleEntry, // Tuesday
            { id: '2', church: 'St Monica', dayOfWeek: 3, startTime: '09:00', type: 'Weekday Mass' } as MassScheduleEntry, // Wednesday
        ];

        // April 20, 2026 is Monday
        const now = new Date('2026-04-20T10:00:00Z');
        const soonest = getSoonestCountdown(entries, now);

        expect(soonest?.entry.id).toBe('1');
    });
});
