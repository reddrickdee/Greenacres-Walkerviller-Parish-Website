import { useMemo, useState } from 'react';
import { useEvents } from '../../hooks/useEvents';
import { EventCard } from './EventCard';

/**
 * Filterable list of upcoming events. Sources from Sanity via useEvents,
 * falling back to static JSON. A month-grid view is intentionally deferred
 * until dated event content exists in Sanity (static fallback items are undated).
 */
export function EventCalendar() {
    const { events } = useEvents();

    const categories = useMemo(
        () => ['All', ...Array.from(new Set(events.map(e => e.category)))],
        [events],
    );
    const [active, setActive] = useState('All');

    if (!events.length) return null;

    const filtered = active === 'All' ? events : events.filter(e => e.category === active);

    return (
        <div>
            {categories.length > 2 && (
                <div className="flex flex-wrap gap-2" role="group" aria-label="Filter events by category">
                    {categories.map(c => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => setActive(c)}
                            aria-pressed={active === c}
                            className={`rounded-full px-4 py-2 text-[0.875rem] font-semibold uppercase tracking-[0.14em] transition-colors ${
                                active === c
                                    ? 'bg-parish-accent text-white'
                                    : 'bg-parish-elevated text-parish-muted hover:text-parish-accent'
                            }`}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            )}
            <div className="mt-8 grid gap-4 md:grid-cols-2">
                {filtered.map(e => (
                    <EventCard key={e.id} event={e} />
                ))}
            </div>
        </div>
    );
}
