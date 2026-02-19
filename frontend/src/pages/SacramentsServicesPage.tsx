import { motion } from 'framer-motion';
import { useParishData } from '../context/ParishDataContext';

export function SacramentsServicesPage() {
    const { content, isLoading } = useParishData();

    if (isLoading || !content) {
        return <div className="h-screen flex items-center justify-center bg-[#1C1917] text-white font-display tracking-widest text-sm uppercase">Loading…</div>;
    }

    return (
        <div className="min-h-screen bg-[#1C1917] pt-32 pb-24 px-8 md:px-24">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="mb-24 text-center"
                >
                    <div className="text-parish-accent font-display tracking-widest text-sm uppercase mb-4">Sacraments & Services</div>
                    <h1 className="font-display text-6xl md:text-8xl text-[#F9F8F6] leading-none mx-auto text-balance">
                        Channels of <em className="font-serif italic text-parish-accent">Grace</em>
                    </h1>
                </motion.div>

                {/* Sacraments Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
                    {content.sacraments.map((sacrament, index) => (
                        <motion.div
                            key={sacrament.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="group border-b border-white/10 pb-8 cursor-pointer"
                        >
                            <div className="flex justify-between items-end mb-4">
                                <h2 className="font-display text-4xl text-[#F9F8F6] group-hover:text-parish-accent transition-colors duration-500">{sacrament.title}</h2>
                                <div className="w-8 h-[1px] bg-white/20 group-hover:w-16 group-hover:bg-parish-accent transition-all duration-500" />
                            </div>
                            <p className="font-serif text-xl text-white/60 leading-relaxed">
                                {sacrament.details}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Sacramental Journeys */}
                {content.sacramentalJourneys.length > 0 && (
                    <div className="space-y-24">
                        <h2 className="font-display text-5xl text-center text-parish-accent">Preparation Pathways</h2>
                        {content.sacramentalJourneys.map(journey => (
                            <motion.div
                                key={journey.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                                className="bg-white/5 p-10 md:p-14 rounded-[2rem] border border-white/10"
                            >
                                <h3 className="font-display text-3xl text-[#F9F8F6] mb-2">{journey.title}</h3>
                                <p className="font-serif text-white/50 italic text-lg mb-4">{journey.subtitle}</p>
                                <p className="font-serif text-white/60 text-lg mb-10">{journey.intro}</p>

                                <div className="relative border-l border-parish-accent/30 ml-4">
                                    {journey.steps.map((step) => (
                                        <div key={step.id} className="mb-8 pl-8 relative">
                                            <div className="absolute -left-2 top-1 w-4 h-4 rounded-full bg-parish-accent ring-4 ring-[#1C1917]" />
                                            <div className="font-display tracking-widest text-xs uppercase text-parish-accent mb-2">{step.phaseLabel}</div>
                                            <h4 className="font-display text-xl text-[#F9F8F6] mb-2">{step.title}</h4>
                                            <p className="font-serif text-white/50">{step.details}</p>
                                            {step.meetingLabel && (
                                                <p className="font-serif text-white/30 text-sm mt-2 italic">{step.meetingLabel}</p>
                                            )}
                                            {step.prerequisites.length > 0 && (
                                                <ul className="mt-2 space-y-1">
                                                    {step.prerequisites.map((p, j) => (
                                                        <li key={j} className="font-serif text-sm text-white/40 before:content-['→_'] before:text-parish-accent">{p}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {journey.ctaLabel && (
                                    <a href={journey.ctaRoute || '/contact'} className="mt-8 inline-block bg-parish-accent text-[#1C1917] px-8 py-4 font-display text-xs tracking-[0.2em] uppercase rounded-full hover:bg-white transition-colors no-underline">
                                        {journey.ctaLabel}
                                    </a>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Community Services & Volunteering */}
                <div className="mt-32 grid grid-cols-1 md:grid-cols-2 gap-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <h2 className="font-display text-4xl text-parish-accent mb-8">Community Services</h2>
                        <ul className="space-y-4">
                            {content.communityServices.map((service, i) => (
                                <li key={i} className="font-serif text-lg text-white/60 leading-relaxed border-b border-white/5 pb-4">{service}</li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                    >
                        <h2 className="font-display text-4xl text-parish-accent mb-8">Faith Formation</h2>
                        <ul className="space-y-4">
                            {content.faithFormation.map((item, i) => (
                                <li key={i} className="font-serif text-lg text-white/60 leading-relaxed border-b border-white/5 pb-4">{item}</li>
                            ))}
                        </ul>

                        <h3 className="font-display text-2xl text-[#F9F8F6] mt-12 mb-4">Volunteering</h3>
                        <p className="font-serif text-white/50 text-lg leading-relaxed">{content.volunteerInfo}</p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
