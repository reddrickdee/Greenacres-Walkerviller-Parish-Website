import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { getUserFromRequest, getSupabaseAdmin, checkSafeguarding } from '../_shared/validate.ts';

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { user } = await getUserFromRequest(req);
        const body = await req.json();
        const { postType, content, title, isAnonymous, intentionType, intentionName, visibility } = body;

        // Validate required fields
        if (!postType || !content) {
            return new Response(JSON.stringify({ error: 'postType and content are required' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        const validPostTypes = ['prayer_request', 'words_of_hope', 'mini_article', 'suggestion'];
        if (!validPostTypes.includes(postType)) {
            return new Response(JSON.stringify({ error: 'Invalid postType' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        // Determine status: check for safeguarding terms
        const isFlagged = checkSafeguarding(content) || (title && checkSafeguarding(title));
        const status = isFlagged ? 'escalated' : 'pending';

        // Suggestions are always admin_private
        const finalVisibility = postType === 'suggestion' ? 'admin_private' : (visibility || 'public');

        const admin = getSupabaseAdmin();

        const { data, error } = await admin
            .from('community_posts')
            .insert({
                author_id: user.id,
                post_type: postType,
                status,
                visibility: finalVisibility,
                title: title || null,
                content,
                is_anonymous: isAnonymous || false,
                intention_type: intentionType || 'general',
                intention_name: intentionName || null,
            })
            .select('id, status')
            .single();

        if (error) throw error;

        // Log moderation event if escalated
        if (isFlagged) {
            await admin.from('moderation_events').insert({
                target_type: 'post',
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
