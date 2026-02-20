import { motion, useScroll, useTransform } from 'framer-motion';
import { useParishData } from '../context/ParishDataContext';
import { PrayerWallSection } from '../components/PrayerWallSection';
import { DailyReflectionCard } from '../components/home/DailyReflectionCard';

export function HomePage() {
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const { content, isLoading } = useParishData();

    if (isLoading || !content) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#1C1917] text-white font-display tracking-widest text-lg">
                Loading…
            </div>
        );
    }

    const nextMass = content.massSchedule[0];

    return (
        <>
            {/* Hero Section */}
            <header className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-[#1C1917]">
                <motion.div
                    style={{ y, opacity }}
                    className="absolute inset-0 z-0"
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity"
                        style={{ backgroundImage: "url('/assets/images/source/hero_3.webp')" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1C1917]/50 to-[#1C1917]" />
                </motion.div>

                <div className="relative z-10 text-center px-6 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
                        className="font-display text-parish-accent tracking-[0.15em] text-lg md:text-xl mb-8"
                    >
                        {content.tagline}
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.4 }}
                        className="font-display text-5xl md:text-7xl lg:text-8xl text-[#F9F8F6] leading-tight mb-8"
                    >
                        Welcome to<br />Our <em className="font-serif italic text-parish-accent">Parish</em>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.7 }}
                        className="font-serif text-xl md:text-2xl text-white/70 italic max-w-2xl mx-auto mb-12"
                    >
                        "I can do all things through Christ who strengthens me."
                        <span className="block text-base text-white/40 mt-2 not-italic">— Philippians 4:13</span>
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.9 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <a
                            href="/mass-times"
                            className="bg-parish-accent text-[#1C1917] px-10 py-4 font-display text-base tracking-widest uppercase rounded-full hover:bg-white transition-colors no-underline font-semibold"
                        >
                            Mass Times
                        </a>
                        <a
                            href="/new-here"
                            className="border-2 border-white/40 text-white px-10 py-4 font-display text-base tracking-widest uppercase rounded-full hover:border-parish-accent hover:text-parish-accent transition-colors no-underline"
                        >
                            I'm New Here
                        </a>
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
                >
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-1.5 h-1.5 bg-white/60 rounded-full"
                        />
                    </div>
                </motion.div>
            </header>

            {/* Welcome Section */}
            <section className="relative z-20 bg-parish-bg rounded-t-[2rem] -mt-8 pt-20 md:pt-28 px-6 md:px-16 lg:px-24">
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24">
                    <div className="flex-1">
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight text-parish-fg text-balance"
                        >
                            {content.parishName}
                        </motion.h2>
                    </div>

                    <div className="flex-1 pt-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
                        >
                            <p className="text-xl md:text-2xl leading-relaxed text-parish-muted font-serif mb-8">
                                {content.welcomeExcerpt}
                            </p>
                            <a href="/about" className="group inline-flex items-center gap-4 no-underline">
                                <span className="font-display tracking-widest uppercase text-base text-parish-fg border-b-2 border-parish-accent pb-1 group-hover:text-parish-accent transition-colors">
                                    Learn About Us
                                </span>
                                <div className="w-8 h-[2px] bg-parish-accent group-hover:w-16 transition-all duration-500" />
                            </a>
                        </motion.div>
                    </div>
                </div>

                {/* Daily Reflection */}
                <div className="mt-24 md:mt-32 max-w-4xl mx-auto">
                    <DailyReflectionCard />
                </div>

                {/* Worship at a Glance */}
                <div className="mt-28 md:mt-32 max-w-6xl mx-auto pb-20 md:pb-32">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-4 flex flex-col justify-end pb-8">
                            <h3 className="font-display text-3xl md:text-4xl mb-4">Worship at a Glance</h3>
                            <p className="text-parish-muted font-serif text-xl">Join us in celebrating the Eucharist across our parish locations.</p>
                        </div>

                        {nextMass && (
                            <motion.div
                                whileHover={{ y: -4 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="lg:col-span-8 bg-white p-8 md:p-14 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] border border-black/5 flex flex-col md:flex-row gap-10 items-center"
                            >
                                <div className="flex-1">
                                    <div className="text-parish-accent font-display tracking-widest text-sm uppercase mb-4">Next Mass</div>
                                    <h4 className="font-display text-5xl md:text-6xl mb-3">{nextMass.startTime}</h4>
                                    <p className="text-parish-muted font-serif text-xl italic mb-8">{nextMass.church}</p>
                                    <a href="/mass-times" className="bg-parish-fg text-white px-8 py-4 font-display text-sm tracking-widest uppercase hover:bg-parish-accent transition-colors rounded-full no-underline inline-block">
                                        View Full Schedule
                                    </a>
                                </div>

                                <div className="w-full md:w-[1px] h-[1px] md:h-32 bg-black/10" />

                                <div className="flex-1">
                                    <div className="text-parish-fg/40 font-display tracking-widest text-sm uppercase mb-4">Parish Prayer</div>
                                    <p className="font-serif text-lg leading-relaxed italic text-parish-muted">
                                        "{content.parishPrayerText.substring(0, 200)}…"
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </section>

            {/* Prayer Wall */}
            <PrayerWallSection />
        </>
    );
}
