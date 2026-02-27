// src/lib/universalisApi.ts
// Fetches daily Mass readings directly from the Universalis JSONP endpoint.
// Primary strategy: fetch() with CORS. Fallback: JSONP script injection.
//
// BACKUP SOURCE (if Universalis ever becomes unavailable):
//   Catholic Gallery — https://www.catholicgallery.org/mass-reading/
//   Widget embed:  https://www.catholicgallery.org/widget/free-mass-readings-widget-for-your-website-or-blog/
//   Monthly pages: https://www.catholicgallery.org/mass-reading/february-2026-download/

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
 * Infer the liturgical colour from the Universalis `day` title text.
 * Universalis doesn't expose colour in the JSONP, but we can deduce it
 * from the liturgical season / feast name with high accuracy.
 */
function detectLiturgicalColour(dayTitle: string): string {
    const t = dayTitle.toLowerCase();

    // Rose: 3rd Sunday of Advent (Gaudete) or 4th Sunday of Lent (Laetare)
    if (t.includes('3rd sunday of advent') || t.includes('4th sunday of lent')) return 'Rose';

    // Red: Palm Sunday, Pentecost, Good Friday, martyrs, Apostles
    if (t.includes('palm sunday') || t.includes('passion sunday')) return 'Red';
    if (t.includes('pentecost') && !t.includes('after pentecost')) return 'Red';
    if (t.includes('good friday') || t.includes('holy cross')) return 'Red';
    if (t.includes('martyr') || t.includes('apostle')) return 'Red';
    if (t.includes('ss. peter and paul') || t.includes('st peter') || t.includes('st paul')) return 'Red';

    // Violet / Purple: Lent and Advent
    if (t.includes('lent') || t.includes('ash wednesday')) return 'Violet';
    if (t.includes('advent')) return 'Violet';

    // White: Easter, Christmas, solemnities, feasts of the Lord/BVM/saints (non-martyrs)
    if (t.includes('easter') || t.includes('ascension')) return 'White';
    if (t.includes('christmas') || t.includes('epiphany') || t.includes('baptism of the lord')) return 'White';
    if (t.includes('holy thursday') || t.includes('holy saturday')) return 'White';
    if (t.includes('trinity') || t.includes('corpus christi') || t.includes('sacred heart')) return 'White';
    if (t.includes('transfiguration') || t.includes('presentation')) return 'White';
    if (t.includes('assumption') || t.includes('immaculate') || t.includes('our lady')) return 'White';
    if (t.includes('all saints') || t.includes('solemnity')) return 'White';

    // Green: Ordinary Time (default)
    return 'Green';
}

/**
 * Map the raw Universalis JSON into our DailyReflection shape.
 * Only the reading fields are populated — reflection fields remain undefined.
 */
function mapToReflection(data: any): DailyReflection {
    const numberStr = data.number.toString();
    const dateIso = `${numberStr.substring(0, 4)}-${numberStr.substring(4, 6)}-${numberStr.substring(6, 8)}`;

    // Decode HTML entities (e.g. &#160; → space, &#x2010; → ‐)
    const decodeEntities = (s?: string): string | undefined => {
        if (!s) return undefined;
        const el = document.createElement('span');
        el.innerHTML = s;
        return el.textContent || s;
    };

    // Strip HTML tags from the "day" field to get a clean title, then decode entities
    const rawTitle = data.day ? data.day.replace(/<[^>]+>/g, '').trim() : 'Daily Mass';
    const title = decodeEntities(rawTitle) || 'Daily Mass';

    return {
        id: `universalis-${dateIso}`,
        date: dateIso,
        liturgicalColor: detectLiturgicalColour(title),
        title,
        // Readings (HTML from Universalis)
        firstReadingHtml: data.Mass_R1?.text || undefined,
        psalmHtml: data.Mass_Ps?.text || undefined,
        secondReadingHtml: data.Mass_R2?.text || undefined,
        gospelAcclamationHtml: data.Mass_GA?.text || undefined,
        gospelHtml: data.Mass_G?.text || undefined,
        // Scripture references & headings (decoded)
        firstReadingSource: decodeEntities(data.Mass_R1?.source),
        firstReadingHeading: decodeEntities(data.Mass_R1?.heading),
        psalmSource: decodeEntities(data.Mass_Ps?.source),
        secondReadingSource: decodeEntities(data.Mass_R2?.source),
        secondReadingHeading: decodeEntities(data.Mass_R2?.heading),
        gospelAcclamationSource: decodeEntities(data.Mass_GA?.source),
        gospelSource: decodeEntities(data.Mass_G?.source),
        gospelHeading: decodeEntities(data.Mass_G?.heading),
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
