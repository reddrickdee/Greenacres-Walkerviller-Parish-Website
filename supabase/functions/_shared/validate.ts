import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export function getSupabaseAdmin() {
    return createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
}

export async function getUserFromRequest(req: Request) {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
        throw new Error('Missing Authorization header');
    }

    const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
        throw new Error('Unauthorized');
    }

    return { user, supabase };
}

// Safeguarding keyword list — terms suggesting references to minors or risky content
// that should be escalated for admin review instead of published.
const SAFEGUARDING_TERMS = [
    'child abuse',
    'sexual abuse',
    'minor',
    'underage',
    'safeguarding concern',
    'grooming',
    'inappropriate touching',
    'molestation',
    'exploitation of children',
    'child protection',
];

export function checkSafeguarding(text: string): boolean {
    const lowerText = text.toLowerCase();
    return SAFEGUARDING_TERMS.some(term => lowerText.includes(term));
}
