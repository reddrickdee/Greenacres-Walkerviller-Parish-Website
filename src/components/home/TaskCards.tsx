import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
    CalendarClock,
    MapPinned,
    Newspaper,
    Heart,
    Phone,
    ArrowRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface TaskCard {
    icon: LucideIcon;
    title: string;
    description: string;
    to: string;
    linkLabel: string;
}

const TASKS: TaskCard[] = [
    {
        icon: CalendarClock,
        title: 'Mass Times',
        description: 'Weekend and weekday Mass times for both St Monica\u2019s and St Martin\u2019s.',
        to: '/mass-times',
        linkLabel: 'View Mass Times',
    },
    {
        icon: MapPinned,
        title: "I'm New Here",
        description: 'Everything you need to know for your first visit. We can\u2019t wait to welcome you.',
        to: '/new-here',
        linkLabel: 'Plan Your Visit',
    },
    {
        icon: Newspaper,
        title: "This Week's Bulletin",
        description: 'Read the latest bulletin and find what\u2019s happening in our Parish this week.',
        to: '/news-events',
        linkLabel: 'Read Bulletin',
    },
    {
        icon: Heart,
        title: 'Give Online',
        description: 'Your generosity helps our Parish to continue our mission and ministries.',
        to: '/give',
        linkLabel: 'Give Now',
    },
    {
        icon: Phone,
        title: 'Contact the Office',
        description: 'Get in touch with our Parish Office. We\u2019re here to help.',
        to: '/contact',
        linkLabel: 'Contact Us',
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

export function TaskCards() {
    const prefersReduced = useReducedMotion();

    return (
        <section className="page-section" id="help-today">
            <div className="page-section-inner">
                <motion.h2
                    {...(prefersReduced ? noMotion : reveal)}
                    className="text-center text-[clamp(1.6rem,3.5vw,2.6rem)] text-parish-fg mb-10 md:mb-14"
                >
                    How can we help you today?
                </motion.h2>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                    {TASKS.map((task, index) => {
                        const Icon = task.icon;
                        const motionProps = prefersReduced
                            ? noMotion
                            : {
                                ...reveal,
                                transition: { ...reveal.transition, delay: index * 0.08 },
                            };

                        /* Requirement 4.3: subtle hover lift on pointer hover, reverting on leave.
                           Requirement 4.7: suppress the lift entirely under prefers-reduced-motion
                           so the card does not translate at all (the global reduced-motion rule in
                           index.css only collapses the transition duration, it does not remove the
                           transform). */
                        const liftClass = prefersReduced ? '' : 'hover:-translate-y-0.5';

                        return (
                            <motion.div key={task.title} {...motionProps}>
                                <Link
                                    to={task.to}
                                    data-lift={prefersReduced ? 'off' : 'on'}
                                    className={`group flex flex-col rounded-2xl border border-parish-border/15 bg-parish-surface px-5 py-6 no-underline transition-all duration-500 ${liftClass} hover:border-parish-accent/15 hover:shadow-card-hover`}
                                >
                                    <Icon
                                        className="h-6 w-6 text-parish-accent"
                                        strokeWidth={1.5}
                                        aria-hidden="true"
                                    />
                                    <h3 className="mt-3 text-base font-display text-parish-fg">
                                        {task.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-parish-muted">
                                        {task.description}
                                    </p>
                                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-parish-accent">
                                        {task.linkLabel}
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
