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
    { id: 't3', quote: 'Every homily gives me something real to carry into the week. The parish feels prayerful without ever feeling closed off.', name: 'Catherine S.', role: 'Community volunteer' },
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
        <section className="page-section mt-16 md:mt-24">
            <div className="page-section-inner">
                <div className="sanctuary-panel px-6 py-12 text-center md:px-10 md:py-14">
                    <div className="section-label mx-auto mb-4 w-fit">Testimonials</div>
                    <h2 className="mx-auto max-w-3xl text-4xl text-parish-fg md:text-5xl">
                        What people remember is not spectacle, but the feeling of being welcomed.
                    </h2>

                    <div className="relative flex min-h-[220px] items-center justify-center">
                        <AnimatePresence custom={direction} mode="wait">
                            <motion.div
                                key={t.id}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.4, ease: 'easeInOut' }}
                                className="flex flex-col items-center gap-6 px-4 pt-10"
                            >
                                <Quote size={32} className="text-parish-brass/60" />
                                <p className="max-w-3xl font-serif text-xl italic leading-relaxed text-parish-fg md:text-2xl">
                                    "{t.quote}"
                                </p>
                                <div>
                                    <div className="text-lg text-parish-fg">{t.name}</div>
                                    {t.role && <div className="text-sm italic text-parish-muted">{t.role}</div>}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-4">
                        <button onClick={prev} aria-label="Previous testimonial"
                            className="rounded-full border border-parish-border/10 p-2 text-parish-muted transition-colors hover:border-parish-brass/30 hover:text-parish-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-parish-accent">
                            <ChevronLeft size={20} />
                        </button>
                        <div className="flex gap-2">
                            {TESTIMONIALS.map((_, i) => (
                                <button key={i} onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                                    className={`h-2 rounded-full transition-all ${i === current ? 'w-8 bg-parish-brass' : 'w-2 bg-parish-border/20 hover:bg-parish-border/40'}`}
                                    aria-label={`Go to testimonial ${i + 1}`} />
                            ))}
                        </div>
                        <button onClick={next} aria-label="Next testimonial"
                            className="rounded-full border border-parish-border/10 p-2 text-parish-muted transition-colors hover:border-parish-brass/30 hover:text-parish-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-parish-accent">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
