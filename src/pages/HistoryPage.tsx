import { motion } from 'framer-motion';
import { useParishData } from '../context/ParishDataContext';
import { usePageSEO } from '../hooks/usePageSEO';
import { PageMeta } from '../components/PageMeta';

export function HistoryPage() {
    const { content, isLoading } = useParishData();

    usePageSEO({
        title: 'Parish History',
        description: 'Over a century of Catholic faith in Adelaide — from a Druids Hall in 1912 to today\'s thriving two-church parish at Greenacres and Walkerville.',
        path: '/history',
    });

    if (isLoading || !content) {
        return <div className="h-screen flex items-center justify-center bg-parish-bg font-display tracking-widest text-lg">Loading…</div>;
    }

    return (
        <div className="min-h-screen bg-parish-bg pt-28 pb-24 px-6 md:px-16 lg:px-24">
            <PageMeta title="Parish History" description="Explore over a century of faith at Greenacres Walkerville Catholic Parish. Interactive timeline from 1912 to the present day." path="/history" />
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="mb-16 md:mb-20 text-center"
                >
                    <div className="text-parish-accent font-display tracking-widest text-base uppercase mb-4">Parish History</div>
                    <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-parish-fg leading-tight text-balance">
                        A Century of <em className="font-serif italic text-parish-accent">Faith</em>
                    </h1>
                    <p className="font-serif text-xl text-parish-muted mt-6 max-w-2xl mx-auto">
                        From humble beginnings in a Druids Hall to a thriving two-church parish, our community's story spans over a century of devotion.
                    </p>
                </motion.div>

                {/* Timeline */}
                <div className="relative border-l-2 border-parish-accent/30 ml-4 md:ml-8 mb-20">
                    {content.historyMilestones.map((item, index) => (
                        <motion.div
                            key={item.year + index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.8, delay: Math.min(index * 0.05, 0.4), ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="mb-10 pl-10 md:pl-14 relative"
                        >
                            <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-parish-accent ring-4 ring-parish-bg" />

                            <h3 className="font-display text-3xl md:text-4xl text-parish-accent mb-3">{item.year}</h3>
                            <p className="font-serif text-xl leading-relaxed text-parish-muted">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
