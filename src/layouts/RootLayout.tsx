import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { ArrowRight, CalendarClock, Church, Clock3, HeartHandshake, Mail, MapPinned, Menu, X } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { AccessibilityMenu } from '../components/AccessibilityMenu';
import { ScrollToTop } from '../components/ScrollToTop';
import { SkipLink } from '../components/SkipLink';

const PRIMARY_NAV = [
    { to: '/', label: 'Home' },
    { to: '/new-here', label: "I'm New Here" },
    { to: '/mass-times', label: 'Mass Times' },
    { to: '/about', label: 'About' },
    { to: '/news-events', label: 'News & Events' },
    { to: '/contact', label: 'Contact' },
];

const DRAWER_GROUPS = [
    {
        title: 'Explore',
        links: [
            { to: '/', label: 'Home' },
            { to: '/about', label: 'About Us' },
            { to: '/history', label: 'History' },
            { to: '/gallery', label: 'Gallery' },
            { to: '/new-here', label: "I'm New Here" },
        ],
    },
    {
        title: 'Worship',
        links: [
            { to: '/mass-times', label: 'Mass Times' },
            { to: '/sacraments', label: 'Sacraments' },
            { to: '/live', label: 'Live Stream' },
            { to: '/homilies', label: 'Homilies' },
            { to: '/news-events', label: 'News & Events' },
        ],
    },
    {
        title: 'Community',
        links: [
            { to: '/community', label: 'Community Hub' },
            { to: '/volunteer', label: 'Volunteer' },
            { to: '/giving', label: 'Give' },
            { to: '/contact', label: 'Contact' },
            { to: '/safeguarding', label: 'Safeguarding' },
        ],
    },
];

const QUICK_ACTIONS = [
    {
        icon: CalendarClock,
        title: 'Weekend Mass',
        detail: "Sat 6:00pm St Monica's / Sun 9:30am St Martin's",
        to: '/mass-times',
    },
    {
        icon: MapPinned,
        title: 'Plan your first visit',
        detail: 'Find parking, contact details, and what to expect.',
        to: '/new-here',
    },
    {
        icon: Mail,
        title: 'Speak with the parish office',
        detail: 'Reach out for pastoral care, sacraments, or support.',
        to: '/contact',
    },
];

function isActive(pathname: string, to: string) {
    if (to === '/') {
        return pathname === '/';
    }

    return pathname === to || pathname.startsWith(`${to}/`);
}

export function RootLayout() {
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, 'change', latest => {
        setIsScrolled(latest > 40);
    });

    const isHome = location.pathname === '/';
    const isHeroTransparent = isHome && !isScrolled;

    return (
        <div className="flex min-h-screen flex-col">
            <SkipLink />

            <nav
                className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${!isHeroTransparent
                    ? 'border-b border-parish-border/10 bg-parish-surface/95 shadow-sanctuary backdrop-blur-2xl'
                    : 'border-b border-transparent bg-transparent'
                    }`}
                role="navigation"
                aria-label="Main navigation"
            >
                <div className="border-b border-white/5 bg-[#12100E] text-[#EDE8DC]">
                    <div className="mx-auto flex max-w-[1480px] items-center justify-center gap-3 px-4 py-2 text-center text-[0.68rem] font-semibold uppercase tracking-[0.28em] md:justify-between md:px-6">
                        <span className="hidden opacity-70 md:block">Greenacres + Walkerville Catholic Parish</span>
                        <span>In the footsteps of Jesus</span>
                    </div>
                </div>

                <div className="mx-auto flex max-w-[1480px] items-center justify-between gap-4 px-4 py-4 md:px-6">
                    <Link
                        to="/"
                        className="flex min-w-0 items-center gap-3 no-underline"
                        aria-label="Greenacres Walkerville Catholic Parish home"
                    >
                        <div className={`flex h-14 w-14 items-center justify-center rounded-full border border-parish-brass/35 shadow-halo backdrop-blur-md transition-colors duration-500 ${isHeroTransparent ? 'bg-black/30' : 'bg-parish-surface/75'}`}>
                            <img
                                src="/parish-logo.png"
                                alt="Greenacres Walkerville Parish logo"
                                className="h-9 w-9 object-contain"
                            />
                        </div>
                        <div className="min-w-0 transition-colors duration-500">
                            <div className={`font-display text-xl leading-none md:text-2xl ${isHeroTransparent ? 'text-white' : 'text-parish-fg'}`}>
                                Greenacres Walkerville
                            </div>
                            <div className={`mt-1 truncate text-[0.65rem] font-semibold uppercase tracking-[0.28em] md:text-[0.72rem] ${isHeroTransparent ? 'text-white/80' : 'text-parish-muted'}`}>
                                Catholic Parish • Adelaide
                            </div>
                        </div>
                    </Link>

                    <div className="hidden items-center gap-1 xl:flex">
                        {PRIMARY_NAV.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`rounded-full px-4 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.24em] no-underline transition-all duration-300 ${isActive(location.pathname, link.to)
                                    ? 'bg-parish-fg text-parish-inverse shadow-halo dark:bg-white/10 dark:text-white dark:shadow-none'
                                    : isHeroTransparent
                                        ? 'text-white/85 hover:bg-white/10 hover:text-white'
                                        : 'text-parish-muted hover:bg-parish-border/6 hover:text-parish-fg'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <Link to="/community" className="pilgrimage-button-ghost hidden lg:inline-flex">
                            Community
                        </Link>
                        <Link to="/giving" className="pilgrimage-button hidden md:inline-flex">
                            Give
                        </Link>
                        <div className="flex items-center gap-1 rounded-full border border-parish-border/10 bg-parish-surface/65 px-1.5 py-1 backdrop-blur-md">
                            <AccessibilityMenu />
                            <ThemeToggle />
                        </div>
                        <button
                            onClick={() => setMenuOpen(open => !open)}
                            className="flex h-12 w-12 items-center justify-center rounded-full border border-parish-border/12 bg-parish-surface/70 text-parish-fg transition-colors hover:border-parish-brass/35 hover:text-parish-accent xl:hidden"
                            aria-expanded={menuOpen}
                            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        >
                            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                            className="border-t border-parish-border/10 bg-parish-surface/96 backdrop-blur-2xl xl:hidden"
                        >
                            <div className="mx-auto grid max-w-[1480px] gap-8 px-5 py-6 md:grid-cols-12 md:px-6">
                                <div className="md:col-span-8 grid gap-8 md:grid-cols-3">
                                    {DRAWER_GROUPS.map(group => (
                                        <div key={group.title}>
                                            <div className="ornamental-kicker mb-4">{group.title}</div>
                                            <div className="space-y-2">
                                                {group.links.map(link => (
                                                    <Link
                                                        key={link.to}
                                                        to={link.to}
                                                        onClick={() => setMenuOpen(false)}
                                                        className={`flex items-center justify-between rounded-[1.25rem] px-4 py-3 no-underline transition-all ${isActive(location.pathname, link.to)
                                                            ? 'bg-parish-fg text-parish-inverse'
                                                            : 'bg-parish-border/5 text-parish-fg hover:bg-parish-border/10'
                                                            }`}
                                                    >
                                                        <span className="text-sm font-semibold uppercase tracking-[0.18em]">{link.label}</span>
                                                        <ArrowRight className="h-4 w-4 opacity-60" />
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="md:col-span-4 sanctuary-panel p-5">
                                    <div className="ornamental-kicker mb-4">Quick Actions</div>
                                    <div className="space-y-3">
                                        {QUICK_ACTIONS.map(action => {
                                            const Icon = action.icon;
                                            return (
                                                <Link
                                                    key={action.title}
                                                    to={action.to}
                                                    onClick={() => setMenuOpen(false)}
                                                    className="flex items-start gap-3 rounded-[1.5rem] bg-parish-border/5 px-4 py-4 text-parish-fg no-underline transition-all hover:bg-parish-border/8"
                                                >
                                                    <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-parish-brass/25 bg-parish-surface/70 text-parish-brass">
                                                        <Icon className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-semibold uppercase tracking-[0.14em]">{action.title}</div>
                                                        <div className="mt-1 text-sm leading-relaxed text-parish-muted">{action.detail}</div>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
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

            <footer className="mt-8 border-t border-parish-border/10 bg-parish-fg px-6 py-16 text-parish-inverse md:px-10 lg:px-16" role="contentinfo">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
                        <div className="lg:col-span-5">
                            <div className="section-label !text-parish-inverse/65 before:!bg-parish-brass/80 mb-5">Sanctuary Light</div>
                            <Link to="/" className="no-underline">
                                <h2 className="max-w-md text-4xl text-parish-inverse md:text-5xl">
                                    A parish that feels calm, welcoming, and unmistakably Catholic.
                                </h2>
                            </Link>
                            <p className="mt-5 max-w-xl text-base leading-relaxed text-parish-inverse/72 md:text-lg">
                                Greenacres Walkerville Catholic Parish gathers across St Monica&apos;s Walkerville and St Martin&apos;s Greenacres. Whether you are visiting for the first time or returning after years away, you are welcome here.
                            </p>
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                                <Link to="/new-here" className="pilgrimage-button">
                                    Plan A First Visit
                                </Link>
                                <Link to="/mass-times" className="pilgrimage-button-secondary !border-white/15 !bg-white/6 !text-white">
                                    View Mass Times
                                </Link>
                            </div>
                        </div>

                        <div className="lg:col-span-7 grid gap-8 md:grid-cols-3">
                            <div>
                                <div className="ornamental-kicker !text-parish-brass mb-4">Visit</div>
                                <div className="space-y-4 text-parish-inverse/78">
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
                                    {PRIMARY_NAV.map(link => (
                                        <Link
                                            key={link.to}
                                            to={link.to}
                                            className="block text-sm uppercase tracking-[0.18em] text-parish-inverse/78 no-underline transition-colors hover:text-white"
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                    <Link to="/community" className="block text-sm uppercase tracking-[0.18em] text-parish-inverse/78 no-underline transition-colors hover:text-white">Community Hub</Link>
                                    <Link to="/safeguarding" className="block text-sm uppercase tracking-[0.18em] text-parish-inverse/78 no-underline transition-colors hover:text-white">Safeguarding</Link>
                                </div>
                            </div>

                            <div>
                                <div className="ornamental-kicker !text-parish-brass mb-4">Belong</div>
                                <div className="space-y-4 text-parish-inverse/78">
                                    <Link to="/contact" className="flex items-center gap-3 no-underline text-sm leading-relaxed transition-colors hover:text-white">
                                        <Mail className="h-4 w-4 text-parish-brass" />
                                        Contact the Parish Office
                                    </Link>
                                    <Link to="/volunteer" className="flex items-center gap-3 no-underline text-sm leading-relaxed transition-colors hover:text-white">
                                        <HeartHandshake className="h-4 w-4 text-parish-brass" />
                                        Volunteer and serve
                                    </Link>
                                    <Link to="/giving" className="flex items-center gap-3 no-underline text-sm leading-relaxed transition-colors hover:text-white">
                                        <ArrowRight className="h-4 w-4 text-parish-brass" />
                                        Support parish life
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-14 border-t border-white/10 pt-6 text-sm leading-relaxed text-parish-inverse/60 md:flex md:items-center md:justify-between md:gap-6">
                        <p>© {new Date().getFullYear()} Greenacres Walkerville Catholic Parish.</p>
                        <p>We acknowledge the Traditional Owners and Custodians of the lands on which our parish gathers and pay our respects to Elders past, present and emerging.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
