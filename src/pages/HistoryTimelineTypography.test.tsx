// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeAll, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { ReactElement } from 'react';
import type { ParishContent } from '../types';

/* jsdom does not implement IntersectionObserver, which framer-motion's
   `whileInView` relies on. Provide a minimal no-op stub so the real
   HistoryPage timeline motion content renders during the test. */
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
/*  Mock the parish data context so we can drive the timeline render.  */
/* ------------------------------------------------------------------ */
const { mockUseParishData } = vi.hoisted(() => ({ mockUseParishData: vi.fn() }));

vi.mock('../context/ParishDataContext', () => ({
    useParishData: mockUseParishData,
}));

import { HistoryPage } from './HistoryPage';

/* ---------- helpers ---------- */

const MILESTONES = [
    { year: '1912', description: 'Former Druids Hall on North East Road used for Sunday Mass.' },
    { year: '1941', description: 'Parish of Walkerville established by Archbishop Beovich.' },
];

/** Minimal content stub — HistoryPage only reads `historyMilestones`. */
function makeContent(): ParishContent {
    return { historyMilestones: MILESTONES } as unknown as ParishContent;
}

function renderPage(ui: ReactElement) {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
}

afterEach(() => {
    cleanup();
    mockUseParishData.mockReset();
});

/* ------------------------------------------------------------------ */
/*  Timeline editorial typography (Phase 3 — Requirements 3.3, 6.9).   */
/*  Headings in font-display (Merriweather); body copy in font-body    */
/*  (Outfit); no new font families.                                    */
/* ------------------------------------------------------------------ */

describe('HistoryPage — timeline editorial typography', () => {
    // Validates: Requirements 3.3
    it('renders each milestone year as a heading in font-display (Merriweather)', () => {
        mockUseParishData.mockReturnValue({ content: makeContent(), isLoading: false });
        renderPage(<HistoryPage />);

        for (const { year } of MILESTONES) {
            const heading = screen.getByRole('heading', { name: year });
            expect(heading.className).toContain('font-display');
        }
    });

    // Validates: Requirements 3.3
    it('renders milestone body copy in font-body (Outfit)', () => {
        mockUseParishData.mockReturnValue({ content: makeContent(), isLoading: false });
        renderPage(<HistoryPage />);

        for (const { description } of MILESTONES) {
            const body = screen.getByText(description);
            expect(body.className).toContain('font-body');
        }
    });

    // Validates: Requirements 6.9
    it('introduces no font families beyond the preserved Merriweather/Outfit pairing', () => {
        mockUseParishData.mockReturnValue({ content: makeContent(), isLoading: false });
        const { container } = renderPage(<HistoryPage />);

        // Tailwind font-weight utilities (not font families) are allowed.
        const fontWeights = new Set([
            'thin', 'extralight', 'light', 'normal', 'medium',
            'semibold', 'bold', 'extrabold', 'black',
        ]);
        // The only font-family utilities permitted by the design system.
        const allowedFamilies = new Set(['display', 'body', 'serif', 'dyslexic']);

        for (const el of Array.from(container.querySelectorAll<HTMLElement>('*'))) {
            for (const cls of Array.from(el.classList)) {
                if (!cls.startsWith('font-')) continue;
                const suffix = cls.slice('font-'.length);
                if (fontWeights.has(suffix)) continue; // weight utility, not a family
                expect(allowedFamilies.has(suffix)).toBe(true);
            }
        }
    });
});
