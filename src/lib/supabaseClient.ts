import { createClient } from '@supabase/supabase-js';

// Access environment variables securely in Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a single supabase client for interacting with your database
export const supabase = createClient(
    supabaseUrl || 'https://placeholder-url.supabase.co', // Fallback to prevent immediate crash if env missing
    supabaseAnonKey || 'placeholder-anon-key'
);

// We export a helper to check if the client is properly configured
export const isSupabaseConfigured = () => {
    return Boolean(supabaseUrl && supabaseAnonKey);
};
