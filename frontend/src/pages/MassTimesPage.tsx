import { motion } from 'framer-motion';
import { useParishData } from '../context/ParishDataContext';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function MassTimesPage() {
    const { content, isLoading } = useParishData();

    if (isLoading || !content) {
        return <div className="h-screen flex items-center justify-center bg-parish-bg font-display tracking-widest text-sm uppercase">Loading…</div>;
    }

    const monicaMasses = content.massSchedule.filter(m => m.church.includes('Monica'));
    const martinMasses = content.massSchedule.filter(m => m.church.includes('Martin'));

    return (
        <div className="min-h-screen bg-parish-bg pt-32 pb-24 px-8 md:px-24">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="mb-24 text-center"
                >
                    <div className="text-parish-accent font-display tracking-widest text-sm uppercase mb-4">Mass & Sacraments</div>
                    <h1 className="font-display text-6xl md:text-8xl text-parish-fg leading-none mx-auto text-balance">
                        Worship <em className="font-serif italic text-parish-accent">Times</em>
                    </h1>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* St Monica's Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
                        className="bg-white p-10 md:p-14 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-black/5"
                    >
                        <h2 className="font-display text-3xl mb-2">St Monica's Church</h2>
                        <p className="font-serif text-parish-muted italic mb-8">{monicaMasses[0]?.address}</p>
                        <div className="space-y-6">
                            {monicaMasses.map(mass => (
                                <div key={mass.id} className="border-b border-black/5 pb-4 last:border-0">
                                    <div className="flex justify-between items-baseline">
                                        <span className="font-display text-2xl">{mass.startTime}</span>
                                        <span className="font-display tracking-widest text-xs uppercase text-parish-accent">{WEEKDAYS[mass.dayOfWeek - 1]}</span>
                                    </div>
                                    <p className="font-serif text-parish-muted mt-1">{mass.type}{mass.notes ? ` — ${mass.notes}` : ''}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* St Martin's Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
                        className="bg-white p-10 md:p-14 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-black/5"
                    >
                        <h2 className="font-display text-3xl mb-2">St Martin's Church</h2>
                        <p className="font-serif text-parish-muted italic mb-8">{martinMasses[0]?.address}</p>
                        <div className="space-y-6">
                            {martinMasses.map(mass => (
                                <div key={mass.id} className="border-b border-black/5 pb-4 last:border-0">
                                    <div className="flex justify-between items-baseline">
                                        <span className="font-display text-2xl">{mass.startTime}</span>
                                        <span className="font-display tracking-widest text-xs uppercase text-parish-accent">{WEEKDAYS[mass.dayOfWeek - 1]}</span>
                                    </div>
                                    <p className="font-serif text-parish-muted mt-1">{mass.type}{mass.notes ? ` — ${mass.notes}` : ''}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Sacraments Quick Reference */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="mt-24 bg-[#1C1917] p-12 md:p-16 rounded-[2rem] text-white"
                >
                    <h2 className="font-display text-4xl mb-10 text-parish-accent">Sacraments</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {content.sacraments.map((s, i) => (
                            <div key={i} className="border-b border-white/10 pb-4">
                                <h3 className="font-display text-xl mb-2 text-white">{s.title}</h3>
                                <p className="font-serif text-white/60 text-lg">{s.details}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
