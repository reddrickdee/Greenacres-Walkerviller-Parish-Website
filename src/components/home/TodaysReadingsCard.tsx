import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { BookOpen, ArrowRight } from 'lucide-react';
import { useDailyMassReadings } from '../../hooks/useDailyMassReadings';
import { useLiturgicalSeason } from '../../hooks/useLiturgicalSeason';
import { resolveLiturgicalColour } from '../../lib/liturgicalColour';
import { getAdelaideISODate } from '../../lib/adelaideDate';
import type { ColourOverrides } from '../../lib/liturgicalColour';
import { PATHS } from '../../lib/routes';

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

function decodeHtml(html: string): string {
    const el = document.createElement('span');
    el.innerHTML = html;
    return el.textContent ?? html;
}

function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
}

export function TodaysReadingsCard() {
    const { data, status } = useDailyMassReadings();
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

    const gospelRef = data?.Mass_G?.source ? decodeHtml(data.Mass_G.source) : null;
    const liturgicalDay = data?.day ? stripHtml(data.day).trim() : null;

    if (status === 'loading' || status === 'idle') {
        return (
            <section className="page-section" id="todays-readings">
                <div className="page-section-inner">
                    <div className="sanctuary-panel px-6 py-6 md:px-8 md:py-8 animate-pulse">
                        <div className="h-4 bg-parish-border/20 rounded w-24 mb-3" />
                        <div className="h-6 bg-parish-border/20 rounded w-48 mb-2" />
                        <div className="h-4 bg-parish-border/20 rounded w-36" />
                    </div>
                </div>
            </section>
        );
    }

    if (status === 'error' || status === 'timeout' || !data) {
        return (
            <section className="page-section" id="todays-readings">
                <div className="page-section-inner">
                    <motion.div {...m}>
                        <Link
                            to={PATHS.DAILY_READINGS}
                            className="group flex items-center gap-4 sanctuary-panel px-6 py-6 md:px-8 md:py-8 no-underline transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-card-hover"
                        >
                            <BookOpen className="h-6 w-6 text-parish-accent shrink-0" aria-hidden="true" />
                            <div className="flex-1 min-w-0">
                                <p className="ornamental-kicker mb-0.5">Readings &amp; Reflection</p>
                                <p className="text-sm text-parish-muted">
                                    Daily readings and prayer sources for Adelaide
                                </p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-parish-accent shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                        </Link>
                    </motion.div>
                </div>
            </section>
        );
    }

    return (
        <section className="page-section" id="todays-readings">
            <div className="page-section-inner">
                <motion.div {...m}>
                    <Link
                        to={PATHS.DAILY_READINGS}
                        className="group block sanctuary-panel overflow-hidden no-underline transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-card-hover"
                        style={{
                            background: `linear-gradient(135deg, ${colourInfo.cssColor}08 0%, transparent 60%)`,
                        }}
                    >
                        <div className="px-6 py-6 md:px-8 md:py-8">
                            <div className="flex items-start gap-4">
                                <div
                                    className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0"
                                    style={{
                                        backgroundColor: `${colourInfo.cssColor}12`,
                                        color: colourInfo.cssColor,
                                    }}
                                >
                                    <BookOpen className="h-5 w-5" aria-hidden="true" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="ornamental-kicker mb-1">Readings &amp; Reflection</p>
                                    {liturgicalDay && (
                                        <p className="text-base font-display text-parish-fg leading-snug">
                                            {liturgicalDay}
                                        </p>
                                    )}
                                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-parish-muted">
                                        {gospelRef && (
                                            <span>
                                                Gospel: <span className="font-semibold text-parish-fg">{gospelRef}</span>
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1.5">
                                            <span
                                                className="inline-block h-2 w-2 rounded-full"
                                                style={{ backgroundColor: colourInfo.cssColor }}
                                                aria-hidden="true"
                                            />
                                            {colourInfo.label}
                                        </span>
                                    </div>
                                </div>
                                <ArrowRight className="h-4 w-4 text-parish-accent shrink-0 mt-1 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                            </div>
                        </div>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
