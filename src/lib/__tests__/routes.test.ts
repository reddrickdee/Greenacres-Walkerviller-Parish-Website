import { describe, it, expect } from 'vitest';
import { PATHS, ROUTE_MANIFEST, ROUTE_META, ALL_STATIC_PATHS } from '../../lib/routes';
import {
    PRIMARY_NAV,
    DRAWER_GROUPS,
    QUICK_ACTIONS,
    FOOTER_EXTRA_NAV,
} from '../../lib/navigation';

// ── PATHS constants ──────────────────────────────────────────────────────────

describe('PATHS', () => {
    it('every value starts with "/"', () => {
        for (const [, path] of Object.entries(PATHS)) {
            expect(path.startsWith('/')).toBe(true);
        }
    });

    it('has no duplicate path values', () => {
        const values = Object.values(PATHS);
        expect(new Set(values).size).toBe(values.length);
    });

    it('contains at least 20 routes', () => {
        expect(Object.keys(PATHS).length).toBeGreaterThanOrEqual(20);
    });
});

// ── ROUTE_MANIFEST ───────────────────────────────────────────────────────────

describe('ROUTE_MANIFEST', () => {
    it('every entry uses a PATHS constant', () => {
        const validPaths = new Set(Object.values(PATHS) as string[]);
        for (const entry of ROUTE_MANIFEST) {
            expect(validPaths.has(entry.path)).toBe(true);
        }
    });

    it('has no duplicate paths', () => {
        const paths = ROUTE_MANIFEST.map(r => r.path);
        expect(new Set(paths).size).toBe(paths.length);
    });

    it('every entry has a non-empty label and valid section', () => {
        const validSections = ['Explore', 'Worship', 'Community', 'Admin'];
        for (const entry of ROUTE_MANIFEST) {
            expect(entry.label).toBeTruthy();
            expect(validSections).toContain(entry.section);
        }
    });
});

// ── ROUTE_META (derived from manifest) ───────────────────────────────────────

describe('ROUTE_META (derived)', () => {
    it('has the same number of entries as ROUTE_MANIFEST', () => {
        expect(Object.keys(ROUTE_META).length).toBe(ROUTE_MANIFEST.length);
    });

    it('every ROUTE_MANIFEST entry is in ROUTE_META', () => {
        for (const entry of ROUTE_MANIFEST) {
            expect(ROUTE_META[entry.path]).toBeDefined();
            expect(ROUTE_META[entry.path].label).toBe(entry.label);
        }
    });
});

// ── Cross-reference: navigation arrays → manifest ────────────────────────────

describe('navigation arrays use PATHS from the manifest', () => {
    const manifestPaths: Set<string> = new Set(ROUTE_MANIFEST.map(r => r.path));

    it('all PRIMARY_NAV.to values are in the manifest', () => {
        for (const item of PRIMARY_NAV) {
            expect(manifestPaths.has(item.to)).toBe(true);
        }
    });

    it('all DRAWER_GROUPS link destinations are in the manifest', () => {
        for (const group of DRAWER_GROUPS) {
            for (const link of group.links) {
                expect(manifestPaths.has(link.to)).toBe(true);
            }
        }
    });

    it('all QUICK_ACTIONS destinations are in the manifest', () => {
        for (const action of QUICK_ACTIONS) {
            expect(manifestPaths.has(action.to)).toBe(true);
        }
    });

    it('all FOOTER_EXTRA_NAV destinations are in the manifest', () => {
        for (const item of FOOTER_EXTRA_NAV) {
            expect(manifestPaths.has(item.to)).toBe(true);
        }
    });
});

// ── ALL_STATIC_PATHS ─────────────────────────────────────────────────────────

describe('ALL_STATIC_PATHS', () => {
    it('excludes dynamic :param routes', () => {
        for (const path of ALL_STATIC_PATHS) {
            expect(path).not.toContain(':');
        }
    });

    it('includes at least the core public routes', () => {
        expect(ALL_STATIC_PATHS).toContain('/');
        expect(ALL_STATIC_PATHS).toContain('/mass-times');
        expect(ALL_STATIC_PATHS).toContain('/about');
        expect(ALL_STATIC_PATHS).toContain('/contact');
    });
});
