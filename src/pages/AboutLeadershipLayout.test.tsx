// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { ReactElement } from 'react';
import type { ParishContent } from '../types';

/* ------------------------------------------------------------------ */
/*  Drive the parish data context with a populated About page.         */
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

import { AboutPage } from './AboutPage';

/* ---------- fixture ---------- */

/** Minimal parish content covering only the fields AboutPage reads. */
function makeContent(): ParishContent {
    return {
        tagline: 'In the Footsteps of Jesus',
        visionStatement: 'Our parish vision statement.',
        parishPrayerText: 'A reverent parish prayer.',
        priestWelcome: 'A welcome from the parish priest.',
        pastoralChairMessage: 'A message from the pastoral council chair.',
        missionPoints: [{ title: 'Commitment to social justice.' }],
        councilMembers: [
            { name: 'Father Dean Marin VG', role: 'Priest Moderator', bio: 'Bio one.' },
            { name: 'Jane Parishioner', role: 'Council Member', bio: 'Bio two.' },
        ],
    } as unknown as ParishContent;
}

function renderAbout(): ReactElement {
    return <MemoryRouter><AboutPage /></MemoryRouter>;
}

afterEach(() => {
    cleanup();
    mockUseParishData.mockReset();
    mockReducedMotion.mockReset();
    mockReducedMotion.mockReturnValue(false);
});

/* ------------------------------------------------------------------ */
/*  Requirement 3.1 — leadership/council layout                        */
/* ------------------------------------------------------------------ */

describe('AboutPage — leadership/council layout (Requirement 3.1)', () => {
    function loaded() {
        mockUseParishData.mockReturnValue({
            content: makeContent(),
            newsletters: null,
            isLoading: false,
            error: null,
            reload: vi.fn(),
        });
    }

    // Validates: Requirements 3.1
    it('presents council members using the existing sanctuary-card vocabulary', () => {
        loaded();
        const { container } = render(renderAbout());

        // Each council member renders inside a sanctuary-card (no new card type).
        const councilCards = container.querySelectorAll('.sanctuary-card.p-0');
        expect(councilCards.length).toBe(2);
        expect(screen.getByText('Father Dean Marin VG')).toBeTruthy();
        expect(screen.getByText('Jane Parishioner')).toBeTruthy();
    });

    // Validates: Requirements 3.1
    it('surfaces an existing-copy pull-quote (the parish tagline) in the text-heavy leadership section', () => {
        loaded();
        const { container } = render(renderAbout());

        const quote = container.querySelector('blockquote');
        expect(quote).not.toBeNull();
        // The pull-quote reuses existing parish copy — no invented text.
        expect(quote?.textContent).toContain('In the Footsteps of Jesus');
    });

    // Validates: Requirements 3.1
    it('applies the SectionGap scale (mt-16 md:mt-24) between top-level sections and never the old md:mt-20', () => {
        loaded();
        const { container } = render(renderAbout());

        // No top-level section retains the old between-section value.
        expect(container.querySelector('.md\\:mt-20')).toBeNull();

        // The three post-hero top-level sections carry the canonical SectionGap.
        const gapSections = container.querySelectorAll('section.page-section.mt-16.md\\:mt-24');
        expect(gapSections.length).toBe(3);
    });
});

/* ------------------------------------------------------------------ */
/*  Requirement 6.4 — stagger respects reduced motion                  */
/* ------------------------------------------------------------------ */

describe('AboutPage — council stagger respects reduced motion (Requirement 6.4)', () => {
    function loaded() {
        mockUseParishData.mockReturnValue({
            content: makeContent(),
            newsletters: null,
            isLoading: false,
            error: null,
            reload: vi.fn(),
        });
    }

    // Validates: Requirements 6.4
    it('animates with an entrance offset and per-card delay when motion is allowed', () => {
        mockReducedMotion.mockReturnValue(false);
        loaded();
        const { container } = render(renderAbout());

        const cards = container.querySelectorAll('.sanctuary-card.p-0');
        const first = cards[0];
        expect(JSON.parse(first.getAttribute('data-initial') ?? 'null')).toEqual({ opacity: 0, y: 22 });

        const secondTransition = JSON.parse(cards[1].getAttribute('data-transition') ?? 'null');
        // Second card carries a non-zero stagger delay.
        expect(secondTransition.delay).toBeGreaterThan(0);
    });

    // Validates: Requirements 6.4
    it('collapses the entrance offset and delay to zero when reduced motion is preferred', () => {
        mockReducedMotion.mockReturnValue(true);
        loaded();
        const { container } = render(renderAbout());

        const cards = container.querySelectorAll('.sanctuary-card.p-0');
        for (const card of cards) {
            expect(JSON.parse(card.getAttribute('data-initial') ?? 'null')).toEqual({ opacity: 1, y: 0 });
            const transition = JSON.parse(card.getAttribute('data-transition') ?? 'null');
            expect(transition).toEqual({ duration: 0 });
        }
    });
});
