import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Cross, ArrowRight } from 'lucide-react';
import { useParishData } from '../../context/ParishDataContext';
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

function getWeekendDateRange(): string {
    const now = new Date();
    const dayOfWeek = now.getDay();
    // Find the Saturday of this week
    const daysUntilSat = (6 - dayOfWeek + 7) % 7;
    const saturday = new Date(now);
    saturday.setDate(now.getDate() + (daysUntilSat === 0 && dayOfWeek !== 6 ? 7 : daysUntilSat));
    const sunday = new Date(saturday);
    sunday.setDate(saturday.getDate() + 1);

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${saturday.getDate()} \u2013 ${sunday.getDate()} ${months[sunday.getMonth()]} ${sunday.getFullYear()}`;
}

export function ThisWeekend() {
    const prefersReduced = useReducedMotion();
    const motionProps = prefersReduced ? noMotion : reveal;
    const { content } = useParishData();
    const season = useLiturgicalSeason();

    if (!content) return null;

    const weekendRange = getWeekendDateRange();

    return (
        <section className="page-section" id="this-weekend">
            <div className="page-section-inner">
                <motion.div
                    {...motionProps}
                    className="overflow-hidden rounded-2xl border border-parish-border/15 bg-parish-surface"
                    style={{ boxShadow: '0 4px 16px -4px rgba(0,0,0,0.08)' }}
                >
                    <div className="grid lg:grid-cols-12">
                        {/* Left: Mass info */}
                        <div className="lg:col-span-7 px-6 py-8 md:px-10 md:py-10">
                            <div className="flex items-center gap-3 mb-2">
                                <Cross className="h-5 w-5 text-parish-accent shrink-0" aria-hidden="true" />
                                <div>
                                    <h2 className="text-2xl font-display text-parish-fg md:text-3xl">
                                        This Weekend
                                    </h2>
                                    <p className="text-sm text-parish-muted">{weekendRange}</p>
                                </div>
                            </div>

                            <p
                                className="mt-3 text-lg font-display font-bold"
                                style={{ color: season.cssColor }}
                            >
                                {season.label}
                            </p>

                            {/* Mass schedule table */}
                            <div className="mt-6 space-y-1">
                                <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-parish-muted mb-3">
                                    Upcoming Masses
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-base font-semibold text-parish-fg">
                                            St Monica&apos;s Church
                                        </p>
                                        <p className="text-sm text-parish-muted">
                                            90 North East Road, Walkerville
                                        </p>
                                        <div className="mt-2 flex flex-wrap gap-x-8 gap-y-1 text-sm text-parish-muted">
                                            <span>Saturday Vigil <strong className="text-parish-fg ml-2">6:00pm</strong></span>
                                            <span>Sunday <strong className="text-parish-fg ml-2">9:30am</strong></span>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-base font-semibold text-parish-fg">
                                            St Martin&apos;s Church
                                        </p>
                                        <p className="text-sm text-parish-muted">
                                            Corner Muller &amp; Hampstead Roads, Greenacres
                                        </p>
                                        <div className="mt-2 flex flex-wrap gap-x-8 gap-y-1 text-sm text-parish-muted">
                                            <span>Sunday <strong className="text-parish-fg ml-2">9:00am</strong></span>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-base font-semibold text-parish-fg">
                                            Weekday Mass
                                        </p>
                                        <p className="text-sm text-parish-muted">Both Churches</p>
                                        <div className="mt-2 text-sm text-parish-muted">
                                            <span>Monday – Saturday <strong className="text-parish-fg ml-2">9:15am</strong></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Link
                                to="/mass-times"
                                className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-parish-accent no-underline"
                            >
                                View full Mass Times
                                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                            </Link>
                        </div>

                        {/* Right: Church photo */}
                        <div className="lg:col-span-5 relative min-h-[280px] lg:min-h-0">
                            <img
                                src="/assets/source/hero_4.webp"
                                alt="Interior of St Monica's Church, Walkerville"
                                loading="lazy"
                                decoding="async"
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
