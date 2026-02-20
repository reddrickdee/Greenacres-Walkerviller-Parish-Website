import type { ParishContent, NewsletterArchive, MassScheduleEntry, DailyReflection } from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';

/**
 * Loads the core parish content from the bundled JSON file.
 * Attempts to overlay mass schedules from Supabase CMS if configured.
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
 * Returns null if not configured or on failure (silent fallback to JSON).
 */
async function loadMassScheduleFromCMS(): Promise<MassScheduleEntry[] | null> {
    if (!isSupabaseConfigured()) return null;

    try {
        const { data: rows, error } = await supabase
            .from('mass_schedule_entries')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });

        if (error || !rows || rows.length === 0) return null;

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

/**
 * Fetch the daily reflection for a specific date from Supabase.
 * Returns null if not configured, not found, or on failure.
 */
export async function loadDailyReflectionFromCMS(dateIso: string): Promise<DailyReflection | null> {
    if (!isSupabaseConfigured()) return null;

    try {
        const { data: rows, error } = await supabase
            .from('daily_reflections')
            .select('*')
            .eq('date', dateIso)
            .limit(1);

        if (error || !rows || rows.length === 0) return null;

        const row = rows[0];
        return {
            id: row.id as string,
            date: row.date as string,
            liturgicalColor: row.liturgical_color as string,
            title: row.title as string,
            firstReading: (row.first_reading as string) ?? undefined,
            psalm: (row.psalm as string) ?? undefined,
            gospel: (row.gospel as string) ?? undefined,
            reflection: (row.reflection as string) ?? undefined,
        } as DailyReflection;
    } catch {
        return null;
    }
}
