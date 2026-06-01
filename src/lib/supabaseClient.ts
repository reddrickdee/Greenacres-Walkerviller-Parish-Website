/**
 * Supabase client — env-gated, mirroring the Sanity/Supabase fallback pattern.
 *
 * Without VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY the client is null and
 * consumers fall back to a non-database experience (e.g. "contact the office").
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
    ? createClient(url, anonKey)
    : null;
