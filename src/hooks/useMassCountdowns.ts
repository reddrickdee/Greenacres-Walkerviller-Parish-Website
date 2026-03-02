import { useState, useEffect, useMemo } from 'react';
import type { MassScheduleEntry } from '../types';
import { getCountdown, type MassCountdown, PARISH_TIME_ZONE } from '../lib/massCountdown';

/** Refresh cadence – 1 second (seconds-precision display). */
const TICK_MS = 1_000;

interface UseMassCountdownsResult {
    /** Current time (ticks every 30s). */
    now: Date;
    /** Countdown keyed by entry `id`. `null` if entry is invalid. */
    countdownsById: Record<string, MassCountdown | null>;
}

/**
 * Shared hook that ticks every 30s and computes countdowns for each
 * supplied mass schedule entry.
 */
export function useMassCountdowns(entries: MassScheduleEntry[]): UseMassCountdownsResult {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), TICK_MS);
        return () => clearInterval(id);
    }, []);

    // Stable key for memoisation – changes only when the entry set changes.
    const entryIds = useMemo(() => entries.map(e => e.id).join(','), [entries]);

    const countdownsById = useMemo(() => {
        const map: Record<string, MassCountdown | null> = {};
        for (const entry of entries) {
            map[entry.id] = getCountdown(entry, now, PARISH_TIME_ZONE);
        }
        return map;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [now, entryIds]);

    return { now, countdownsById };
}
