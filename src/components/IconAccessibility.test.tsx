// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import type { ReactElement } from 'react';

/* ------------------------------------------------------------------ */
/*  ContentError consumes useParishData() for its reload button, so    */
/*  we stub the context to render it in isolation.                     */
/* ------------------------------------------------------------------ */
const { mockUseParishData } = vi.hoisted(() => ({ mockUseParishData: vi.fn() }));

vi.mock('../context/ParishDataContext', () => ({
    useParishData: mockUseParishData,
}));

import { ThemeToggle } from './ThemeToggle';
import { AccessibilityMenu } from './AccessibilityMenu';
import { ContentError } from './ContentStates';
import { ThemeProvider } from '../context/ThemeContext';

/* ---------- helpers ---------- */

function renderWithTheme(ui: ReactElement) {
    return render(<ThemeProvider>{ui}</ThemeProvider>);
}

/**
 * Assert that every rendered lucide icon (an <svg>) within `container`
 * is marked decorative via aria-hidden="true". Robust to the exact
 * number of icons a component renders.
 */
function expectAllIconsAriaHidden(container: HTMLElement) {
    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
    icons.forEach(icon => {
        expect(icon.getAttribute('aria-hidden')).toBe('true');
    });
}

afterEach(() => {
    cleanup();
    mockUseParishData.mockReset();
});

/* ------------------------------------------------------------------ */
/*  Icon-only controls must expose an accessible name.                 */
/* ------------------------------------------------------------------ */

describe('Icon-only controls expose an accessible name', () => {
    // Validates: Requirements 1.3
    it('ThemeToggle button has an accessible name', () => {
        renderWithTheme(<ThemeToggle />);
        // The only content of the control is an icon; the name comes from aria-label.
        expect(screen.getByRole('button', { name: /switch to (light|dark) mode/i })).toBeTruthy();
    });

    // Validates: Requirements 1.3
    it('AccessibilityMenu trigger button has an accessible name', () => {
        render(<AccessibilityMenu />);
        expect(screen.getByRole('button', { name: /accessibility settings/i })).toBeTruthy();
    });

    // Validates: Requirements 1.3
    it('ContentError retry control (icon + text) has an accessible name', () => {
        mockUseParishData.mockReturnValue({ reload: vi.fn() });
        render(<ContentError />);
        expect(screen.getByRole('button', { name: /try again/i })).toBeTruthy();
    });
});

/* ------------------------------------------------------------------ */
/*  Decorative icons inside named controls carry aria-hidden="true".   */
/* ------------------------------------------------------------------ */

describe('Decorative icons carry aria-hidden', () => {
    // Validates: Requirements 1.3
    it('ThemeToggle icon is hidden from assistive tech', () => {
        const { container } = renderWithTheme(<ThemeToggle />);
        expectAllIconsAriaHidden(container);
    });

    // Validates: Requirements 1.3
    it('AccessibilityMenu trigger icon is hidden from assistive tech', () => {
        const { container } = render(<AccessibilityMenu />);
        // Only the closed trigger is rendered; its Settings glyph is decorative.
        expectAllIconsAriaHidden(container);
    });

    // Validates: Requirements 1.3
    it('ContentError decorative icons (retry, phone, mail) are all hidden', () => {
        mockUseParishData.mockReturnValue({ reload: vi.fn() });
        const { container } = render(<ContentError />);
        expectAllIconsAriaHidden(container);
    });
});
