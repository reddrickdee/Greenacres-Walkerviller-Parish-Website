// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { ReactElement } from 'react';
import type { ParishContent } from '../types';

/* ------------------------------------------------------------------ */
/*  Drive the parish data context with populated history milestones.   */
/* ------------------------------------------------------------------ */
const { mockUseParishData } = vi.hoisted(() => ({ mockUseParishData: vi.fn() }));

vi.mock('../context/ParishDataContext', () => ({
    useParishData: mockUseParishData,
}));

/* ------------------------------------------------------------------ */
/*  Mock framer-motion so we can (a) toggle reduced motion and         */
/*  (b) capture the `initial` / `transition` props a motion element    */
/*  receives (exposed as JSON on data-* attributes).                   */
/* ------------------------------------------------------------------ */
const { mockReducedMotion } = vi.hoisted(() => ({ mockReducedMotion: vi.fn(() => false) }));

vi.mock('framer-motion', async () => {
    const React = await import('react');
    const MOTION_ONLY = new Set([
        'initial', 'animate', 'exit', 'whileInView', 'whileHover', 'whileTap',
        'whileFocus', 'whileDrag', 'viewport', 'transition', 'variants', 'layout',
        'layoutId', 'drag', 'style',
    ]);

    const makeComponent = (tag: string) =>
        ({ children, ...props }: Record<string, unknown>) => {
            const domProps: Record<string, unknown> = {};
            for (const [key, value] of Object.entries(props)) {
                if (!MOTION_ONLY.has(key)) domProps[key] = value;
            }
            domProps['data-initial'] = JSON.stringify(props.initial ?? null);
            domProps['data-transition'] = JSON.stringify(props.transition ?? null);
            return React.createElement(tag, domProps, children as React.ReactNode);
        };

    const motion = new Proxy({}, {
        get: (_target, tag: string) => makeComponent(tag),
    });

    return {
        motion,
        useReducedMotion: () => mockReducedMotion(),
        AnimatePresence: ({ children }: { children?: unknown }) => children,
    };
});

import { HistoryPage } from './HistoryPage';

/* ---------- fixture ---------- */

/** Minimal parish content covering only the fields HistoryPage reads. */
function makeContent(): ParishContent {
    return {
        historyMilestones: [
            { year: '1912', description: 'A first Mass in a Druids Hall.' },
            { year: '1955', description: 'The Greenacres church is built.' },
            { year: '1998', description: 'The two communities unite as one parish.' },
        ],
    } as unknown as ParishContent;
}

function renderHistory(): ReactElement {
    return <MemoryRouter><HistoryPage /></MemoryRouter>;
}

function loaded() {
    mockUseParishData.mockReturnValue({
        content: makeContent(),
        newsletters: null,
        isLoading: false,
        error: null,
        reload: vi.fn(),
    });
}

afterEach(() => {
    cleanup();
    mockUseParishData.mockReset();
    mockReducedMotion.mockReset();
    mockReducedMotion.mockReturnValue(false);
});

/* ------------------------------------------------------------------ */
/*  Requirement 6.4 / Property 11 — timeline reveal respects motion    */
/* ------------------------------------------------------------------ */

describe('HistoryPage — timeline reveal respects reduced motion (Requirement 6.4)', () => {
    // Validates: Requirements 6.4
    it('animates with an entrance offset and per-entry delay when motion is allowed', () => {
        mockReducedMotion.mockReturnValue(false);
        loaded();
        const { container } = render(renderHistory());

        // The motion entry is the outer `.relative.mb-10` wrapper; the hover-lift
        // padding (pl-10) now lives on an inner container so the CSS hover transform
        // does not collide with Framer Motion's inline reveal transform.
        const entries = container.querySelectorAll('.relative.mb-10');
        expect(entries.length).toBe(3);

        // First entry slides in from the left with full duration.
        expect(JSON.parse(entries[0].getAttribute('data-initial') ?? 'null')).toEqual({ opacity: 0, x: -20 });
        const firstTransition = JSON.parse(entries[0].getAttribute('data-transition') ?? 'null');
        expect(firstTransition.duration).toBeGreaterThan(0);

        // Later entries carry a non-zero stagger delay.
        const thirdTransition = JSON.parse(entries[2].getAttribute('data-transition') ?? 'null');
        expect(thirdTransition.delay).toBeGreaterThan(0);
    });

    // Validates: Requirements 6.4
    it('collapses the entrance offset and delay to zero when reduced motion is preferred', () => {
        mockReducedMotion.mockReturnValue(true);
        loaded();
        const { container } = render(renderHistory());

        const entries = container.querySelectorAll('.relative.mb-10');
        expect(entries.length).toBe(3);

        for (const entry of entries) {
            expect(JSON.parse(entry.getAttribute('data-initial') ?? 'null')).toEqual({ opacity: 1, x: 0 });
            const transition = JSON.parse(entry.getAttribute('data-transition') ?? 'null');
            expect(transition).toEqual({ duration: 0 });
        }
    });
});
