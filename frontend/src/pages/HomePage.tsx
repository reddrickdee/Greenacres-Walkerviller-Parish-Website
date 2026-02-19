import { motion, useScroll, useTransform } from 'framer-motion';
import { useParishData } from '../context/ParishDataContext';
import { PrayerWallSection } from '../components/PrayerWallSection';

export function HomePage() {
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const { content, isLoading } = useParishData();

    if (isLoading || !content) {
        return <div className="h-screen flex items-center justify-center bg-[#1C1917] text-white font-display tracking-widest text-sm uppercase">Loading…</div>;
    }

    // Find the next upcoming mass
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
                        style={{ backgroundImage: "url('../assets/images/source/hero_3.webp')" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1C1917]/50 to-[#1C1917]" />
                </motion.div>

                <div className="relative z-10 text-center px-4 max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
                        className="font-display text-parish-accent tracking-[0.2em] text-sm uppercase mb-8"
                    >
                        {content.tagline}
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.4 }}
                        className="font-display text-6xl md:text-8xl lg:text-[10rem] text-[#F9F8F6] leading-none mb-6 text-edge-cap"
                    >
                        Our <em className="font-serif italic text-parish-accent pr-4">Parish</em>
                    </motion.h1>
                </div>
            </header>

            {/* Content Section */}
            <main className="relative z-20 bg-parish-bg rounded-t-[3rem] -mt-12 pt-24 px-8 md:px-24">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 md:gap-32">
                    <div className="flex-1">
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="font-display text-5xl md:text-7xl leading-[1.1] text-parish-fg text-balance"
                        >
                            {content.parishName}
                        </motion.h2>
                    </div>

                    <div className="flex-1 pt-4 md:pt-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
                            className="prose prose-lg"
                        >
                            <p className="text-xl leading-relaxed text-parish-muted font-light mb-8 font-serif">
                                <span className="float-left text-7xl leading-none pr-4 font-display text-parish-accent mt-2">{content.welcomeExcerpt.charAt(0)}</span>
                                {content.welcomeExcerpt.slice(1)}
                            </p>
                            <a href="/about" className="group inline-flex items-center gap-4 cursor-pointer no-underline">
                                <span className="font-display tracking-widest uppercase text-sm border-b border-parish-accent pb-1 group-hover:text-parish-accent transition-colors">
                                    Read More
                                </span>
                                <div className="w-8 h-[1px] bg-parish-fg group-hover:w-16 group-hover:bg-parish-accent transition-all duration-500" />
                            </a>
                        </motion.div>
                    </div>
                </div>

                {/* Next Mass / Today's Reading */}
                <div className="mt-48 max-w-7xl mx-auto pb-32">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        <div className="md:col-span-4 flex flex-col justify-end pb-8">
                            <h3 className="font-display text-4xl mb-4">Worship at a Glance</h3>
                            <p className="text-parish-muted font-serif text-lg">Join us in celebrating the Eucharist across our parish locations.</p>
                        </div>

                        {nextMass && (
                            <motion.div
                                whileHover={{ y: -5 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="md:col-span-8 bg-white p-10 md:p-16 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-black/5 flex flex-col md:flex-row gap-12 items-center"
                            >
                                <div className="flex-1">
                                    <div className="text-parish-accent font-display tracking-widest text-xs uppercase mb-4">Next Mass</div>
                                    <h4 className="font-display text-5xl mb-2">{nextMass.startTime}</h4>
                                    <p className="text-parish-muted font-serif text-xl italic mb-8">{nextMass.church}</p>

                                    <div className="flex gap-4">
                                        <a href="/mass-times" className="bg-parish-fg text-white px-8 py-4 font-display text-xs tracking-[0.2em] uppercase hover:bg-parish-accent transition-colors rounded-full no-underline">
                                            View Schedule
                                        </a>
                                    </div>
                                </div>

                                <div className="w-[1px] h-32 bg-black/10 hidden md:block" />

                                <div className="flex-1">
                                    <div className="text-parish-fg/40 font-display tracking-widest text-xs uppercase mb-4">Parish Prayer</div>
                                    <p className="font-serif text-lg leading-snug italic">
                                        "{content.parishPrayerText.substring(0, 180)}…"
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </main>

            {/* Prayer Wall */}
            <PrayerWallSection />
        </>
    );
}
