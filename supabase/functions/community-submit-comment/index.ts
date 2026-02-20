import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { getUserFromRequest, getSupabaseAdmin, checkSafeguarding } from '../_shared/validate.ts';

// Minimal stub for Phase 1 — will be expanded in Phase 2
serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { user } = await getUserFromRequest(req);
        const { postId, content } = await req.json();

        if (!postId || !content) {
            return new Response(JSON.stringify({ error: 'postId and content are required' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        const isFlagged = checkSafeguarding(content);
        const status = isFlagged ? 'escalated' : 'pending';

        const admin = getSupabaseAdmin();

        const { data, error } = await admin
            .from('community_comments')
            .insert({
                post_id: postId,
                author_id: user.id,
                content,
                status,
            })
            .select('id, status')
            .single();

        if (error) throw error;

        if (isFlagged) {
            await admin.from('moderation_events').insert({
                target_type: 'comment',
                target_id: data.id,
                previous_status: null,
                new_status: 'escalated',
                reason: 'Safeguarding keyword detected',
            });
        }

        return new Response(JSON.stringify({ id: data.id, status: data.status }), {
            status: 201,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    } catch (err: any) {
        const status = err.message === 'Unauthorized' || err.message === 'Missing Authorization header' ? 401 : 500;
        return new Response(JSON.stringify({ error: err.message }), {
            status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
