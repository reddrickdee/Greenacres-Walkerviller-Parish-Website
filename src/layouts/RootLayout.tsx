import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About Us' },
    { to: '/history', label: 'History' },
    { to: '/mass-times', label: 'Mass Times' },
    { to: '/sacraments', label: 'Sacraments' },
    { to: '/news-events', label: 'News & Events' },
    { to: '/contact', label: 'Contact' },
    { to: '/new-here', label: "I'm New Here" },
];

export function RootLayout() {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    return (
        <div className="min-h-screen flex flex-col">
            {/* ── Navigation ────────────────────────────────────────── */}
            <nav
                className="fixed top-0 left-0 right-0 z-50 bg-[#1C1917]/95 backdrop-blur-md border-b border-white/10"
                role="navigation"
                aria-label="Main navigation"
            >
                <div className="max-w-7xl mx-auto px-6 md:px-10 flex justify-between items-center h-20">
                    {/* Logo / Parish Name */}
                    <Link
                        to="/"
                        className="font-display font-semibold tracking-wider text-base text-white no-underline hover:text-parish-accent transition-colors"
                        aria-label="Greenacres Walkerville Parish – Home"
                    >
                        Greenacres Walkerville
                    </Link>

                    {/* Desktop Links (lg and up) */}
                    <div className="hidden lg:flex items-center gap-2">
                        {NAV_LINKS.filter(l => l.to !== '/').map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setMenuOpen(false)}
                                className={`
                  font-display tracking-wider text-nav uppercase px-4 py-3 rounded-lg transition-colors no-underline
                  ${location.pathname === link.to
                                        ? 'text-parish-accent bg-white/10'
                                        : 'text-white/80 hover:text-white hover:bg-white/5'}
                  ${link.to === '/new-here'
                                        ? 'border border-parish-accent text-parish-accent hover:bg-parish-accent hover:text-[#1C1917] ml-2'
                                        : ''}
                `}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="lg:hidden flex flex-col justify-center items-center w-12 h-12 rounded-lg hover:bg-white/10 transition-colors"
                        aria-expanded={menuOpen}
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    >
                        <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                        <span className={`block w-6 h-0.5 bg-white my-1.5 transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                        <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                    </button>
                </div>

                {/* Mobile Menu Drawer */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="lg:hidden bg-[#1C1917] border-t border-white/10 overflow-hidden"
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
                                                ? 'text-parish-accent bg-white/10'
                                                : 'text-white/80 hover:text-white hover:bg-white/5'}
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
            <main className="flex-1" role="main">
                <Outlet />
            </main>

            {/* ── Footer ────────────────────────────────────────────── */}
            <footer className="bg-[#1C1917] text-white px-8 md:px-16 py-20" role="contentinfo">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between gap-16">
                        {/* Branding */}
                        <div className="max-w-sm">
                            <Link to="/" className="font-display text-2xl tracking-wider text-parish-accent no-underline block mb-6">
                                Greenacres Walkerville<br />Catholic Parish
                            </Link>
                            <p className="font-serif text-lg text-white/60 italic leading-relaxed">
                                "I can do all things through Christ who strengthens me." — Philippians 4:13
                            </p>
                        </div>

                        {/* Navigation Columns */}
                        <div className="flex gap-16 md:gap-24">
                            <div className="flex flex-col gap-4">
                                <span className="font-display tracking-widest text-xs uppercase text-parish-accent mb-2">Discover</span>
                                <Link to="/" className="text-white/70 hover:text-parish-accent transition-colors no-underline font-serif text-lg py-1">Home</Link>
                                <Link to="/about" className="text-white/70 hover:text-parish-accent transition-colors no-underline font-serif text-lg py-1">About Us</Link>
                                <Link to="/history" className="text-white/70 hover:text-parish-accent transition-colors no-underline font-serif text-lg py-1">History</Link>
                                <Link to="/new-here" className="text-white/70 hover:text-parish-accent transition-colors no-underline font-serif text-lg py-1">I'm New Here</Link>
                            </div>
                            <div className="flex flex-col gap-4">
                                <span className="font-display tracking-widest text-xs uppercase text-parish-accent mb-2">Worship</span>
                                <Link to="/mass-times" className="text-white/70 hover:text-parish-accent transition-colors no-underline font-serif text-lg py-1">Mass Times</Link>
                                <Link to="/sacraments" className="text-white/70 hover:text-parish-accent transition-colors no-underline font-serif text-lg py-1">Sacraments</Link>
                                <Link to="/news-events" className="text-white/70 hover:text-parish-accent transition-colors no-underline font-serif text-lg py-1">News & Events</Link>
                                <Link to="/contact" className="text-white/70 hover:text-parish-accent transition-colors no-underline font-serif text-lg py-1">Contact</Link>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-white/40 font-serif text-base">
                            © {new Date().getFullYear()} Greenacres Walkerville Catholic Parish
                        </p>
                        <p className="text-white/30 font-serif text-sm italic">
                            In the Footsteps of Jesus
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
