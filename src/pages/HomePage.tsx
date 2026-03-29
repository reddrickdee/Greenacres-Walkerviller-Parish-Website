import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
    ArrowRight,
    CalendarClock,
    Mail,
    Phone,
} from 'lucide-react';
import { useParishData } from '../context/ParishDataContext';
import { usePageSEO } from '../hooks/usePageSEO';
import { JsonLdSchema } from '../components/JsonLdSchema';
import { HeroSection } from '../components/home/HeroSection';
import { WeeklyNotices } from '../components/home/WeeklyNotices';
import { ActionBand } from '../components/layout/PageTemplates';
import { ContentLoading, ContentError } from '../components/ContentStates';

// ── Animation helpers ─────────────────────────────────────────────────────────

const reveal = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

const noMotion = {
    initial: { opacity: 1, y: 0 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0 },
};

// ── HomePage ──────────────────────────────────────────────────────────────────

export function HomePage() {
    const { content, isLoading } = useParishData();
    const prefersReduced = useReducedMotion();
    const motionProps = prefersReduced ? noMotion : reveal;

    usePageSEO({
        title: 'Greenacres Walkerville Catholic Parish',
        description:
            'Weekly parish notices, Mass times, and community updates for Greenacres Walkerville Catholic Parish in Adelaide.',
        path: '/',
        ogImage: '/assets/source/hero_4.webp',
    });

    if (isLoading) return <ContentLoading />;
    if (!content) return <ContentError />;

    return (
        <>
            <JsonLdSchema />
            <HeroSection />

            <div className="relative z-10 -mt-16 pb-24 md:pb-32">
                {/* ── Quick-Access Strip ─────────────────────────────── */}
                <section className="page-section">
                    <div className="page-section-inner">
                        <motion.div
                            {...motionProps}
                            className="sanctuary-panel px-6 py-6 md:px-8 md:py-7"
                        >
                            <div className="grid gap-5 md:grid-cols-3">
                                {/* Weekend Masses */}
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-parish-brass/25 bg-parish-elevated/65 text-parish-brass">
                                        <CalendarClock className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-parish-fg">Weekend Masses</div>
                                        <p className="mt-1 text-sm text-parish-muted">
                                            Sat 6:00pm — St Monica&apos;s
                                        </p>
                                        <p className="text-sm text-parish-muted">
                                            Sun 9:30am — St Martin&apos;s
                                        </p>
                                        <Link
                                            to="/mass-times"
                                            className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-parish-accent no-underline"
                                        >
                                            Full schedule <ArrowRight className="h-3.5 w-3.5" />
                                        </Link>
                                    </div>
                                </div>

                                {/* Parish Office */}
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-parish-brass/25 bg-parish-elevated/65 text-parish-brass">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-parish-fg">Parish Office</div>
                                        <p className="mt-1 text-sm text-parish-muted">
                                            {content.contact.phone}
                                        </p>
                                        <p className="text-sm text-parish-muted">
                                            {content.contact.officeHours}
                                        </p>
                                    </div>
                                </div>

                                {/* Contact */}
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-parish-brass/25 bg-parish-elevated/65 text-parish-brass">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-parish-fg">Get in Touch</div>
                                        <p className="mt-1 text-sm text-parish-muted">
                                            {content.contact.email}
                                        </p>
                                        <Link
                                            to="/contact"
                                            className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-parish-accent no-underline"
                                        >
                                            Contact us <ArrowRight className="h-3.5 w-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* ── Weekly Notices (bulletin content) ──────────────── */}
                <div className="mt-12 md:mt-16">
                    <WeeklyNotices />
                </div>

                {/* ── Come This Weekend CTA ──────────────────────────── */}
                <section className="page-section mt-12 md:mt-16">
                    <div className="page-section-inner">
                        <ActionBand>
                            <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
                                <div className="lg:col-span-7">
                                    <span className="section-label mb-4">Come This Weekend</span>
                                    <h2 className="text-[clamp(2rem,4vw,3.4rem)] text-parish-fg">
                                        Everyone is welcome at Mass.
                                    </h2>
                                    <p className="mt-4 max-w-2xl text-base leading-relaxed text-parish-muted md:text-lg">
                                        Join us this weekend for Mass at St Monica&apos;s or St Martin&apos;s. We look forward to welcoming you.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-3 lg:col-span-5 lg:items-end">
                                    <Link to="/mass-times" className="pilgrimage-button">
                                        View Mass Times
                                    </Link>
                                    <Link to="/new-here" className="pilgrimage-button-secondary">
                                        Read the First-Visit Guide
                                    </Link>
                                </div>
                            </div>
                        </ActionBand>
                    </div>
                </section>
            </div>
        </>
    );
}
