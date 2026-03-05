import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import { SpeedInsights } from '@vercel/speed-insights/react';
import App from './App.tsx';
import { ParishDataProvider } from './context/ParishDataContext.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import './index.css';

// ── PWA Service Worker Registration ──────────────────────────────────────────
// Using 'prompt' strategy: users are notified when a new version is available
// so they can choose to refresh (important for mass time changes etc.)
registerSW({
    onNeedRefresh() {
        // Show a subtle update banner — implemented in App.tsx via PWAUpdateBanner
        window.dispatchEvent(new CustomEvent('pwa-update-available'));
    },
    onOfflineReady() {
        console.info('[GW Parish] App is ready for offline use.');
    },
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider>
            <ParishDataProvider>
                <App />
                <SpeedInsights />
            </ParishDataProvider>
        </ThemeProvider>
    </StrictMode>,
);
