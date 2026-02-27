// src/lib/universalisApi.ts
// Fetches daily Mass readings directly from the Universalis JSONP endpoint.
// Primary strategy: fetch() with CORS. Fallback: JSONP script injection.

import type { DailyReflection } from '../types';

const BASE_URL = 'https://universalis.com/Australia';

/**
 * Build the Universalis JSONP URL for a given date.
 * @param dateIso  YYYY-MM-DD string, or undefined for "today"
 */
function buildUrl(dateIso?: string): string {
    if (dateIso) {
        const yyyymmdd = dateIso.replace(/-/g, '');
        return `${BASE_URL}/${yyyymmdd}/jsonpmass.js`;
    }
    return `${BASE_URL}/jsonpmass.js`;
}

/**
 * Strip the JSONP wrapper and parse the inner JSON object.
 * Payload looks like: universalisCallback({…})
 */
function parseJsonp(payload: string): any {
    const startIdx = payload.indexOf('(');
    const endIdx = payload.lastIndexOf(')');
    if (startIdx <= 0 || endIdx <= 0) {
        throw new Error('Invalid JSONP payload from Universalis');
    }
    return JSON.parse(payload.substring(startIdx + 1, endIdx));
}

/**
 * Extract a plain-text liturgical colour from the JSONP `day` HTML field.
 * Falls back to 'Green' if undetectable.
 */
function detectLiturgicalColour(): string {
    // The Universalis JSONP doesn't expose colour directly, but
    // the mass.htm page shows it. We'll keep the DB value or default.
    return 'Green';
}

/**
 * Map the raw Universalis JSON into our DailyReflection shape.
 * Only the reading fields are populated — reflection fields remain undefined.
 */
function mapToReflection(data: any): DailyReflection {
    const numberStr = data.number.toString();
    const dateIso = `${numberStr.substring(0, 4)}-${numberStr.substring(4, 6)}-${numberStr.substring(6, 8)}`;

    // Strip HTML tags from the "day" field to get a clean title
    const title = data.day
        ? data.day.replace(/<[^>]+>/g, '').trim()
        : 'Daily Mass';

    return {
        id: `universalis-${dateIso}`,
        date: dateIso,
        liturgicalColor: detectLiturgicalColour(),
        title,
        // Readings (HTML from Universalis)
        firstReadingHtml: data.Mass_R1?.text || undefined,
        psalmHtml: data.Mass_Ps?.text || undefined,
        secondReadingHtml: data.Mass_R2?.text || undefined,
        gospelAcclamationHtml: data.Mass_GA?.text || undefined,
        gospelHtml: data.Mass_G?.text || undefined,
        // Scripture references & headings
        firstReadingSource: data.Mass_R1?.source || undefined,
        firstReadingHeading: data.Mass_R1?.heading || undefined,
        psalmSource: data.Mass_Ps?.source || undefined,
        secondReadingSource: data.Mass_R2?.source || undefined,
        secondReadingHeading: data.Mass_R2?.heading || undefined,
        gospelAcclamationSource: data.Mass_GA?.source || undefined,
        gospelSource: data.Mass_G?.source || undefined,
        gospelHeading: data.Mass_G?.heading || undefined,
    };
}

// ── Strategy 1: Direct fetch (works if Universalis sends CORS headers) ───────

async function fetchViaFetch(url: string): Promise<string> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Universalis returned ${res.status}`);
    return res.text();
}

// ── Strategy 2: JSONP script injection (always bypasses CORS) ────────────────

function fetchViaJsonp(url: string, timeoutMs = 8000): Promise<string> {
    return new Promise((resolve, reject) => {

        let settled = false;

        const timer = setTimeout(() => {
            if (!settled) {
                settled = true;
                cleanup();
                reject(new Error('Universalis JSONP timed out'));
            }
        }, timeoutMs);

        // The Universalis endpoint calls `universalisCallback(...)`, but we
        // can't easily rename it. Instead we intercept via a global override.
        const originalCallback = (window as any).universalisCallback;
        (window as any).universalisCallback = (data: any) => {
            if (!settled) {
                settled = true;
                clearTimeout(timer);
                cleanup();
                // Reconstruct the "text" so we can reuse the same parse path
                resolve(`universalisCallback(${JSON.stringify(data)})`);
            }
        };

        const script = document.createElement('script');
        script.src = url;
        script.async = true;
        script.onerror = () => {
            if (!settled) {
                settled = true;
                clearTimeout(timer);
                cleanup();
                reject(new Error('Failed to load Universalis script'));
            }
        };

        function cleanup() {
            // Restore original callback (or delete)
            if (originalCallback) {
                (window as any).universalisCallback = originalCallback;
            } else {
                delete (window as any).universalisCallback;
            }
            script.remove();
        }

        document.head.appendChild(script);
    });
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Fetch today's (or a specific date's) Mass readings from Universalis.com.
 * Tries direct fetch first; falls back to JSONP script injection if CORS blocks.
 * Returns null if both strategies fail.
 */
export async function fetchUniversalisReadings(dateIso?: string): Promise<DailyReflection | null> {
    const url = buildUrl(dateIso);

    try {
        // Strategy 1: direct fetch
        const text = await fetchViaFetch(url);
        const data = parseJsonp(text);
        return mapToReflection(data);
    } catch {
        // CORS likely blocked — try JSONP
    }

    try {
        const text = await fetchViaJsonp(url);
        const data = parseJsonp(text);
        return mapToReflection(data);
    } catch {
        // Both strategies failed
    }

    return null;
}
