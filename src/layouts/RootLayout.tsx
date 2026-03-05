import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { ThemeToggle } from '../components/ThemeToggle';
import { AccessibilityMenu } from '../components/AccessibilityMenu';
import { ScrollToTop } from '../components/ScrollToTop';
import { SkipLink } from '../components/SkipLink';

const NAV_LINKS = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About Us' },
    { to: '/mass-times', label: 'Mass Times' },
    { to: '/sacraments', label: 'Sacraments' },
    { to: '/community', label: 'Community Hub' },
    { to: '/giving', label: 'Give' },
    { to: '/volunteer', label: 'Volunteer' },
    { to: '/live', label: 'Live Stream' },
    { to: '/homilies', label: 'Homilies' },
    { to: '/news-events', label: 'News & Events' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/history', label: 'History' },
    { to: '/contact', label: 'Contact' },
    { to: '/new-here', label: "I'm New Here" },
];

export function RootLayout() {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
    });

    return (
        <div className="min-h-screen flex flex-col">
            {/* ── Skip Navigation (WCAG 2.4.1) ────────────────────────── */}
            <SkipLink />
            {/* ── Navigation ────────────────────────────────────────── */}
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 flex flex-col ${isScrolled
                    ? 'bg-parish-surface/90 backdrop-blur-md border-b border-parish-border/10 py-0 shadow-lg shadow-parish-fg/5'
                    : 'bg-transparent border-b-0 py-2'
                    }`}
                role="navigation"
                aria-label="Main navigation"
            >
                <div className="max-w-[1480px] mx-auto px-4 md:px-6 flex justify-between items-center h-20">
                    {/* Logo / Parish Name */}
                    <Link
                        to="/"
                        className="flex items-center gap-3 shrink-0 whitespace-nowrap font-display font-semibold tracking-wider text-base text-parish-fg no-underline hover:text-parish-accent transition-colors"
                        aria-label="Greenacres Walkerville Parish – Home"
                    >
                        <img
                            src="/parish-logo.png"
                            alt="Greenacres Walkerville Parish logo"
                            className="h-12 w-12 object-contain"
                        />
                        Greenacres Walkerville
                    </Link>

                    <div className="flex items-center gap-2 md:gap-3">
                        {/* Desktop Links (2xl and up) */}
                        <div className="hidden 2xl:flex items-center">
                            {NAV_LINKS.filter(l => l.to !== '/').map(link => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setMenuOpen(false)}
                                    className={`
                      whitespace-nowrap font-display tracking-wider text-nav uppercase px-2 py-2.5 rounded-lg transition-colors no-underline
                      ${location.pathname === link.to
                                            ? 'text-parish-accent bg-parish-accent/10'
                                            : 'text-parish-muted hover:text-parish-fg hover:bg-parish-border/5'}
                      ${link.to === '/new-here'
                                            ? 'border border-parish-secondary text-parish-secondary hover:bg-parish-secondary hover:text-parish-inverse ml-3 font-semibold rounded-full px-4'
                                            : ''}
                    `}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        <div className="flex items-center gap-1">
                            <AccessibilityMenu />
                            <ThemeToggle />
                        </div>

                        {/* Mobile Hamburger */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="2xl:hidden flex flex-col justify-center items-center w-12 h-12 rounded-lg hover:bg-parish-border/5 transition-colors"
                            aria-expanded={menuOpen}
                            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        >
                            <span className={`block w-6 h-0.5 bg-parish-fg transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                            <span className={`block w-6 h-0.5 bg-parish-fg my-1.5 transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                            <span className={`block w-6 h-0.5 bg-parish-fg transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Drawer */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="2xl:hidden bg-parish-surface border-t border-parish-border/10 overflow-hidden"
                        >
                            <div className="px-6 py-6 flex flex-col gap-2">
                                {NAV_LINKS.map(link => (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        onClick={() => setMenuOpen(false)}
                                        className={`
                      font-display tracking-wider text-base uppercase px-5 py-4 rounded-xl transition-colors no-underline
                      ${location.pathname === link.to
                                                ? 'text-parish-accent bg-parish-accent/10'
                                                : 'text-parish-muted hover:text-parish-fg hover:bg-parish-border/5'}
                    `}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* ── Page Content ──────────────────────────────────────── */}
            <ScrollToTop />
            <main id="main-content" className="flex-1" role="main">
                <Outlet />
            </main>

            {/* ── Footer ────────────────────────────────────────────── */}
            <footer className="bg-parish-surface border-t border-parish-border/5 text-parish-fg px-8 md:px-16 py-20" role="contentinfo">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between gap-16">
                        {/* Branding */}
                        <div className="max-w-sm">
                            <Link to="/" className="font-display text-2xl tracking-wider text-parish-accent no-underline block mb-6">
                                Greenacres Walkerville<br />Catholic Parish
                            </Link>
                            <p className="font-serif text-lg text-parish-muted italic leading-relaxed">
                                "I can do all things through Christ who strengthens me." — Philippians 4:13
                            </p>
                        </div>

                        {/* Navigation Columns */}
                        <div className="flex gap-16 md:gap-24">
                            <div className="flex flex-col gap-4">
                                <span className="font-display tracking-widest text-xs uppercase text-parish-accent mb-2">Discover</span>
                                <Link to="/" className="text-parish-muted hover:text-parish-accent transition-colors no-underline font-serif text-lg py-1">Home</Link>
                                <Link to="/about" className="text-parish-muted hover:text-parish-accent transition-colors no-underline font-serif text-lg py-1">About Us</Link>
                                <Link to="/history" className="text-parish-muted hover:text-parish-accent transition-colors no-underline font-serif text-lg py-1">History</Link>
                                <Link to="/gallery" className="text-parish-muted hover:text-parish-accent transition-colors no-underline font-serif text-lg py-1">Gallery</Link>
                                <Link to="/community" className="text-parish-muted hover:text-parish-accent transition-colors no-underline font-serif text-lg py-1">Community Hub</Link>
                                <Link to="/new-here" className="text-parish-muted hover:text-parish-accent transition-colors no-underline font-serif text-lg py-1">I'm New Here</Link>
                            </div>
                            <div className="flex flex-col gap-4">
                                <span className="font-display tracking-widest text-xs uppercase text-parish-accent mb-2">Worship</span>
                                <Link to="/mass-times" className="text-parish-muted hover:text-parish-accent transition-colors no-underline font-serif text-lg py-1">Mass Times</Link>
                                <Link to="/sacraments" className="text-parish-muted hover:text-parish-accent transition-colors no-underline font-serif text-lg py-1">Sacraments</Link>
                                <Link to="/news-events" className="text-parish-muted hover:text-parish-accent transition-colors no-underline font-serif text-lg py-1">News & Events</Link>
                                <Link to="/contact" className="text-parish-muted hover:text-parish-accent transition-colors no-underline font-serif text-lg py-1">Contact</Link>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 pt-8 border-t border-parish-border/10 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-parish-muted font-serif text-base text-center md:text-left">
                            © {new Date().getFullYear()} Greenacres Walkerville Catholic Parish<br />
                            <Link to="/safeguarding" className="hover:text-parish-accent transition-colors">Safeguarding & Privacy</Link>
                        </p>
                        <p className="text-parish-muted font-serif text-sm italic text-center max-w-md">
                            We acknowledge the Traditional Owners and Custodians of the lands on which our parish gathers. We pay our respects to Elders past, present and emerging.
                        </p>
                        <p className="text-parish-muted font-serif text-sm italic text-center md:text-right">
                            In the Footsteps of Jesus
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
