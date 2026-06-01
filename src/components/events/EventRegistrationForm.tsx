import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarPlus, Check } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import type { CalendarEvent } from '../../hooks/useEvents';

interface Props {
    event: CalendarEvent;
}

function buildIcs(event: CalendarEvent): string {
    const start = event.dateTime ? new Date(event.dateTime) : new Date();
    const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    return [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//GW Parish//Events//EN',
        'BEGIN:VEVENT',
        `UID:${event.id}@gwparish.org.au`,
        `DTSTAMP:${stamp(new Date())}`,
        `DTSTART:${stamp(start)}`,
        `DTEND:${stamp(end)}`,
        `SUMMARY:${event.title}`,
        event.location ? `LOCATION:${event.location}` : '',
        'END:VEVENT',
        'END:VCALENDAR',
    ].filter(Boolean).join('\r\n');
}

function downloadIcs(event: CalendarEvent) {
    const blob = new Blob([buildIcs(event)], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.title.replace(/\s+/g, '-').toLowerCase()}.ics`;
    a.click();
    URL.revokeObjectURL(url);
}

export function EventRegistrationForm({ event }: Props) {
    const [form, setForm] = useState({ name: '', email: '', phone: '', attendees: 1, dietary: '', accessibility: '' });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [booked, setBooked] = useState<number | null>(null);

    const remaining = event.maxCapacity != null && booked != null ? event.maxCapacity - booked : null;
    const isFull = remaining != null && remaining <= 0;

    useEffect(() => {
        if (!supabase || event.maxCapacity == null) return;
        supabase
            .rpc('event_registration_count', { p_event_id: event.id })
            .then(({ data }) => { if (typeof data === 'number') setBooked(data); });
    }, [event.id, event.maxCapacity]);

    if (!isSupabaseConfigured) {
        return (
            <p className="mt-4 rounded-xl border border-parish-border/15 bg-parish-elevated/40 px-4 py-3 text-[1rem] text-parish-muted">
                To register, please <Link to="/contact" className="font-semibold text-parish-accent hover:underline">contact the Parish Office</Link>.
            </p>
        );
    }

    if (status === 'success') {
        return (
            <div className="mt-4 rounded-xl border border-parish-accent/20 bg-parish-accent/5 px-5 py-4">
                <p className="flex items-center gap-2 font-semibold text-parish-accent">
                    <Check className="h-5 w-5" aria-hidden="true" /> You're registered. A confirmation will follow.
                </p>
                {event.dateTime && (
                    <button type="button" onClick={() => downloadIcs(event)} className="pilgrimage-button-secondary mt-4 inline-flex items-center gap-2 !px-5 !py-2.5">
                        <CalendarPlus className="h-4 w-4" aria-hidden="true" /> Add to calendar
                    </button>
                )}
            </div>
        );
    }

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supabase) return;
        setStatus('submitting');
        const { error } = await supabase.from('event_registrations').insert({
            event_id: event.id,
            name: form.name,
            email: form.email,
            phone: form.phone || null,
            attendee_count: form.attendees,
            dietary_notes: form.dietary || null,
            accessibility_notes: form.accessibility || null,
        });
        setStatus(error ? 'error' : 'success');
    };

    const field = 'w-full rounded-xl border border-parish-border/20 bg-parish-surface px-4 py-2.5 text-[1rem] text-parish-fg focus:border-parish-accent focus:outline-none';

    return (
        <form onSubmit={submit} className="mt-4 space-y-3">
            {remaining != null && (
                <p className={`text-[0.875rem] font-semibold ${isFull ? 'text-parish-secondary' : 'text-parish-accent'}`}>
                    {isFull ? 'This event is full.' : `${remaining} of ${event.maxCapacity} spots remaining`}
                </p>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
                <input required placeholder="Full name" aria-label="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={field} />
                <input required type="email" placeholder="Email" aria-label="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={field} />
                <input type="tel" placeholder="Phone (optional)" aria-label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={field} />
                <input type="number" min={1} max={20} aria-label="Number of attendees" value={form.attendees} onChange={e => setForm({ ...form, attendees: Math.max(1, Number(e.target.value)) })} className={field} />
            </div>
            <input placeholder="Dietary requirements (optional)" aria-label="Dietary requirements" value={form.dietary} onChange={e => setForm({ ...form, dietary: e.target.value })} className={field} />
            <input placeholder="Accessibility needs (optional)" aria-label="Accessibility needs" value={form.accessibility} onChange={e => setForm({ ...form, accessibility: e.target.value })} className={field} />
            {status === 'error' && <p className="text-[0.875rem] text-parish-secondary">Something went wrong — please try again or contact the office.</p>}
            <button type="submit" disabled={status === 'submitting' || isFull} className="pilgrimage-button inline-flex !px-5 !py-2.5 disabled:opacity-50">
                {status === 'submitting' ? 'Registering…' : 'Confirm registration'}
            </button>
        </form>
    );
}
