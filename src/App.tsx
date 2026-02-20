import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { AuthProvider } from './context/AuthContext';
import { HomePage } from './pages/HomePage';
import { MassTimesPage } from './pages/MassTimesPage';
import { ContactPage } from './pages/ContactPage';
import { AboutPage } from './pages/AboutPage';
import { HistoryPage } from './pages/HistoryPage';
import { NewHerePage } from './pages/NewHerePage';
import { NewsEventsPage } from './pages/NewsEventsPage';
import { SacramentsServicesPage } from './pages/SacramentsServicesPage';
import { BulletinPage } from './pages/BulletinPage';
import { GalleryPage } from './pages/GalleryPage';
import { SafeguardingPage } from './pages/SafeguardingPage';
import { CommunityHubPage } from './pages/CommunityHubPage';
import { AdminCommunityPage } from './pages/AdminCommunityPage';
import { AdminGuard } from './components/community/AdminGuard';

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: 'mass-times',
                element: <MassTimesPage />,
            },
            {
                path: 'contact',
                element: <ContactPage />,
            },
            {
                path: 'about',
                element: <AboutPage />,
            },
            {
                path: 'history',
                element: <HistoryPage />,
            },
            {
                path: 'new-here',
                element: <NewHerePage />,
            },
            {
                path: 'news-events',
                element: <NewsEventsPage />,
            },
            {
                path: 'sacraments',
                element: <SacramentsServicesPage />,
            },
            {
                path: 'news-events/bulletin/:id',
                element: <BulletinPage />,
            },
            {
                path: 'gallery',
                element: <GalleryPage />,
            },
            {
                path: 'safeguarding',
                element: <SafeguardingPage />,
            },
            {
                path: 'community',
                element: <CommunityHubPage />,
            },
            {
                path: 'admin/community',
                element: <AdminGuard><AdminCommunityPage /></AdminGuard>,
            }
        ]
    }
]);

function App() {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    );
}

export default App;
