import { motion, useScroll, useTransform } from 'framer-motion';
import { useParishData } from '../../context/ParishDataContext';

export function HeroSection() {
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const { content } = useParishData();

    if (!content) return null;

    return (
        <header className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 text-center">
            <motion.div
                style={{ y }}
                className="absolute inset-0 z-0"
            >
                {/* Background image could also be a video */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-70"
                    style={{ backgroundImage: "url('/assets/images/source/hero_3.webp')" }}
                />
                {/* Overlay 1: Darken for legibility */}
                <div className="absolute inset-0 bg-parish-bg/60 mix-blend-multiply" />
                {/* Overlay 2: Noise (dust motes) */}
                <div className="absolute inset-0 noise-bg opacity-30 mix-blend-overlay" />
                {/* Gradient fade at bottom */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-parish-bg/30 to-parish-bg" />
            </motion.div>

            <div className="relative z-10 max-w-4xl pt-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
                >
                    <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-parish-fg font-light leading-[1.1] mb-6 tracking-tight">
                        Welcome to <br />
                        <span className="font-serif italic text-parish-brass/90">Greenacres Walkerville Parish</span>
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.5 }}
                    className="font-serif text-xl md:text-2xl text-parish-fg/80 italic max-w-2xl mx-auto mb-12 leading-relaxed"
                >
                    "I can do all things through Christ who strengthens me."
                    <span className="block text-sm font-display tracking-widest uppercase text-parish-brass mt-4 not-italic">
                        — Philippians 4:13
                    </span>
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.7 }}
                    className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                >
                    <a href="/mass-times" className="ethereal-button bg-parish-brass/10 border-parish-brass/30 text-parish-brass hover:bg-parish-brass hover:text-parish-bg">
                        Mass Times
                    </a>
                    <a href="/new-here" className="ethereal-button">
                        I'm New Here
                    </a>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 2 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
            >
                <div className="w-6 h-10 border border-parish-border/20 rounded-full flex justify-center pt-2">
                    <motion.div
                        animate={{ y: [0, 8, 0], opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-1 h-1 bg-parish-brass rounded-full"
                    />
                </div>
            </motion.div>
        </header>
    );
}
