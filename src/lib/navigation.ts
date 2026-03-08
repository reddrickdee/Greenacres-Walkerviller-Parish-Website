/**
 * Shared navigation config — single source of truth for header, drawer,
 * quick-actions panel, and footer links across the site.
 */
import type { LucideIcon } from 'lucide-react';
import { CalendarClock, Mail, MapPinned } from 'lucide-react';

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

// ── Primary Nav (header bar + footer Explore base) ────────────────────────────

export const PRIMARY_NAV: NavItem[] = [
    { to: '/', label: 'Home' },
    { to: '/mass-times', label: 'Mass Times' },
    { to: '/new-here', label: "I'm New Here" },
    { to: '/contact', label: 'Contact' },
    { to: '/about', label: 'About' },
    { to: '/news-events', label: 'News & Events' },
];

// ── Mobile Drawer Groups ──────────────────────────────────────────────────────

export const DRAWER_GROUPS: NavGroup[] = [
    {
        title: 'Explore',
        links: [
            { to: '/', label: 'Home' },
            { to: '/about', label: 'About Us' },
            { to: '/history', label: 'History' },
            { to: '/gallery', label: 'Gallery' },
            { to: '/new-here', label: "I'm New Here" },
        ],
    },
    {
        title: 'Worship',
        links: [
            { to: '/mass-times', label: 'Mass Times' },
            { to: '/sacraments', label: 'Sacraments' },
            { to: '/live', label: 'Live Stream' },
            { to: '/homilies', label: 'Homilies' },
            { to: '/news-events', label: 'News & Events' },
        ],
    },
    {
        title: 'Community',
        links: [
            { to: '/community', label: 'Community Hub' },
            { to: '/volunteer', label: 'Volunteer' },
            { to: '/giving', label: 'Give' },
            { to: '/contact', label: 'Contact' },
            { to: '/safeguarding', label: 'Safeguarding' },
        ],
    },
];

// ── Quick Actions (mobile drawer sidebar panel) ───────────────────────────────

export const QUICK_ACTIONS: QuickAction[] = [
    {
        icon: CalendarClock,
        title: 'Weekend Mass',
        detail: "Sat 6:00pm St Monica's / Sun 9:30am St Martin's",
        to: '/mass-times',
    },
    {
        icon: MapPinned,
        title: 'Plan your first visit',
        detail: 'Find parking, contact details, and what to expect.',
        to: '/new-here',
    },
    {
        icon: Mail,
        title: 'Speak with the parish office',
        detail: 'Reach out for pastoral care, sacraments, or support.',
        to: '/contact',
    },
];

// ── Footer-only extras (appended to PRIMARY_NAV in footer Explore column) ────

export const FOOTER_EXTRA_NAV: NavItem[] = [
    { to: '/sacraments', label: 'Sacraments & Services' },
    { to: '/community', label: 'Community Hub' },
    { to: '/safeguarding', label: 'Safeguarding' },
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

// ── Route Metadata for Breadcrumbs ────────────────────────────────────────────

export interface RouteMeta {
    /** Display label for breadcrumb / page title fallback. */
    label: string;
    /** Section grouping (matches drawer group titles). */
    section: 'Explore' | 'Worship' | 'Community' | 'Admin';
}

export const ROUTE_META: Record<string, RouteMeta> = {
    '/': { label: 'Home', section: 'Explore' },
    '/about': { label: 'About Us', section: 'Explore' },
    '/history': { label: 'History', section: 'Explore' },
    '/gallery': { label: 'Gallery', section: 'Explore' },
    '/new-here': { label: "I'm New Here", section: 'Explore' },
    '/mass-times': { label: 'Mass Times', section: 'Worship' },
    '/sacraments': { label: 'Sacraments', section: 'Worship' },
    '/sacraments/request': { label: 'Request a Sacrament', section: 'Worship' },
    '/live': { label: 'Live Stream', section: 'Worship' },
    '/homilies': { label: 'Homilies', section: 'Worship' },
    '/news-events': { label: 'News & Events', section: 'Worship' },
    '/community': { label: 'Community Hub', section: 'Community' },
    '/volunteer': { label: 'Volunteer', section: 'Community' },
    '/giving': { label: 'Support Our Parish', section: 'Community' },
    '/contact': { label: 'Contact', section: 'Community' },
    '/safeguarding': { label: 'Safeguarding', section: 'Community' },
    '/admin/community': { label: 'Community Admin', section: 'Admin' },
    '/admin/reflections': { label: 'Reflections Admin', section: 'Admin' },
};
