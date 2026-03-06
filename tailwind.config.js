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

                    // Liturgical Seasons
                    advent: '#6B3FA0',
                    ordinary: '#2D5F2D',
                    martyrs: '#8B2332',
                }
            },
            fontFamily: {
                display: ['Fraunces', 'serif'],
                serif: ['Fraunces', 'serif'],
                body: ['Manrope', 'sans-serif'],
                dyslexic: ['OpenDyslexic', 'sans-serif'],
            },
            fontSize: {
                // Readable base scale for elderly-friendly UI
                'body': ['1.125rem', { lineHeight: '1.75' }],   // 18px base
                'body-lg': ['1.25rem', { lineHeight: '1.7' }],  // 20px
                'body-xl': ['1.5rem', { lineHeight: '1.65' }],  // 24px
                'nav': ['0.875rem', { lineHeight: '1', letterSpacing: '0.1em' }],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            },
            boxShadow: {
                sanctuary: '0 35px 90px -45px rgba(0, 0, 0, 0.45)',
                halo: '0 22px 60px -32px hsla(var(--color-parish-brass), 0.35)',
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
            }
        },
    },
    plugins: [],
}
