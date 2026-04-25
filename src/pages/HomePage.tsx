import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
    ArrowRight,
    CalendarClock,
    FileText,
    Mail,
    MapPinned,
    Phone,
    ShieldCheck,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useParishData } from '../context/ParishDataContext';
import { usePageSEO } from '../hooks/usePageSEO';
import { JsonLdSchema } from '../components/JsonLdSchema';
import { HeroSection } from '../components/home/HeroSection';
import { WeeklyNotices } from '../components/home/WeeklyNotices';
import { ActionBand } from '../components/layout/PageTemplates';
import { ContentLoading, ContentError } from '../components/ContentStates';

// ── Animation helpers ─────────────────────────────────────────────────────────

const reveal = {
    initial: { opacity: 0, y: 24, filter: 'blur(8px)' },
    whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] as const },
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

            <div className="relative z-10 -mt-16 pb-32 md:pb-40">
                {/* ── Parish Today / Quick Access ────────────────────── */}
                <section className="page-section">
                    <div className="page-section-inner">
                        <motion.div
                            {...motionProps}
                            className="sanctuary-panel px-6 py-7 md:px-8 md:py-8"
                        >
                            <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                                <div>
                                    <span className="section-label mb-3">Parish Today</span>
                                    <h2 className="text-[clamp(1.8rem,3vw,2.7rem)] text-parish-fg">The practical things most people need first.</h2>
                                </div>
                                <p className="max-w-md text-sm leading-relaxed text-parish-muted">
                                    Content last checked {content.lastVerified}. Please contact the parish office if anything looks out of date.
                                </p>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                <TaskCard
                                    icon={CalendarClock}
                                    title="Come to Mass"
                                    body="Saturday 6:00pm at St Monica's and Sunday 9:30am at St Martin's."
                                    to="/mass-times"
                                    cta="View Mass Times"
                                />
                                <TaskCard
                                    icon={MapPinned}
                                    title="Plan a First Visit"
                                    body="Find parking, accessibility notes, what to expect, and how to arrive."
                                    to="/new-here"
                                    cta="First Visit Guide"
                                />
                                <TaskCard
                                    icon={FileText}
                                    title="Read This Week's Bulletin"
                                    body="Current notices, Mass changes, rosters, and parish news in one place."
                                    to="#weekly-notices"
                                    cta="Read Notices"
                                />
                                <TaskCard
                                    icon={Phone}
                                    title="Contact the Office"
                                    body={`${content.contact.phone} · ${content.contact.officeHours}`}
                                    to="/contact"
                                    cta="Contact Us"
                                />
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* ── Weekly Notices (bulletin content) ──────────────── */}
                <div className="mt-16 md:mt-24">
                    <WeeklyNotices />
                </div>

                {/* ── Come This Weekend CTA ──────────────────────────── */}
                <section className="page-section mt-16 md:mt-24">
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
                                    <div className="mt-5 flex flex-wrap gap-3 text-sm text-parish-muted">
                                        <span className="inline-flex items-center gap-2 rounded-full border border-parish-border/10 bg-parish-surface px-4 py-2">
                                            <Mail className="h-4 w-4 text-parish-brass" />
                                            {content.contact.email}
                                        </span>
                                        <Link to="/safeguarding" className="inline-flex items-center gap-2 rounded-full border border-parish-border/10 bg-parish-surface px-4 py-2 text-parish-muted no-underline hover:text-parish-accent">
                                            <ShieldCheck className="h-4 w-4 text-parish-brass" />
                                            Safeguarding
                                        </Link>
                                    </div>
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

function TaskCard({
    icon: Icon,
    title,
    body,
    to,
    cta,
}: {
    icon: LucideIcon;
    title: string;
    body: string;
    to: string;
    cta: string;
}) {
    const isAnchor = to.startsWith('#');
    const className = "group block rounded-xl border border-parish-border/10 bg-parish-surface px-5 py-5 text-parish-fg no-underline shadow-sm transition hover:-translate-y-0.5 hover:border-parish-brass/35 hover:shadow-sanctuary";
    const content = (
        <>
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-parish-brass/25 bg-parish-elevated/55 text-parish-brass">
                <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-xl text-parish-fg">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-parish-muted">{body}</p>
            <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-parish-accent">
                {cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </span>
        </>
    );

    if (isAnchor) {
        return <a href={to} className={className}>{content}</a>;
    }

    return <Link to={to} className={className}>{content}</Link>;
}
