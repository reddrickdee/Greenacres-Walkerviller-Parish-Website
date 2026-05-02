import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CalendarClock } from 'lucide-react';
import { useParishData } from '../../context/ParishDataContext';
import { useLiturgicalSeason } from '../../hooks/useLiturgicalSeason';
import { useMassCountdowns } from '../../hooks/useMassCountdowns';
import {
    isCoreCountdownMass,
    getSoonestCountdown,
    DAY_NAMES,
} from '../../lib/massCountdown';

export function HeroSection() {
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '24%']);
    const heroScale = useTransform(scrollYProgress, [0, 0.3], [1.05, 1]);
    const { content } = useParishData();

    // Live countdown for the next upcoming Mass
    const schedule = content?.massSchedule ?? [];
    const countdownEntries = schedule.filter(isCoreCountdownMass);
    const { now } = useMassCountdowns(countdownEntries);
    const nextService = getSoonestCountdown(countdownEntries, now);
    const liturgicalSeason = useLiturgicalSeason();

    if (!content) return null;

    // Format next service info
    const nextDay = nextService ? DAY_NAMES[(nextService.entry.dayOfWeek - 1) % 7] : null;
    const nextTime = nextService?.entry.startTime
        ? (() => {
            const [h, m] = nextService.entry.startTime.split(':').map(Number);
            const ampm = h >= 12 ? 'pm' : 'am';
            return `${h > 12 ? h - 12 : h}:${String(m).padStart(2, '0')}${ampm}`;
        })()
        : null;
    const nextChurch = nextService?.entry.church.includes('Monica')
        ? "St Monica's"
        : "St Martin's";

    return (
        <header className="relative overflow-hidden bg-parish-bg pt-36 md:pt-40">
            {/* Hero photo with warm overlay */}
            <motion.div style={{ y, scale: heroScale }} className="absolute inset-0 z-0">
                <img
                    src="/assets/source/hero_4.webp"
                    alt=""
                    role="presentation"
                    width={1920}
                    height={1080}
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                />
                {/* Warm cream overlay — lets the church photo show through on the right */}
                <div className="absolute inset-0 bg-[linear-gradient(106deg,rgba(245,241,233,0.97)_0%,rgba(245,241,233,0.92)_35%,rgba(245,241,233,0.55)_65%,rgba(245,241,233,0.3)_100%)] dark:bg-[linear-gradient(106deg,rgba(14,16,19,0.96)_0%,rgba(14,16,19,0.88)_42%,rgba(14,16,19,0.52)_100%)]" />
                <div className="absolute inset-0 bg-gradient-to-b from-parish-bg/30 via-transparent to-parish-bg" />
            </motion.div>

            <div className="relative z-10 mx-auto flex max-w-7xl flex-col justify-start px-6 pb-14 md:px-10 lg:min-h-[72dvh] lg:justify-end lg:px-16 lg:pb-16">
                <div className="grid items-end gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-7">
                        <motion.div
                            initial={{ opacity: 0, y: 28, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            transition={{ duration: 0.9, ease: [0.32, 0.72, 0, 1] }}
                        >
                            <h1 className="max-w-3xl text-[clamp(2.4rem,5.5vw,4.5rem)] leading-[1.05] text-parish-fg text-balance">
                                A welcoming community of faith in Adelaide
                            </h1>
                            <p className="mt-5 max-w-xl text-lg leading-relaxed text-parish-muted md:text-xl">
                                We are a Catholic Parish serving Greenacres, Walkerville and the surrounding communities.
                            </p>
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                                <Link to="/mass-times" className="pilgrimage-button">
                                    View Mass Times
                                </Link>
                                <Link to="/new-here" className="pilgrimage-button-secondary">
                                    I&apos;m New Here
                                </Link>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right panel: Next Mass countdown + church badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 36, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 0.95, delay: 0.25, ease: [0.32, 0.72, 0, 1] }}
                        className="hidden lg:col-span-5 lg:flex lg:flex-col lg:items-end lg:gap-4"
                    >
                        {/* Next Mass widget */}
                        <div className="sanctuary-panel bg-parish-surface/95 p-5 max-w-sm w-full">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-parish-accent/8 text-parish-accent">
                                    <CalendarClock className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-parish-muted">Next Mass</div>
                                    {nextService ? (
                                        <>
                                            <div className="mt-2 text-2xl font-display text-parish-fg">
                                                {nextDay} {nextTime}
                                            </div>
                                            <div className="text-sm leading-relaxed text-parish-muted">{nextChurch}</div>
                                            <div className="mt-2 text-sm text-parish-accent font-semibold">
                                                Begins in {nextService.countdown.display}
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="mt-2 text-2xl font-display text-parish-fg">Saturday 6:00pm</div>
                                            <div className="text-sm leading-relaxed text-parish-muted">St Monica&apos;s Walkerville</div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Church badge */}
                        <div className="rounded-xl border border-parish-border/15 bg-parish-surface/90 backdrop-blur-sm px-4 py-3 max-w-xs">
                            <div className="flex items-center gap-3">
                                <img
                                    src="/icons/parish-logo-72.webp"
                                    alt=""
                                    width={32}
                                    height={32}
                                    className="h-8 w-8 object-contain"
                                />
                                <div>
                                    <div className="text-xs font-semibold uppercase tracking-[0.12em] text-parish-fg">
                                        St Monica&apos;s
                                    </div>
                                    <div className="text-[0.72rem] text-parish-muted">
                                        Catholic Church
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1, duration: 1.2 }}
                    className="mt-10 flex flex-wrap items-center gap-4 text-parish-muted"
                >
                    <div className="h-px w-14 bg-parish-border/30" />
                    <span className="text-[0.72rem] font-semibold uppercase tracking-[0.18em]">{content.tagline}</span>
                    <span className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] opacity-60">·</span>
                    <span className={`text-[0.72rem] font-semibold uppercase tracking-[0.18em] ${liturgicalSeason.colorClass}`}>
                        {liturgicalSeason.label}
                    </span>
                </motion.div>
            </div>
        </header>
    );
}
