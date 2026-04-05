import { useMemo } from 'react';

/**
 * Liturgical seasons for the Roman Catholic calendar.
 *
 * This hook uses date-range logic based on Easter computation
 * (Computus algorithm) to determine the current liturgical season,
 * returning the season name, Tailwind color token, and CSS accent color.
 *
 * Seasons (simplified, non-diocesan):
 *  - Advent: 4 Sundays before Christmas → Dec 24
 *  - Christmas: Dec 25 → Baptism of the Lord (Sun after Epiphany/Jan 6)
 *  - Ordinary Time I: After Baptism → Shrove Tuesday
 *  - Lent: Ash Wednesday → Holy Thursday
 *  - Easter Triduum + Easter: Good Friday → Pentecost Sunday
 *  - Ordinary Time II: After Pentecost → Saturday before Advent
 */

export type LiturgicalSeason =
    | 'advent'
    | 'christmas'
    | 'ordinary'
    | 'lent'
    | 'easter';

export interface LiturgicalSeasonInfo {
    /** Liturgical season key. */
    season: LiturgicalSeason;
    /** Human-readable season name. */
    label: string;
    /** Tailwind text color class for accents. */
    colorClass: string;
    /** Tailwind bg color class for subtle elements. */
    bgClass: string;
    /** CSS color value for inline use. */
    cssColor: string;
}

// ── Easter date via the Anonymous Gregorian Algorithm (Computus) ──────────
function computeEaster(year: number): Date {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
}

function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

/** First Sunday on or after a given date. */
function nextSunday(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    if (day !== 0) d.setDate(d.getDate() + (7 - day));
    return d;
}

/** Fourth Sunday before Dec 25 = start of Advent. */
function adventStart(year: number): Date {
    const christmas = new Date(year, 11, 25);
    const christmasDay = christmas.getDay();
    // Days back to the previous Sunday
    const daysBack = christmasDay === 0 ? 7 : christmasDay;
    const fourthSunday = new Date(year, 11, 25 - daysBack - 21);
    return fourthSunday;
}

function isBetween(date: Date, start: Date, end: Date): boolean {
    const d = date.getTime();
    return d >= start.getTime() && d <= end.getTime();
}

function startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function determineSeason(now: Date): LiturgicalSeason {
    const today = startOfDay(now);
    const year = today.getFullYear();

    // Advent of current year
    const advent = adventStart(year);
    if (today >= advent) {
        // We're in Advent or Christmas of current year
        const christmas = new Date(year, 11, 25);
        if (today < christmas) return 'advent';

        // Christmas season: Dec 25 → Baptism of the Lord (Sun after Jan 6)
        const epiphany = new Date(year + 1, 0, 6);
        const baptism = nextSunday(addDays(epiphany, 1));
        if (isBetween(today, christmas, baptism)) return 'christmas';

        // We're past Christmas but still in the same year's Advent calculation
        // This shouldn't happen in practice since Advent < Christmas
    }

    // Easter of current year
    const easter = computeEaster(year);
    const ashWednesday = addDays(easter, -46);
    const holyThursday = addDays(easter, -3);
    const pentecost = addDays(easter, 49);

    // Lent: Ash Wednesday → Holy Thursday
    if (isBetween(today, ashWednesday, holyThursday)) return 'lent';

    // Easter: Good Friday → Pentecost
    if (isBetween(today, addDays(easter, -2), pentecost)) return 'easter';

    // Check if we're in Christmas season from *previous* year
    const prevEpiphany = new Date(year, 0, 6);
    const prevBaptism = nextSunday(addDays(prevEpiphany, 1));
    const prevChristmas = new Date(year - 1, 11, 25);
    if (isBetween(today, prevChristmas, prevBaptism)) return 'christmas';

    // Check if Advent of current year hasn't started but we're past Pentecost
    if (today >= advent) return 'advent';

    // Everything else is Ordinary Time
    return 'ordinary';
}

const SEASON_INFO: Record<LiturgicalSeason, Omit<LiturgicalSeasonInfo, 'season'>> = {
    advent: {
        label: 'Advent',
        colorClass: 'text-parish-advent',
        bgClass: 'bg-parish-advent/10',
        cssColor: '#6B3FA0',
    },
    christmas: {
        label: 'Christmas',
        colorClass: 'text-parish-brass',
        bgClass: 'bg-parish-brass/10',
        cssColor: '#C5A55A',
    },
    ordinary: {
        label: 'Ordinary Time',
        colorClass: 'text-parish-ordinary',
        bgClass: 'bg-parish-ordinary/10',
        cssColor: '#2D5F2D',
    },
    lent: {
        label: 'Lent',
        colorClass: 'text-parish-advent',
        bgClass: 'bg-parish-advent/10',
        cssColor: '#6B3FA0',
    },
    easter: {
        label: 'Easter',
        colorClass: 'text-parish-brass',
        bgClass: 'bg-parish-brass/10',
        cssColor: '#C5A55A',
    },
};

/**
 * Returns the current liturgical season with display metadata.
 * Recalculates only when the date changes (memoized).
 */
export function useLiturgicalSeason(now?: Date): LiturgicalSeasonInfo {
    return useMemo(() => {
        const date = now ?? new Date();
        const season = determineSeason(date);
        return { season, ...SEASON_INFO[season] };
    }, [now]);
}
