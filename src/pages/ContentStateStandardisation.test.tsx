// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { ReactElement } from 'react';
import type { ParishContent, NewsletterArchive } from '../types';

/* ------------------------------------------------------------------ */
/*  Mock the parish data context so we can drive loading / null state   */
/*  Both the pages AND ContentStates resolve useParishData to this mock */
/* ------------------------------------------------------------------ */
const { mockUseParishData } = vi.hoisted(() => ({ mockUseParishData: vi.fn() }));

vi.mock('../context/ParishDataContext', () => ({
    useParishData: mockUseParishData,
}));

import { AboutPage } from './AboutPage';
import { HistoryPage } from './HistoryPage';
import { BulletinPage } from './BulletinPage';

/* ---------- helpers ---------- */

interface ParishDataState {
    content: ParishContent | null;
    newsletters: NewsletterArchive | null;
    isLoading: boolean;
    error: string | null;
    reload: () => void;
}

/** Build a parish-data context value, overriding only the bits a test cares about. */
function makeState(overrides: Partial<ParishDataState> = {}): ParishDataState {
    return {
        content: null,
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

/** The default loading message rendered by ContentLoading. */
const LOADING_PATTERN = /loading parish content/i;
/** The default heading rendered by ContentError. */
const ERROR_HEADING = { name: /something went wrong/i } as const;

afterEach(() => {
    cleanup();
    mockUseParishData.mockReset();
});

/* ------------------------------------------------------------------ */
/*  Content-driven pages render the canonical ContentStates            */
/*  components (Phase 1 standardisation).                              */
/* ------------------------------------------------------------------ */

describe('Content-driven pages — loading state (ContentLoading)', () => {
    // Validates: Requirements 1.1
    it('AboutPage renders ContentLoading while content is loading', () => {
        mockUseParishData.mockReturnValue(makeState({ isLoading: true }));
        renderPage(<AboutPage />);

        expect(screen.getByText(LOADING_PATTERN)).toBeTruthy();
        // The error branch must NOT be shown while loading.
        expect(screen.queryByRole('heading', ERROR_HEADING)).toBeNull();
    });

    // Validates: Requirements 1.1
    it('HistoryPage renders ContentLoading while content is loading', () => {
        mockUseParishData.mockReturnValue(makeState({ isLoading: true }));
        renderPage(<HistoryPage />);

        expect(screen.getByText(LOADING_PATTERN)).toBeTruthy();
        expect(screen.queryByRole('heading', ERROR_HEADING)).toBeNull();
    });

    // Validates: Requirements 1.1
    it('BulletinPage renders ContentLoading while newsletters are loading', () => {
        mockUseParishData.mockReturnValue(makeState({ isLoading: true }));
        renderPage(<BulletinPage />);

        expect(screen.getByText(LOADING_PATTERN)).toBeTruthy();
        expect(screen.queryByRole('heading', ERROR_HEADING)).toBeNull();
    });
});

describe('Content-driven pages — error state (ContentError)', () => {
    // Validates: Requirements 1.2
    it('AboutPage renders ContentError when content resolves to null', () => {
        mockUseParishData.mockReturnValue(makeState({ isLoading: false, content: null }));
        renderPage(<AboutPage />);

        expect(screen.getByRole('heading', ERROR_HEADING)).toBeTruthy();
        expect(screen.getByRole('button', { name: /try again/i })).toBeTruthy();
        // The loading branch must NOT be shown once loading has completed.
        expect(screen.queryByText(LOADING_PATTERN)).toBeNull();
    });

    // Validates: Requirements 1.2
    it('HistoryPage renders ContentError when content resolves to null', () => {
        mockUseParishData.mockReturnValue(makeState({ isLoading: false, content: null }));
        renderPage(<HistoryPage />);

        expect(screen.getByRole('heading', ERROR_HEADING)).toBeTruthy();
        expect(screen.getByRole('button', { name: /try again/i })).toBeTruthy();
        expect(screen.queryByText(LOADING_PATTERN)).toBeNull();
    });

    // Validates: Requirements 1.2
    it('BulletinPage renders ContentError when newsletters resolve to null', () => {
        mockUseParishData.mockReturnValue(makeState({ isLoading: false, newsletters: null }));
        renderPage(<BulletinPage />);

        expect(screen.getByRole('heading', ERROR_HEADING)).toBeTruthy();
        expect(screen.getByRole('button', { name: /try again/i })).toBeTruthy();
        expect(screen.queryByText(LOADING_PATTERN)).toBeNull();
    });
});
