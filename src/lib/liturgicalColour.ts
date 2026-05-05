/**
 * Liturgical colour resolution — maps seasons and feast-day overrides to
 * vestment colour tokens used in the Daily Readings page and home card.
 *
 * Colour priority:
 *  1. Local override JSON (keyed by YYYY-MM-DD)
 *  2. Season-based fallback from useLiturgicalSeason
 */

export type LiturgicalColour = 'white' | 'green' | 'purple' | 'red' | 'rose';

export interface LiturgicalColourInfo {
    colour: LiturgicalColour;
    label: string;
    cssColor: string;
    /** Tailwind text class */
    textClass: string;
    /** Tailwind bg class (subtle) */
    bgClass: string;
}

const COLOUR_MAP: Record<LiturgicalColour, LiturgicalColourInfo> = {
    white: {
        colour: 'white',
        label: 'White / Gold',
        cssColor: '#C5A55A',
        textClass: 'text-parish-brass',
        bgClass: 'bg-parish-brass/10',
    },
    green: {
        colour: 'green',
        label: 'Green',
        cssColor: '#2D5F2D',
        textClass: 'text-parish-ordinary',
        bgClass: 'bg-parish-ordinary/10',
    },
    purple: {
        colour: 'purple',
        label: 'Purple',
        cssColor: '#6B3FA0',
        textClass: 'text-parish-advent',
        bgClass: 'bg-parish-advent/10',
    },
    red: {
        colour: 'red',
        label: 'Red',
        cssColor: '#8B2332',
        textClass: 'text-parish-martyrs',
        bgClass: 'bg-parish-martyrs/10',
    },
    rose: {
        colour: 'rose',
        label: 'Rose',
        cssColor: '#C48793',
        textClass: 'text-pink-600',
        bgClass: 'bg-pink-600/10',
    },
};

export type ColourOverrides = Record<string, LiturgicalColour>;

const SEASON_COLOUR_FALLBACK: Record<string, LiturgicalColour> = {
    advent: 'purple',
    lent: 'purple',
    christmas: 'white',
    easter: 'white',
    ordinary: 'green',
};

/**
 * Resolve the liturgical colour for a given date.
 *
 * @param dateKey - YYYY-MM-DD string in Adelaide local time
 * @param seasonKey - season key from useLiturgicalSeason (e.g. 'easter')
 * @param overrides - optional local override map
 */
export function resolveLiturgicalColour(
    dateKey: string,
    seasonKey: string,
    overrides?: ColourOverrides,
): LiturgicalColourInfo {
    const overrideColour = overrides?.[dateKey];
    if (overrideColour && COLOUR_MAP[overrideColour]) {
        return COLOUR_MAP[overrideColour];
    }
    const fallback = SEASON_COLOUR_FALLBACK[seasonKey] ?? 'green';
    return COLOUR_MAP[fallback];
}

export function getColourInfo(colour: LiturgicalColour): LiturgicalColourInfo {
    return COLOUR_MAP[colour];
}
