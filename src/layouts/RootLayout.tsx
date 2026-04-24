import { useState, useRef, useEffect, useCallback } from 'react';
import { useOverlay } from '../hooks/useOverlay';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { ArrowRight, Church, Clock3, HeartHandshake, Mail } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { AccessibilityMenu } from '../components/AccessibilityMenu';
import { ScrollToTop } from '../components/ScrollToTop';
import { SkipLink } from '../components/SkipLink';
import {
    PRIMARY_NAV,
    DRAWER_GROUPS,
    QUICK_ACTIONS,
    FOOTER_EXTRA_NAV,
    isActive,
} from '../lib/navigation';
import { PATHS } from '../lib/routes';
import { useLiturgicalSeason } from '../hooks/useLiturgicalSeason';
import { useParishData } from '../context/ParishDataContext';

export function RootLayout() {
    const location = useLocation();
    const season = useLiturgicalSeason();
    const { content } = useParishData();
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

    const isHeroTransparent = false;

    return (
        <div className="flex min-h-screen flex-col">
            <SkipLink />

            <nav
                className="fixed inset-x-0 top-0 z-sticky"
                role="navigation"
                aria-label="Main navigation"
            >
                {/* Utility strip — stays full-width */}
                <div className="border-b border-parish-shell-border/5 bg-parish-shell-bg text-parish-shell-fg">
                    <div className="mx-auto flex max-w-[1480px] items-center justify-center gap-3 px-4 py-2 text-center text-[0.68rem] font-semibold uppercase tracking-[0.28em] md:justify-between md:px-6">
                        <span className="hidden opacity-70 md:block">Greenacres + Walkerville Catholic Parish</span>
                        <span>In the footsteps of Jesus</span>
                    </div>
                </div>

                {/* Floating pill nav */}
                <div className="flex justify-center px-4 pt-3 md:px-6">
                    <div
                        className={`flex w-full max-w-[1480px] items-center justify-between gap-4 rounded-full px-5 py-3 transition-all duration-700 ease-premium ${isHeroTransparent
                            ? 'border border-white/10 bg-parish-overlay-bg/20 shadow-lg backdrop-blur-2xl'
                            : `border border-parish-border/10 bg-parish-surface/92 ${isScrolled ? 'shadow-sanctuary' : 'shadow-lg'} backdrop-blur-2xl`
                        }`}
                    >
                        <Link
                            to="/"
                            className="flex min-w-0 items-center gap-3 no-underline"
                            aria-label="Greenacres Walkerville Catholic Parish home"
                        >
                            <div className={`flex h-11 w-11 items-center justify-center rounded-full border border-parish-brass/35 shadow-halo backdrop-blur-md transition-colors duration-500 ${isHeroTransparent ? 'bg-parish-overlay-bg/30' : 'bg-parish-surface/75'}`}>
                                <img
                                    src="/icons/parish-logo-72.webp"
                                    alt="Greenacres Walkerville Parish logo"
                                    width={28}
                                    height={28}
                                    className="h-7 w-7 object-contain"
                                />
                            </div>
                            <div className="min-w-0 transition-colors duration-500">
                                <div className={`font-display text-lg leading-none md:text-xl ${isHeroTransparent ? 'text-white' : 'text-parish-fg'}`}>
                                    Greenacres Walkerville
                                </div>
                                <div className={`mt-0.5 truncate text-[0.6rem] font-semibold uppercase tracking-[0.28em] md:text-[0.65rem] ${isHeroTransparent ? 'text-white/70' : 'text-parish-muted'}`}>
                                    Catholic Parish
                                </div>
                            </div>
                        </Link>

                        <div className="hidden items-center gap-0.5 lg:flex">
                            {PRIMARY_NAV.map(link => {
                                const active = isActive(location.pathname, link.to);
                                const isMass = link.to === PATHS.MASS_TIMES;
                                const isNew = link.to === PATHS.NEW_HERE;
                                const emphasis = isMass
                                    ? 'bg-parish-fg text-parish-inverse shadow-halo hover:bg-parish-accent-hover'
                                    : isNew
                                        ? 'border border-parish-border/15 bg-parish-surface text-parish-fg hover:border-parish-brass/35'
                                        : 'text-parish-muted hover:bg-parish-border/6 hover:text-parish-fg';

                                return (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        className={`rounded-full px-3.5 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] no-underline transition-all duration-200 ${active
                                            ? 'bg-parish-fg text-parish-inverse shadow-halo dark:bg-parish-shell-border/10 dark:text-parish-shell-fg dark:shadow-none'
                                            : emphasis
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="flex items-center gap-2">
                            <div className={`flex items-center gap-1 rounded-full border px-1.5 py-1 backdrop-blur-md transition-colors duration-500 ${isHeroTransparent ? 'border-white/10 bg-white/5' : 'border-parish-border/10 bg-parish-surface/65'}`}>
                                <AccessibilityMenu />
                                <ThemeToggle />
                            </div>
                            <button
                                ref={hamburgerRef}
                                onClick={() => setMenuOpen(open => !open)}
                                className={`relative flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-700 ease-premium lg:hidden ${isHeroTransparent
                                    ? 'border-white/15 bg-white/5 text-white hover:bg-white/10'
                                    : 'border-parish-border/10 bg-parish-surface/70 text-parish-fg hover:border-parish-brass/35 hover:text-parish-accent'
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

                {/* Mobile drawer — full-screen glass overlay with staggered reveals */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                            className="fixed inset-0 top-0 z-[-1] bg-parish-overlay-bg/85 backdrop-blur-3xl lg:hidden"
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
                                                <div className="ornamental-kicker !text-parish-brass/80 mb-5">{group.title}</div>
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
                                                                className={`flex items-center justify-between rounded-[1.25rem] px-4 py-3 no-underline transition-all duration-300 active:scale-[0.98] ${isActive(location.pathname, link.to)
                                                                    ? 'bg-white/15 text-white'
                                                                    : 'text-white/75 hover:bg-white/5 hover:text-white'
                                                                }`}
                                                            >
                                                                <span className="text-sm font-semibold uppercase tracking-[0.18em]">{link.label}</span>
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
                                        className="md:col-span-5 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-md"
                                    >
                                        <div className="ornamental-kicker !text-parish-brass/80 mb-5">Quick Actions</div>
                                        <div className="space-y-3">
                                            {QUICK_ACTIONS.map(action => {
                                                const Icon = action.icon;
                                                return (
                                                    <Link
                                                        key={action.title}
                                                        to={action.to}
                                                        onClick={closeDrawer}
                                                        className="flex items-start gap-3 rounded-[1.5rem] px-4 py-4 text-white/85 no-underline transition-all duration-300 hover:bg-white/5 active:scale-[0.98]"
                                                    >
                                                        <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-parish-brass/30 bg-white/5 text-parish-brass">
                                                            <Icon className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-semibold uppercase tracking-[0.14em] text-white">{action.title}</div>
                                                            <div className="mt-1 text-sm leading-relaxed text-white/55">{action.detail}</div>
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
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

            <footer className="mt-8 border-t border-parish-shell-border/10 bg-parish-shell-bg px-6 py-24 text-parish-shell-fg md:px-10 lg:px-16" role="contentinfo">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
                        <div className="lg:col-span-5">
                            <div
                                className="section-label !text-parish-shell-muted mb-5"
                                style={{ '--season-color': season.cssColor } as React.CSSProperties}
                            >
                                <span
                                    className="mr-2 inline-block h-2 w-2 rounded-full"
                                    style={{ backgroundColor: season.cssColor }}
                                    aria-hidden="true"
                                />
                                Season of {season.label}
                            </div>
                            <Link to="/" className="no-underline">
                                <h2 className="max-w-md text-4xl text-parish-shell-fg md:text-5xl">
                                    A welcoming community of faith across Greenacres and Walkerville.
                                </h2>
                            </Link>
                            <p className="mt-5 max-w-xl text-base leading-relaxed text-parish-shell-muted md:text-lg">
                                Whether you are visiting for the first time or returning after years away, you are welcome here.
                            </p>
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                                <Link to="/new-here" className="pilgrimage-button">
                                    Plan A First Visit
                                </Link>
                                <Link to="/mass-times" className="pilgrimage-button-secondary !border-parish-shell-border/15 !bg-parish-shell-border/6 !text-parish-shell-fg">
                                    View Mass Times
                                </Link>
                            </div>
                        </div>

                        <div className="lg:col-span-7 grid gap-8 md:grid-cols-3">
                            <div>
                                <div className="ornamental-kicker !text-parish-brass mb-4">Visit</div>
                                <div className="space-y-4 text-parish-shell-fg/78">
                                    <div className="flex gap-3">
                                        <Church className="mt-1 h-4 w-4 text-parish-brass" />
                                        <div className="text-sm leading-relaxed">St Monica&apos;s Church, 90 North East Road, Walkerville</div>
                                    </div>
                                    <div className="flex gap-3">
                                        <Church className="mt-1 h-4 w-4 text-parish-brass" />
                                        <div className="text-sm leading-relaxed">St Martin&apos;s Church, Corner Muller and Hampstead Roads, Greenacres</div>
                                    </div>
                                    <div className="flex gap-3">
                                        <Clock3 className="mt-1 h-4 w-4 text-parish-brass" />
                                        <div className="text-sm leading-relaxed">Weekend Masses: Saturday 6:00pm and Sunday 9:30am</div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="ornamental-kicker !text-parish-brass mb-4">Explore</div>
                                <div className="space-y-3">
                                    {[...PRIMARY_NAV, ...FOOTER_EXTRA_NAV].map(link => (
                                        <Link
                                            key={link.to}
                                            to={link.to}
                                            className="block text-sm uppercase tracking-[0.18em] text-parish-shell-fg/78 no-underline transition-all duration-500 ease-premium hover:text-parish-shell-fg hover:translate-x-1"
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="ornamental-kicker !text-parish-brass mb-4">Belong</div>
                                <div className="space-y-4 text-parish-shell-fg/78">
                                    <Link to="/contact" className="flex items-center gap-3 no-underline text-sm leading-relaxed transition-colors hover:text-parish-shell-fg">
                                        <Mail className="h-4 w-4 text-parish-brass" />
                                        Contact the Parish Office
                                    </Link>
                                    <Link to="/volunteer" className="flex items-center gap-3 no-underline text-sm leading-relaxed transition-colors hover:text-parish-shell-fg">
                                        <HeartHandshake className="h-4 w-4 text-parish-brass" />
                                        Volunteer and serve
                                    </Link>
                                    <Link to="/news-events" className="flex items-center gap-3 no-underline text-sm leading-relaxed transition-colors hover:text-parish-shell-fg">
                                        <ArrowRight className="h-4 w-4 text-parish-brass" />
                                        Weekly bulletin archive
                                    </Link>
                                    <Link to="/safeguarding" className="flex items-center gap-3 no-underline text-sm leading-relaxed transition-colors hover:text-parish-shell-fg">
                                        <ArrowRight className="h-4 w-4 text-parish-brass" />
                                        Safeguarding &amp; child protection
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-14 border-t border-parish-shell-border/10 pt-6 text-sm leading-relaxed text-parish-shell-muted/60 md:flex md:items-center md:justify-between md:gap-6">
                        <p>© {new Date().getFullYear()} Greenacres Walkerville Catholic Parish.</p>
                        <p>We acknowledge the Traditional Owners and Custodians of the lands on which our parish gathers and pay our respects to Elders past, present and emerging.</p>
                        {content?.lastVerified && (
                            <p>Parish information last checked {content.lastVerified}.</p>
                        )}
                    </div>
                </div>
            </footer>
        </div>
    );
}
