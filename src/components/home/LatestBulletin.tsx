import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Download, ExternalLink } from 'lucide-react';

interface BulletinData {
    weekOf: string;
    issueTitle: string;
    pdfUrl: string;
}

const reveal = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-40px' },
    transition: { duration: 0.7, ease: [0.32, 0.72, 0, 1] as const },
};

const noMotion = {
    initial: { opacity: 1, y: 0 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0 },
};

export function LatestBulletin() {
    const [data, setData] = useState<BulletinData | null>(null);
    const prefersReduced = useReducedMotion();
    const motionProps = prefersReduced ? noMotion : reveal;

    useEffect(() => {
        fetch('/data/weekly_notices.json')
            .then(r => {
                if (!r.ok) throw new Error('Failed to load');
                return r.json();
            })
            .then(setData)
            .catch(() => { /* silently fail */ });
    }, []);

    if (!data) return null;

    return (
        <section className="page-section" id="latest-bulletin">
            <div className="page-section-inner">
                <motion.div
                    {...motionProps}
                    className="overflow-hidden rounded-2xl border border-parish-border/15 bg-parish-elevated/50"
                    style={{ boxShadow: '0 2px 8px -2px rgba(0,0,0,0.06)' }}
                >
                    <div className="grid md:grid-cols-12 gap-0">
                        {/* Bulletin cover image */}
                        <div className="md:col-span-4 relative bg-parish-elevated p-6 md:p-8 flex items-center justify-center min-h-[240px]">
                            <div className="relative w-full max-w-[200px] aspect-[3/4] rounded-lg overflow-hidden shadow-card bg-parish-surface">
                                <img
                                    src="/assets/source/news_connections.webp"
                                    alt={`Parish bulletin: ${data.issueTitle}`}
                                    loading="lazy"
                                    decoding="async"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Bulletin info */}
                        <div className="md:col-span-8 px-6 py-8 md:px-10 md:py-10 flex flex-col justify-center">
                            <div className="ornamental-kicker mb-3">Latest Bulletin</div>
                            <h2 className="text-2xl font-display text-parish-fg md:text-3xl">
                                This week in our Parish
                            </h2>
                            <p className="mt-3 text-base leading-relaxed text-parish-muted max-w-lg">
                                Stay informed with the latest news, reflections, and events across our Parish community.
                            </p>

                            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                                <a
                                    href={data.pdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="pilgrimage-button inline-flex items-center gap-2"
                                >
                                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                                    Read Bulletin Online
                                </a>
                                <a
                                    href={data.pdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="pilgrimage-button-secondary inline-flex items-center gap-2"
                                    download
                                >
                                    <Download className="h-4 w-4" aria-hidden="true" />
                                    Download Bulletin (PDF)
                                </a>
                            </div>

                            <p className="mt-4 text-sm text-parish-muted">
                                {data.weekOf} · {data.issueTitle}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
