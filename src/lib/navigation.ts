/**
 * Shared navigation config — builds header, drawer, quick-actions,
 * and footer link arrays from the route manifest.
 *
 * Path constants and ROUTE_META are centralised in ./routes.ts.
 */
import type { LucideIcon } from 'lucide-react';
import { CalendarClock, Mail, MapPinned } from 'lucide-react';
import { PATHS } from './routes';

// Re-export ROUTE_META so existing consumers (Breadcrumbs, tests) keep working
export { ROUTE_META } from './routes';
export type { RouteMeta } from './routes';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface NavItem {
    to: string;
    label: string;
}

export interface NavGroup {
    title: string;
    links: NavItem[];
}

export interface QuickAction {
    icon: LucideIcon;
    title: string;
    detail: string;
    to: string;
}

// ── Primary Nav (header bar) ──────────────────────────────────────────────────

export const PRIMARY_NAV: NavItem[] = [
    { to: PATHS.MASS_TIMES, label: 'Mass Times' },
    { to: PATHS.DAILY_READINGS, label: "Today's Readings" },
    { to: PATHS.NEW_HERE, label: "I'm New Here" },
    { to: PATHS.ABOUT, label: 'Our Parish' },
    { to: PATHS.NEWS_EVENTS, label: 'News & Events' },
    { to: PATHS.VOLUNTEER, label: 'Get Involved' },
    { to: PATHS.CONTACT, label: 'Contact' },
];

// ── Mobile Drawer Groups ──────────────────────────────────────────────────────

export const DRAWER_GROUPS: NavGroup[] = [
    {
        title: 'Worship',
        links: [
            { to: PATHS.MASS_TIMES, label: 'Mass Times' },
            { to: PATHS.DAILY_READINGS, label: "Today's Readings" },
        ],
    },
    {
        title: 'Visit',
        links: [
            { to: PATHS.NEW_HERE, label: "I'm New Here" },
            { to: PATHS.ABOUT, label: 'About Us' },
            { to: PATHS.HISTORY, label: 'History' },
            { to: PATHS.GALLERY, label: 'Gallery' },
        ],
    },
    {
        title: 'Community',
        links: [
            { to: PATHS.NEWS_EVENTS, label: 'News & Events' },
            { to: PATHS.VOLUNTEER, label: 'Get Involved' },
            { to: PATHS.CONTACT, label: 'Contact' },
        ],
    },
];

// ── Quick Actions (mobile drawer sidebar panel) ───────────────────────────────

export const QUICK_ACTIONS: QuickAction[] = [
    {
        icon: CalendarClock,
        title: 'Weekend Mass',
        detail: "Sat 6:00pm St Monica's / Sun 9:30am St Martin's",
        to: PATHS.MASS_TIMES,
    },
    {
        icon: MapPinned,
        title: 'Plan your first visit',
        detail: 'Find parking, contact details, and what to expect.',
        to: PATHS.NEW_HERE,
    },
    {
        icon: Mail,
        title: 'Speak with the parish office',
        detail: 'Reach out for pastoral care, sacraments, or support.',
        to: PATHS.CONTACT,
    },
];

// ── Footer quick links ──────────────────────────────────────────────────────

export const FOOTER_QUICK_LINKS: NavItem[] = [
    { to: PATHS.MASS_TIMES, label: 'Mass Times' },
    { to: PATHS.DAILY_READINGS, label: "Today's Readings" },
    { to: PATHS.NEW_HERE, label: "I'm New Here" },
    { to: PATHS.NEWS_EVENTS, label: 'News & Events' },
    { to: PATHS.VOLUNTEER, label: 'Get Involved' },
    { to: PATHS.CONTACT, label: 'Contact' },
];

// ── Footer-only extras (appended to PRIMARY_NAV in footer Explore column) ────

export const FOOTER_EXTRA_NAV: NavItem[] = [
    { to: PATHS.GALLERY, label: 'Gallery' },
    { to: PATHS.VOLUNTEER, label: 'Volunteer' },
];

// ── Active-state helper ───────────────────────────────────────────────────────

/**
 * Determines if a nav link should show its active state.
 * Handles exact match for "/" and prefix match for all other routes,
 * which correctly highlights parent routes for nested pages
 * (e.g. "/news-events" stays active on "/news-events/bulletin/123").
 */
export function isActive(pathname: string, to: string): boolean {
    if (to === '/') return pathname === '/';
    return pathname === to || pathname.startsWith(`${to}/`);
}
