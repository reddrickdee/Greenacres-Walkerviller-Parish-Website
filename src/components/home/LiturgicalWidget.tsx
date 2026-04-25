import { motion, useReducedMotion } from 'framer-motion';
import { BookOpen, Sparkles } from 'lucide-react';
import { useLiturgicalSeason } from '../../hooks/useLiturgicalSeason';

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

export function LiturgicalWidget() {
    const season = useLiturgicalSeason();
    const prefersReduced = useReducedMotion();
    const motionProps = prefersReduced ? noMotion : reveal;

    return (
        <section className="page-section" id="liturgical-season">
            <div className="page-section-inner">
                <motion.div
                    {...motionProps}
                    className="sanctuary-panel overflow-hidden"
                >
                    <div
                        className="px-6 py-8 md:px-10 md:py-10"
                        style={{
                            background: `linear-gradient(135deg, ${season.cssColor}10 0%, transparent 60%)`,
                        }}
                    >
                        <div className="flex items-start gap-4">
                            <div
                                className="flex h-12 w-12 items-center justify-center rounded-full shrink-0"
                                style={{
                                    backgroundColor: `${season.cssColor}15`,
                                    color: season.cssColor,
                                }}
                            >
                                <Sparkles className="h-6 w-6" />
                            </div>
                            <div>
                                <div className="ornamental-kicker mb-1">This Week in the Church</div>
                                <h2
                                    className="text-2xl font-display md:text-3xl"
                                    style={{ color: season.cssColor }}
                                >
                                    Season of {season.label}
                                </h2>
                                <p className="mt-3 text-sm leading-relaxed text-parish-muted max-w-xl">
                                    {season.label === 'Easter' && (
                                        <>We celebrate the risen Christ during these fifty days of joy. The Easter Season runs from Easter Sunday through Pentecost Sunday.</>
                                    )}
                                    {season.label === 'Lent' && (
                                        <>A time of prayer, fasting, and almsgiving as we prepare our hearts for the celebration of Easter.</>
                                    )}
                                    {season.label === 'Advent' && (
                                        <>We prepare in joyful anticipation for the coming of Christ at Christmas. A season of hope and expectation.</>
                                    )}
                                    {season.label === 'Christmas' && (
                                        <>We celebrate the birth of Jesus Christ and the gift of God&apos;s love made flesh in our world.</>
                                    )}
                                    {season.label === 'Ordinary Time' && (
                                        <>We walk with Jesus through his public ministry, growing deeper in our understanding of his teachings and example.</>
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Liturgical color indicator */}
                        <div className="mt-6 flex items-center gap-3 text-sm text-parish-muted">
                            <BookOpen className="h-4 w-4" />
                            <span>
                                Liturgical colour:{' '}
                                <span
                                    className="inline-flex items-center gap-1.5 font-semibold"
                                    style={{ color: season.cssColor }}
                                >
                                    <span
                                        className="inline-block h-2.5 w-2.5 rounded-full"
                                        style={{ backgroundColor: season.cssColor }}
                                        aria-hidden="true"
                                    />
                                    {season.label === 'Easter' || season.label === 'Christmas' ? 'White / Gold' :
                                     season.label === 'Lent' || season.label === 'Advent' ? 'Purple' :
                                     season.label === 'Ordinary Time' ? 'Green' : 'White'}
                                </span>
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
