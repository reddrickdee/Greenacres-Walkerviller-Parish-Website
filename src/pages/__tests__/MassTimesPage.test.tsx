import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { MassTimesPage } from '../MassTimesPage';
import { buildParishContent, buildMassEntry } from '../../test/fixtures';

// ── Mock useParishData ───────────────────────────────────────────────────────

const mockParishData = vi.fn();

vi.mock('../../context/ParishDataContext', () => ({
    useParishData: () => mockParishData(),
}));

function renderPage() {
    return render(
        <MemoryRouter initialEntries={['/mass-times']}>
            <MassTimesPage />
        </MemoryRouter>,
    );
}

describe('MassTimesPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('shows loading state while data is loading', () => {
        mockParishData.mockReturnValue({
            content: null,
            newsletters: null,
            isLoading: true,
            error: null,
            reload: vi.fn(),
        });

        renderPage();
        const body = document.body.textContent ?? '';
        expect(body).toContain('Loading');
    });

    it('renders mass schedule when data is loaded', () => {
        const content = buildParishContent({
            massSchedule: [
                buildMassEntry({
                    id: 'sat-vigil',
                    type: 'Vigil Mass',
                    dayOfWeek: 6,
                    startTime: '18:00',
                    church: "St Monica's Walkerville",
                }),
                buildMassEntry({
                    id: 'sun-morning',
                    type: 'Sunday Mass',
                    dayOfWeek: 7,
                    startTime: '09:30',
                    church: "St Martin's Greenacres",
                }),
            ],
        });

        mockParishData.mockReturnValue({
            content,
            newsletters: null,
            isLoading: false,
            error: null,
            reload: vi.fn(),
        });

        renderPage();
        // Both church names should appear on the page
        const allMonica = screen.getAllByText(/Monica/i);
        const allMartin = screen.getAllByText(/Martin/i);
        expect(allMonica.length).toBeGreaterThan(0);
        expect(allMartin.length).toBeGreaterThan(0);
    });

    it('renders the worship schedule heading', () => {
        const content = buildParishContent({
            massSchedule: [
                buildMassEntry({
                    dayOfWeek: 6,
                    startTime: '18:00',
                    church: "St Monica's Walkerville",
                }),
            ],
        });

        mockParishData.mockReturnValue({
            content,
            newsletters: null,
            isLoading: false,
            error: null,
            reload: vi.fn(),
        });

        renderPage();
        const body = document.body.textContent ?? '';
        expect(body).toMatch(/worship|schedule|mass/i);
    });

    it('renders sacraments section when sacraments data exists', () => {
        const content = buildParishContent({
            massSchedule: [
                buildMassEntry({ church: "St Monica's Walkerville" }),
            ],
            sacraments: [
                { title: 'Baptism', details: 'Contact the parish office' },
                { title: 'Marriage', details: 'Six months notice required' },
            ],
        });

        mockParishData.mockReturnValue({
            content,
            newsletters: null,
            isLoading: false,
            error: null,
            reload: vi.fn(),
        });

        renderPage();
        expect(screen.getByText('Baptism')).toBeInTheDocument();
        expect(screen.getByText('Marriage')).toBeInTheDocument();
    });
});
