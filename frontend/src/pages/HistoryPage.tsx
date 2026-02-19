import { motion } from 'framer-motion';
import { useParishData } from '../context/ParishDataContext';

export function HistoryPage() {
    const { content, isLoading } = useParishData();

    if (isLoading || !content) {
        return <div className="h-screen flex items-center justify-center bg-parish-bg font-display tracking-widest text-sm uppercase">Loading…</div>;
    }

    return (
        <div className="min-h-screen bg-parish-bg pt-32 pb-24 px-8 md:px-24">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="mb-24 text-center"
                >
                    <div className="text-parish-accent font-display tracking-widest text-sm uppercase mb-4">Parish History</div>
                    <h1 className="font-display text-6xl md:text-8xl text-parish-fg leading-none mx-auto text-balance">
                        A Timeline of <em className="font-serif italic text-parish-accent">Faith</em>
                    </h1>
                </motion.div>

                {/* Timeline */}
                <div className="relative border-l border-black/10 ml-4 md:ml-12 mb-32">
                    {content.historyMilestones.map((item, index) => (
                        <motion.div
                            key={item.year + index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="mb-12 pl-12 relative"
                        >
                            <div className="absolute -left-2 top-2 w-4 h-4 rounded-full bg-parish-accent ring-8 ring-parish-bg" />

                            <h3 className="font-display text-4xl text-parish-accent mb-3">{item.year}</h3>
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
