import { describe, it, expect } from 'vitest';
import {
    PRIMARY_NAV,
    DRAWER_GROUPS,
    QUICK_ACTIONS,
    FOOTER_EXTRA_NAV,
    ROUTE_META,
    isActive,
} from '../../lib/navigation';

// ── isActive ─────────────────────────────────────────────────────────────────

describe('isActive', () => {
    it('matches exact path', () => {
        expect(isActive('/about', '/about')).toBe(true);
    });

    it('matches root only exactly', () => {
        expect(isActive('/', '/')).toBe(true);
        expect(isActive('/about', '/')).toBe(false);
    });

    it('does not match unrelated paths', () => {
        expect(isActive('/about', '/contact')).toBe(false);
    });

    it('matches sub-routes via prefix for non-root paths', () => {
        // isActive uses startsWith for non-root links
        expect(isActive('/community/article/1', '/community')).toBe(true);
    });
});

// ── Navigation data integrity ────────────────────────────────────────────────

describe('PRIMARY_NAV', () => {
    it('contains at least Home and Mass Times', () => {
        const labels = PRIMARY_NAV.map(n => n.label);
        expect(labels).toContain('Home');
        expect(labels).toContain('Mass Times');
    });

    it('every entry has a non-empty route and label', () => {
        for (const item of PRIMARY_NAV) {
            expect(item.to).toBeTruthy();
            expect(item.label).toBeTruthy();
            expect(item.to.startsWith('/')).toBe(true);
        }
    });
});

describe('DRAWER_GROUPS', () => {
    it('has at least one group with links', () => {
        expect(DRAWER_GROUPS.length).toBeGreaterThan(0);
        for (const group of DRAWER_GROUPS) {
            expect(group.title).toBeTruthy();
            expect(group.links.length).toBeGreaterThan(0);
        }
    });
});

describe('QUICK_ACTIONS', () => {
    it('every action has a title, route, and icon', () => {
        for (const action of QUICK_ACTIONS) {
            expect(action.title).toBeTruthy();
            expect(action.to).toBeTruthy();
            expect(action.icon).toBeDefined();
        }
    });
});

describe('FOOTER_EXTRA_NAV', () => {
    it('every item has a non-empty route', () => {
        for (const item of FOOTER_EXTRA_NAV) {
            expect(item.to).toBeTruthy();
            expect(item.to.startsWith('/')).toBe(true);
        }
    });
});

// ── Route metadata ───────────────────────────────────────────────────────────

describe('ROUTE_META', () => {
    it('contains metadata for major pages', () => {
        const paths = Object.keys(ROUTE_META);
        expect(paths).toContain('/');
        expect(paths).toContain('/mass-times');
        expect(paths).toContain('/about');
    });

    it('every entry has a label and section', () => {
        for (const [, meta] of Object.entries(ROUTE_META)) {
            expect(meta.label).toBeTruthy();
            expect(meta.section).toBeTruthy();
            expect(['Explore', 'Worship', 'Community', 'Admin']).toContain(meta.section);
        }
    });

    it('all PRIMARY_NAV routes have corresponding ROUTE_META entries', () => {
        const metaPaths = new Set(Object.keys(ROUTE_META));
        for (const navItem of PRIMARY_NAV) {
            expect(metaPaths.has(navItem.to)).toBe(true);
        }
    });
});
