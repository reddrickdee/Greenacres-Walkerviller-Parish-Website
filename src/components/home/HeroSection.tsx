import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, CalendarClock, FileText, MapPinned, Phone } from 'lucide-react';
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
        <header className="relative overflow-hidden bg-parish-bg pt-28 md:pt-32">
            <motion.div style={{ y, scale: heroScale }} className="absolute inset-0 z-0">
                <img
                    src="/assets/source/hero_4.webp"
                    alt=""
                    role="presentation"
                    width={1920}
                    height={1080}
                    fetchPriority="high"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(106deg,rgba(249,246,239,0.98)_0%,rgba(249,246,239,0.92)_38%,rgba(249,246,239,0.62)_62%,rgba(249,246,239,0.36)_100%)] dark:bg-[linear-gradient(106deg,rgba(14,16,19,0.96)_0%,rgba(14,16,19,0.88)_42%,rgba(14,16,19,0.52)_100%)]" />
                <div className="absolute inset-0 bg-gradient-to-b from-parish-bg/40 via-transparent to-parish-bg" />
            </motion.div>

            <div className="relative z-10 mx-auto flex min-h-[78dvh] max-w-7xl flex-col justify-end px-6 pb-14 md:px-10 lg:px-16 lg:pb-16">
                <div className="grid items-end gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-7">
                        <motion.div
                            initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            transition={{ duration: 0.9, ease: [0.32, 0.72, 0, 1] }}
                        >
                            <span className="section-label">Catholic Parish in Adelaide</span>
                            <h1 className="mt-6 max-w-5xl text-[clamp(3rem,7vw,6.8rem)] leading-[0.92] text-parish-fg text-balance">
                                Greenacres Walkerville <span className="text-parish-accent">Catholic Parish</span>
                            </h1>
                            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-parish-muted md:text-xl">
                                Join us for Mass at St Monica&apos;s Walkerville or St Martin&apos;s Greenacres. Find this weekend&apos;s times, the latest bulletin, and a simple first-visit guide in one place.
                            </p>
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                                <Link to="/mass-times" className="pilgrimage-button">
                                    View Mass Times
                                </Link>
                                <Link to="/new-here" className="pilgrimage-button">
                                    Plan Your First Visit
                                </Link>
                                <Link to="/news-events" className="pilgrimage-button-secondary">
                                    Read Bulletin
                                </Link>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 36, filter: 'blur(6px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 0.95, delay: 0.25, ease: [0.32, 0.72, 0, 1] }}
                        className="lg:col-span-5"
                    >
                        <div className="sanctuary-panel bg-parish-surface/95 p-5 md:p-6">
                            {/* Next Service — live countdown */}
                            <div className="rounded-xl border border-parish-border/12 bg-parish-elevated/35 p-4">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-full border border-parish-brass/35 bg-parish-surface text-parish-brass">
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
                                                <div className="mt-2 text-sm text-parish-brass">
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

                            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                                <Link to="/news-events" className="rounded-xl border border-parish-border/12 bg-parish-surface px-4 py-4 text-parish-fg no-underline transition hover:border-parish-brass/35">
                                    <div className="flex items-start gap-3">
                                        <FileText className="mt-1 h-5 w-5 text-parish-brass" />
                                        <div>
                                            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-parish-muted">This Week</div>
                                            <p className="mt-1 text-sm leading-relaxed text-parish-muted">Read the current Connections bulletin and parish notices.</p>
                                        </div>
                                    </div>
                                </Link>
                                <a href={`tel:${content.contact.phone}`} className="rounded-xl border border-parish-border/12 bg-parish-surface px-4 py-4 text-parish-fg no-underline transition hover:border-parish-brass/35">
                                    <div className="flex items-start gap-3">
                                        <Phone className="mt-1 h-5 w-5 text-parish-brass" />
                                        <div>
                                            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-parish-muted">Parish Office</div>
                                            <p className="mt-1 text-sm leading-relaxed text-parish-muted">{content.contact.phone}</p>
                                        </div>
                                    </div>
                                </a>
                            </div>

                            {/* First-visit guidance */}
                            <div className="mt-4 rounded-xl border border-parish-border/12 bg-parish-elevated/35 p-4">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-full border border-parish-brass/35 bg-parish-surface text-parish-brass">
                                        <MapPinned className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-parish-muted">First-time visitor?</div>
                                        <p className="mt-2 text-sm leading-relaxed text-parish-muted">
                                            Find the churches, know what to expect, and contact the office before your visit.
                                        </p>
                                        <Link to="/new-here" className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-parish-accent no-underline">
                                            Your first visit guide
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
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
