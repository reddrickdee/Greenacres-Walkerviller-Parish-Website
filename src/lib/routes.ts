/**
 * Route manifest — single source of truth for all routes in the application.
 *
 * Every navigable path is defined here once. Navigation arrays, breadcrumbs,
 * the Router config, and tests all derive from this manifest.
 */

// ── Path Constants ────────────────────────────────────────────────────────────
// Use these instead of string literals throughout the codebase.

export const PATHS = {
    HOME: '/',
    MASS_TIMES: '/mass-times',
    CONTACT: '/contact',
    ABOUT: '/about',
    HISTORY: '/history',
    NEW_HERE: '/new-here',
    NEWS_EVENTS: '/news-events',
    VOLUNTEER: '/volunteer',
    GALLERY: '/gallery',
    DAILY_READINGS: '/daily-readings',
    // Dynamic routes (param segments)
    BULLETIN: '/news-events/bulletin/:id',
} as const;

/** Union of all static path values. */
export type StaticPath = typeof PATHS[keyof typeof PATHS];

// ── Section Type ──────────────────────────────────────────────────────────────

export type RouteSection = 'Explore' | 'Worship' | 'Community';

// ── Route Manifest Entry ──────────────────────────────────────────────────────

export interface RouteEntry {
    /** Route path (matches router `path` prop). */
    path: StaticPath;
    /** Display label for breadcrumbs and page title fallback. */
    label: string;
    /** Section grouping (matches drawer group titles). */
    section: RouteSection;
}

// ── Manifest ──────────────────────────────────────────────────────────────────
// Each static page route is listed here once, in nav-logical order.
// Dynamic and admin routes follow.

export const ROUTE_MANIFEST: RouteEntry[] = [
    // Worship
    { path: PATHS.HOME, label: 'Home', section: 'Worship' },
    { path: PATHS.MASS_TIMES, label: 'Mass Times', section: 'Worship' },
    { path: PATHS.DAILY_READINGS, label: 'Readings & Reflection', section: 'Worship' },
    { path: PATHS.NEWS_EVENTS, label: 'News & Events', section: 'Worship' },
    // Explore
    { path: PATHS.ABOUT, label: 'About Us', section: 'Explore' },
    { path: PATHS.HISTORY, label: 'History', section: 'Explore' },
    { path: PATHS.NEW_HERE, label: "I'm New Here", section: 'Explore' },
    { path: PATHS.GALLERY, label: 'Gallery', section: 'Explore' },
    // Community
    { path: PATHS.VOLUNTEER, label: 'Volunteer', section: 'Community' },
    { path: PATHS.CONTACT, label: 'Contact', section: 'Community' },
];

// ── Derived lookups ───────────────────────────────────────────────────────────

/** Shape of each entry in ROUTE_META (used by Breadcrumbs etc.). */
export interface RouteMeta {
    label: string;
    section: RouteSection;
}

/**
 * Lookup map keyed by path → { label, section }.
 * Used by Breadcrumbs and any component that needs route metadata.
 */
export const ROUTE_META: Record<string, RouteMeta> =
    Object.fromEntries(ROUTE_MANIFEST.map(r => [r.path, { label: r.label, section: r.section }]));

/**
 * All static paths (excludes dynamic :param routes).
 * Useful for E2E smoke tests and static analysis.
 */
export const ALL_STATIC_PATHS: string[] = ROUTE_MANIFEST
    .map(r => r.path)
    .filter(p => !p.includes(':'));
