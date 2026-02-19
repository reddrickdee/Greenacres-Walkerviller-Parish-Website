import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { HomePage } from './pages/HomePage';
import { MassTimesPage } from './pages/MassTimesPage';
import { ContactPage } from './pages/ContactPage';
import { AboutPage } from './pages/AboutPage';
import { HistoryPage } from './pages/HistoryPage';
import { NewHerePage } from './pages/NewHerePage';
import { NewsEventsPage } from './pages/NewsEventsPage';
import { SacramentsServicesPage } from './pages/SacramentsServicesPage';
import { BulletinPage } from './pages/BulletinPage';

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
            }
        ]
    }
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
