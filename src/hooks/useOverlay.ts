import { useEffect, useRef, useCallback, type RefObject } from 'react';

/**
 * Shared overlay accessibility utility.
 *
 * Provides focus trapping, Escape‑to‑close, body scroll locking,
 * and focus restoration for modal/drawer/lightbox surfaces.
 *
 * Usage:
 *   const { overlayRef } = useOverlay({ isOpen, onClose, triggerRef });
 *   <div ref={overlayRef} ...>
 */
interface UseOverlayOptions {
    /** Whether the overlay is currently visible. */
    isOpen: boolean;
    /** Called when the overlay should close (Escape or backdrop click). */
    onClose: () => void;
    /**
     * Ref to the element that triggered the overlay.
     * Focus returns here when the overlay closes.
     */
    triggerRef?: RefObject<HTMLElement | null>;
    /**
     * If true, skip body scroll locking (e.g. for inline drawers
     * where the page behind is still partially visible but scrollable).
     */
    skipScrollLock?: boolean;
}

export function useOverlay({
    isOpen,
    onClose,
    triggerRef,
    skipScrollLock = false,
}: UseOverlayOptions) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const previousOverflow = useRef('');

    // ── Focus trap + Escape handler ──────────────────────────────────────
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
                return;
            }

            if (e.key !== 'Tab' || !overlayRef.current) return;

            const focusable = overlayRef.current.querySelectorAll<HTMLElement>(
                'a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])',
            );
            if (focusable.length === 0) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        },
        [onClose],
    );

    // ── Open: lock scroll, move focus in, attach key listener ────────────
    useEffect(() => {
        if (!isOpen) return;

        // Body scroll lock
        if (!skipScrollLock) {
            previousOverflow.current = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
        }

        // Move focus into overlay
        const el = overlayRef.current;
        if (el) {
            // Try to focus the first focusable element; fall back to the container.
            const firstFocusable = el.querySelector<HTMLElement>(
                'a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])',
            );
            if (firstFocusable) {
                firstFocusable.focus();
            } else {
                el.focus();
            }
        }

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);

            // Restore scroll
            if (!skipScrollLock) {
                document.body.style.overflow = previousOverflow.current;
            }
        };
    }, [isOpen, handleKeyDown, skipScrollLock]);

    // ── Close: return focus to trigger ───────────────────────────────────
    const prevOpen = useRef(false);
    useEffect(() => {
        if (prevOpen.current && !isOpen) {
            triggerRef?.current?.focus();
        }
        prevOpen.current = isOpen;
    }, [isOpen, triggerRef]);

    return { overlayRef, handleKeyDown };
}
