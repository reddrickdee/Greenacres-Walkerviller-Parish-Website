import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, CalendarClock, MapPinned } from 'lucide-react';
import { useParishData } from '../../context/ParishDataContext';
import { useMassCountdowns } from '../../hooks/useMassCountdowns';
import {
    isCoreCountdownMass,
    getSoonestCountdown,
    DAY_NAMES,
} from '../../lib/massCountdown';

export function HeroSection() {
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '24%']);
    const { content } = useParishData();

    // Live countdown for the next upcoming Mass
    const schedule = content?.massSchedule ?? [];
    const countdownEntries = schedule.filter(isCoreCountdownMass);
    const { now } = useMassCountdowns(countdownEntries);
    const nextService = getSoonestCountdown(countdownEntries, now);

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
        <header className="relative min-h-[70vh] overflow-hidden md:min-h-screen">
            <motion.div style={{ y }} className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/assets/source/hero_4.webp')" }}
                />
                <div className="absolute inset-0 bg-[linear-gradient(118deg,rgba(9,10,11,0.92)_0%,rgba(18,20,24,0.74)_48%,rgba(23,20,17,0.42)_100%)]" />
                <div className="absolute inset-0 noise-bg opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-parish-bg" />
            </motion.div>

            <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-end px-6 pb-14 pt-32 md:px-10 lg:px-16 lg:pb-20">
                <div className="grid items-end gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-7">
                        <motion.div
                            initial={{ opacity: 0, y: 28 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <span className="section-label !text-white/70 before:!bg-parish-brass/80">Catholic Parish in Adelaide</span>
                            <h1 className="mt-6 max-w-5xl text-[clamp(3.4rem,8vw,7.4rem)] leading-[0.9] text-white text-balance">
                                Walk gently. <br />
                                <span className="text-parish-brass">Belong deeply.</span>
                            </h1>
                            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85 md:text-xl">
                                Greenacres Walkerville Catholic Parish is a place of prayer, welcome, and practical support for people arriving for the first time and for parishioners who call this community home.
                            </p>
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                                <Link to="/new-here" className="pilgrimage-button">
                                    Plan Your First Visit
                                </Link>
                                <Link to="/mass-times" className="pilgrimage-button-secondary !border-parish-overlay-border/20 !bg-parish-overlay-bg/8 !text-parish-overlay-text">
                                    View Mass Times
                                </Link>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 36 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.95, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="lg:col-span-5"
                    >
                        <div className="sanctuary-panel border-parish-overlay-border/10 bg-parish-overlay-bg/10 p-6 text-parish-overlay-text backdrop-blur-2xl md:p-7">
                            {/* Next Service — live countdown */}
                            <div className="rounded-[1.6rem] border border-parish-overlay-border/10 bg-parish-overlay-bg/20 p-4">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-full border border-parish-brass/40 bg-parish-overlay-bg/6 text-parish-brass">
                                        <CalendarClock className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-parish-overlay-text/70">Next Service</div>
                                        {nextService ? (
                                            <>
                                                <div className="mt-2 text-2xl font-display text-parish-overlay-text">
                                                    {nextDay} {nextTime}
                                                </div>
                                                <div className="text-sm leading-relaxed text-parish-overlay-text/75">{nextChurch}</div>
                                                <div className="mt-2 text-sm text-parish-brass">
                                                    Begins in {nextService.countdown.display}
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="mt-2 text-2xl font-display text-parish-overlay-text">Saturday 6:00pm</div>
                                                <div className="text-sm leading-relaxed text-parish-overlay-text/75">St Monica&apos;s Walkerville</div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* First-visit guidance */}
                            <div className="mt-4 rounded-[1.6rem] border border-parish-overlay-border/10 bg-parish-overlay-bg/20 p-4">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-full border border-parish-brass/40 bg-parish-overlay-bg/6 text-parish-brass">
                                        <MapPinned className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-parish-overlay-text/70">First-time visitor?</div>
                                        <p className="mt-2 text-sm leading-relaxed text-parish-overlay-text/80">
                                            Find the churches, know what to expect, and contact the office before your visit.
                                        </p>
                                        <Link to="/new-here" className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-parish-brass no-underline">
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
                    className="mt-10 flex items-center gap-4 text-white/60"
                >
                    <div className="h-px w-14 bg-white/30" />
                    <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em]">{content.tagline}</span>
                </motion.div>
            </div>
        </header>
    );
}
