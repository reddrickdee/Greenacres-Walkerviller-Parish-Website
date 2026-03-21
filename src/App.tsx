import { lazy, Suspense, useState, useEffect, Component, type ReactNode, type ErrorInfo } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { AuthProvider } from './context/AuthContext';
import { Sparkles, X } from 'lucide-react';

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
import { PATHS } from './lib/routes';

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

// ── Chunk Error Boundary ──────────────────────────────────────────────────────
// Catches stale dynamic-import errors after a Vercel redeployment and auto-refreshes.
class ChunkErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
    constructor(props: { children: ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        // Detect stale chunk import failures
        if (
            error.message.includes('Failed to fetch dynamically imported module') ||
            error.message.includes('Importing a module script failed') ||
            error.message.includes('error loading dynamically imported module')
        ) {
            return { hasError: true };
        }
        throw error; // Re-throw non-chunk errors
    }

    componentDidCatch(_error: Error, _info: ErrorInfo) {
        // Auto-reload once; use sessionStorage to prevent infinite loops
        const key = 'chunk-reload-attempted';
        if (!sessionStorage.getItem(key)) {
            sessionStorage.setItem(key, '1');
            window.location.reload();
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-parish-surface flex items-center justify-center px-6">
                    <div className="text-center max-w-md">
                        <p className="font-display text-lg tracking-wider text-parish-fg mb-3">Page Update Available</p>
                        <p className="font-serif text-parish-muted text-sm mb-6">
                            A newer version of the site is available. Please refresh to continue.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-parish-accent text-parish-inverse px-6 py-3 rounded-full font-display text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
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
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-toast flex items-center gap-4 px-6 py-4 rounded-xl shadow-xl bg-parish-accent text-parish-inverse font-display text-sm"
        >
            <span className="flex items-center gap-2"><Sparkles size={14} /> A new version is available.</span>
            <button
                onClick={() => window.location.reload()}
                className="underline font-semibold hover:no-underline focus:outline-none focus:ring-2 focus:ring-parish-inverse rounded"
            >
                Refresh
            </button>
            <button
                onClick={() => setVisible(false)}
                aria-label="Dismiss update notification"
                className="ml-1 opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-parish-inverse rounded"
            >
                <X size={14} />
            </button>
        </div>
    );
}

// ── Router ────────────────────────────────────────────────────────────────────
/** Strip leading "/" so PATHS constants work as relative child routes. */
const rel = (p: string) => p.replace(/^\//, '');

const router = createBrowserRouter([
    {
        path: PATHS.HOME,
        element: <RootLayout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: rel(PATHS.MASS_TIMES), element: <MassTimesPage /> },
            { path: rel(PATHS.CONTACT), element: <ContactPage /> },
            { path: rel(PATHS.ABOUT), element: <AboutPage /> },
            { path: rel(PATHS.HISTORY), element: <HistoryPage /> },
            { path: rel(PATHS.NEW_HERE), element: <NewHerePage /> },
            { path: rel(PATHS.NEWS_EVENTS), element: <NewsEventsPage /> },
            { path: rel(PATHS.SACRAMENTS), element: <SacramentsServicesPage /> },
            { path: rel(PATHS.BULLETIN), element: <BulletinPage /> },
            { path: rel(PATHS.GALLERY), element: <GalleryPage /> },
            { path: rel(PATHS.SAFEGUARDING), element: <SafeguardingPage /> },
            { path: rel(PATHS.COMMUNITY), element: <CommunityHubPage /> },
            { path: rel(PATHS.ARTICLE_DETAIL), element: <ArticleDetailPage /> },
            { path: rel(PATHS.ARTICLE_NEW), element: <ContributorGuard><ArticleEditorPage /></ContributorGuard> },
            { path: rel(PATHS.GIVING), element: <GivingPage /> },
            { path: rel(PATHS.VOLUNTEER), element: <VolunteerPage /> },
            { path: rel(PATHS.SACRAMENTS_REQUEST), element: <SacramentsBookingPage /> },
            { path: rel(PATHS.LIVE), element: <LiveStreamPage /> },
            { path: rel(PATHS.HOMILIES), element: <HomiliesPage /> },
            { path: rel(PATHS.ADMIN_COMMUNITY), element: <AdminGuard><AdminCommunityPage /></AdminGuard> },
            { path: rel(PATHS.ADMIN_REFLECTIONS), element: <AdminGuard><AdminReflectionsPage /></AdminGuard> },
        ],
    },
]);

function App() {
    return (
        <AuthProvider>
            <ChunkErrorBoundary>
                <Suspense fallback={<PageSkeleton />}>
                    <RouterProvider router={router} />
                </Suspense>
            </ChunkErrorBoundary>
            <PWAUpdateBanner />
        </AuthProvider>
    );
}

export default App;
