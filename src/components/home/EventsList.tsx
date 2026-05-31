import { useState, useEffect } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Calendar, Clock3, MapPin, Tag } from 'lucide-react';

interface ParishEvent {
    date: string;
    title: string;
    time: string;
    location: string;
    description: string;
    category: string;
}

// Intentional exception to parish-* design tokens: category colors use Tailwind
// palette values because these are semantic event-type indicators, not theme-level
// tokens. They need distinct hues that don't change with the parish colour scheme.
const CATEGORY_COLORS: Record<string, string> = {
    Mass: 'text-parish-accent',
    Sacrament: 'text-purple-600 dark:text-purple-400',
    Meeting: 'text-blue-600 dark:text-blue-400',
    Feast: 'text-amber-600 dark:text-amber-400',
    Devotion: 'text-rose-600 dark:text-rose-400',
    Community: 'text-parish-secondary',
    Youth: 'text-cyan-600 dark:text-cyan-400',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Heading reveal — kept as a single self-contained reveal.
const reveal = {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-40px' },
    transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] as const },
};

const noMotion = {
    initial: { opacity: 1, y: 0 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0 },
};

// Viewport-triggered staggered entry for the events grid. The container drives the
// cascade via `staggerChildren`; each card inherits the `hidden`/`visible` labels.
// `prefersReduced` collapses both the per-child stagger and the entry offset to zero,
// honouring `prefers-reduced-motion` (MOTION_INTENSITY 3–4).
function listContainerVariants(prefersReduced: boolean): Variants {
    return {
        hidden: {},
        visible: {
            transition: {
                delayChildren: prefersReduced ? 0 : 0.04,
                staggerChildren: prefersReduced ? 0 : 0.08,
            },
        },
    };
}

function listItemVariants(prefersReduced: boolean): Variants {
    if (prefersReduced) {
        return {
            hidden: { opacity: 1, y: 0 },
            visible: { opacity: 1, y: 0, transition: { duration: 0 } },
        };
    }
    return {
        hidden: { opacity: 0, y: 16 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] as const },
        },
    };
}

function formatDate(dateStr: string): string {
    const d = new Date(dateStr + 'T00:00:00');
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return `${days[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

interface EventsListProps {
    /** Max number of events to show */
    limit?: number;
    /** Show heading */
    showHeading?: boolean;
}

interface EventCardProps {
    event: ParishEvent;
    /** When true, the card spans a larger layout (the single featured card). */
    featured: boolean;
    variants: Variants;
}

function EventCard({ event, featured, variants }: EventCardProps) {
    const colorClass = CATEGORY_COLORS[event.category] ?? 'text-parish-muted';
    const eventDate = new Date(event.date + 'T00:00:00');

    return (
        <motion.div
            variants={variants}
            data-featured={featured ? 'true' : 'false'}
            className={
                featured
                    ? 'sanctuary-card sm:col-span-2 flex flex-col gap-4 border-parish-accent/20 px-6 py-7 sm:flex-row sm:items-center sm:gap-7'
                    : 'sanctuary-card flex flex-col gap-3 px-5 py-5'
            }
        >
            {/* Date badge */}
            <div
                className={
                    featured
                        ? 'flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-parish-accent/10 text-parish-accent'
                        : 'flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-parish-accent/8 text-parish-accent'
                }
            >
                <span className={featured ? 'text-2xl font-bold leading-none' : 'text-lg font-bold leading-none'}>
                    {eventDate.getDate()}
                </span>
                <span className="text-[0.65rem] font-semibold uppercase tracking-wider">
                    {MONTHS[eventDate.getMonth()]}
                </span>
            </div>

            {/* Event details */}
            <div className="flex-1 min-w-0">
                {featured && (
                    <div className="ornamental-kicker mb-1.5">Next Up</div>
                )}
                <h3
                    className={
                        featured
                            ? 'text-lg font-display text-parish-fg md:text-xl'
                            : 'text-base font-semibold text-parish-fg'
                    }
                >
                    {event.title}
                </h3>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-parish-muted">
                    <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                        {formatDate(event.date)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                        {event.time}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                        {event.location}
                    </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-parish-muted">
                    {event.description}
                </p>
            </div>

            {/* Category tag */}
            <span
                className={`inline-flex items-center gap-1 shrink-0 self-start text-[0.65rem] font-semibold uppercase tracking-wider ${colorClass}`}
            >
                <Tag className="h-3 w-3" aria-hidden="true" />
                {event.category}
            </span>
        </motion.div>
    );
}

export function EventsList({ limit = 8, showHeading = true }: EventsListProps) {
    const [events, setEvents] = useState<ParishEvent[]>([]);
    const [loaded, setLoaded] = useState(false);
    const prefersReduced = useReducedMotion() ?? false;

    useEffect(() => {
        fetch('/data/events.json')
            .then(r => {
                if (!r.ok) throw new Error('Failed to load');
                return r.json();
            })
            .then((data: { events: ParishEvent[] }) => {
                // Filter to only future events
                const today = new Date().toISOString().split('T')[0];
                const upcoming = data.events
                    .filter(e => e.date >= today)
                    .sort((a, b) => a.date.localeCompare(b.date))
                    .slice(0, limit);
                setEvents(upcoming);
            })
            .catch((err) => {
                if (import.meta.env.DEV) console.warn('EventsList: failed to load events', err);
            })
            .finally(() => setLoaded(true));
    }, [limit]);

    // Don't render until fetch completes to avoid layout shift
    if (!loaded || events.length === 0) return null;

    // Featured-card asymmetry: only when two or more events render does exactly one
    // card (the soonest upcoming) span a larger layout; the rest stay uniform
    // (DESIGN_VARIANCE 4–5). With a single event there is no featured treatment.
    const hasFeatured = events.length >= 2;
    const itemVariants = listItemVariants(prefersReduced);

    return (
        <section className="page-section" id="upcoming-events">
            <div className="page-section-inner">
                {showHeading && (
                    <motion.div {...(prefersReduced ? noMotion : reveal)}>
                        <div className="ornamental-kicker mb-3">Upcoming Events</div>
                        <h2 className="text-3xl font-display text-parish-fg md:text-4xl mb-8">
                            What&apos;s happening in the Parish
                        </h2>
                    </motion.div>
                )}

                <motion.div
                    className="grid gap-4 sm:grid-cols-2"
                    variants={listContainerVariants(prefersReduced)}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-40px' }}
                >
                    {events.map((event, index) => (
                        <EventCard
                            key={`${event.date}-${event.title}`}
                            event={event}
                            featured={hasFeatured && index === 0}
                            variants={itemVariants}
                        />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
