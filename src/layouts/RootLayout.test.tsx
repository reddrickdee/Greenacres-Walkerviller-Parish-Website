// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeAll, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

import { RootLayout } from './RootLayout';
import { ThemeProvider } from '../context/ThemeContext';

/* ------------------------------------------------------------------ */
/*  RootLayout is composition-only: SkipLink, Header, ScrollToTop,      */
/*  <main id="main-content">, Footer. Because it renders <Outlet/>, it  */
/*  must be driven through a real router. We mount it as the element of */
/*  a route and assert the landmark-count invariant (exactly one        */
/*  navigation, one main, one contentinfo). Header pulls in framer-     */
/*  motion (matchMedia) and ThemeToggle (ThemeProvider).                */
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

function renderRootLayout() {
    const router = createMemoryRouter(
        [
            {
                path: '/',
                element: <RootLayout />,
                children: [{ index: true, element: <div>Home route content</div> }],
            },
        ],
        { initialEntries: ['/'] },
    );

    return render(
        <ThemeProvider>
            <RouterProvider router={router} />
        </ThemeProvider>,
    );
}

afterEach(() => {
    cleanup();
});

describe('RootLayout — landmark invariants', () => {
    // Validates: Requirements 2.7
    it('renders exactly one navigation landmark', () => {
        renderRootLayout();
        expect(screen.getAllByRole('navigation').length).toBe(1);
        expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeTruthy();
    });

    // Validates: Requirements 2.7
    it('renders exactly one main landmark with id main-content', () => {
        renderRootLayout();
        const mains = screen.getAllByRole('main');
        expect(mains.length).toBe(1);
        expect(mains[0].getAttribute('id')).toBe('main-content');
    });

    // Validates: Requirements 2.7
    it('renders exactly one contentinfo landmark', () => {
        renderRootLayout();
        expect(screen.getAllByRole('contentinfo').length).toBe(1);
    });

    // Validates: Requirements 2.7
    it('renders the routed outlet content inside main', () => {
        renderRootLayout();
        const main = screen.getByRole('main');
        expect(main.textContent).toContain('Home route content');
    });
});
