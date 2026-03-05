var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { visualizer } from 'rollup-plugin-visualizer';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: __spreadArray([
        react(),
        // ── Image Optimisation ──────────────────────────────────────────
        ViteImageOptimizer({
            jpg: { quality: 82 },
            jpeg: { quality: 82 },
            png: { quality: 85 },
            webp: { lossless: false, quality: 82 },
            avif: { lossless: false, quality: 75 },
        }),
        // ── Progressive Web App ─────────────────────────────────────────
        VitePWA({
            registerType: 'prompt',
            includeAssets: ['favicon.ico', 'parish-logo.png', 'robots.txt'],
            manifest: {
                name: 'Greenacres Walkerville Catholic Parish',
                short_name: 'GW Parish',
                description: 'Welcome to Greenacres Walkerville Catholic Parish, Broadview SA.',
                theme_color: '#6b2d2d',
                background_color: '#faf7f2',
                display: 'standalone',
                orientation: 'portrait',
                start_url: '/',
                scope: '/',
                icons: [
                    { src: '/icons/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
                    { src: '/icons/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
                    { src: '/icons/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
                ],
            },
            workbox: {
                // Cache-first for static assets — exclude large gallery images from precache
                globPatterns: ['**/*.{js,css,html,ico,svg,woff2}', 'icons/*.png', 'parish-logo.png'],
                // Raise limit to 5 MB so parish logo (3.5 MB) doesn't break the build
                maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
                runtimeCaching: [
                    {
                        // Network-first for API/Supabase calls
                        urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'supabase-api-cache',
                            expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 }, // 1 hour
                        },
                    },
                    {
                        // Stale-while-revalidate for parish JSON data files
                        urlPattern: /\/data\/.*\.json$/i,
                        handler: 'StaleWhileRevalidate',
                        options: {
                            cacheName: 'parish-data-cache',
                            expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 }, // 24 hours
                        },
                    },
                    {
                        // Cache-first for Google Fonts
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'google-fonts-cache',
                            expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }, // 1 year
                        },
                    },
                ],
            },
        })
    ], (process.env.ANALYZE
        ? [visualizer({ open: true, filename: 'dist/stats.html', gzipSize: true, brotliSize: true })]
        : []), true),
    build: {
        rollupOptions: {
            output: {
                // Split vendor chunks to maximise caching efficiency
                manualChunks: {
                    'vendor-react': ['react', 'react-dom'],
                    'vendor-router': ['react-router-dom'],
                    'vendor-motion': ['framer-motion'],
                    'vendor-supabase': ['@supabase/supabase-js'],
                    'vendor-icons': ['lucide-react'],
                },
            },
        },
        // Warn if a chunk exceeds 500 kB after gzip
        chunkSizeWarningLimit: 500,
    },
});
