/**
 * useEvents — upcoming parish events from Sanity, with static JSON fallback.
 *
 * When Sanity is configured AND has event documents, those are used.
 * Otherwise it falls back to `parish_content.json` `eventItems` (undated labels).
 */
import { useSanityQuery } from './useSanityQuery';
import { useParishData } from '../context/ParishDataContext';

export interface CalendarEvent {
    id: string;
    title: string;
    /** ISO string when sourced from Sanity; absent for static fallback items. */
    dateTime?: string;
    /** Human-readable date label, always present. */
    dateLabel: string;
    location?: string;
    description?: string;
    category: string;
    registrationEnabled?: boolean;
    imageUrl?: string;
}

interface SanityEvent {
    id: string;
    title: string;
    dateTime: string;
    location?: string;
    description?: string;
    category?: string;
    registrationEnabled?: boolean;
    imageUrl?: string;
}

const EVENTS_QUERY = `*[_type == "event" && dateTime >= now()] | order(dateTime asc){
    "id": _id, title, dateTime, location, description, category, registrationEnabled,
    "imageUrl": image.asset->url
}`;

function labelFor(iso: string): string {
    return new Date(iso).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'long' });
}

export function useEvents() {
    const { content } = useParishData();
    const { data, isLoading, isLive } = useSanityQuery<SanityEvent[]>({
        query: EVENTS_QUERY,
        fallbackData: [],
    });

    const live = Boolean(isLive && data && data.length);

    const events: CalendarEvent[] = live
        ? data!.map(e => ({
              ...e,
              category: e.category ?? 'Community',
              dateLabel: labelFor(e.dateTime),
          }))
        : (content?.eventItems ?? []).map((e, i) => ({
              id: `static-${i}`,
              title: e.title,
              dateLabel: e.dateLabel,
              description: e.description,
              category: 'Community',
          }));

    return { events, isLoading, isLive: live };
}
