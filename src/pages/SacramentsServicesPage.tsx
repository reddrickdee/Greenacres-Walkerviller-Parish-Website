import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useParishData } from '../context/ParishDataContext';
import { usePageSEO } from '../hooks/usePageSEO';
import { PageMeta } from '../components/PageMeta';

export function SacramentsServicesPage() {
    const { content, isLoading } = useParishData();

    usePageSEO({
        title: 'Sacraments & Services',
        description: 'Baptism, Marriage, RCIA, Reconciliation, and community services at Greenacres Walkerville Catholic Parish. Preparation pathways and how to get started.',
        path: '/sacraments',
    });

    if (isLoading || !content) {
        return <div className="h-screen flex items-center justify-center bg-parish-bg text-parish-fg font-display tracking-widest text-lg">Loading…</div>;
    }

    return (
        <div className="min-h-screen bg-parish-bg pt-28 pb-24 px-6 md:px-16 lg:px-24">
            <PageMeta title="Sacraments & Services" description="Sacraments at Greenacres Walkerville Parish — Baptism, Reconciliation, Weddings, Funerals, and sacramental preparation pathways." path="/sacraments" />
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="mb-16 md:mb-20 text-center"
                >
                    <div className="text-parish-accent font-display tracking-widest text-base uppercase mb-4">Sacraments & Services</div>
                    <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-parish-fg leading-tight text-balance">
                        Channels of <em className="font-serif italic text-parish-accent">Grace</em>
                    </h1>
                    <p className="font-serif text-xl text-parish-muted mt-6 max-w-2xl mx-auto italic">
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
                            className="bg-parish-surface shadow-sm border border-parish-border/10 p-8 md:p-10 rounded-[2rem] hover:border-parish-accent/30 hover:shadow-md transition-all group"
                        >
                            <h2 className="font-display text-3xl text-parish-fg mb-4 group-hover:text-parish-accent transition-colors">{sacrament.title}</h2>
                            <p className="font-serif text-xl text-parish-muted leading-relaxed">{sacrament.details}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Sacramental Journeys */}
                {content.sacramentalJourneys.length > 0 && (
                    <div className="space-y-16 mb-24">
                        <h2 className="font-display text-4xl text-center text-parish-accent">Preparation Pathways</h2>
                        <p className="font-serif text-xl text-parish-muted text-center max-w-2xl mx-auto">
                            Each sacrament involves a journey of preparation. Here is what to expect.
                        </p>
                        {content.sacramentalJourneys.map(journey => (
                            <motion.div
                                key={journey.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1 }}
                                className="bg-parish-surface shadow-sm p-8 md:p-12 rounded-[2rem] border border-parish-border/10"
                            >
                                <h3 className="font-display text-3xl text-parish-fg mb-2">{journey.title}</h3>
                                <p className="font-serif text-parish-muted italic text-xl mb-4">{journey.subtitle}</p>
                                <p className="font-serif text-parish-fg text-xl mb-10 leading-relaxed">{journey.intro}</p>

                                <div className="relative border-l-2 border-parish-accent/30 ml-4">
                                    {journey.steps.map((step) => (
                                        <div key={step.id} className="mb-8 pl-8 md:pl-10 relative">
                                            {/* Fix alignment: absolute dot needs to sit exactly on the border line */}
                                            <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-parish-accent ring-4 ring-parish-surface" />
                                            <div className="font-display tracking-widest text-sm uppercase text-parish-accent mb-2">{step.phaseLabel}</div>
                                            <h4 className="font-display text-2xl text-parish-fg mb-3">{step.title}</h4>
                                            <p className="font-serif text-lg text-parish-muted leading-relaxed">{step.details}</p>
                                            {step.meetingLabel && (
                                                <p className="font-serif text-parish-muted text-base mt-2 italic flex items-center gap-2">
                                                    <span aria-hidden="true">📅</span> {step.meetingLabel}
                                                </p>
                                            )}
                                            {step.prerequisites.length > 0 && (
                                                <ul className="mt-3 space-y-1">
                                                    {step.prerequisites.map((p, j) => (
                                                        <li key={j} className="font-serif text-base text-parish-muted flex items-start gap-2">
                                                            <span className="text-parish-accent/50 mt-1">→</span> {p}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {journey.ctaLabel && (
                                    <Link
                                        to={journey.ctaRoute || '/contact'}
                                        className="mt-8 inline-block bg-parish-accent text-parish-inverse px-10 py-4 font-display text-base tracking-widest uppercase rounded-full hover:bg-parish-accent-hover transition-colors no-underline font-semibold"
                                    >
                                        {journey.ctaLabel}
                                    </Link>
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
                                <li key={i} className="font-serif text-lg text-parish-fg leading-relaxed border-b border-parish-border/10 pb-4">{service}</li>
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
                                <li key={i} className="font-serif text-lg text-parish-fg leading-relaxed border-b border-parish-border/10 pb-4">{item}</li>
                            ))}
                        </ul>

                        <h3 className="font-display text-2xl text-parish-fg mt-12 mb-4">Volunteering</h3>
                        <p className="font-serif text-lg text-parish-muted leading-relaxed">{content.volunteerInfo}</p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
