import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
    id: string;
    quote: string;
    name: string;
    role?: string;
}

const TESTIMONIALS: Testimonial[] = [
    { id: 't1', quote: 'From the moment we walked through the doors, we felt at home. This parish truly lives the Gospel.', name: 'Maria & Tony', role: 'Parishioners since 2019' },
    { id: 't2', quote: 'The warmth and welcome we received when we moved to Adelaide was extraordinary. We found our church family here.', name: 'The Nguyen Family', role: 'Parishioners since 2022' },
    { id: 't3', quote: 'Fr Steve\'s homilies always leave me with something to reflect on throughout the week. A truly caring shepherd.', name: 'Catherine S.', role: 'Community volunteer' },
    { id: 't4', quote: 'The children\'s liturgy program has been wonderful for our kids. They actually look forward to going to Mass!', name: 'David & Helen', role: 'Young family' },
    { id: 't5', quote: 'Being part of the St Vincent de Paul group here has shown me the real meaning of service to others.', name: 'Robert K.', role: 'SVdP Member' },
];

export function TestimonialsCarousel() {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(0);

    const next = () => { setDirection(1); setCurrent(i => (i + 1) % TESTIMONIALS.length); };
    const prev = () => { setDirection(-1); setCurrent(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length); };

    // Auto-advance every 8 seconds
    useEffect(() => {
        const timer = setInterval(next, 8000);
        return () => clearInterval(timer);
    }, []);

    const t = TESTIMONIALS[current];

    const variants = {
        enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
    };

    return (
        <section className="py-20 md:py-28 px-6 md:px-16 lg:px-24 bg-parish-elevated border-y border-parish-border/5">
            <div className="max-w-4xl mx-auto text-center">
                <div className="text-parish-accent font-display tracking-widest text-sm uppercase mb-4">Testimonials</div>
                <h2 className="font-display text-4xl md:text-5xl text-parish-fg mb-12">
                    Our <em className="font-serif italic text-parish-accent">Community</em> Speaks
                </h2>

                <div className="relative min-h-[220px] flex items-center justify-center">
                    <AnimatePresence custom={direction} mode="wait">
                        <motion.div
                            key={t.id}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.4, ease: 'easeInOut' }}
                            className="flex flex-col items-center gap-6 px-4"
                        >
                            <Quote size={32} className="text-parish-accent/30" />
                            <p className="font-serif text-xl md:text-2xl text-parish-fg italic leading-relaxed max-w-3xl">
                                "{t.quote}"
                            </p>
                            <div>
                                <div className="font-display text-lg text-parish-fg">{t.name}</div>
                                {t.role && <div className="font-serif text-sm text-parish-muted italic">{t.role}</div>}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4 mt-8">
                    <button onClick={prev} aria-label="Previous testimonial"
                        className="p-2 rounded-full border border-parish-border/10 text-parish-muted hover:text-parish-accent hover:border-parish-accent/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-parish-accent">
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex gap-2">
                        {TESTIMONIALS.map((_, i) => (
                            <button key={i} onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                                className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-parish-accent w-6' : 'bg-parish-border/20 hover:bg-parish-border/40'}`}
                                aria-label={`Go to testimonial ${i + 1}`} />
                        ))}
                    </div>
                    <button onClick={next} aria-label="Next testimonial"
                        className="p-2 rounded-full border border-parish-border/10 text-parish-muted hover:text-parish-accent hover:border-parish-accent/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-parish-accent">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </section>
    );
}
