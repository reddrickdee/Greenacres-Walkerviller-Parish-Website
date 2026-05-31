// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeAll, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, within, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { ReactElement } from 'react';
import type { ParishContent, NewsletterArchive } from '../types';

/* jsdom does not implement IntersectionObserver, which framer-motion's
   `whileInView` (used by SectionIntro in PageTemplates) relies on. */
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
/*  Mock the parish data context so the page renders with content.     */
/* ------------------------------------------------------------------ */
const { mockUseParishData } = vi.hoisted(() => ({ mockUseParishData: vi.fn() }));

vi.mock('../context/ParishDataContext', () => ({
    useParishData: mockUseParishData,
}));

/* usePageSEO touches document/head; stub it so the page renders cleanly. */
vi.mock('../hooks/usePageSEO', () => ({
    usePageSEO: vi.fn(),
}));

import { ContactPage } from './ContactPage';

/* ---------- helpers ---------- */

interface ParishDataState {
    content: ParishContent | null;
    newsletters: NewsletterArchive | null;
    isLoading: boolean;
    error: string | null;
    reload: () => void;
}

/** Minimal contact/schools content sufficient to render the ContactPage maps. */
function makeContent(): ParishContent {
    return {
        contact: {
            address: '90 North East Road, Walkerville SA 5081',
            postalAddress: 'PO Box 1, Walkerville SA 5081',
            phone: '(08) 8261 6200',
            email: 'admin@gwparish.org.au',
            officeHours: 'Mon, Wed, Thu 9:00am to 3:00pm',
            stMonicaQuery: "St Monica's Catholic Church, 90 North East Road, Walkerville SA",
            stMartinQuery: "St Martin's Catholic Church, Corner Muller and Hampstead Roads, Greenacres SA",
        },
        schools: [],
        lastVerified: '2025-01-01',
    } as unknown as ParishContent;
}

function makeState(overrides: Partial<ParishDataState> = {}): ParishDataState {
    return {
        content: makeContent(),
        newsletters: null,
        isLoading: false,
        error: null,
        reload: vi.fn(),
        ...overrides,
    };
}

function renderPage(ui: ReactElement) {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
}

afterEach(() => {
    cleanup();
    mockUseParishData.mockReset();
});

/* ------------------------------------------------------------------ */
/*  Requirement 4.4 — visible loading indicator + descriptive title    */
/* ------------------------------------------------------------------ */

describe('ContactPage — map loading state (Requirement 4.4)', () => {
    it('shows a visible loading indicator for each map while the iframe loads', () => {
        mockUseParishData.mockReturnValue(makeState());
        renderPage(<ContactPage />);

        // One status indicator per map (two churches), visible before load.
        const indicators = screen.getAllByRole('status');
        expect(indicators.length).toBe(2);
        for (const indicator of indicators) {
            expect(within(indicator).getByText(/loading map/i)).toBeTruthy();
        }
    });

    it('renders the loading container with a Shadow_Token_System token', () => {
        mockUseParishData.mockReturnValue(makeState());
        const { container } = renderPage(<ContactPage />);

        // The rounded map containers use the warm-tinted shadow token, not a literal black.
        const shadowed = container.querySelectorAll('[style*="var(--shadow-md)"]');
        expect(shadowed.length).toBe(2);
        for (const el of shadowed) {
            expect(el.className).toContain('rounded-[1.5rem]');
        }
    });

    it('gives every map iframe a non-empty title naming the church and suburb', () => {
        mockUseParishData.mockReturnValue(makeState());
        renderPage(<ContactPage />);

        const monica = screen.getByTitle(/st monica's church, walkerville/i);
        const martin = screen.getByTitle(/st martin's church, greenacres/i);

        expect((monica.getAttribute('title') ?? '').trim().length).toBeGreaterThan(0);
        expect((martin.getAttribute('title') ?? '').trim().length).toBeGreaterThan(0);
    });
});

/* ------------------------------------------------------------------ */
/*  Requirement 4.5 — replace the loader with the map on load          */
/* ------------------------------------------------------------------ */

describe('ContactPage — map reveal on load (Requirement 4.5)', () => {
    it('removes the loading indicator and reveals the map once the iframe loads', () => {
        mockUseParishData.mockReturnValue(makeState());
        renderPage(<ContactPage />);

        const iframe = screen.getByTitle(/st monica's church, walkerville/i);
        // Hidden behind the loader before load completes.
        expect(iframe.className).toContain('opacity-0');
        expect(screen.getAllByRole('status').length).toBe(2);

        // Fire the iframe load event for the first map.
        fireEvent.load(iframe);

        // That map's loader is gone and its iframe is revealed; the other remains loading.
        expect(iframe.className).toContain('opacity-100');
        expect(screen.getAllByRole('status').length).toBe(1);
    });
});

/* ------------------------------------------------------------------ */
/*  Requirement 4.6 — map-unavailable indication on failure/block      */
/* ------------------------------------------------------------------ */

describe('ContactPage — map failure handling (Requirement 4.6)', () => {
    /* Cross-origin Google Maps frames do not reliably fire `onError` when
       blocked, so the component surfaces the unavailable state via a load
       timeout. That timeout is the observable failure path in jsdom (React
       does not dispatch iframe `onError` here), and it covers the blocked
       case the requirement calls out. */
    it('shows a map-unavailable indication when a blocked iframe never loads', () => {
        vi.useFakeTimers();
        try {
            mockUseParishData.mockReturnValue(makeState());
            renderPage(<ContactPage />);

            // Both maps start loading; no unavailable indication yet.
            expect(screen.queryByText(/map unavailable/i)).toBeNull();
            expect(screen.getAllByRole('status').length).toBe(2);

            // Advance past the load timeout without firing load or error.
            act(() => {
                vi.advanceTimersByTime(10_000);
            });

            // Both blocked maps surface the unavailable indication...
            expect(screen.getAllByText(/map unavailable/i).length).toBe(2);
            // ...and their iframes are removed.
            expect(screen.queryByTitle(/st monica's church, walkerville/i)).toBeNull();
            expect(screen.queryByTitle(/st martin's church, greenacres/i)).toBeNull();
        } finally {
            vi.useRealTimers();
        }
    });

    it('reveals a loaded map and only marks the still-blocked map unavailable', () => {
        vi.useFakeTimers();
        try {
            mockUseParishData.mockReturnValue(makeState());
            renderPage(<ContactPage />);

            // The first church's map loads successfully before the timeout.
            const monica = screen.getByTitle(/st monica's church, walkerville/i);
            act(() => {
                fireEvent.load(monica);
            });

            // Let the second church's map time out as blocked.
            act(() => {
                vi.advanceTimersByTime(10_000);
            });

            // Loaded map stays revealed; only the blocked one is unavailable.
            expect(screen.getByTitle(/st monica's church, walkerville/i).className).toContain('opacity-100');
            expect(screen.queryByTitle(/st martin's church, greenacres/i)).toBeNull();
            expect(screen.getAllByText(/map unavailable/i).length).toBe(1);
        } finally {
            vi.useRealTimers();
        }
    });

    it('retains the visible text address when a map is unavailable', () => {
        vi.useFakeTimers();
        try {
            mockUseParishData.mockReturnValue(makeState());
            renderPage(<ContactPage />);

            act(() => {
                vi.advanceTimersByTime(10_000);
            });

            // The street address in the Address InfoCard remains visible
            // (exact match avoids the map-query paragraphs that embed it).
            expect(screen.getByText('90 North East Road, Walkerville SA 5081')).toBeTruthy();

            // Each unavailable panel retains the church's location text for AT.
            const panels = screen.getAllByText(/map unavailable/i)
                .map(node => node.closest('[role="status"]'))
                .filter((el): el is HTMLElement => el !== null);
            expect(panels.length).toBe(2);
            expect(within(panels[0]).getByText(/st monica's catholic church/i)).toBeTruthy();
            expect(within(panels[1]).getByText(/st martin's catholic church/i)).toBeTruthy();
        } finally {
            vi.useRealTimers();
        }
    });
});
