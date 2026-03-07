/**
 * SkipLink — WCAG 2.2 compliant "Skip to main content" link.
 * Visually hidden until focused via keyboard navigation.
 */
export function SkipLink() {
    return (
        <a
            href="#main-content"
            className={[
                // Hidden by default, shown on focus (keyboard navigation)
                'sr-only focus:not-sr-only',
                // Positioning and appearance when visible
                'focus:fixed focus:top-4 focus:left-4 focus:z-[9999]',
                'focus:px-5 focus:py-3 focus:rounded-lg',
                'focus:bg-parish-accent focus:text-parish-inverse',
                'focus:font-display focus:font-semibold focus:text-sm focus:uppercase focus:tracking-wider',
                'focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-parish-inverse',
                'transition-none',
            ].join(' ')}
        >
            Skip to main content
        </a>
    );
}
