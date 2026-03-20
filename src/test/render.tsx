import { render, type RenderOptions } from '@testing-library/react';
import { MemoryRouter, type MemoryRouterProps } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import type { ReactElement, ReactNode } from 'react';

/**
 * Options for the test render helper.
 *
 * @example
 *   renderApp(<GivingPage />, { route: '/giving' });
 *   renderApp(<HomePage />, { route: '/', parishOverrides: { tagline: 'test' } });
 */
export interface AppRenderOptions extends Omit<RenderOptions, 'wrapper'> {
    /** Initial route for MemoryRouter (default: '/') */
    route?: string;
    /** Extra MemoryRouter props (e.g. future flags) */
    routerProps?: Omit<MemoryRouterProps, 'initialEntries'>;
}

/**
 * Renders a component inside the provider stack used by the real app:
 * MemoryRouter → ThemeProvider.
 *
 * ParishDataProvider is intentionally omitted: pages that need parish
 * data should mock `useParishData` via vi.mock() at the test-file level
 * so each test can control loading/error/content states precisely.
 */
export function renderApp(
    ui: ReactElement,
    { route = '/', routerProps, ...renderOptions }: AppRenderOptions = {},
) {
    function Wrapper({ children }: { children: ReactNode }) {
        return (
            <MemoryRouter initialEntries={[route]} {...routerProps}>
                <ThemeProvider>
                    {children}
                </ThemeProvider>
            </MemoryRouter>
        );
    }

    return {
        ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    };
}
