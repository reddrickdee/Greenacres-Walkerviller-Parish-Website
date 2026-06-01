import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
    AlertCircle,
    Bell,
    Calendar,
    Church,
    Download,
    ShieldCheck,
    Users,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface NoticeItem {
    heading: string;
    body: string;
    imageAsset?: string;
    imageAlt?: string;
}

interface RosterRole {
    role: string;
    name: string;
}

interface RosterMass {
    label: string;
    roles: RosterRole[];
}

interface Roster {
    heading: string;
    saturday: RosterMass;
    sunday: RosterMass;
}

interface LiturgicalInfo {
    sundayTitle: string;
    weekdayReadings: string;
    note?: string;
}

interface MassChanges {
    heading: string;
    body: string;
}

interface WeeklyNoticesData {
    weekOf: string;
    issueTitle: string;
    pdfUrl: string;
    liturgicalInfo: LiturgicalInfo;
    massChanges: MassChanges;
    topNotices: NoticeItem[];
    thisWeek: NoticeItem[];
    communitySchool: NoticeItem[];
    roster: Roster;
}

// ── Animation helpers ─────────────────────────────────────────────────────────

const reveal = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-40px' },
    transition: { duration: 0.55, ease: [0.32, 0.72, 0, 1] as const },
};

const noMotion = {
    initial: { opacity: 1, y: 0 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0 },
};

// ── Subcomponents ─────────────────────────────────────────────────────────────

function NoticeCard({ item, index }: { item: NoticeItem; index: number }) {
    const prefersReduced = useReducedMotion();
    const motionProps = prefersReduced ? noMotion : {
        ...reveal,
        transition: { ...reveal.transition, delay: index * 0.04 },
    };

    return (
        <motion.div
            {...motionProps}
            className="overflow-hidden rounded-xl border border-parish-border/10 bg-parish-surface shadow-sm"
        >
            {item.imageAsset && (
                <img
                    src={`/${item.imageAsset}`}
                    alt={item.imageAlt ?? item.heading}
                    className="aspect-square w-full object-cover"
                    loading="lazy"
                />
            )}
            <div className="px-5 py-5 md:px-6 md:py-6">
                <h3 className="text-lg font-display text-parish-fg md:text-xl">
                    {item.heading}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-parish-muted">
                    {item.body}
                </p>
            </div>
        </motion.div>
    );
}

function SectionHeader({
    icon: Icon,
    label,
    title,
}: {
    icon: typeof Bell;
    label: string;
    title: string;
}) {
    return (
        <div className="flex items-center gap-3 mb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-parish-brass/25 bg-parish-elevated/65 text-parish-brass">
                <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
                <div className="text-[0.875rem] font-semibold uppercase tracking-[0.22em] text-parish-muted">
                    {label}
                </div>
                <h2 className="text-2xl font-display text-parish-fg md:text-3xl">
                    {title}
                </h2>
            </div>
        </div>
    );
}

function RosterSection({ roster }: { roster: Roster }) {
    const prefersReduced = useReducedMotion();
    const motionProps = prefersReduced ? noMotion : reveal;

    return (
        <motion.div {...motionProps} className="mt-3">
            <SectionHeader icon={Users} label="Volunteers" title={roster.heading} />
            <div className="grid gap-4 md:grid-cols-2">
                {[roster.saturday, roster.sunday].map(mass => (
                    <div
                        key={mass.label}
                        className="rounded-xl border border-parish-border/10 bg-parish-surface px-5 py-5 shadow-sm"
                    >
                        <div className="text-[1rem] font-semibold text-parish-fg">{mass.label}</div>
                        <div className="mt-3 space-y-2">
                            {mass.roles.map(r => (
                                <div key={r.role} className="flex justify-between text-[1rem] text-parish-muted">
                                    <span>{r.role}</span>
                                    <span className="font-medium text-parish-fg">{r.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function WeeklyNotices() {
    const [data, setData] = useState<WeeklyNoticesData | null>(null);
    const [error, setError] = useState(false);
    const prefersReduced = useReducedMotion();
    const motionProps = prefersReduced ? noMotion : reveal;

    useEffect(() => {
        fetch('/data/weekly_notices.json')
            .then(r => {
                if (!r.ok) throw new Error('Failed to load notices');
                return r.json();
            })
            .then(setData)
            .catch(() => setError(true));
    }, []);

    if (error) return null;
    if (!data) {
        return (
            <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-parish-accent/20 border-t-parish-accent" />
            </div>
        );
    }

    return (
        <section className="page-section" id="weekly-notices">
            <div className="page-section-inner">
                {/* Issue header + PDF download */}
                <motion.div {...motionProps} className="mb-8 md:mb-10">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <span className="section-label mb-3">This Week's Bulletin</span>
                            <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] text-parish-fg">
                                {data.issueTitle}
                            </h2>
                            <p className="mt-2 inline-flex items-center gap-2 text-[1rem] text-parish-muted">
                                <ShieldCheck className="h-4 w-4 text-parish-brass" aria-hidden="true" />
                                Current parish notices for the week of {data.weekOf}.
                            </p>
                        </div>
                        <a
                            href={data.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pilgrimage-button inline-flex items-center gap-2 shrink-0"
                        >
                            <Download className="h-4 w-4" aria-hidden="true" />
                            Download Bulletin PDF
                        </a>
                    </div>

                    {/* Liturgical info strip */}
                    <div className="mt-5 rounded-xl border border-parish-border/10 bg-parish-elevated/45 px-5 py-4 md:px-6">
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[1rem] text-parish-muted">
                            <span className="font-medium text-parish-fg">
                                {data.liturgicalInfo.sundayTitle}
                            </span>
                            <span>{data.liturgicalInfo.weekdayReadings}</span>
                            {data.liturgicalInfo.note && (
                                <span className="flex items-center gap-1 text-parish-accent">
                                    <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                                    {data.liturgicalInfo.note}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Mass schedule this week */}
                    {data.massChanges && (
                        <div className="mt-4 rounded-xl border border-parish-brass/20 bg-parish-brass/10 px-5 py-4 md:px-6">
                            <div className="flex items-start gap-3">
                                <Church className="h-5 w-5 mt-0.5 shrink-0 text-parish-brass" aria-hidden="true" />
                                <div>
                                    <div className="text-[1rem] font-semibold text-parish-fg">
                                        {data.massChanges.heading}
                                    </div>
                                    <p className="mt-1 text-[1rem] leading-relaxed text-parish-muted">
                                        {data.massChanges.body}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Top Notices */}
                <div className="mb-10">
                    <SectionHeader icon={Bell} label="Important" title="Top Notices" />
                    <div className="grid gap-4">
                        {data.topNotices.map((item, i) => (
                            <NoticeCard key={item.heading} item={item} index={i} />
                        ))}
                    </div>
                </div>

                {/* This Week at the Parish */}
                <div className="mb-10">
                    <SectionHeader icon={Calendar} label="Happening" title="This Week at the Parish" />
                    <div className="grid gap-4 md:grid-cols-2">
                        {data.thisWeek.map((item, i) => (
                            <NoticeCard key={item.heading} item={item} index={i} />
                        ))}
                    </div>
                </div>

                {/* Community & School */}
                <div className="mb-10">
                    <SectionHeader icon={Users} label="Community" title="Community & School" />
                    <div className="grid gap-4 md:grid-cols-2">
                        {data.communitySchool.map((item, i) => (
                            <NoticeCard key={item.heading} item={item} index={i} />
                        ))}
                    </div>
                </div>

                {/* Roster */}
                {data.roster && <RosterSection roster={data.roster} />}

                {/* Bottom PDF download */}
                <motion.div {...motionProps} className="mt-10 text-center">
                    <p className="text-[1rem] text-parish-muted mb-4">
                        For the full bulletin including readings, reflections, and additional notices:
                    </p>
                    <a
                        href={data.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pilgrimage-button-secondary inline-flex items-center gap-2"
                    >
                        <Download className="h-4 w-4" aria-hidden="true" />
                        Download Full Bulletin PDF
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
