// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeAll, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import type { NewsletterArchive } from '../types';

/* jsdom does not implement IntersectionObserver, which framer-motion's
   `whileInView` relies on. Provide a minimal no-op stub so the real
   BulletinPage motion content renders during the test. */
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
/*  Mock the parish data context so we can drive a populated bulletin   */
/* ------------------------------------------------------------------ */
const { mockUseParishData } = vi.hoisted(() => ({ mockUseParishData: vi.fn() }));

vi.mock('../context/ParishDataContext', () => ({
    useParishData: mockUseParishData,
}));

import { BulletinPage } from './BulletinPage';

const BULLETIN_ID = 'connections-test';

/** A newsletter archive containing a single native bulletin with a
 *  multi-paragraph priest's reflection and a couple of sections. */
function makeNewsletters(): NewsletterArchive {
    return {
        lastVerified: '2026-05-10',
        source: 'test',
        items: [
            {
                id: BULLETIN_ID,
                title: 'Connections Test Edition',
                url: '/assets/bulletins/test.pdf',
                isCurrent: true,
                nativeBulletin: {
                    date: 'May 10, 2026',
                    priestReflection:
                        'First reflection paragraph that should carry the drop cap.\n\nSecond reflection paragraph that must NOT carry a drop cap.',
                    sections: [
                        { title: 'Parish Notice', content: 'A general notice — never drop-capped.' },
                        { title: 'Another Notice', content: 'A second general notice.' },
                    ],
                },
            },
        ],
    };
}

function renderBulletin() {
    return render(
        <MemoryRouter initialEntries={[`/news-events/bulletin/${BULLETIN_ID}`]}>
            <Routes>
                <Route path="/news-events/bulletin/:id" element={<BulletinPage />} />
            </Routes>
        </MemoryRouter>,
    );
}

afterEach(() => {
    cleanup();
    mockUseParishData.mockReset();
});

describe('BulletinPage — scoped reflection drop cap (Decision 6)', () => {
    // Validates: Requirements 3.7
    it('wraps the priest reflection in a .reflection-prose container', () => {
        mockUseParishData.mockReturnValue({
            content: null,
            newsletters: makeNewsletters(),
            isLoading: false,
            error: null,
            reload: vi.fn(),
        });

        const { container } = renderBulletin();

        const prose = container.querySelector('.reflection-prose');
        expect(prose).not.toBeNull();
        // The first paragraph (drop-cap target) lives inside the prose container.
        const firstPara = prose?.querySelector('p:first-of-type');
        expect(firstPara?.textContent).toContain('First reflection paragraph');
    });

    // Validates: Requirements 3.7 — the canonical drop cap is delivered via the
    // scoped ::first-letter rule, NOT a manual first-character <span> hack.
    it('does not use the legacy manual drop-cap span (no text-parish-brass / float-left span)', () => {
        mockUseParishData.mockReturnValue({
            content: null,
            newsletters: makeNewsletters(),
            isLoading: false,
            error: null,
            reload: vi.fn(),
        });

        const { container } = renderBulletin();

        expect(container.querySelector('span.text-parish-brass')).toBeNull();
        expect(container.querySelector('span.float-left')).toBeNull();
    });

    // Validates: Requirements 3.8 / Decision 6 — liturgical / general bulletin
    // section content is never placed inside the drop-cap-scoped container.
    it('keeps bulletin section content outside the .reflection-prose container', () => {
        mockUseParishData.mockReturnValue({
            content: null,
            newsletters: makeNewsletters(),
            isLoading: false,
            error: null,
            reload: vi.fn(),
        });

        const { container } = renderBulletin();

        const proseContainers = container.querySelectorAll('.reflection-prose');
        // Exactly one drop-cap-scoped container — the priest's reflection.
        expect(proseContainers.length).toBe(1);

        const sectionContent = screen.getByText('A general notice — never drop-capped.');
        expect(sectionContent.closest('.reflection-prose')).toBeNull();
    });
});
