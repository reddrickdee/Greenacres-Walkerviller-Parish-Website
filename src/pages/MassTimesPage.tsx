import { motion } from 'framer-motion';
import { useParishData } from '../context/ParishDataContext';
import { usePageSEO } from '../hooks/usePageSEO';
import { PageMeta } from '../components/PageMeta';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function MassTimesPage() {
    const { content, isLoading } = useParishData();

    usePageSEO({
        title: 'Mass Times',
        description: 'Weekend and weekday Mass schedule at St Monica\'s Walkerville (Saturday 6pm vigil) and St Martin\'s Greenacres (Sunday 9:30am). Plus weekday services and Reconciliation times.',
        path: '/mass-times',
    });

    if (isLoading || !content) {
        return <div className="h-screen flex items-center justify-center bg-parish-bg font-display tracking-widest text-lg">Loading…</div>;
    }

    const monicaMasses = content.massSchedule.filter(m => m.church.includes('Monica'));
    const martinMasses = content.massSchedule.filter(m => m.church.includes('Martin'));

    return (
        <div className="min-h-screen bg-parish-bg pt-28 pb-24 px-6 md:px-16 lg:px-24">
            <PageMeta title="Mass Times" description="Mass times and schedules for St Monica's Church Walkerville and St Martin's Church Greenacres. Weekend and weekday Mass, reconciliation, and sacrament information." path="/mass-times" />
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="mb-16 md:mb-20 text-center"
                >
                    <div className="text-parish-accent font-display tracking-widest text-base uppercase mb-4">Join Us in Worship</div>
                    <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-parish-fg leading-tight text-balance">
                        Mass <em className="font-serif italic text-parish-accent">Times</em>
                    </h1>
                    <p className="font-serif text-xl text-parish-muted mt-6 max-w-2xl mx-auto">
                        Everyone is welcome. Come as you are and let God do the rest.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* St Monica's */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.1 }}
                        className="bg-parish-surface p-8 md:p-12 rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.06)] border border-parish-border/5"
                    >
                        <h2 className="font-display text-3xl mb-3">St Monica's Church</h2>
                        <p className="font-serif text-lg text-parish-muted italic mb-8">{monicaMasses[0]?.address}</p>
                        <div className="space-y-6">
                            {monicaMasses.map(mass => (
                                <div key={mass.id} className="border-b border-parish-border/5 pb-5 last:border-0">
                                    <div className="flex justify-between items-baseline gap-4">
                                        <span className="font-display text-3xl">{mass.startTime}</span>
                                        <span className="font-display tracking-widest text-sm uppercase text-parish-accent">{WEEKDAYS[mass.dayOfWeek - 1]}</span>
                                    </div>
                                    <p className="font-serif text-lg text-parish-muted mt-2">{mass.type}{mass.notes ? ` — ${mass.notes}` : ''}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* St Martin's */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="bg-parish-surface p-8 md:p-12 rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.06)] border border-parish-border/5"
                    >
                        <h2 className="font-display text-3xl mb-3">St Martin's Church</h2>
                        <p className="font-serif text-lg text-parish-muted italic mb-8">{martinMasses[0]?.address}</p>
                        <div className="space-y-6">
                            {martinMasses.map(mass => (
                                <div key={mass.id} className="border-b border-parish-border/5 pb-5 last:border-0">
                                    <div className="flex justify-between items-baseline gap-4">
                                        <span className="font-display text-3xl">{mass.startTime}</span>
                                        <span className="font-display tracking-widest text-sm uppercase text-parish-accent">{WEEKDAYS[mass.dayOfWeek - 1]}</span>
                                    </div>
                                    <p className="font-serif text-lg text-parish-muted mt-2">{mass.type}{mass.notes ? ` — ${mass.notes}` : ''}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Sacraments */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="mt-20 bg-parish-fg p-8 md:p-14 rounded-[2rem] text-parish-surface"
                >
                    <h2 className="font-display text-3xl md:text-4xl mb-10 text-parish-accent">Sacraments at a Glance</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {content.sacraments.map((s, i) => (
                            <div key={i} className="border-b border-parish-surface/10 pb-6">
                                <h3 className="font-display text-2xl mb-3 text-parish-surface">{s.title}</h3>
                                <p className="font-serif text-lg text-parish-surface/70 leading-relaxed">{s.details}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
