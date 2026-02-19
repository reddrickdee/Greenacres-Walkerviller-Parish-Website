/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                parish: {
                    bg: '#F9F8F6',      // Warm alabaster
                    surface: '#FFFFFF',
                    fg: '#1C1917',      // Deep slate instead of harsh black
                    muted: '#78716C',   // Stone gray
                    accent: '#D4AF37',  // Liturgical Gold

                    // Liturgical Seasons
                    advent: '#6B3FA0',
                    ordinary: '#2D5F2D',
                    martyrs: '#8B2332',
                }
            },
            fontFamily: {
                display: ['Cinzel', 'serif'],
                serif: ['"Cormorant Garamond"', 'serif'],
                body: ['Inter', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
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
