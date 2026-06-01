import { Link } from 'react-router-dom';
import { CalendarDays, Clock, MapPin } from 'lucide-react';
import type { CalendarEvent } from '../../hooks/useEvents';

function dateParts(iso?: string) {
    if (!iso) return null;
    const d = new Date(iso);
    return {
        day: d.getDate(),
        month: d.toLocaleDateString('en-AU', { month: 'short' }),
        time: d.toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit' }).toLowerCase(),
    };
}

export function EventCard({ event }: { event: CalendarEvent }) {
    const p = dateParts(event.dateTime);

    return (
        <div className="sanctuary-card flex gap-5">
            <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-parish-accent/10 text-parish-accent">
                {p ? (
                    <>
                        <span className="font-display text-2xl leading-none">{p.day}</span>
                        <span className="text-[0.75rem] font-semibold uppercase tracking-wide">{p.month}</span>
                    </>
                ) : (
                    <CalendarDays className="h-6 w-6" aria-hidden="true" />
                )}
            </div>
            <div className="min-w-0">
                <span className="inline-block rounded-full bg-parish-elevated px-2.5 py-0.5 text-[0.875rem] font-semibold uppercase tracking-[0.14em] text-parish-muted">
                    {event.category}
                </span>
                <h3 className="mt-2 font-display text-xl text-parish-fg">{event.title}</h3>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[0.875rem] text-parish-muted">
                    <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-4 w-4" aria-hidden="true" />
                        {p ? `${p.time} · ${event.dateLabel}` : event.dateLabel}
                    </span>
                    {event.location && (
                        <span className="inline-flex items-center gap-1.5">
                            <MapPin className="h-4 w-4" aria-hidden="true" />
                            {event.location}
                        </span>
                    )}
                </div>
                {event.description && (
                    <p className="mt-2 text-[1rem] leading-relaxed text-parish-muted">{event.description}</p>
                )}
                {event.registrationEnabled && (
                    <Link to="/contact" className="pilgrimage-button mt-4 inline-flex !px-5 !py-2.5">
                        Register
                    </Link>
                )}
            </div>
        </div>
    );
}
