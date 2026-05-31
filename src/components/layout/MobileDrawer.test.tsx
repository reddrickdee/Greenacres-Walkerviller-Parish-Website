// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useRef, type ReactElement } from 'react';

import { MobileDrawer } from './MobileDrawer';

/* ------------------------------------------------------------------ */
/*  MobileDrawer is the focus-trapped mobile overlay. It renders        */
/*  react-router <Link>s and the AccessibilityMenu/ThemeToggle, so it   */
/*  needs a Router + ThemeProvider. framer-motion's AnimatePresence     */
/*  drives the reveal/exit.                                             */
/* ------------------------------------------------------------------ */

const { mockUseTheme } = vi.hoisted(() => ({
    mockUseTheme: vi.fn(() => ({
        theme: 'light' as const,
        setTheme: vi.fn(),
        toggleTheme: vi.fn(),
    })),
}));

vi.mock('../../context/ThemeContext', () => ({
    useTheme: mockUseTheme,
}));

function renderInRouter(ui: ReactElement) {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
}

/**
 * Harness that owns a real trigger button + ref so we can assert focus
 * return behaviour. `isOpen` is controlled by the test via rerender.
 */
function DrawerHarness({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const triggerRef = useRef<HTMLButtonElement>(null);
    return (
        <>
            <button ref={triggerRef} data-testid="hamburger">
                Open menu
            </button>
            <MobileDrawer isOpen={isOpen} onClose={onClose} triggerRef={triggerRef} />
        </>
    );
}

afterEach(() => {
    cleanup();
});

describe('MobileDrawer — open/closed rendering', () => {
    // Validates: Requirements 2.5
    it('renders a modal dialog with the mobile-drawer id when open', () => {
        renderInRouter(<DrawerHarness isOpen onClose={vi.fn()} />);

        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeTruthy();
        expect(dialog.getAttribute('aria-modal')).toBe('true');
        expect(dialog.getAttribute('id')).toBe('mobile-drawer');
    });

    // Validates: Requirements 2.5
    it('renders no dialog when closed', () => {
        renderInRouter(<DrawerHarness isOpen={false} onClose={vi.fn()} />);
        expect(screen.queryByRole('dialog')).toBeNull();
    });
});

describe('MobileDrawer — Escape to close', () => {
    // Validates: Requirements 2.6
    it('invokes onClose when Escape is pressed while open', () => {
        const onClose = vi.fn();
        renderInRouter(<DrawerHarness isOpen onClose={onClose} />);

        act(() => {
            fireEvent.keyDown(document, { key: 'Escape' });
        });

        expect(onClose).toHaveBeenCalledTimes(1);
    });
});

describe('MobileDrawer — focus returns to trigger on close', () => {
    // Validates: Requirements 2.6
    it('moves focus back to the trigger when transitioning open -> closed', () => {
        const onClose = vi.fn();
        const { rerender } = renderInRouter(<DrawerHarness isOpen onClose={onClose} />);

        // Sanity: the drawer is open.
        expect(screen.getByRole('dialog')).toBeTruthy();

        const trigger = screen.getByTestId('hamburger');

        // Close the drawer — useOverlay should restore focus to the trigger.
        act(() => {
            rerender(
                <MemoryRouter>
                    <DrawerHarness isOpen={false} onClose={onClose} />
                </MemoryRouter>,
            );
        });

        expect(document.activeElement).toBe(trigger);
    });
});
