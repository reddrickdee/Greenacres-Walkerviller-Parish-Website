import { lazy, Suspense, useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { AuthProvider } from './context/AuthContext';

// ── Route-level Code Splitting ────────────────────────────────────────────────
// Each page is loaded only when the user navigates to it, reducing the initial
// bundle size significantly.
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const MassTimesPage = lazy(() => import('./pages/MassTimesPage').then(m => ({ default: m.MassTimesPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const HistoryPage = lazy(() => import('./pages/HistoryPage').then(m => ({ default: m.HistoryPage })));
const NewHerePage = lazy(() => import('./pages/NewHerePage').then(m => ({ default: m.NewHerePage })));
const NewsEventsPage = lazy(() => import('./pages/NewsEventsPage').then(m => ({ default: m.NewsEventsPage })));
const SacramentsServicesPage = lazy(() => import('./pages/SacramentsServicesPage').then(m => ({ default: m.SacramentsServicesPage })));
const BulletinPage = lazy(() => import('./pages/BulletinPage').then(m => ({ default: m.BulletinPage })));
const GalleryPage = lazy(() => import('./pages/GalleryPage').then(m => ({ default: m.GalleryPage })));
const SafeguardingPage = lazy(() => import('./pages/SafeguardingPage').then(m => ({ default: m.SafeguardingPage })));
const CommunityHubPage = lazy(() => import('./pages/CommunityHubPage').then(m => ({ default: m.CommunityHubPage })));
const AdminCommunityPage = lazy(() => import('./pages/AdminCommunityPage').then(m => ({ default: m.AdminCommunityPage })));
const AdminReflectionsPage = lazy(() => import('./pages/AdminReflectionsPage').then(m => ({ default: m.AdminReflectionsPage })));
const GivingPage = lazy(() => import('./pages/GivingPage').then(m => ({ default: m.GivingPage })));
const VolunteerPage = lazy(() => import('./pages/VolunteerPage').then(m => ({ default: m.VolunteerPage })));
const SacramentsBookingPage = lazy(() => import('./pages/SacramentsBookingPage').then(m => ({ default: m.SacramentsBookingPage })));
const LiveStreamPage = lazy(() => import('./pages/LiveStreamPage').then(m => ({ default: m.LiveStreamPage })));
const HomiliesPage = lazy(() => import('./pages/HomiliesPage').then(m => ({ default: m.HomiliesPage })));
const ArticleDetailPage = lazy(() => import('./pages/ArticleDetailPage').then(m => ({ default: m.ArticleDetailPage })));
const ArticleEditorPage = lazy(() => import('./pages/ArticleEditorPage').then(m => ({ default: m.ArticleEditorPage })));

// ── Route Guards ──────────────────────────────────────────────────────────────
import { AdminGuard } from './components/community/AdminGuard';
import { ContributorGuard } from './components/community/ContributorGuard';

// ── Page Loading Skeleton ─────────────────────────────────────────────────────
function PageSkeleton() {
    return (
        <div className="min-h-screen flex items-center justify-center" role="status" aria-label="Loading page">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-parish-accent/20 border-t-parish-accent rounded-full animate-spin" />
                <p className="text-parish-muted font-serif text-sm">Loading…</p>
            </div>
        </div>
    );
}

// ── PWA Update Banner ─────────────────────────────────────────────────────────
function PWAUpdateBanner() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handler = () => setVisible(true);
        window.addEventListener('pwa-update-available', handler);
        return () => window.removeEventListener('pwa-update-available', handler);
    }, []);

    if (!visible) return null;

    return (
        <div
            role="alert"
            aria-live="polite"
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-4 px-6 py-4 rounded-xl shadow-xl bg-parish-accent text-white font-display text-sm"
        >
            <span>✨ A new version is available.</span>
            <button
                onClick={() => window.location.reload()}
                className="underline font-semibold hover:no-underline focus:outline-none focus:ring-2 focus:ring-white rounded"
            >
                Refresh
            </button>
            <button
                onClick={() => setVisible(false)}
                aria-label="Dismiss update notification"
                className="ml-1 opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white rounded"
            >
                ✕
            </button>
        </div>
    );
}

// ── Router ────────────────────────────────────────────────────────────────────
const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: 'mass-times', element: <MassTimesPage /> },
            { path: 'contact', element: <ContactPage /> },
            { path: 'about', element: <AboutPage /> },
            { path: 'history', element: <HistoryPage /> },
            { path: 'new-here', element: <NewHerePage /> },
            { path: 'news-events', element: <NewsEventsPage /> },
            { path: 'sacraments', element: <SacramentsServicesPage /> },
            { path: 'news-events/bulletin/:id', element: <BulletinPage /> },
            { path: 'gallery', element: <GalleryPage /> },
            { path: 'safeguarding', element: <SafeguardingPage /> },
            { path: 'community', element: <CommunityHubPage /> },
            { path: 'community/articles/:id', element: <ArticleDetailPage /> },
            { path: 'community/editor/articles/new', element: <ContributorGuard><ArticleEditorPage /></ContributorGuard> },
            { path: 'giving', element: <GivingPage /> },
            { path: 'volunteer', element: <VolunteerPage /> },
            { path: 'sacraments/request', element: <SacramentsBookingPage /> },
            { path: 'live', element: <LiveStreamPage /> },
            { path: 'homilies', element: <HomiliesPage /> },
            { path: 'admin/community', element: <AdminGuard><AdminCommunityPage /></AdminGuard> },
            { path: 'admin/reflections', element: <AdminGuard><AdminReflectionsPage /></AdminGuard> },
        ],
    },
]);

function App() {
    return (
        <AuthProvider>
            <Suspense fallback={<PageSkeleton />}>
                <RouterProvider router={router} />
            </Suspense>
            <PWAUpdateBanner />
        </AuthProvider>
    );
}

export default App;
