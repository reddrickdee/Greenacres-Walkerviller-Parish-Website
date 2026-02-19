import type { ParishContent, NewsletterArchive, MassScheduleEntry } from '../types';

/**
 * Loads the core parish content from the bundled JSON file.
 */
export async function loadParishContent(): Promise<ParishContent> {
    const res = await fetch('/data/parish_content.json');
    if (!res.ok) throw new Error(`Failed to load parish content: ${res.status}`);
    const data: ParishContent = await res.json();

    // Attempt CMS overlay for mass schedules
    const cmsSchedule = await loadMassScheduleFromCMS();
    if (cmsSchedule && cmsSchedule.length > 0) {
        return { ...data, massSchedule: cmsSchedule };
    }

    return data;
}

/**
 * Loads the newsletter archive from the bundled JSON file.
 */
export async function loadNewsletterArchive(): Promise<NewsletterArchive> {
    const res = await fetch('/data/newsletters.json');
    if (!res.ok) throw new Error(`Failed to load newsletters: ${res.status}`);
    return res.json();
}

/**
 * Optional: Overlay mass schedule from Supabase CMS.
 * Returns null if not configured or on failure (silent fallback).
 */
async function loadMassScheduleFromCMS(): Promise<MassScheduleEntry[] | null> {
    const endpoint = import.meta.env.VITE_SUPABASE_URL;
    const apiKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!endpoint || !apiKey) return null;

    try {
        const res = await fetch(
            `${endpoint}/rest/v1/mass_schedule_entries?is_active=eq.true&order=sort_order.asc`,
            {
                headers: {
                    Accept: 'application/json',
                    apikey: apiKey,
                    Authorization: `Bearer ${apiKey}`,
                },
            }
        );

        if (!res.ok) return null;

        const rows: Array<Record<string, unknown>> = await res.json();
        if (rows.length === 0) return null;

        return rows.map((row) => {
            const rawTime = row.start_time as string;
            const startTime = rawTime.length >= 5 ? rawTime.substring(0, 5) : rawTime;
            return {
                id: row.id as string,
                church: row.church as string,
                address: row.address as string,
                dayOfWeek: row.day_of_week as number,
                startTime,
                type: row.type as string,
                notes: (row.notes as string) ?? undefined,
                durationMinutes: (row.duration_minutes as number) ?? 60,
            };
        });
    } catch {
        return null;
    }
}
