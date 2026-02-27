import { motion } from 'framer-motion';
import { useParishData } from '../context/ParishDataContext';

export function NewHerePage() {
    const { content, isLoading } = useParishData();

    if (isLoading || !content) {
        return <div className="h-screen flex items-center justify-center bg-parish-bg font-display tracking-widest text-lg">Loading…</div>;
    }

    return (
        <div className="min-h-screen bg-parish-bg pt-28 pb-24 px-6 md:px-16 lg:px-24">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="mb-16 text-center"
                >
                    <div className="text-parish-accent font-display tracking-widest text-base uppercase mb-4">Welcome</div>
                    <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-parish-fg leading-tight mb-8 text-balance">
                        You Belong <em className="font-serif italic text-parish-accent">Here</em>
                    </h1>
                    <p className="font-serif text-xl md:text-2xl text-parish-muted max-w-2xl mx-auto leading-relaxed">
                        Whether you have been Catholic your whole life, are returning after a break, or are exploring faith for the first time — you are welcome here. God has brought you to this moment.
                    </p>
                </motion.div>

                {/* Scripture */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.15 }}
                    className="bg-parish-fg p-8 md:p-12 rounded-[2rem] text-center mb-16"
                >
                    <p className="font-serif text-xl md:text-2xl italic text-parish-surface/80 leading-relaxed max-w-2xl mx-auto">
                        "Come to me, all you who are weary and burdened, and I will give you rest."
                    </p>
                    <p className="font-display tracking-widest text-sm uppercase text-parish-accent mt-4">— Matthew 11:28</p>
                </motion.div>

                {/* Steps */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="space-y-6"
                >
                    <h2 className="font-display text-3xl mb-6">Your First Visit</h2>
                    {content.newHereSteps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.6, delay: i * 0.08 }}
                            className="bg-parish-surface p-8 md:p-10 rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.06)] border border-parish-border/5 flex gap-6 items-start"
                        >
                            <div className="font-display text-4xl text-parish-accent leading-none mt-1 shrink-0 w-12 text-center">{i + 1}</div>
                            <p className="font-serif text-xl leading-relaxed text-parish-muted">{step}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-16 text-center">
                    <a href="/mass-times" className="bg-parish-fg text-parish-surface px-10 py-4 font-display tracking-widest uppercase text-base hover:bg-parish-accent transition-colors rounded-full no-underline inline-block">
                        Plan Your Visit
                    </a>
                    <a href="/contact" className="bg-parish-surface text-parish-fg border-2 border-parish-fg/20 px-10 py-4 font-display tracking-widest uppercase text-base hover:border-parish-accent hover:text-parish-accent transition-colors rounded-full no-underline inline-block">
                        Contact the Office
                    </a>
                </div>
            </div>
        </div>
    );
}
