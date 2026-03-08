import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { ROUTE_META } from '../lib/navigation';

/**
 * Breadcrumb trail component.
 *
 * Renders: Home > Section > Current Page
 * Hidden on the home page itself.
 */
export function Breadcrumbs() {
    const { pathname } = useLocation();

    // Don't show breadcrumbs on the home page
    if (pathname === '/') return null;

    const meta = ROUTE_META[pathname];
    if (!meta) return null;

    return (
        <nav
            aria-label="Breadcrumb"
            className="page-section-inner mb-6 mt-2"
        >
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-parish-muted">
                <li>
                    <Link
                        to="/"
                        className="hover:text-parish-fg transition-colors no-underline"
                    >
                        Home
                    </Link>
                </li>
                <li aria-hidden="true">
                    <ChevronRight size={14} className="text-parish-muted/50" />
                </li>
                <li aria-current="page" className="font-medium text-parish-fg">
                    {meta.label}
                </li>
            </ol>
        </nav>
    );
}
