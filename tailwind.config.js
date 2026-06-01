/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['selector', '[data-theme="dark"]'],
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                parish: {
                    bg: 'rgb(var(--color-parish-bg) / <alpha-value>)',
                    surface: 'rgb(var(--color-parish-surface) / <alpha-value>)',
                    elevated: 'rgb(var(--color-parish-elevated) / <alpha-value>)',
                    fg: 'rgb(var(--color-parish-fg) / <alpha-value>)',
                    muted: 'rgb(var(--color-parish-muted) / <alpha-value>)',
                    accent: 'rgb(var(--color-parish-accent) / <alpha-value>)',
                    'accent-hover': 'rgb(var(--color-parish-accent-hover) / <alpha-value>)',
                    secondary: 'rgb(var(--color-parish-secondary) / <alpha-value>)',
                    'secondary-hover': 'rgb(var(--color-parish-secondary-hover) / <alpha-value>)',
                    border: 'rgb(var(--color-parish-border) / <alpha-value>)',
                    inverse: 'rgb(var(--color-parish-inverse) / <alpha-value>)',
                    'inverse-muted': 'rgb(var(--color-parish-inverse-muted) / <alpha-value>)',
                    brass: 'hsl(var(--color-parish-brass) / <alpha-value>)',

                    // Shell surfaces (utility strip + footer)
                    'shell-bg': 'rgb(var(--color-parish-shell-bg) / <alpha-value>)',
                    'shell-fg': 'rgb(var(--color-parish-shell-fg) / <alpha-value>)',
                    'shell-muted': 'rgb(var(--color-parish-shell-muted) / <alpha-value>)',
                    'shell-border': 'rgb(var(--color-parish-shell-border) / <alpha-value>)',

                    // Overlay surfaces (photographic captions + glass panels)
                    'overlay-bg': 'rgb(var(--color-parish-overlay-bg) / <alpha-value>)',
                    'overlay-text': 'rgb(var(--color-parish-overlay-text) / <alpha-value>)',
                    'overlay-muted': 'rgb(var(--color-parish-overlay-muted) / <alpha-value>)',
                    'overlay-border': 'rgb(var(--color-parish-overlay-border) / <alpha-value>)',

                    // Liturgical Seasons
                    advent: '#6B3FA0',
                    ordinary: '#2D5F2D',
                    martyrs: '#8B2332',
                    christmas: '#C5A55A',
                    easter: '#C5A55A',
                }
            },
            fontFamily: {
                display: ['Merriweather', 'serif'],
                serif: ['Merriweather', 'serif'],
                body: ['Outfit', 'sans-serif'],
                dyslexic: ['OpenDyslexic', 'sans-serif'],
            },
            transitionTimingFunction: {
                premium: 'cubic-bezier(0.32, 0.72, 0, 1)',
            },
            spacing: {
                section: '6rem',
                'section-lg': '10rem',
            },
            fontSize: {
                // Readable base scale for elderly-friendly UI — mapped to --type-* tokens
                'body': ['var(--type-body)', { lineHeight: '1.85' }],     // 18px base
                'body-lg': ['var(--type-body-lg)', { lineHeight: '1.7' }], // 20px
                'body-xl': ['1.5rem', { lineHeight: '1.65' }],            // 24px
                'sub': ['var(--type-sub)', { lineHeight: '1.7' }],        // 16px — secondary text
                'label': ['var(--type-label)', { lineHeight: '1.4', letterSpacing: '0.1em' }],   // 14px — kickers/labels
                'button': ['var(--type-button)', { lineHeight: '1', letterSpacing: '0.1em' }],   // 15px — CTAs
                'fine': ['var(--type-fine)', { lineHeight: '1.5' }],      // 13px — fine print
                'caption': ['var(--type-caption)', { lineHeight: '1.5' }], // 14px — captions
                'nav': ['var(--type-nav)', { lineHeight: '1', letterSpacing: '0.1em' }], // 13px — nav (exception)
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            },
            boxShadow: {
                sanctuary: '0 4px 16px -4px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)',
                halo: '0 8px 32px -8px rgba(45, 95, 45, 0.2)',
                'halo-brass': '0 8px 32px -8px hsla(var(--color-parish-brass), 0.25)',
                card: '0 1px 3px rgba(0, 0, 0, 0.06), 0 8px 24px -8px rgba(0, 0, 0, 0.08)',
                'card-hover': '0 4px 12px rgba(0, 0, 0, 0.08), 0 12px 32px -8px rgba(0, 0, 0, 0.1)',
            },
            animation: {
                'fade-in': 'fadeIn 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
                'fade-in-up': 'fadeInUp 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            },
            zIndex: {
                sticky: '30',
                dropdown: '35',
                overlay: '40',
                modal: '50',
                toast: '60',
                skip: '70',
            },
        },
    },
    plugins: [],
}
