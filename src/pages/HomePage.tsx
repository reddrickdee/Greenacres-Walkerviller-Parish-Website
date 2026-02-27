import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useParishData } from '../context/ParishDataContext';
import { usePageSEO } from '../hooks/usePageSEO';
import { JsonLdSchema } from '../components/JsonLdSchema';
import { PrayerWallSection } from '../components/PrayerWallSection';
import { DailyReflectionCard } from '../components/home/DailyReflectionCard';
import { ReflectionDateNavigator } from '../components/home/ReflectionDateNavigator';
import { useAvailableReflectionDates } from '../hooks/useAvailableReflectionDates';
import { FacebookFeed } from '../components/social/FacebookFeed';
import { HeroSection } from '../components/home/HeroSection';
import { PageMeta } from '../components/PageMeta';
import { Clock, BookOpen, Users, ArrowRight } from 'lucide-react';

export function HomePage() {
    const { content, isLoading } = useParishData();
    const [selectedDate, setSelectedDate] = useState(() => new Date().toLocaleDateString('en-CA'));
    const { availableDates } = useAvailableReflectionDates();

    usePageSEO({
        title: 'Greenacres Walkerville Catholic Parish',
        description: 'A welcoming and inclusive Catholic parish community in Adelaide, South Australia. Join us for Mass at St Monica\'s Walkerville and St Martin\'s Greenacres.',
        path: '/',
    });

    if (isLoading || !content) {
        return (
            <div className="h-screen flex items-center justify-center bg-parish-bg text-parish-fg font-display tracking-widest text-lg">
                Loading…
            </div>
        );
    }

    const nextMass = content.massSchedule[0];

    return (
        <>
            <PageMeta description="Welcome to Greenacres Walkerville Catholic Parish in Adelaide. Join us for Mass, daily reflections, community prayer, and parish events at St Monica's and St Martin's churches." path="/" />
            <JsonLdSchema />
            <HeroSection />

            {/* Welcome Section */}
            <section className="relative z-20 bg-parish-bg -mt-8 pt-20 md:pt-28 px-6 md:px-16 lg:px-24">
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24">
                    <div className="flex-1">
                        <motion.h2
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight text-parish-fg text-balance tracking-tight"
                        >
                            {content.parishName}
                        </motion.h2>
                    </div>

                    <div className="flex-1 pt-2">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        >
                            <p className="text-xl md:text-2xl leading-relaxed text-parish-muted font-serif mb-8 italic">
                                {content.welcomeExcerpt}
                            </p>
                            <Link to="/about" className="group inline-flex items-center gap-4 no-underline">
                                <span className="font-display tracking-widest uppercase text-nav text-parish-fg border-b border-parish-brass/50 pb-1 group-hover:text-parish-brass transition-colors">
                                    Learn About Us
                                </span>
                                <ArrowRight className="w-4 h-4 text-parish-brass group-hover:translate-x-2 transition-transform duration-300" />
                            </Link>
                        </motion.div>
                    </div>
                </div>

                <div className="mt-20 max-w-6xl mx-auto">
                    <div className="section-divider" />
                </div>

                {/* Daily Reflection */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mt-24 md:mt-32 max-w-4xl mx-auto space-y-8"
                >
                    <ReflectionDateNavigator
                        selectedDate={selectedDate}
                        onDateChange={setSelectedDate}
                        availableDates={availableDates}
                    />
                    <DailyReflectionCard selectedDate={selectedDate} />
                </motion.div>

                <div className="mt-24 max-w-6xl mx-auto">
                    <div className="section-divider" />
                </div>

                {/* Worship at a Glance */}
                <div className="mt-28 md:mt-40 max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="font-display text-3xl md:text-4xl text-parish-fg mb-4"
                        >
                            Worship at a Glance
                        </motion.h3>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-parish-muted font-serif text-xl italic"
                        >
                            Join us in celebrating the Eucharist.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20 md:pb-32">
                        {/* Next Mass Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="sacred-container p-8 lg:p-10 flex flex-col items-center text-center"
                        >
                            <Clock className="w-8 h-8 text-parish-brass mb-6" />
                            <div className="text-parish-brass font-display tracking-widest text-nav uppercase mb-4">Next Mass</div>
                            <h4 className="font-display text-4xl md:text-5xl mb-3">{nextMass?.startTime || "9:00 AM"}</h4>
                            <p className="text-parish-muted font-serif text-lg italic mb-8">{nextMass?.church || "St. Martin's Church"}</p>
                            <Link to="/mass-times" className="ethereal-button mt-auto">
                                Full Schedule
                            </Link>
                        </motion.div>

                        {/* Sacraments Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
                            className="sacred-container p-8 lg:p-10 flex flex-col items-center text-center"
                        >
                            <BookOpen className="w-8 h-8 text-parish-brass mb-6" />
                            <div className="text-parish-brass font-display tracking-widest text-nav uppercase mb-4">Sacraments</div>
                            <h4 className="font-display text-2xl md:text-3xl mb-3 text-parish-fg leading-snug">Baptisms, Weddings & Funerals</h4>
                            <p className="text-parish-muted font-serif text-lg italic mb-8 mx-auto">Sacramental preparation and life celebrations.</p>
                            <Link to="/sacraments" className="ethereal-button mt-auto">
                                Learn More
                            </Link>
                        </motion.div>

                        {/* Parish Life Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                            className="sacred-container p-8 lg:p-10 flex flex-col items-center text-center"
                        >
                            <Users className="w-8 h-8 text-parish-brass mb-6" />
                            <div className="text-parish-brass font-display tracking-widest text-nav uppercase mb-4">Parish Life</div>
                            <h4 className="font-display text-2xl md:text-3xl mb-3 text-parish-fg leading-snug">Get Involved</h4>
                            <p className="text-parish-muted font-serif text-lg italic mb-8 mx-auto">Ministries, volunteering, and community groups.</p>
                            <Link to="/community" className="ethereal-button mt-auto">
                                Community Hub
                            </Link>
                        </motion.div>
                    </div>
                </div>

                {/* Community & Connection */}
                <div className="mt-20 md:mt-28 max-w-7xl mx-auto px-4 md:px-0 pb-24 md:pb-28">
                    <div className="mb-12">
                        <div className="inline-block rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide uppercase bg-parish-surface/80 text-parish-fg border border-parish-border/10 mb-6">
                            Community
                        </div>
                        <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="font-display text-4xl md:text-5xl lg:text-6xl text-parish-fg mb-6 tracking-tight leading-[1.1]"
                        >
                            Gathered in Prayer <br className="hidden md:block" />
                            <span className="font-serif italic text-parish-accent">& Parish Life</span>
                        </motion.h3>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-parish-muted font-serif text-xl md:text-2xl italic max-w-2xl leading-relaxed"
                        >
                            A dedicated space to lift each other up in prayer and stay connected to the daily pulse of our parish family.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 relative items-start">
                        {/* The Prayer Wall (Left Column) */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="w-full lg:col-span-7 flex flex-col"
                        >
                            <PrayerWallSection embedded={true} maxItems={4} />
                        </motion.div>

                        {/* Facebook Feed (Right Column) */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                            className="w-full lg:col-span-5 flex flex-col pt-2 lg:sticky lg:top-24"
                        >
                            <div className="mb-8 flex justify-between items-end w-full">
                                <h2 className="text-3xl md:text-4xl text-parish-fg font-display italic">Parish Updates</h2>
                            </div>
                            <FacebookFeed pageId="61584973342464" height={500} />
                        </motion.div>
                    </div>
                </div>
            </section>
        </>
    );
}
