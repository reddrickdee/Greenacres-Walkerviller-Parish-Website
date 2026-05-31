// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeAll, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, act, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import type { ReactElement } from 'react';

import { Header } from './Header';
import { ThemeProvider } from '../../context/ThemeContext';

/* ------------------------------------------------------------------ */
/*  Header owns the nav landmark, the hamburger trigger, scroll state,  */
/*  and hosts the MobileDrawer. It uses framer-motion (useScroll /      */
/*  useMotionValueEvent) which probes matchMedia for reduced motion,    */
/*  so we provide a jsdom stub. Header also renders ThemeToggle, hence   */
/*  the ThemeProvider wrapper.                                          */
/* ------------------------------------------------------------------ */

beforeAll(() => {
    if (!window.matchMedia) {
        window.matchMedia = vi.fn().mockImplementation((query: string) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        })) as unknown as typeof window.matchMedia;
    }
});

function renderHeader(ui: ReactElement) {
    return render(
        <MemoryRouter initialEntries={['/']}>
            <ThemeProvider>{ui}</ThemeProvider>
        </MemoryRouter>,
    );
}

afterEach(() => {
    cleanup();
});

describe('Header — navigation landmark', () => {
    // Validates: Requirements 2.1, 2.7
    it('renders the Main navigation landmark', () => {
        renderHeader(<Header />);
        expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeTruthy();
    });
});

describe('Header — hamburger trigger', () => {
    // Validates: Requirements 2.6
    it('toggles aria-expanded and aria-label between Open/Close menu', () => {
        renderHeader(<Header />);
        const trigger = screen.getByRole('button', { name: /open menu/i });

        expect(trigger.getAttribute('aria-expanded')).toBe('false');
        expect(trigger.getAttribute('aria-controls')).toBe('mobile-drawer');

        act(() => {
            fireEvent.click(trigger);
        });

        const openTrigger = screen.getByRole('button', { name: /close menu/i });
        expect(openTrigger.getAttribute('aria-expanded')).toBe('true');

        act(() => {
            fireEvent.click(openTrigger);
        });

        expect(screen.getByRole('button', { name: /open menu/i }).getAttribute('aria-expanded')).toBe('false');
    });

    // Validates: Requirements 2.5, 2.6
    it('opens the mobile drawer dialog when activated', () => {
        renderHeader(<Header />);
        expect(screen.queryByRole('dialog')).toBeNull();

        act(() => {
            fireEvent.click(screen.getByRole('button', { name: /open menu/i }));
        });

        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeTruthy();
        expect(dialog.getAttribute('id')).toBe('mobile-drawer');
        expect(dialog.getAttribute('aria-modal')).toBe('true');
    });
});

describe('Header — route change closes the drawer', () => {
    // Validates: Requirements 2.6
    it('closes the open drawer when the route changes', async () => {
        function NavigateButton() {
            const navigate = useNavigate();
            return (
                <button data-testid="route-change" onClick={() => navigate('/contact')}>
                    navigate
                </button>
            );
        }

        render(
            <MemoryRouter initialEntries={['/']}>
                <ThemeProvider>
                    <Header />
                    <NavigateButton />
                </ThemeProvider>
            </MemoryRouter>,
        );

        // Open the drawer.
        act(() => {
            fireEvent.click(screen.getByRole('button', { name: /open menu/i }));
        });
        expect(screen.getByRole('dialog')).toBeTruthy();

        // Navigate — Header's effect on location.pathname must close the drawer.
        act(() => {
            fireEvent.click(screen.getByTestId('route-change'));
        });

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).toBeNull();
        });
    });
});
