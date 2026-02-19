import { motion } from 'framer-motion';
import { useParishData } from '../context/ParishDataContext';

export function SacramentsServicesPage() {
    const { content, isLoading } = useParishData();

    if (isLoading || !content) {
        return <div className="h-screen flex items-center justify-center bg-[#1C1917] text-white font-display tracking-widest text-lg">Loading…</div>;
    }

    return (
        <div className="min-h-screen bg-[#1C1917] pt-28 pb-24 px-6 md:px-16 lg:px-24">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="mb-16 md:mb-20 text-center"
                >
                    <div className="text-parish-accent font-display tracking-widest text-base uppercase mb-4">Sacraments & Services</div>
                    <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-[#F9F8F6] leading-tight text-balance">
                        Channels of <em className="font-serif italic text-parish-accent">Grace</em>
                    </h1>
                    <p className="font-serif text-xl text-white/60 mt-6 max-w-2xl mx-auto italic">
                        "The Lord is my shepherd; I shall not want." — Psalm 23:1
                    </p>
                </motion.div>

                {/* Sacraments */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
                    {content.sacraments.map((sacrament, index) => (
                        <motion.div
                            key={sacrament.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className="bg-white/5 border border-white/10 p-8 md:p-10 rounded-[2rem] hover:border-parish-accent/30 transition-all"
                        >
                            <h2 className="font-display text-3xl text-[#F9F8F6] mb-4">{sacrament.title}</h2>
                            <p className="font-serif text-xl text-white/70 leading-relaxed">{sacrament.details}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Sacramental Journeys */}
                {content.sacramentalJourneys.length > 0 && (
                    <div className="space-y-16 mb-24">
                        <h2 className="font-display text-4xl text-center text-parish-accent">Preparation Pathways</h2>
                        <p className="font-serif text-xl text-white/50 text-center max-w-2xl mx-auto">
                            Each sacrament involves a journey of preparation. Here is what to expect.
                        </p>
                        {content.sacramentalJourneys.map(journey => (
                            <motion.div
                                key={journey.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1 }}
                                className="bg-white/5 p-8 md:p-12 rounded-[2rem] border border-white/10"
                            >
                                <h3 className="font-display text-3xl text-[#F9F8F6] mb-2">{journey.title}</h3>
                                <p className="font-serif text-white/50 italic text-xl mb-4">{journey.subtitle}</p>
                                <p className="font-serif text-white/60 text-xl mb-10 leading-relaxed">{journey.intro}</p>

                                <div className="relative border-l-2 border-parish-accent/30 ml-4">
                                    {journey.steps.map((step) => (
                                        <div key={step.id} className="mb-8 pl-8 md:pl-10 relative">
                                            <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-parish-accent ring-4 ring-[#1C1917]" />
                                            <div className="font-display tracking-widest text-sm uppercase text-parish-accent mb-2">{step.phaseLabel}</div>
                                            <h4 className="font-display text-2xl text-[#F9F8F6] mb-3">{step.title}</h4>
                                            <p className="font-serif text-lg text-white/60 leading-relaxed">{step.details}</p>
                                            {step.meetingLabel && (
                                                <p className="font-serif text-white/40 text-base mt-2 italic">📅 {step.meetingLabel}</p>
                                            )}
                                            {step.prerequisites.length > 0 && (
                                                <ul className="mt-3 space-y-1">
                                                    {step.prerequisites.map((p, j) => (
                                                        <li key={j} className="font-serif text-base text-white/50">→ {p}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {journey.ctaLabel && (
                                    <a
                                        href={journey.ctaRoute || '/contact'}
                                        className="mt-8 inline-block bg-parish-accent text-[#1C1917] px-10 py-4 font-display text-base tracking-widest uppercase rounded-full hover:bg-white transition-colors no-underline font-semibold"
                                    >
                                        {journey.ctaLabel}
                                    </a>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Community Services & Faith Formation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <h2 className="font-display text-3xl text-parish-accent mb-8">Community Services</h2>
                        <ul className="space-y-5">
                            {content.communityServices.map((service, i) => (
                                <li key={i} className="font-serif text-lg text-white/70 leading-relaxed border-b border-white/5 pb-4">{service}</li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.15 }}
                    >
                        <h2 className="font-display text-3xl text-parish-accent mb-8">Faith Formation</h2>
                        <ul className="space-y-5">
                            {content.faithFormation.map((item, i) => (
                                <li key={i} className="font-serif text-lg text-white/70 leading-relaxed border-b border-white/5 pb-4">{item}</li>
                            ))}
                        </ul>

                        <h3 className="font-display text-2xl text-[#F9F8F6] mt-12 mb-4">Volunteering</h3>
                        <p className="font-serif text-lg text-white/60 leading-relaxed">{content.volunteerInfo}</p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
