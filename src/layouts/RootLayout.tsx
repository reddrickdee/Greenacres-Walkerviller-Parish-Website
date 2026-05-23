import { useState, useRef, useEffect, useCallback } from 'react';
import { useOverlay } from '../hooks/useOverlay';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { ArrowRight, Church, Clock3, Mail, Phone, Search } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { AccessibilityMenu } from '../components/AccessibilityMenu';
import { ScrollToTop } from '../components/ScrollToTop';
import { SkipLink } from '../components/SkipLink';
import {
    PRIMARY_NAV,
    DRAWER_GROUPS,
    QUICK_ACTIONS,
    FOOTER_QUICK_LINKS,
    isActive,
} from '../lib/navigation';
import { useLiturgicalSeason } from '../hooks/useLiturgicalSeason';

export function RootLayout() {
    const location = useLocation();
    const season = useLiturgicalSeason();
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

    const { overlayRef: drawerOverlayRef } = useOverlay({
        isOpen: menuOpen,
        onClose: closeDrawer,
        triggerRef: hamburgerRef,
        skipScrollLock: true,
    });

    const isHome = location.pathname === '/';
    const isHeroTransparent = isHome && !isScrolled;

    return (
        <div className="flex min-h-screen flex-col">
            <SkipLink />

            <nav
                className="fixed inset-x-0 top-0 z-sticky"
                role="navigation"
                aria-label="Main navigation"
            >
                {/* Utility strip — green with key links */}
                <div className="bg-parish-shell-bg text-parish-shell-fg">
                    <div className="mx-auto flex max-w-[1480px] items-center justify-between px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.22em] md:px-6">
                        <span className="hidden opacity-80 md:block">In the footsteps of Jesus</span>
                        <div className="flex items-center gap-4 mx-auto md:mx-0">
                            <Link
                                to="/contact"
                                className="text-parish-shell-fg/80 no-underline hover:text-white transition-colors"
                            >
                                Privacy
                            </Link>
                            <span className="text-parish-shell-fg/30 hidden md:inline">|</span>
                            <a
                                href="tel:(08) 8261 6100"
                                className="hidden md:flex items-center gap-1.5 text-parish-shell-fg/80 no-underline hover:text-white transition-colors"
                            >
                                <Phone className="h-3 w-3" />
                                (08) 8261 6100
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
                                <div className={`font-display text-lg leading-tight font-bold md:text-xl ${isHeroTransparent ? 'text-parish-fg' : 'text-parish-fg'}`}>
                                    Greenacres
                                </div>
                                <div className={`font-display text-lg leading-tight font-bold md:text-xl ${isHeroTransparent ? 'text-parish-fg' : 'text-parish-fg'}`}>
                                    Walkerville
                                </div>
                                <div className={`text-[0.55rem] font-semibold uppercase tracking-[0.22em] ${isHeroTransparent ? 'text-parish-muted' : 'text-parish-muted'}`}>
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
                            <div className="hidden md:flex items-center gap-1 rounded-full border border-parish-border/15 px-1.5 py-1">
                                <AccessibilityMenu />
                                <ThemeToggle />
                            </div>
                            <button
                                className="hidden md:flex h-9 w-9 items-center justify-center rounded-md text-parish-muted hover:text-parish-fg transition-colors"
                                aria-label="Search"
                            >
                                <Search className="h-4 w-4" />
                            </button>
                            <button
                                ref={hamburgerRef}
                                onClick={() => setMenuOpen(open => !open)}
                                className={`relative flex h-11 w-11 items-center justify-center rounded-md border transition-all duration-500 lg:hidden ${isHeroTransparent
                                    ? 'border-parish-border/15 text-parish-fg hover:bg-parish-elevated/50'
                                    : 'border-parish-border/15 text-parish-fg hover:bg-parish-elevated/50'
                                }`}
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

                {/* Mobile drawer */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                            className="fixed inset-0 top-0 z-[-1] bg-parish-surface/98 backdrop-blur-xl lg:hidden"
                            id="mobile-drawer"
                            ref={drawerOverlayRef}
                            role="dialog"
                            aria-label="Site navigation menu"
                            aria-modal="true"
                        >
                            <div className="flex h-full flex-col overflow-y-auto px-6 pb-8 pt-32 md:px-10">
                                <div className="mx-auto grid w-full max-w-[900px] gap-10 md:grid-cols-12">
                                    <div className="md:col-span-7 grid gap-10 md:grid-cols-2">
                                        {DRAWER_GROUPS.map((group, groupIdx) => (
                                            <div key={group.title}>
                                                <div className="ornamental-kicker mb-5">{group.title}</div>
                                                <div className="space-y-2">
                                                    {group.links.map((link, linkIdx) => (
                                                        <motion.div
                                                            key={link.to}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{
                                                                duration: 0.5,
                                                                delay: groupIdx * 0.1 + linkIdx * 0.06,
                                                                ease: [0.32, 0.72, 0, 1],
                                                            }}
                                                        >
                                                            <Link
                                                                to={link.to}
                                                                onClick={closeDrawer}
                                                                className={`flex items-center justify-between rounded-xl px-4 py-3 no-underline transition-all duration-300 active:scale-[0.98] ${isActive(location.pathname, link.to)
                                                                    ? 'bg-parish-accent/10 text-parish-accent'
                                                                    : 'text-parish-fg hover:bg-parish-elevated/50 hover:text-parish-accent'
                                                                }`}
                                                            >
                                                                <span className="text-sm font-semibold">{link.label}</span>
                                                                <ArrowRight className="h-4 w-4 opacity-40" />
                                                            </Link>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 24 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.3, ease: [0.32, 0.72, 0, 1] }}
                                        className="md:col-span-5 rounded-2xl border border-parish-border/15 bg-parish-elevated/50 p-6"
                                    >
                                        <div className="ornamental-kicker mb-5">Quick Actions</div>
                                        <div className="space-y-3">
                                            {QUICK_ACTIONS.map(action => {
                                                const Icon = action.icon;
                                                return (
                                                    <Link
                                                        key={action.title}
                                                        to={action.to}
                                                        onClick={closeDrawer}
                                                        className="flex items-start gap-3 rounded-xl px-4 py-4 no-underline transition-all duration-300 hover:bg-parish-accent/5 active:scale-[0.98]"
                                                    >
                                                        <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-parish-accent/10 text-parish-accent">
                                                            <Icon className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-semibold text-parish-fg">{action.title}</div>
                                                            <div className="mt-1 text-sm leading-relaxed text-parish-muted">{action.detail}</div>
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Mobile accessibility controls */}
                                <div className="mt-8 flex items-center justify-center gap-3 md:hidden">
                                    <AccessibilityMenu />
                                    <ThemeToggle />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            <ScrollToTop />
            <main id="main-content" className="flex-1" role="main">
                <Outlet />
            </main>

            {/* ── Footer ────────────────────────────────────────────────────── */}
            <footer className="mt-8 border-t border-parish-border/15 bg-parish-elevated/50 px-6 py-16 md:px-10 lg:px-16" role="contentinfo">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-16">
                        {/* Column 1: Parish identity */}
                        <div>
                            <Link to="/" className="flex items-center gap-3 no-underline mb-4">
                                <img
                                    src="/icons/parish-logo-72.webp"
                                    alt=""
                                    width={40}
                                    height={40}
                                    className="h-10 w-10 object-contain"
                                />
                                <div>
                                    <div className="font-display text-lg font-bold text-parish-fg leading-tight">
                                        Greenacres<br />Walkerville
                                    </div>
                                    <div className="text-[0.55rem] font-semibold uppercase tracking-[0.22em] text-parish-muted">
                                        Catholic Parish
                                    </div>
                                </div>
                            </Link>
                            <p className="text-sm leading-relaxed text-parish-muted">
                                A welcoming community of faith in the footsteps of Jesus.
                            </p>
                            <div className="mt-4 space-y-2 text-sm text-parish-muted">
                                <div className="flex gap-2">
                                    <Church className="mt-0.5 h-4 w-4 text-parish-accent shrink-0" />
                                    <span>St Monica&apos;s Church, 90 North East Road, Walkerville</span>
                                </div>
                                <div className="flex gap-2">
                                    <Church className="mt-0.5 h-4 w-4 text-parish-accent shrink-0" />
                                    <span>St Martin&apos;s Church, Corner Muller &amp; Hampstead Roads, Greenacres</span>
                                </div>
                            </div>
                            <div className="mt-6 border-t border-parish-border/15 pt-4 text-xs text-parish-muted">
                                <div className="font-semibold text-parish-fg uppercase tracking-wider mb-2">Child Safeguarding Contacts</div>
                                <p className="mb-1">
                                    Child Abuse Report Line: <a href="tel:131478" className="font-semibold text-parish-accent hover:underline">13 14 78</a>
                                </p>
                                <p>
                                    Archdiocese Office: <a href="tel:0882108150" className="font-semibold text-parish-accent hover:underline">(08) 8210 8150</a>
                                </p>
                            </div>
                        </div>

                        {/* Column 2: Quick Links */}
                        <div>
                            <h3 className="ornamental-kicker mb-4">Quick Links</h3>
                            <div className="space-y-2.5">
                                {FOOTER_QUICK_LINKS.map(link => (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        className="block text-sm text-parish-muted no-underline transition-colors duration-300 hover:text-parish-accent"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Column 3: Parish Office */}
                        <div>
                            <h3 className="ornamental-kicker mb-4">Parish Office</h3>
                            <div className="space-y-2.5 text-sm text-parish-muted">
                                <div className="flex gap-2">
                                    <Clock3 className="mt-0.5 h-4 w-4 text-parish-accent shrink-0" />
                                    <div>
                                        <p>Monday – Thursday</p>
                                        <p>9:00am – 3:00pm</p>
                                        <p className="mt-1">Friday</p>
                                        <p>9:00am – 12:00pm</p>
                                    </div>
                                </div>
                                <p className="text-xs text-parish-muted/60 mt-2">
                                    We are closed on public holidays.
                                </p>
                            </div>
                            <Link to="/contact" className="pilgrimage-button mt-6 text-xs">
                                Contact the Office
                            </Link>
                        </div>

                        {/* Column 4: Acknowledgement */}
                        <div>
                            <h3 className="ornamental-kicker mb-4">We acknowledge</h3>
                            <p className="text-sm leading-relaxed text-parish-muted">
                                We acknowledge the Kaurna people, the traditional custodians of the land on which we gather, and pay our respects to Elders past, present and emerging.
                            </p>
                            <div className="mt-6 flex items-center gap-3">
                                <a
                                    href="mailto:admin@gwparish.org.au"
                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-parish-border/15 text-parish-muted no-underline transition-colors hover:text-parish-accent hover:border-parish-accent/30"
                                    aria-label="Email"
                                >
                                    <Mail className="h-4 w-4" />
                                </a>
                                <a
                                    href="tel:(08) 8261 6100"
                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-parish-border/15 text-parish-muted no-underline transition-colors hover:text-parish-accent hover:border-parish-accent/30"
                                    aria-label="Phone"
                                >
                                    <Phone className="h-4 w-4" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="mt-12 border-t border-parish-border/15 pt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between text-xs text-parish-muted/60">
                        <p>© {new Date().getFullYear()} Greenacres Walkerville Catholic Parish</p>
                        <div className="flex items-center gap-4">
                            <Link to="/contact" className="no-underline hover:text-parish-accent transition-colors">
                                Privacy
                            </Link>
                            <a href="/sitemap.xml" className="no-underline hover:text-parish-accent transition-colors">
                                Terms of Use
                            </a>
                        </div>
                    </div>

                    {/* Liturgical season indicator */}
                    <div className="mt-4 flex items-center gap-2 text-xs text-parish-muted/40">
                        <span
                            className="inline-block h-2 w-2 rounded-full"
                            style={{ backgroundColor: season.cssColor }}
                            aria-hidden="true"
                        />
                        <span>Season of {season.label}</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
