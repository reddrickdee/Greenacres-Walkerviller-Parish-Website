import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ExternalLink, FileText } from 'lucide-react';
import { useParishData } from '../context/ParishDataContext';
import { usePageSEO } from '../hooks/usePageSEO';
import { ActionBand, SectionIntro, HighlightPageTemplate } from '../components/layout/PageTemplates';
import { ContentLoading, ContentError } from '../components/ContentStates';

// ── helpers ────────────────────────────────────────────────────────────────────

/** Make the raw "CONNECTIONS 4TH SUN LENT" title more readable. */
function humanTitle(raw: string): string {
    return raw
        .replace(/^CONNECTIONS\s+/i, '')
        .split(/\s+/)
        .map((w, i) => {
            if (['OF', 'THE', 'AND'].includes(w) && i !== 0) return w.toLowerCase();
            return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
        })
        .join(' ');
}

// ── animation ──────────────────────────────────────────────────────────────────

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

// ── component ──────────────────────────────────────────────────────────────────

export function NewsEventsPage() {
    const { newsletters, isLoading } = useParishData();
    const prefersReduced = useReducedMotion();
    const m = prefersReduced ? noMotion : reveal;

    usePageSEO({
        title: 'News & Events — Connections Bulletin Archive',
        description:
            'Browse every issue of the Connections bulletin from Greenacres Walkerville Catholic Parish. Download any past bulletin as a PDF.',
        path: '/news-events',
        ogImage: '/assets/source/news_connections.webp',
    });

    if (isLoading) return <ContentLoading />;
    if (!newsletters) return <ContentError />;

    // Sort: current issue first, then alphabetical by title
    const sorted = [...newsletters.items].sort((a, b) => {
        if (a.isCurrent && !b.isCurrent) return -1;
        if (!a.isCurrent && b.isCurrent) return 1;
        return a.title.localeCompare(b.title);
    });

    const currentIssue = sorted.find(i => i.isCurrent);

    return (
        <HighlightPageTemplate
            eyebrow="Bulletin Archive"
            title={<>Connections — every issue, all in one place.</>}
            description="The Connections bulletin is published each weekend. Browse past issues below, or download the latest as a PDF."
            imageSrc="/assets/source/news_connections.webp"
            imageAlt="Connections parish bulletin"
            actions={(
                <>
                    {currentIssue && (
                        <a
                            href={currentIssue.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pilgrimage-button inline-flex items-center gap-2"
                        >
                            <FileText className="h-4 w-4" />
                            Download Latest Issue (PDF)
                        </a>
                    )}
                    <Link to="/contact" className="pilgrimage-button-secondary">
                        Contact The Parish
                    </Link>
                </>
            )}
            aside={(
                <div className="rounded-[1.5rem] border border-parish-brass/20 bg-parish-border/5 px-5 py-5">
                    <div className="ornamental-kicker">How It Works</div>
                    <p className="mt-3 text-sm leading-relaxed text-parish-muted">
                        A new Connections bulletin is published each weekend with the week's notices,
                        rosters, Mass changes, and community news. Every issue is saved here as a PDF.
                    </p>
                </div>
            )}
        >
            {/* ── Current Issue Highlight ──────────────────────────── */}
            {currentIssue && (
                <section className="page-section">
                    <div className="page-section-inner">
                        <motion.div {...m} className="sanctuary-panel px-6 py-7 md:px-8">
                            <div className="grid gap-6 md:grid-cols-12 md:items-center">
                                <div className="md:col-span-8">
                                    <div className="ornamental-kicker">Current Issue</div>
                                    <h2 className="mt-3 text-3xl text-parish-fg md:text-4xl">
                                        {humanTitle(currentIssue.title)}
                                    </h2>
                                    {currentIssue.nativeBulletin && (
                                        <p className="mt-3 text-base text-parish-muted">
                                            {currentIssue.nativeBulletin.date}
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-3 md:col-span-4 md:items-end">
                                    <a
                                        href={currentIssue.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="pilgrimage-button inline-flex items-center gap-2"
                                    >
                                        <FileText className="h-4 w-4" />
                                        Open PDF
                                    </a>
                                    {currentIssue.nativeBulletin && (
                                        <Link
                                            to={`/news-events/bulletin/${currentIssue.id}`}
                                            className="pilgrimage-button-secondary inline-flex items-center gap-2"
                                        >
                                            Read Online <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* ── Past Issues Grid ─────────────────────────────────── */}
            <section className="page-section mt-12 md:mt-16">
                <div className="page-section-inner">
                    <SectionIntro
                        eyebrow="Past Issues"
                        title={<>Browse the full Connections archive.</>}
                        description="Each issue links directly to the PDF on the parish website."
                    />

                    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {sorted.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 18 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{
                                    duration: prefersReduced ? 0 : 0.55,
                                    delay: prefersReduced ? 0 : (index % 6) * 0.04,
                                    ease: [0.32, 0.72, 0, 1],
                                }}
                                className="sanctuary-card flex items-center justify-between gap-4 px-5 py-4"
                            >
                                <div className="min-w-0">
                                    <h3 className="truncate text-sm font-semibold text-parish-fg">
                                        {humanTitle(item.title)}
                                    </h3>
                                    {item.isCurrent && (
                                        <span className="mt-1 inline-block rounded-full bg-parish-accent/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-parish-accent">
                                            Current
                                        </span>
                                    )}
                                    {item.nativeBulletin && (
                                        <Link
                                            to={`/news-events/bulletin/${item.id}`}
                                            className="mt-1 block text-xs text-parish-accent no-underline hover:underline"
                                        >
                                            Read online →
                                        </Link>
                                    )}
                                </div>
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-parish-border/15 text-parish-muted transition hover:border-parish-accent hover:text-parish-accent"
                                    aria-label={`Open PDF: ${item.title}`}
                                >
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Bottom CTA ───────────────────────────────────────── */}
            <section className="page-section mt-16 md:mt-20">
                <div className="page-section-inner">
                    <ActionBand>
                        <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
                            <div className="lg:col-span-8">
                                <span className="section-label mb-4">Stay Connected</span>
                                <h2 className="text-[clamp(2.2rem,4vw,3.9rem)] text-parish-fg">
                                    Check back each weekend for the latest Connections bulletin.
                                </h2>
                            </div>
                            <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
                                <Link to="/" className="pilgrimage-button">
                                    Back to Home
                                </Link>
                                <Link to="/contact" className="pilgrimage-button-secondary">
                                    Contact The Parish
                                </Link>
                            </div>
                        </div>
                    </ActionBand>
                </div>
            </section>
        </HighlightPageTemplate>
    );
}
