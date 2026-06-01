import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Phone } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';
import { AccessibilityMenu } from '../AccessibilityMenu';
import { MobileDrawer } from './MobileDrawer';
import {
    PRIMARY_NAV,
    isActive,
} from '../../lib/navigation';
import { PATHS } from '../../lib/routes';

export function Header() {
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { scrollY } = useScroll();
    const hamburgerRef = useRef<HTMLButtonElement>(null);

    useMotionValueEvent(scrollY, 'change', latest => {
        setIsScrolled(latest > 40);
    });

    // Close drawer on route change
    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    const closeDrawer = useCallback(() => setMenuOpen(false), []);

    const isHome = location.pathname === '/';
    const isHeroTransparent = isHome && !isScrolled;

    return (
        <nav
            className="fixed inset-x-0 top-0 z-sticky"
            role="navigation"
            aria-label="Main navigation"
        >
            {/* Utility strip — green with key links */}
            <div className="bg-parish-shell-bg text-parish-shell-fg">
                <div className="mx-auto flex max-w-[1480px] items-center justify-between px-4 py-1.5 text-[0.8125rem] font-semibold uppercase tracking-[0.22em] md:px-6">
                    <span className="hidden opacity-80 md:block">In the footsteps of Jesus</span>
                    <div className="flex items-center gap-4 mx-auto md:mx-0">
                        <Link
                            to={PATHS.PRIVACY}
                            className="text-parish-shell-fg/80 no-underline hover:text-white transition-colors"
                        >
                            Privacy
                        </Link>
                        <span className="text-parish-shell-fg/30 hidden md:inline">|</span>
                        <a
                            href="tel:0882616200"
                            className="hidden md:flex items-center gap-1.5 text-parish-shell-fg/80 no-underline hover:text-white transition-colors"
                        >
                            <Phone className="h-3 w-3" aria-hidden="true" />
                            (08) 8261 6200
                        </a>
                    </div>
                </div>
            </div>

            {/* Main navigation bar */}
            <div
                className={`border-b transition-all duration-500 ${isScrolled
                    ? 'border-parish-border/15 bg-parish-surface/95 backdrop-blur-xl shadow-sm'
                    : isHeroTransparent
                        ? 'border-transparent bg-transparent'
                        : 'border-parish-border/10 bg-parish-surface/95 backdrop-blur-xl'
                }`}
            >
                <div className="mx-auto flex max-w-[1480px] items-center justify-between px-4 py-2.5 md:px-6">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex min-w-0 items-center gap-3 no-underline"
                        aria-label="Greenacres Walkerville Catholic Parish home"
                    >
                        <div className="flex h-10 w-10 items-center justify-center">
                            <img
                                src="/icons/parish-logo-72.webp"
                                alt="Greenacres Walkerville Parish logo"
                                width={36}
                                height={36}
                                className="h-9 w-9 object-contain"
                            />
                        </div>
                        <div className="min-w-0">
                            <div className="font-display text-lg leading-tight font-bold text-parish-fg md:text-xl">
                                Greenacres
                            </div>
                            <div className="font-display text-lg leading-tight font-bold text-parish-fg md:text-xl">
                                Walkerville
                            </div>
                            <div className="text-[0.8125rem] font-semibold uppercase tracking-[0.22em] text-parish-muted">
                                Catholic Parish
                            </div>
                        </div>
                    </Link>

                    {/* Desktop nav links */}
                    <div className="hidden items-center gap-0.5 lg:flex">
                        {PRIMARY_NAV.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`rounded-md px-3 py-2 text-[0.72rem] font-semibold no-underline transition-all duration-300 ${isActive(location.pathname, link.to)
                                    ? 'text-parish-accent'
                                    : 'text-parish-fg/80 hover:text-parish-accent'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right controls */}
                    <div className="flex items-center gap-2">
                        <Link
                            to={PATHS.GIVING}
                            className="pilgrimage-button hidden md:inline-flex !px-5 !py-2.5"
                        >
                            Give
                        </Link>
                        <div className="hidden md:flex items-center gap-1 rounded-full border border-parish-border/15 px-1.5 py-1">
                            <AccessibilityMenu />
                            <ThemeToggle />
                        </div>
                        <button
                            ref={hamburgerRef}
                            onClick={() => setMenuOpen(open => !open)}
                            className="relative flex h-11 w-11 items-center justify-center rounded-md border border-parish-border/15 text-parish-fg transition-all duration-500 hover:bg-parish-elevated/50 lg:hidden"
                            aria-expanded={menuOpen}
                            aria-controls="mobile-drawer"
                            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        >
                            {/* Animated hamburger → X morph */}
                            <motion.span
                                className="absolute h-[2px] w-5 rounded-full bg-current"
                                animate={menuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }}
                                transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                            />
                            <motion.span
                                className="absolute h-[2px] w-5 rounded-full bg-current"
                                animate={menuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }}
                                transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                            />
                        </button>
                    </div>
                </div>
            </div>

            <MobileDrawer
                isOpen={menuOpen}
                onClose={closeDrawer}
                triggerRef={hamburgerRef}
            />
        </nav>
    );
}
