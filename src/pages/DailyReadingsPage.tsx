import { useMemo, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AlertCircle, BookOpen, ExternalLink, MessageCircle, Palette, RefreshCw } from 'lucide-react';
import { usePageSEO } from '../hooks/usePageSEO';
import { useJsonLd } from '../hooks/useJsonLd';
import { useDailyMassReadings } from '../hooks/useDailyMassReadings';
import { useLiturgicalSeason } from '../hooks/useLiturgicalSeason';
import { useReflectionSources } from '../hooks/useReflectionSources';
import { resolveLiturgicalColour } from '../lib/liturgicalColour';
import { getAdelaideISODate } from '../lib/adelaideDate';
import { getSourceBadge, shouldRenderExcerpt } from '../lib/reflectionSources';
import type { ColourOverrides } from '../lib/liturgicalColour';
import type { ReadingSection, UniversalisData } from '../hooks/useDailyMassReadings';
import type { ReflectionSource } from '../lib/reflectionSources';

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

type MotionConfig = typeof reveal & {
    transition: typeof reveal.transition & {
        delay?: number;
    };
};

function ReadingBlock({
    label,
    reading,
    motionProps,
}: {
    label: string;
    reading: ReadingSection;
    motionProps: MotionConfig;
}) {
    return (
        <motion.div {...motionProps} className="mb-10 last:mb-0">
            <h3 className="ornamental-kicker mb-2 scroll-mt-32">{label}</h3>
            {reading.heading && (
                <p className="mb-2 text-base font-display italic text-parish-fg">
                    {reading.heading}
                </p>
            )}
            <p className="mb-3 text-[1rem] font-semibold text-parish-accent">
                {decodeHtmlEntities(reading.source)}
            </p>
            <div
                className="prose-parish break-words text-base leading-[1.85] text-parish-fg"
                dangerouslySetInnerHTML={{ __html: sanitiseReadingHtml(reading.text) }}
            />
        </motion.div>
    );
}

function ReflectionSourceCard({
    source,
    motionProps,
}: {
    source: ReflectionSource;
    motionProps: MotionConfig;
}) {
    const excerpt = shouldRenderExcerpt(source) ? source.excerpt?.trim() : null;
    const badge = getSourceBadge(source);

    return (
        <motion.article
            {...motionProps}
            className="group flex min-w-0 flex-col rounded-2xl border border-parish-border/15 bg-parish-surface px-5 py-6 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-parish-accent/25 hover:shadow-card-hover md:px-6"
        >
            <span className="mb-4 inline-flex w-fit items-center rounded-full border border-parish-accent/15 bg-parish-accent/5 px-3 py-1 text-[0.875rem] font-semibold uppercase tracking-[0.18em] text-parish-accent">
                {badge}
            </span>
            <div className="flex min-w-0 items-start gap-3">
                <BookOpen className="mt-1 h-4 w-4 shrink-0 text-parish-accent" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-display leading-tight text-parish-fg text-pretty">
                        {source.name}
                    </h3>
                    <p className="mt-3 break-words text-[1rem] leading-relaxed text-parish-muted">
                        {source.description}
                    </p>
                </div>
            </div>

            {excerpt ? (
                <blockquote className="mt-5 border-l-2 border-parish-accent/40 pl-4 text-[1rem] leading-relaxed text-parish-fg">
                    {excerpt}
                </blockquote>
            ) : (
                <p className="mt-5 text-[0.875rem] leading-relaxed text-parish-muted">
                    Linked directly at the source. Reproduced excerpts can appear here after written permission is recorded.
                </p>
            )}

            {source.url && (
                <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex w-fit items-center gap-2 text-[1rem] font-semibold text-parish-accent underline transition-[color,text-decoration-color] duration-200 hover:text-parish-accent-hover hover:no-underline"
                >
                    Read at Source: {source.name}
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
            )}
        </motion.article>
    );
}

function decodeHtmlEntities(html: string): string {
    const el = document.createElement('span');
    el.innerHTML = html;
    return el.textContent ?? html;
}

function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
}

function toPlainText(html: string): string {
    return decodeHtmlEntities(stripHtml(sanitiseReadingHtml(html))).replace(/\s+/g, ' ').trim();
}

function normaliseLiturgicalDay(day: string): string {
    return day
        .replace(/\s*[\u2010-\u2015-]\s*/g, ' - ')
        .replace(/^The\b/, 'the');
}

function sanitiseReadingHtml(html: string): string {
    return html
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .replace(/<(iframe|object|embed|form|input|button)[\s\S]*?>/gi, '');
}

function hasReadingSection(reading: ReadingSection | undefined): boolean {
    return Boolean(reading?.source?.trim() && reading.text?.trim());
}

function hasCoreReadings(data: UniversalisData | null): data is UniversalisData {
    return Boolean(
        data
        && hasReadingSection(data.Mass_R1)
        && hasReadingSection(data.Mass_Ps)
        && hasReadingSection(data.Mass_G),
    );
}

function buildReflectionPrompt(data: UniversalisData | null): string | null {
    if (!hasCoreReadings(data)) return null;

    const liturgicalDay = normaliseLiturgicalDay(toPlainText(data.day));
    const gospelReference = decodeHtmlEntities(data.Mass_G.source).replace(/\s+/g, ' ').trim();
    if (!liturgicalDay || !gospelReference) return null;

    const prompt = `For ${liturgicalDay}, spend a few quiet minutes with the Gospel (${gospelReference}). Notice one word or phrase that stays with you, then bring that prayer into the day.`;
    return prompt.length >= 20 && prompt.length <= 500 ? prompt : null;
}

export function DailyReadingsPage() {
    const { data, status, universalisUrl, retry } = useDailyMassReadings();
    const { sources, status: sourcesStatus } = useReflectionSources();
    const season = useLiturgicalSeason();
    const prefersReduced = useReducedMotion();
    const m = prefersReduced ? noMotion : reveal;

    const isoDate = getAdelaideISODate();
    const readingsData = status === 'success' && hasCoreReadings(data) ? data : null;
    const hasIncompleteReadings = status === 'success' && Boolean(data) && !hasCoreReadings(data);
    const reflectionPrompt = useMemo(() => buildReflectionPrompt(readingsData), [readingsData]);

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
        title: "Today's Readings & Reflection",
        description:
            'Daily Mass readings and reflection sources for the Australia - Adelaide liturgical calendar.',
        path: '/daily-readings',
    });

    const jsonLdSchema = useMemo(
        () => ({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: "Today's Readings & Reflection - Greenacres Walkerville Catholic Parish",
            description:
                'Daily Mass readings and reflection sources for the Australia - Adelaide liturgical calendar.',
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

    const showProblemState = status === 'error' || status === 'timeout' || hasIncompleteReadings;
    const problemTitle = hasIncompleteReadings
        ? 'The readings came through incomplete'
        : status === 'timeout'
            ? 'The readings could not load within the time limit'
            : 'Unable to load today\u2019s readings';

    return (
        <div className="page-shell">
            <section className="page-section pt-12 pb-8 md:pt-20 md:pb-12">
                <div className="page-section-inner">
                    <motion.div {...m}>
                        <p className="ornamental-kicker mb-3">Worship</p>
                        <h1 className="text-[clamp(2rem,4.5vw,3.2rem)] font-display leading-tight text-parish-fg text-pretty">
                            Today&rsquo;s Readings &amp; Reflection
                        </h1>
                        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-parish-muted">
                            Daily Mass readings for the Australia&nbsp;&ndash;&nbsp;Adelaide
                            calendar, with prayer and reflection sources clearly linked.
                        </p>
                    </motion.div>
                </div>
            </section>

            {readingsData && (
                <section className="page-section pb-4">
                    <div className="page-section-inner">
                        <motion.div
                            {...m}
                            className="sanctuary-panel overflow-hidden"
                            style={{
                                background: `linear-gradient(135deg, ${colourInfo.cssColor}10 0%, transparent 60%)`,
                            }}
                        >
                            <div className="flex flex-col gap-4 px-6 py-6 md:px-10 md:py-8 sm:flex-row sm:items-center">
                                <div className="min-w-0 flex-1">
                                    <p className="text-[1rem] text-parish-muted">{readingsData.date}</p>
                                    <div
                                        className="mt-1 break-words text-lg font-display text-parish-fg [&_b]:font-bold"
                                        dangerouslySetInnerHTML={{ __html: sanitiseReadingHtml(readingsData.day) }}
                                    />
                                </div>
                                <div className="flex shrink-0 items-center gap-2 text-[1rem] text-parish-muted">
                                    <Palette className="h-4 w-4" aria-hidden="true" />
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

            {status === 'loading' && (
                <section className="page-section">
                    <div className="page-section-inner flex items-center justify-center py-20">
                        <div className="text-center" role="status" aria-live="polite">
                            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-parish-border/20 border-t-parish-accent" aria-hidden="true" />
                            <p className="mt-4 text-base text-parish-muted">
                                Loading today&rsquo;s readings&hellip;
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {showProblemState && (
                <section className="page-section">
                    <div className="page-section-inner">
                        <div className="sanctuary-panel px-6 py-8 text-center md:px-10 md:py-10">
                            <AlertCircle className="mx-auto mb-3 h-8 w-8 text-parish-muted" aria-hidden="true" />
                            <h2 className="mb-2 text-xl font-display text-parish-fg">
                                {problemTitle}
                            </h2>
                            <p className="mx-auto mb-5 max-w-md text-[1rem] text-parish-muted">
                                Try again, or read today&rsquo;s Mass readings directly on Universalis.
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-3">
                                <button
                                    onClick={retry}
                                    className="pilgrimage-button-secondary"
                                >
                                    <RefreshCw className="h-4 w-4" aria-hidden="true" />
                                    Try Again
                                </button>
                                <a
                                    href={universalisUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="pilgrimage-button-ghost"
                                >
                                    Open Today&rsquo;s Readings on Universalis
                                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {readingsData && (
                <section className="page-section" id="readings">
                    <div className="page-section-inner max-w-3xl">
                        <ReadingBlock
                            label="First Reading"
                            reading={readingsData.Mass_R1}
                            motionProps={m}
                        />

                        <div className="section-divider my-8" />

                        <ReadingBlock
                            label="Responsorial Psalm"
                            reading={readingsData.Mass_Ps}
                            motionProps={m}
                        />

                        <div className="section-divider my-8" />

                        {readingsData.Mass_R2 && (
                            <>
                                <ReadingBlock
                                    label="Second Reading"
                                    reading={readingsData.Mass_R2}
                                    motionProps={m}
                                />
                                <div className="section-divider my-8" />
                            </>
                        )}

                        {readingsData.Mass_GA && (
                            <>
                                <ReadingBlock
                                    label="Gospel Acclamation"
                                    reading={readingsData.Mass_GA}
                                    motionProps={m}
                                />
                                <div className="section-divider my-8" />
                            </>
                        )}

                        <ReadingBlock
                            label="Gospel"
                            reading={readingsData.Mass_G}
                            motionProps={m}
                        />
                    </div>
                </section>
            )}

            <section className="page-section pt-8 md:pt-12" id="reflections">
                <div className="page-section-inner max-w-4xl">
                    <motion.div {...m}>
                        <p className="ornamental-kicker mb-3">Liturgical Reflection Corner</p>
                        <h2 className="mb-3 text-2xl font-display text-parish-fg text-pretty">
                            Prayer for Today
                        </h2>
                        {reflectionPrompt ? (
                            <div className="sanctuary-panel px-6 py-6 md:px-8 md:py-8">
                                <div className="flex min-w-0 gap-4">
                                    <MessageCircle className="mt-1 h-5 w-5 shrink-0 text-parish-accent" aria-hidden="true" />
                                    {/* Reflection_Prose — parish-authored prayer prompt. The
                                        .reflection-prose class scopes the ::first-letter drop cap
                                        to the FIRST paragraph only (parish-accent + font-display),
                                        and adds hanging-punctuation / text-wrap: pretty. It is never
                                        applied to liturgical reading text (Decision 6 / Req 4.1). */}
                                    <div className="reflection-prose min-w-0 flex-1">
                                        <p className="break-words text-base leading-relaxed text-parish-fg">
                                            {reflectionPrompt}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="max-w-2xl text-[1rem] leading-relaxed text-parish-muted">
                                The reflection prompt will appear once today&rsquo;s Gospel reference has loaded.
                            </p>
                        )}
                    </motion.div>

                    <div className="mt-8">
                        <motion.div {...m}>
                            <h2 className="mb-2 text-2xl font-display text-parish-fg text-pretty">
                                Daily Prayer &amp; Reflection Sources
                            </h2>
                            <p className="mb-8 max-w-2xl text-[1rem] leading-relaxed text-parish-muted">
                                Australian Catholic sources appear first. Global sources are included as backup prayer options.
                            </p>
                        </motion.div>

                        {sourcesStatus === 'loading' && (
                            <p className="text-[1rem] text-parish-muted" role="status" aria-live="polite">
                                Loading reflection sources&hellip;
                            </p>
                        )}

                        {sourcesStatus !== 'loading' && sources.length === 0 && (
                            <p className="rounded-2xl border border-parish-border/15 bg-parish-surface px-6 py-5 text-[1rem] text-parish-muted">
                                No daily reflection sources are currently available.
                            </p>
                        )}

                        {sources.length > 0 && (
                            <div className="grid gap-5 md:grid-cols-2">
                                {sources.map((source, i) => (
                                    <ReflectionSourceCard
                                        key={`${source.name}-${source.url}`}
                                        source={source}
                                        motionProps={prefersReduced
                                            ? noMotion
                                            : {
                                                ...reveal,
                                                transition: { ...reveal.transition, delay: i * 0.04 },
                                            }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className="page-section pt-12 pb-16 md:pt-16" id="source">
                <div className="page-section-inner max-w-3xl">
                    <motion.div {...m} className="sanctuary-panel px-6 py-8 md:px-10 md:py-10">
                        <h2 className="mb-4 text-[1rem] font-display uppercase tracking-widest text-parish-muted">
                            Source
                        </h2>
                        <p className="text-[1rem] leading-relaxed text-parish-muted">
                            Readings are provided by{' '}
                            <a
                                href="https://universalis.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-parish-accent underline transition-[color,text-decoration-color] duration-200 hover:text-parish-accent-hover hover:no-underline"
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
                                className="inline-flex items-center gap-1.5 text-[1rem] font-semibold text-parish-accent underline transition-[color,text-decoration-color] duration-200 hover:text-parish-accent-hover hover:no-underline"
                            >
                                Open Today&rsquo;s Readings on Universalis
                                <ExternalLink className="h-3 w-3" aria-hidden="true" />
                            </a>
                        </p>
                        {readingsData?.copyright?.text && (
                            <div
                                className="mt-6 border-t border-parish-border/10 pt-5 text-[0.875rem] leading-relaxed text-parish-muted/60 [&_a]:text-parish-accent [&_a]:underline"
                                dangerouslySetInnerHTML={{
                                    __html: sanitiseReadingHtml(readingsData.copyright.text),
                                }}
                            />
                        )}
                    </motion.div>
                </div>
            </section>

            <noscript>
                <section className="page-section">
                    <div className="page-section-inner max-w-3xl">
                        <div className="sanctuary-panel px-6 py-8 text-center">
                            <p className="mb-3 text-base text-parish-fg">
                                JavaScript is required to display today&rsquo;s readings inline.
                            </p>
                            <a
                                href="https://universalis.com/Australia.Adelaide/mass.htm"
                                className="pilgrimage-button"
                            >
                                Read Today&rsquo;s Readings on Universalis
                            </a>
                        </div>
                    </div>
                </section>
            </noscript>
        </div>
    );
}
