import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
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

function formatDate(dateStr: string): string {
    const d = new Date(dateStr + 'T00:00:00');
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`;
}

interface EventsListProps {
    /** Max number of events to show */
    limit?: number;
    /** Show heading */
    showHeading?: boolean;
}

export function EventsList({ limit = 8, showHeading = true }: EventsListProps) {
    const [events, setEvents] = useState<ParishEvent[]>([]);
    const [loaded, setLoaded] = useState(false);
    const prefersReduced = useReducedMotion();

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

                <div className="space-y-3">
                    {events.map((event, index) => {
                        const motionProps = prefersReduced
                            ? noMotion
                            : { ...reveal, transition: { ...reveal.transition, delay: index * 0.05 } };
                        const colorClass = CATEGORY_COLORS[event.category] ?? 'text-parish-muted';

                        const eventDate = new Date(event.date + 'T00:00:00');

                        return (
                            <motion.div
                                key={`${event.date}-${event.title}`}
                                {...motionProps}
                                className="sanctuary-card flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-start sm:gap-6"
                            >
                                {/* Date badge */}
                                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-parish-accent/8 text-parish-accent">
                                    <span className="text-lg font-bold leading-none">
                                        {eventDate.getDate()}
                                    </span>
                                    <span className="text-[0.65rem] font-semibold uppercase tracking-wider">
                                        {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][eventDate.getMonth()]}
                                    </span>
                                </div>

                                {/* Event details */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base font-semibold text-parish-fg">
                                        {event.title}
                                    </h3>
                                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-parish-muted">
                                        <span className="inline-flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {formatDate(event.date)}
                                        </span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <Clock3 className="h-3.5 w-3.5" />
                                            {event.time}
                                        </span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <MapPin className="h-3.5 w-3.5" />
                                            {event.location}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-sm leading-relaxed text-parish-muted">
                                        {event.description}
                                    </p>
                                </div>

                                {/* Category tag */}
                                <span className={`inline-flex items-center gap-1 shrink-0 text-[0.65rem] font-semibold uppercase tracking-wider ${colorClass}`}>
                                    <Tag className="h-3 w-3" />
                                    {event.category}
                                </span>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
