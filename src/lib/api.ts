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

        // Deduplicate rows with the same church + day + time (caused by
        // seed SQL being run multiple times against a table without a
        // unique constraint).
        const seen = new Set<string>();
        const uniqueRows = rows.filter((row) => {
            const key = `${row.church}|${row.day_of_week}|${row.start_time}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });

        return uniqueRows.map((row) => {
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
            // Readings
            firstReadingHtml: (row.first_reading_html as string) ?? undefined,
            psalmHtml: (row.psalm_html as string) ?? undefined,
            secondReadingHtml: (row.second_reading_html as string) ?? undefined,
            gospelAcclamationHtml: (row.gospel_acclamation_html as string) ?? undefined,
            gospelHtml: (row.gospel_html as string) ?? undefined,
            sequence: (row.sequence as string) ?? undefined,
            // Structured Reflection
            reflectionContext: (row.reflection_context as string) ?? undefined,
            reflectionBody: (row.reflection_body as string) ?? undefined,
            reflectionPrayer: (row.reflection_prayer as string) ?? undefined,
            reflectionAuthor: (row.reflection_author as string) ?? undefined,
        } as DailyReflection;
    } catch {
        return null;
    }
}

/**
 * Fetch all dates that have a daily reflection entry in Supabase.
 * Returns an array of ISO date strings (e.g. ['2026-02-22', '2026-02-23']).
 */
export async function loadAvailableReflectionDates(): Promise<string[]> {
    if (!isSupabaseConfigured()) return [];

    try {
        const { data: rows, error } = await supabase
            .from('daily_reflections')
            .select('date')
            .order('date', { ascending: true });

        if (error || !rows) return [];

        return rows.map((row) => row.date as string);
    } catch {
        return [];
    }
}

/**
 * Upsert only the admin-authored reflection fields for a given date.
 * This preserves any auto-scraped reading data already in the row.
 */
export async function upsertReflection(
    dateIso: string,
    fields: {
        title?: string;
        liturgicalColor?: string;
        reflectionContext?: string;
        reflectionBody?: string;
        reflectionPrayer?: string;
        reflectionAuthor?: string;
    }
): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    try {
        const payload: Record<string, unknown> = {
            date: dateIso,
        };

        if (fields.title !== undefined) payload.title = fields.title;
        if (fields.liturgicalColor !== undefined) payload.liturgical_color = fields.liturgicalColor;
        if (fields.reflectionContext !== undefined) payload.reflection_context = fields.reflectionContext;
        if (fields.reflectionBody !== undefined) payload.reflection_body = fields.reflectionBody;
        if (fields.reflectionPrayer !== undefined) payload.reflection_prayer = fields.reflectionPrayer;
        if (fields.reflectionAuthor !== undefined) payload.reflection_author = fields.reflectionAuthor;

        const { error } = await supabase
            .from('daily_reflections')
            .upsert(payload, { onConflict: 'date' });

        if (error) {
            console.error('Failed to upsert reflection:', error);
            return false;
        }

        return true;
    } catch {
        return false;
    }
}

