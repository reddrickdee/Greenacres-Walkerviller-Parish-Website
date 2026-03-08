import '@testing-library/jest-dom';

/* ── Browser API polyfills for jsdom ────────────────────────────────── */

// IntersectionObserver — required by framer-motion viewport features
class MockIntersectionObserver implements IntersectionObserver {
    readonly root: Element | null = null;
    readonly rootMargin: string = '';
    readonly thresholds: ReadonlyArray<number> = [];
    constructor(
        _callback: IntersectionObserverCallback,
        _options?: IntersectionObserverInit,
    ) { }
    observe() { }
    unobserve() { }
    disconnect() { }
    takeRecords(): IntersectionObserverEntry[] {
        return [];
    }
}
globalThis.IntersectionObserver = MockIntersectionObserver;

// ResizeObserver — sometimes needed by layout components
class MockResizeObserver implements ResizeObserver {
    constructor(_callback: ResizeObserverCallback) { }
    observe() { }
    unobserve() { }
    disconnect() { }
}
globalThis.ResizeObserver = MockResizeObserver;

// matchMedia — needed for responsive hooks and reduced-motion detection
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => { },
        removeListener: () => { },
        addEventListener: () => { },
        removeEventListener: () => { },
        dispatchEvent: () => false,
    }),
});
