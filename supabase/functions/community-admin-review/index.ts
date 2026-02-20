import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { getUserFromRequest, getSupabaseAdmin } from '../_shared/validate.ts';

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { user } = await getUserFromRequest(req);
        const { targetType, targetId, action, reason } = await req.json();

        if (!targetType || !targetId || !action) {
            return new Response(JSON.stringify({ error: 'targetType, targetId, and action are required' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        if (!['post', 'comment'].includes(targetType)) {
            return new Response(JSON.stringify({ error: 'Invalid targetType' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        if (!['approve', 'reject', 'escalate'].includes(action)) {
            return new Response(JSON.stringify({ error: 'Invalid action' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        const admin = getSupabaseAdmin();

        // Assert admin role
        const { data: profile, error: profileError } = await admin
            .from('community_profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profileError || profile?.role !== 'admin') {
            return new Response(JSON.stringify({ error: 'Forbidden: Admin role required' }), {
                status: 403,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        // Map action to new status
        const statusMap: Record<string, string> = {
            approve: 'approved',
            reject: 'rejected',
            escalate: 'escalated',
        };
        const newStatus = statusMap[action];

        // Get current status for audit log
        const tableName = targetType === 'post' ? 'community_posts' : 'community_comments';
        const { data: current } = await admin
            .from(tableName)
            .select('status')
            .eq('id', targetId)
            .single();

        const previousStatus = current?.status || null;

        // Update the target
        const { error: updateError } = await admin
            .from(tableName)
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('id', targetId);

        if (updateError) throw updateError;

        // Write audit log
        await admin.from('moderation_events').insert({
            admin_id: user.id,
            target_type: targetType,
            target_id: targetId,
            previous_status: previousStatus,
            new_status: newStatus,
            reason: reason || null,
        });

        return new Response(JSON.stringify({ success: true, newStatus }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    } catch (err: any) {
        const status = err.message === 'Unauthorized' || err.message === 'Missing Authorization header' ? 401 : err.message?.includes('Forbidden') ? 403 : 500;
        return new Response(JSON.stringify({ error: err.message }), {
            status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
