// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeAll, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

/* jsdom does not implement IntersectionObserver, which framer-motion's
   `whileInView` relies on. Provide a minimal no-op stub. */
beforeAll(() => {
    class IntersectionObserverStub {
        observe() {}
        unobserve() {}
        disconnect() {}
        takeRecords() {
            return [];
        }
    }
    vi.stubGlobal('IntersectionObserver', IntersectionObserverStub);
});

/* ------------------------------------------------------------------ */
/*  Mock framer-motion: render plain tags and toggle reduced motion.    */
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

import { TaskCards } from './TaskCards';

function renderCards() {
    return render(
        <MemoryRouter>
            <TaskCards />
        </MemoryRouter>,
    );
}

afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    mockReducedMotion.mockReset();
    mockReducedMotion.mockReturnValue(false);
});

/* ------------------------------------------------------------------ */
/*  Requirement 4.3 — interactive card hover lift                      */
/* ------------------------------------------------------------------ */

describe('TaskCards — hover lift (Requirement 4.3)', () => {
    it('applies the -translate-y-0.5 hover lift to every interactive card when motion is allowed', () => {
        mockReducedMotion.mockReturnValue(false);

        const { container } = renderCards();

        const cards = container.querySelectorAll('a[data-lift]');
        expect(cards.length).toBeGreaterThan(0);
        for (const card of cards) {
            expect(card.className).toContain('hover:-translate-y-0.5');
            expect(card.getAttribute('data-lift')).toBe('on');
        }
    });

    it('reverts via a transition so the lift returns on pointer leave', () => {
        mockReducedMotion.mockReturnValue(false);

        const { container } = renderCards();
        // The transition utility governs both the apply (hover) and the revert (leave).
        const card = container.querySelector('a[data-lift]');
        expect(card?.className).toContain('transition-all');
    });
});

/* ------------------------------------------------------------------ */
/*  Requirement 4.7 — suppress the lift under prefers-reduced-motion   */
/* ------------------------------------------------------------------ */

describe('TaskCards — reduced motion suppresses the hover lift (Requirement 4.7)', () => {
    it('omits the -translate-y-0.5 lift class when reduced motion is preferred', () => {
        mockReducedMotion.mockReturnValue(true);

        const { container } = renderCards();

        const cards = container.querySelectorAll('a[data-lift]');
        expect(cards.length).toBeGreaterThan(0);
        for (const card of cards) {
            expect(card.className).not.toContain('-translate-y-0.5');
            expect(card.getAttribute('data-lift')).toBe('off');
        }
    });
});
