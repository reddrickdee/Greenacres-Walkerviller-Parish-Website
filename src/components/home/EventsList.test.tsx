// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeAll, vi } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';

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
/*  Mock framer-motion: render plain tags, toggle reduced motion, and   */
/*  serialise the `variants` / `initial` / `transition` props onto       */
/*  data-* attributes so the stagger configuration is observable.        */
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
            domProps['data-variants'] = JSON.stringify(props.variants ?? null);
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

import { EventsList } from './EventsList';

/* ---------- fixtures ---------- */

interface FixtureEvent {
    date: string;
    title: string;
    time: string;
    location: string;
    description: string;
    category: string;
}

function makeEvent(overrides: Partial<FixtureEvent> = {}): FixtureEvent {
    return {
        date: '2099-01-01',
        title: 'Sample Event',
        time: '9:00am',
        location: 'St Martin\u2019s Church',
        description: 'A parish gathering.',
        category: 'Community',
        ...overrides,
    };
}

/** Stub global fetch to resolve the supplied events payload. */
function stubEventsFetch(events: FixtureEvent[]) {
    vi.stubGlobal(
        'fetch',
        vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ events }),
            } as Response),
        ),
    );
}

afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    mockReducedMotion.mockReset();
    mockReducedMotion.mockReturnValue(false);
});

/* ------------------------------------------------------------------ */
/*  Requirement 4.2 — featured-card asymmetry                          */
/* ------------------------------------------------------------------ */

describe('EventsList — featured-card asymmetry (Requirement 4.2)', () => {
    it('renders exactly one larger-span featured card when two or more events render', async () => {
        stubEventsFetch([
            makeEvent({ date: '2099-01-01', title: 'Soonest Event' }),
            makeEvent({ date: '2099-02-01', title: 'Second Event' }),
            makeEvent({ date: '2099-03-01', title: 'Third Event' }),
        ]);

        const { container } = render(<EventsList />);
        await screen.findByText('Soonest Event');

        // Exactly one featured card.
        const featured = container.querySelectorAll('[data-featured="true"]');
        expect(featured.length).toBe(1);

        // The featured card occupies a larger layout span than the uniform cards.
        expect(featured[0].className).toContain('sm:col-span-2');

        // The remaining cards are uniform: present, not featured, no larger span.
        const uniform = container.querySelectorAll('[data-featured="false"]');
        expect(uniform.length).toBe(2);
        for (const card of uniform) {
            expect(card.className).not.toContain('sm:col-span-2');
        }
    });

    it('promotes the soonest upcoming event as the featured card', async () => {
        stubEventsFetch([
            // Deliberately out of order — the component sorts ascending by date.
            makeEvent({ date: '2099-03-01', title: 'Later Event' }),
            makeEvent({ date: '2099-01-01', title: 'Earliest Event' }),
        ]);

        const { container } = render(<EventsList />);
        await screen.findByText('Earliest Event');

        const featured = container.querySelector('[data-featured="true"]');
        expect(featured?.textContent).toContain('Earliest Event');
        expect(featured?.textContent).toContain('Next Up');
    });

    it('renders a single event with no featured treatment', async () => {
        stubEventsFetch([makeEvent({ date: '2099-01-01', title: 'Only Event' })]);

        const { container } = render(<EventsList />);
        await screen.findByText('Only Event');

        // No card is promoted to featured.
        expect(container.querySelectorAll('[data-featured="true"]').length).toBe(0);

        const cards = container.querySelectorAll('.sanctuary-card');
        expect(cards.length).toBe(1);
        expect(cards[0].getAttribute('data-featured')).toBe('false');
        expect(cards[0].className).not.toContain('sm:col-span-2');
    });

    it('renders nothing when there are no upcoming events', async () => {
        stubEventsFetch([]);

        const { container } = render(<EventsList />);
        await waitFor(() => {
            expect((globalThis.fetch as ReturnType<typeof vi.fn>)).toHaveBeenCalled();
        });

        expect(container.querySelector('#upcoming-events')).toBeNull();
        expect(container.querySelectorAll('.sanctuary-card').length).toBe(0);
    });
});

/* ------------------------------------------------------------------ */
/*  Requirement 4.2 — viewport-triggered stagger respects reduced motion */
/* ------------------------------------------------------------------ */

describe('EventsList — staggered entry respects reduced motion (Requirement 4.2)', () => {
    function gridFor(container: HTMLElement) {
        return container.querySelector('.grid[data-variants]');
    }

    it('drives a viewport-triggered stagger with an entrance offset when motion is allowed', async () => {
        mockReducedMotion.mockReturnValue(false);
        stubEventsFetch([
            makeEvent({ date: '2099-01-01', title: 'First' }),
            makeEvent({ date: '2099-02-01', title: 'Second' }),
        ]);

        const { container } = render(<EventsList />);
        await screen.findByText('First');

        // Container cascades children with a non-zero stagger.
        const grid = gridFor(container);
        const containerVariants = JSON.parse(grid?.getAttribute('data-variants') ?? 'null');
        expect(containerVariants.visible.transition.staggerChildren).toBeGreaterThan(0);

        // Each card animates from an offset (opacity 0, shifted down).
        const card = container.querySelector('.sanctuary-card');
        const itemVariants = JSON.parse(card?.getAttribute('data-variants') ?? 'null');
        expect(itemVariants.hidden).toEqual({ opacity: 0, y: 16 });
        expect(itemVariants.visible.opacity).toBe(1);
    });

    it('collapses the stagger and entrance offset to zero when reduced motion is preferred', async () => {
        mockReducedMotion.mockReturnValue(true);
        stubEventsFetch([
            makeEvent({ date: '2099-01-01', title: 'First' }),
            makeEvent({ date: '2099-02-01', title: 'Second' }),
        ]);

        const { container } = render(<EventsList />);
        await screen.findByText('First');

        const grid = gridFor(container);
        const containerVariants = JSON.parse(grid?.getAttribute('data-variants') ?? 'null');
        expect(containerVariants.visible.transition.staggerChildren).toBe(0);
        expect(containerVariants.visible.transition.delayChildren).toBe(0);

        const card = container.querySelector('.sanctuary-card');
        const itemVariants = JSON.parse(card?.getAttribute('data-variants') ?? 'null');
        expect(itemVariants.hidden).toEqual({ opacity: 1, y: 0 });
        expect(itemVariants.visible).toEqual({ opacity: 1, y: 0, transition: { duration: 0 } });
    });
});
