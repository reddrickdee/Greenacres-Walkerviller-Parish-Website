import { Outlet } from 'react-router-dom';
import { ScrollToTop } from '../components/ScrollToTop';
import { SkipLink } from '../components/SkipLink';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

export function RootLayout() {
    return (
        <div className="flex min-h-screen flex-col">
            <SkipLink />

            <Header />

            <ScrollToTop />
            <main id="main-content" className="flex-1" role="main">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}
