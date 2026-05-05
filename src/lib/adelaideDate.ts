/**
 * Adelaide-timezone date helpers.
 *
 * "Today" is always resolved in Australia/Adelaide so the parish calendar
 * matches regardless of the visitor's local timezone.
 */

const ADELAIDE_TZ = 'Australia/Adelaide';

/** Returns YYYYMMDD for "today" in Adelaide. */
export function getAdelaideDateKey(): string {
    const parts = new Intl.DateTimeFormat('en-AU', {
        timeZone: ADELAIDE_TZ,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(new Date());

    const year = parts.find(p => p.type === 'year')!.value;
    const month = parts.find(p => p.type === 'month')!.value;
    const day = parts.find(p => p.type === 'day')!.value;
    return `${year}${month}${day}`;
}

/** Returns ISO date string YYYY-MM-DD for "today" in Adelaide. */
export function getAdelaideISODate(): string {
    const key = getAdelaideDateKey();
    return `${key.slice(0, 4)}-${key.slice(4, 6)}-${key.slice(6, 8)}`;
}

/** Builds the Universalis JSONP URL for Adelaide calendar. */
export function buildUniversalisUrl(dateKey: string, callbackName: string): string {
    return `https://universalis.com/Australia.Adelaide/${dateKey}/jsonpmass.js?callback=${callbackName}`;
}
