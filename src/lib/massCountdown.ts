// ── Mass Countdown Utilities ─────────────────────────────────────────────────
// Pure time calculations – no React dependency.

import type { MassScheduleEntry } from '../types';

// ── Constants ────────────────────────────────────────────────────────────────

export const PARISH_TIME_ZONE = 'Australia/Adelaide';

// ── Types ────────────────────────────────────────────────────────────────────

export interface MassCountdown {
    /** The next occurrence as a UTC Date. */
    nextStart: Date;
    /** Milliseconds until that occurrence. */
    msUntil: number;
    /** Human-readable display string, e.g. "2d 4h 15m 30s". */
    display: string;
}

export interface SoonestResult {
    entry: MassScheduleEntry;
    countdown: MassCountdown;
}

export const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

// ── Filter helpers ───────────────────────────────────────────────────────────

/** Weekday masses (Tue / Wed / Thu). */
export function isWeekdayMass(e: MassScheduleEntry): boolean {
    return e.type === 'Weekday Mass';
}

/** Saturday Vigil at St Monica's. */
export function isSaturdayMonicaMass(e: MassScheduleEntry): boolean {
    return e.dayOfWeek === 6 && e.church.includes('Monica');
}

/** Sunday Mass at St Martin's (excludes Ordinariate). */
export function isSundayMartinMass(e: MassScheduleEntry): boolean {
    return (
        e.dayOfWeek === 7 &&
        e.church.includes('Martin') &&
        !(e.notes?.toLowerCase().includes('ordinariate'))
    );
}

/** Any mass that should get a countdown timer. */
export function isCoreCountdownMass(e: MassScheduleEntry): boolean {
    return isWeekdayMass(e) || isSaturdayMonicaMass(e) || isSundayMartinMass(e);
}

// ── Timezone helper ──────────────────────────────────────────────────────────

interface ZonedParts {
    year: number;
    month: number;   // 1-indexed
    day: number;
    hour: number;
    minute: number;
    /** JS weekday 0=Sun … 6=Sat */
    jsWeekday: number;
}

/**
 * Break a UTC timestamp into Adelaide wall-clock parts using Intl.
 * This correctly handles DST transitions.
 */
function getZonedParts(date: Date, tz: string): ZonedParts {
    const fmt = new Intl.DateTimeFormat('en-AU', {
        timeZone: tz,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        weekday: 'short',
        hour12: false,
    });
    const parts = Object.fromEntries(
        fmt.formatToParts(date).map(p => [p.type, p.value])
    );

    const weekdayMap: Record<string, number> = {
        Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
    };

    return {
        year: Number(parts.year),
        month: Number(parts.month),
        day: Number(parts.day),
        hour: Number(parts.hour),
        minute: Number(parts.minute),
        jsWeekday: weekdayMap[parts.weekday] ?? 0,
    };
}

/**
 * Convert a dayOfWeek value (1=Mon … 7=Sun) to JS weekday (0=Sun … 6=Sat).
 */
function isoToJsWeekday(isoDow: number): number {
    return isoDow === 7 ? 0 : isoDow;
}

// ── Core countdown logic ─────────────────────────────────────────────────────

/**
 * Given a mass entry and the current time, compute the next occurrence
 * of that mass in the given timezone.
 *
 * Returns a `Date` representing the next start in UTC, or `null` if the
 * entry's time is invalid.
 */
export function getNextOccurrence(
    entry: MassScheduleEntry,
    now: Date,
    tz: string = PARISH_TIME_ZONE,
): Date | null {
    // Parse startTime
    const match = entry.startTime?.match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return null;
    const massHour = Number(match[1]);
    const massMinute = Number(match[2]);

    const targetJsDay = isoToJsWeekday(entry.dayOfWeek);
    const zoned = getZonedParts(now, tz);

    // How many days until the next matching weekday?
    let daysAhead = (targetJsDay - zoned.jsWeekday + 7) % 7;

    // If same weekday, check if the mass has already passed today
    if (daysAhead === 0) {
        const nowMinutes = zoned.hour * 60 + zoned.minute;
        const massMinutes = massHour * 60 + massMinute;
        if (nowMinutes >= massMinutes) {
            daysAhead = 7; // next week
        }
    }

    // Build target in Adelaide wall-clock, then convert to UTC
    // by creating a date string and parsing it with the timezone offset.
    const targetDate = new Date(now.getTime() + daysAhead * 86_400_000);
    const targetParts = getZonedParts(targetDate, tz);

    // Construct an ISO string at the desired wall-clock time in the timezone.
    // We use a trick: create a formatter that gives us the UTC offset for that
    // day, then build the date from wall-clock + offset.
    const offsetFormatter = new Intl.DateTimeFormat('en-AU', {
        timeZone: tz,
        timeZoneName: 'longOffset',
    });
    const offsetParts = Object.fromEntries(
        offsetFormatter.formatToParts(targetDate).map(p => [p.type, p.value])
    );
    // timeZoneName looks like "GMT+10:30" or "GMT+09:30"
    const offsetStr = offsetParts.timeZoneName ?? 'GMT+09:30';
    const utcOffset = offsetStr.replace('GMT', '');

    const pad = (n: number) => String(n).padStart(2, '0');
    const isoStr = `${targetParts.year}-${pad(targetParts.month)}-${pad(targetParts.day)}T${pad(massHour)}:${pad(massMinute)}:00${utcOffset}`;

    const result = new Date(isoStr);
    return isNaN(result.getTime()) ? null : result;
}

/**
 * Format a millisecond duration as a human-readable countdown.
 * Omits zero-leading segments: "4h 15m 30s" not "0d 4h 15m 30s".
 * Always shows at least "0s" for very small values.
 */
export function formatCountdown(ms: number): string {
    if (ms <= 0) return '0s';

    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts: string[] = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

    return parts.join(' ');
}

/**
 * Get a full countdown object for a single mass entry.
 */
export function getCountdown(
    entry: MassScheduleEntry,
    now: Date,
    tz: string = PARISH_TIME_ZONE,
): MassCountdown | null {
    const nextStart = getNextOccurrence(entry, now, tz);
    if (!nextStart) return null;

    const msUntil = nextStart.getTime() - now.getTime();
    return {
        nextStart,
        msUntil: Math.max(0, msUntil),
        display: formatCountdown(Math.max(0, msUntil)),
    };
}

/**
 * From a list of entries, return the countdown with the smallest msUntil,
 * along with the winning entry so callers can show day/time info.
 */
export function getSoonestCountdown(
    entries: MassScheduleEntry[],
    now: Date,
    tz: string = PARISH_TIME_ZONE,
): SoonestResult | null {
    let best: SoonestResult | null = null;
    for (const entry of entries) {
        const cd = getCountdown(entry, now, tz);
        if (cd && (best === null || cd.msUntil < best.countdown.msUntil)) {
            best = { entry, countdown: cd };
        }
    }
    return best;
}
