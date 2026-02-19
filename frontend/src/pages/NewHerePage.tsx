import { motion } from 'framer-motion';
import { useParishData } from '../context/ParishDataContext';

export function NewHerePage() {
    const { content, isLoading } = useParishData();

    if (isLoading || !content) {
        return <div className="h-screen flex items-center justify-center bg-parish-bg font-display tracking-widest text-sm uppercase">Loading…</div>;
    }

    return (
        <div className="min-h-screen bg-parish-bg pt-32 pb-24 px-8 md:px-24">
            <div className="max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="mb-16"
                >
                    <div className="text-parish-accent font-display tracking-widest text-sm uppercase mb-6">Welcome</div>
                    <h1 className="font-display text-6xl md:text-8xl text-parish-fg leading-none mb-8 text-balance">
                        I'm New <em className="font-serif italic text-parish-accent">Here</em>
                    </h1>
                    <p className="font-serif text-2xl text-parish-muted max-w-2xl mx-auto italic">
                        Whether you've been Catholic your whole life, or are just exploring faith for the first time, you are welcome here.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
                    className="text-left space-y-8"
                >
                    {content.newHereSteps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="bg-white p-10 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-black/5 flex gap-6 items-start"
                        >
                            <div className="font-display text-5xl text-parish-accent leading-none mt-1">{i + 1}</div>
                            <p className="font-serif text-xl leading-relaxed text-parish-muted">{step}</p>
                        </motion.div>
                    ))}

                    <div className="flex flex-col md:flex-row gap-8 justify-center mt-16 text-center">
                        <a href="/mass-times" className="bg-parish-fg text-white px-10 py-5 font-display tracking-[0.2em] uppercase text-sm hover:bg-parish-accent transition-colors rounded-full no-underline">
                            Plan a Visit
                        </a>
                        <a href="/contact" className="bg-white text-parish-fg border border-parish-fg/20 px-10 py-5 font-display tracking-[0.2em] uppercase text-sm hover:border-parish-accent hover:text-parish-accent transition-colors rounded-full no-underline">
                            Contact Office
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
