import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
    Droplets,
    HeartHandshake,
    GraduationCap,
    Shield,
    Calendar,
    ArrowRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ParishLifeItem {
    icon: LucideIcon;
    title: string;
    description: string;
    to: string;
}

const ITEMS: ParishLifeItem[] = [
    {
        icon: Droplets,
        title: 'Sacraments',
        description: 'Baptism, Reconciliation, First Communion, Confirmation & more.',
        to: '/sacraments',
    },
    {
        icon: HeartHandshake,
        title: 'Ministries',
        description: 'Explore our ministries and find a place to share your gifts.',
        to: '/volunteer',
    },
    {
        icon: GraduationCap,
        title: 'Our Schools',
        description: "St Martin's Primary School and St Monica's Primary.",
        to: '/contact',
    },
    {
        icon: Shield,
        title: 'Safeguarding',
        description: "Keeping our community safe is everyone's responsibility.",
        to: '/safeguarding',
    },
    {
        icon: Calendar,
        title: 'Parish Calendar',
        description: "See what's happening in the parish this month.",
        to: '/news-events',
    },
];

const reveal = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-40px' },
    transition: { duration: 0.6, ease: [0.32, 0.72, 0, 1] as const },
};

const noMotion = {
    initial: { opacity: 1, y: 0 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0 },
};

export function ParishLifeStrip() {
    const prefersReduced = useReducedMotion();

    return (
        <section className="page-section" id="parish-life">
            <div className="page-section-inner">
                <motion.h2
                    {...(prefersReduced ? noMotion : reveal)}
                    className="text-3xl font-display text-parish-fg mb-8 md:text-4xl"
                >
                    Parish life
                </motion.h2>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                    {ITEMS.map((item, index) => {
                        const Icon = item.icon;
                        const motionProps = prefersReduced
                            ? noMotion
                            : {
                                ...reveal,
                                transition: { ...reveal.transition, delay: index * 0.06 },
                            };

                        return (
                            <motion.div key={item.title} {...motionProps}>
                                <Link
                                    to={item.to}
                                    className="group flex flex-col rounded-2xl border border-parish-border/10 bg-parish-surface px-5 py-6 no-underline transition-all duration-500 hover:-translate-y-0.5 hover:border-parish-accent/15 hover:shadow-card"
                                >
                                    <Icon
                                        className="h-6 w-6 text-parish-accent"
                                        strokeWidth={1.5}
                                        aria-hidden="true"
                                    />
                                    <h3 className="mt-3 text-base font-display text-parish-fg">
                                        {item.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-parish-muted flex-1">
                                        {item.description}
                                    </p>
                                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-parish-accent">
                                        Learn more
                                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                                    </span>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
