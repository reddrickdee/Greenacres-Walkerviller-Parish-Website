import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useOverlay } from '../useOverlay';

/* ── helpers ─────────────────────────────────────────────────────────── */

/** Build a minimal DOM tree with focusable elements inside a container. */
function createOverlayDOM() {
    const container = document.createElement('div');
    const btn1 = document.createElement('button');
    btn1.textContent = 'First';
    const btn2 = document.createElement('button');
    btn2.textContent = 'Second';
    const btn3 = document.createElement('button');
    btn3.textContent = 'Third';
    container.append(btn1, btn2, btn3);
    document.body.appendChild(container);
    return { container, btn1, btn2, btn3 };
}

/* ── tests ───────────────────────────────────────────────────────────── */

describe('useOverlay', () => {
    let dom: ReturnType<typeof createOverlayDOM>;

    beforeEach(() => {
        dom = createOverlayDOM();
        document.body.style.overflow = '';
    });

    afterEach(() => {
        dom.container.remove();
    });

    it('locks body scroll when open and restores on close', () => {
        const onClose = vi.fn();
        const { rerender } = renderHook(
            ({ isOpen }) => useOverlay({ isOpen, onClose }),
            { initialProps: { isOpen: false } },
        );

        expect(document.body.style.overflow).toBe('');

        rerender({ isOpen: true });
        expect(document.body.style.overflow).toBe('hidden');

        rerender({ isOpen: false });
        expect(document.body.style.overflow).toBe('');
    });

    it('skips scroll lock when skipScrollLock is true', () => {
        const onClose = vi.fn();
        renderHook(() =>
            useOverlay({ isOpen: true, onClose, skipScrollLock: true }),
        );
        expect(document.body.style.overflow).not.toBe('hidden');
    });

    it('calls onClose when Escape is pressed', () => {
        const onClose = vi.fn();
        renderHook(() => useOverlay({ isOpen: true, onClose }));

        act(() => {
            document.dispatchEvent(
                new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
            );
        });

        expect(onClose).toHaveBeenCalledOnce();
    });

    it('traps focus: Tab on last element wraps to first', () => {
        const onClose = vi.fn();
        const { result } = renderHook(() =>
            useOverlay({ isOpen: true, onClose }),
        );

        // Manually wire the ref to our container
        (result.current.overlayRef as any).current = dom.container;

        dom.btn3.focus();
        expect(document.activeElement).toBe(dom.btn3);

        act(() => {
            const ev = new KeyboardEvent('keydown', {
                key: 'Tab',
                bubbles: true,
                cancelable: true,
            });
            document.dispatchEvent(ev);
        });

        expect(document.activeElement).toBe(dom.btn1);
    });

    it('traps focus: Shift+Tab on first element wraps to last', () => {
        const onClose = vi.fn();
        const { result } = renderHook(() =>
            useOverlay({ isOpen: true, onClose }),
        );

        (result.current.overlayRef as any).current = dom.container;

        dom.btn1.focus();

        act(() => {
            const ev = new KeyboardEvent('keydown', {
                key: 'Tab',
                shiftKey: true,
                bubbles: true,
                cancelable: true,
            });
            document.dispatchEvent(ev);
        });

        expect(document.activeElement).toBe(dom.btn3);
    });

    it('returns focus to trigger element on close', async () => {
        const onClose = vi.fn();
        const triggerBtn = document.createElement('button');
        triggerBtn.textContent = 'Trigger';
        document.body.appendChild(triggerBtn);

        const triggerRef = { current: triggerBtn };

        const { rerender } = renderHook(
            ({ isOpen }) => useOverlay({ isOpen, onClose, triggerRef }),
            { initialProps: { isOpen: true } },
        );

        // Close the overlay
        rerender({ isOpen: false });
        expect(document.activeElement).toBe(triggerBtn);

        triggerBtn.remove();
    });
});
