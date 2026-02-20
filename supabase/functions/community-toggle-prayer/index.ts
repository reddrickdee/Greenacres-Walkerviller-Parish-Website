import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { getUserFromRequest, getSupabaseAdmin } from '../_shared/validate.ts';

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { user } = await getUserFromRequest(req);
        const { postId } = await req.json();

        if (!postId) {
            return new Response(JSON.stringify({ error: 'postId is required' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        const admin = getSupabaseAdmin();

        // Check for existing prayer (unique constraint on post_id, user_id)
        const { data: existing } = await admin
            .from('community_prayers')
            .select('id')
            .eq('post_id', postId)
            .eq('user_id', user.id)
            .maybeSingle();

        if (existing) {
            // Unpray — remove existing
            await admin.from('community_prayers').delete().eq('id', existing.id);
            return new Response(JSON.stringify({ action: 'removed' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        } else {
            // Pray — insert new
            const { error } = await admin.from('community_prayers').insert({
                post_id: postId,
                user_id: user.id,
            });
            if (error) throw error;

            return new Response(JSON.stringify({ action: 'added' }), {
                status: 201,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }
    } catch (err: any) {
        const status = err.message === 'Unauthorized' || err.message === 'Missing Authorization header' ? 401 : 500;
        return new Response(JSON.stringify({ error: err.message }), {
            status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
