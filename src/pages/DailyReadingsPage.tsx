import { useMemo, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { BookOpen, ExternalLink, RefreshCw, AlertCircle, Palette } from 'lucide-react';
import { usePageSEO } from '../hooks/usePageSEO';
import { useJsonLd } from '../hooks/useJsonLd';
import { useDailyMassReadings } from '../hooks/useDailyMassReadings';
import { useLiturgicalSeason } from '../hooks/useLiturgicalSeason';
import { resolveLiturgicalColour } from '../lib/liturgicalColour';
import { getAdelaideISODate } from '../lib/adelaideDate';
import type { ColourOverrides } from '../lib/liturgicalColour';
import type { ReadingSection } from '../hooks/useDailyMassReadings';

const reveal = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-40px' },
    transition: { duration: 0.7, ease: [0.32, 0.72, 0, 1] as const },
};

const noMotion = {
    initial: { opacity: 1, y: 0 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '0px' },
    transition: { duration: 0, ease: [0.32, 0.72, 0, 1] as const },
};

interface ReflectionLink {
    name: string;
    url: string;
    description: string;
}

const REFLECTION_LINKS: ReflectionLink[] = [
    {
        name: 'Universalis',
        url: 'https://universalis.com/Australia.Adelaide/mass.htm',
        description: 'Full Mass readings for the Australia – Adelaide calendar',
    },
    {
        name: 'Pray.com.au',
        url: 'https://pray.com.au/',
        description: 'Australian daily prayer and reflection',
    },
    {
        name: 'Sacred Space',
        url: 'https://www.sacredspace.ie/daily-prayer',
        description: 'Daily prayer from the Irish Jesuits',
    },
    {
        name: 'The Word Among Us',
        url: 'https://wau.org/meditations/daily/',
        description: 'Catholic daily meditation and reflection',
    },
];

function ReadingBlock({
    label,
    reading,
    motionProps,
}: {
    label: string;
    reading: ReadingSection;
    motionProps: typeof reveal;
}) {
    return (
        <motion.div {...motionProps} className="mb-10 last:mb-0">
            <h3 className="ornamental-kicker mb-2">{label}</h3>
            {reading.heading && (
                <p className="text-base font-display text-parish-fg mb-2 italic">
                    {reading.heading}
                </p>
            )}
            <p className="text-sm font-semibold text-parish-accent mb-3">
                {decodeHtmlEntities(reading.source)}
            </p>
            <div
                className="prose-parish text-base leading-[1.85] text-parish-fg"
                dangerouslySetInnerHTML={{ __html: sanitiseReadingHtml(reading.text) }}
            />
        </motion.div>
    );
}

function decodeHtmlEntities(html: string): string {
    const el = document.createElement('span');
    el.innerHTML = html;
    return el.textContent ?? html;
}

function sanitiseReadingHtml(html: string): string {
    return html
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .replace(/<(iframe|object|embed|form|input|button)[\s\S]*?>/gi, '');
}

export function DailyReadingsPage() {
    const { data, status, universalisUrl, retry } = useDailyMassReadings();
    const season = useLiturgicalSeason();
    const prefersReduced = useReducedMotion();
    const m = prefersReduced ? noMotion : reveal;

    const isoDate = getAdelaideISODate();

    const [colourOverrides, setColourOverrides] = useState<ColourOverrides>({});
    useEffect(() => {
        fetch('/data/liturgical_colour_overrides.json')
            .then(r => r.json())
            .then(d => setColourOverrides(d.overrides ?? {}))
            .catch(() => {});
    }, []);

    const colourInfo = useMemo(
        () => resolveLiturgicalColour(isoDate, season.season, colourOverrides),
        [isoDate, season.season, colourOverrides],
    );

    usePageSEO({
        title: "Today's Readings",
        description:
            'Daily Mass readings for the Australia – Adelaide liturgical calendar. First Reading, Psalm, Gospel, and reflection links.',
        path: '/daily-readings',
    });

    const jsonLdSchema = useMemo(
        () => ({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: "Today's Mass Readings — Greenacres Walkerville Catholic Parish",
            description:
                'Daily Mass readings for the Australia – Adelaide liturgical calendar.',
            url: 'https://www.gwparish.org.au/daily-readings',
            isPartOf: {
                '@type': 'WebSite',
                name: 'Greenacres Walkerville Catholic Parish',
                url: 'https://www.gwparish.org.au',
            },
        }),
        [],
    );
    useJsonLd(jsonLdSchema, 'daily-readings-page');

    return (
        <div className="page-shell">
            {/* Hero */}
            <section className="page-section pt-12 pb-8 md:pt-20 md:pb-12">
                <div className="page-section-inner">
                    <motion.div {...m}>
                        <p className="ornamental-kicker mb-3">Worship</p>
                        <h1 className="text-[clamp(2rem,4.5vw,3.2rem)] font-display text-parish-fg leading-tight">
                            Today&rsquo;s Readings
                        </h1>
                        <p className="mt-4 text-lg text-parish-muted max-w-2xl leading-relaxed">
                            The daily Mass readings for the Australia&nbsp;&ndash;&nbsp;Adelaide
                            liturgical calendar. Read, reflect, and prepare for Mass.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Liturgical day + colour */}
            {(status === 'success' && data) && (
                <section className="page-section pb-4">
                    <div className="page-section-inner">
                        <motion.div
                            {...m}
                            className="sanctuary-panel overflow-hidden"
                            style={{
                                background: `linear-gradient(135deg, ${colourInfo.cssColor}10 0%, transparent 60%)`,
                            }}
                        >
                            <div className="px-6 py-6 md:px-10 md:py-8 flex flex-col sm:flex-row sm:items-center gap-4">
                                <div className="flex-1">
                                    <p className="text-sm text-parish-muted">{data.date}</p>
                                    <div
                                        className="mt-1 text-lg font-display text-parish-fg [&_b]:font-bold"
                                        dangerouslySetInnerHTML={{ __html: sanitiseReadingHtml(data.day) }}
                                    />
                                </div>
                                <div className="flex items-center gap-2 text-sm text-parish-muted shrink-0">
                                    <Palette className="h-4 w-4" />
                                    <span>Liturgical colour:</span>
                                    <span
                                        className="inline-flex items-center gap-1.5 font-semibold"
                                        style={{ color: colourInfo.cssColor }}
                                    >
                                        <span
                                            className="inline-block h-2.5 w-2.5 rounded-full"
                                            style={{ backgroundColor: colourInfo.cssColor }}
                                            aria-hidden="true"
                                        />
                                        {colourInfo.label}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Loading */}
            {status === 'loading' && (
                <section className="page-section">
                    <div className="page-section-inner flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-parish-border/20 border-t-parish-accent" />
                            <p className="mt-4 text-base text-parish-muted">
                                Loading today&rsquo;s readings&hellip;
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {/* Error / Timeout */}
            {(status === 'error' || status === 'timeout') && (
                <section className="page-section">
                    <div className="page-section-inner">
                        <div className="sanctuary-panel px-6 py-8 md:px-10 md:py-10 text-center">
                            <AlertCircle className="mx-auto h-8 w-8 text-parish-muted mb-3" />
                            <h2 className="text-xl font-display text-parish-fg mb-2">
                                {status === 'timeout'
                                    ? 'The readings took too long to load'
                                    : 'Unable to load today\u2019s readings'}
                            </h2>
                            <p className="text-sm text-parish-muted mb-5 max-w-md mx-auto">
                                The readings are provided by Universalis. You can try again or
                                read them directly on the Universalis website.
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-3">
                                <button
                                    onClick={retry}
                                    className="pilgrimage-button-secondary"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                    Try Again
                                </button>
                                <a
                                    href={universalisUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="pilgrimage-button-ghost"
                                >
                                    Open on Universalis
                                    <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Readings */}
            {status === 'success' && data && (
                <section className="page-section" id="readings">
                    <div className="page-section-inner max-w-3xl">
                        <ReadingBlock
                            label="First Reading"
                            reading={data.Mass_R1}
                            motionProps={m}
                        />

                        <div className="section-divider my-8" />

                        <ReadingBlock
                            label="Responsorial Psalm"
                            reading={data.Mass_Ps}
                            motionProps={m}
                        />

                        <div className="section-divider my-8" />

                        {data.Mass_R2 && (
                            <>
                                <ReadingBlock
                                    label="Second Reading"
                                    reading={data.Mass_R2}
                                    motionProps={m}
                                />
                                <div className="section-divider my-8" />
                            </>
                        )}

                        {data.Mass_GA && (
                            <>
                                <ReadingBlock
                                    label="Gospel Acclamation"
                                    reading={data.Mass_GA}
                                    motionProps={m}
                                />
                                <div className="section-divider my-8" />
                            </>
                        )}

                        <ReadingBlock
                            label="Gospel"
                            reading={data.Mass_G}
                            motionProps={m}
                        />
                    </div>
                </section>
            )}

            {/* Reflection links */}
            <section className="page-section pt-8 md:pt-12" id="reflections">
                <div className="page-section-inner max-w-3xl">
                    <motion.div {...m}>
                        <h2 className="text-2xl font-display text-parish-fg mb-2">
                            Reflection Links
                        </h2>
                        <p className="text-sm text-parish-muted mb-8">
                            Deepen your prayer with these trusted daily reflection sources.
                        </p>
                    </motion.div>
                    <div className="grid gap-5 sm:grid-cols-2">
                        {REFLECTION_LINKS.map((link, i) => (
                            <motion.a
                                key={link.name}
                                {...(prefersReduced ? noMotion : { ...reveal, transition: { ...reveal.transition, delay: i * 0.06 } })}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex flex-col rounded-2xl border border-parish-border/15 bg-parish-surface px-6 py-6 no-underline transition-all duration-500 hover:-translate-y-0.5 hover:border-parish-accent/15 hover:shadow-card-hover"
                            >
                                <span className="flex items-center gap-2 text-base font-display text-parish-fg">
                                    <BookOpen className="h-4 w-4 text-parish-accent shrink-0" />
                                    {link.name}
                                    <ExternalLink className="h-3 w-3 text-parish-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                                </span>
                                <span className="mt-2 text-sm text-parish-muted leading-relaxed">
                                    {link.description}
                                </span>
                            </motion.a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Source + Copyright */}
            <section className="page-section pt-12 pb-16 md:pt-16" id="source">
                <div className="page-section-inner max-w-3xl">
                    <motion.div {...m} className="sanctuary-panel px-6 py-8 md:px-10 md:py-10">
                        <h3 className="text-sm font-display uppercase tracking-widest text-parish-muted mb-4">
                            Source
                        </h3>
                        <p className="text-sm text-parish-muted leading-relaxed">
                            Readings are provided by{' '}
                            <a
                                href="https://universalis.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-parish-accent underline hover:no-underline"
                            >
                                Universalis
                            </a>
                            , using the Australia&nbsp;&ndash;&nbsp;Adelaide liturgical calendar.
                        </p>
                        <p className="mt-3">
                            <a
                                href={universalisUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm text-parish-accent font-semibold hover:underline"
                            >
                                Open on Universalis
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        </p>
                        {status === 'success' && data?.copyright?.text && (
                            <div
                                className="mt-6 pt-5 border-t border-parish-border/10 text-xs text-parish-muted/60 leading-relaxed [&_a]:text-parish-accent [&_a]:underline"
                                dangerouslySetInnerHTML={{
                                    __html: sanitiseReadingHtml(data.copyright.text),
                                }}
                            />
                        )}
                    </motion.div>
                </div>
            </section>

            {/* No-JS fallback */}
            <noscript>
                <section className="page-section">
                    <div className="page-section-inner max-w-3xl">
                        <div className="sanctuary-panel px-6 py-8 text-center">
                            <p className="text-base text-parish-fg mb-3">
                                JavaScript is required to display today&rsquo;s readings inline.
                            </p>
                            <a
                                href="https://universalis.com/Australia.Adelaide/mass.htm"
                                className="pilgrimage-button"
                            >
                                Read today&rsquo;s readings on Universalis
                            </a>
                        </div>
                    </div>
                </section>
            </noscript>
        </div>
    );
}
