import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { HomePage } from '../HomePage';
import { buildParishContent, buildMassEntry } from '../../test/fixtures';

// ── Mock useParishData ───────────────────────────────────────────────────────

const mockParishData = vi.fn();

vi.mock('../../context/ParishDataContext', () => ({
    useParishData: () => mockParishData(),
}));

function renderHome() {
    return render(
        <MemoryRouter initialEntries={['/']}>
            <HomePage />
        </MemoryRouter>,
    );
}

describe('HomePage', () => {
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

        renderHome();
        const body = document.body.textContent ?? '';
        expect(body).toContain('Loading');
    });

    it('renders parish content when data is loaded', () => {
        const content = buildParishContent({
            massSchedule: [
                buildMassEntry({
                    type: 'Vigil Mass',
                    dayOfWeek: 6,
                    startTime: '18:00',
                    church: "St Monica's Walkerville",
                }),
                buildMassEntry({
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

        renderHome();
        const body = document.body.textContent ?? '';
        // Parish name should be visible
        expect(body).toContain('Greenacres');
        expect(body).toContain('Walkerville');
    });

    it('renders priest welcome excerpt', () => {
        const content = buildParishContent({
            priestWelcome: 'Dear parishioners, welcome to our community of faith and love.',
            massSchedule: [
                buildMassEntry({ church: "St Monica's Walkerville" }),
            ],
        });

        mockParishData.mockReturnValue({
            content,
            newsletters: null,
            isLoading: false,
            error: null,
            reload: vi.fn(),
        });

        renderHome();
        const body = document.body.textContent ?? '';
        expect(body).toContain('parishioners');
    });

    it('renders sacrament cards from data', () => {
        const content = buildParishContent({
            sacraments: [
                { title: 'Baptism', details: 'Contact the parish office' },
                { title: 'Confirmation', details: 'Annual program' },
                { title: 'Marriage', details: 'Six months notice required' },
                { title: 'Reconciliation', details: 'Saturday 5:30pm' },
            ],
            massSchedule: [
                buildMassEntry({ church: "St Monica's Walkerville" }),
            ],
        });

        mockParishData.mockReturnValue({
            content,
            newsletters: null,
            isLoading: false,
            error: null,
            reload: vi.fn(),
        });

        renderHome();
        expect(screen.getByText('Baptism')).toBeInTheDocument();
        expect(screen.getByText('Confirmation')).toBeInTheDocument();
    });
});
