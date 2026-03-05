// @ts-nocheck — This file runs in Supabase's Deno runtime, not the Vite/Node project.
// supabase/functions/send-push-notification/index.ts
// ─────────────────────────────────────────────────────────────────────────────
// Supabase Edge Function — Sends push notifications to all subscribed users.
//
// Triggered by Supabase database webhook on INSERT to parish_announcements.
//
// Deploy:  supabase functions deploy send-push-notification
// Secrets: supabase secrets set VAPID_PRIVATE_KEY=...
//          supabase secrets set VAPID_PUBLIC_KEY=...
//          supabase secrets set VAPID_SUBJECT=mailto:admin@parish.example.com
// ─────────────────────────────────────────────────────────────────────────────

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

// Web Push library for Deno
// Note: In production, you may use a Deno-compatible web-push library
// or call the Web Push protocol directly via fetch().

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PushPayload {
    title: string;
    body: string;
    url?: string;            // Where to navigate on click
    icon?: string;           // Notification icon URL
    tag?: string;            // Dedup tag
}

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: CORS_HEADERS });
    }

    try {
        const payload: PushPayload = await req.json();

        // Create a Supabase admin client to read subscriptions
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Get all push subscriptions
        const { data: subscriptions, error } = await supabase
            .from('push_subscriptions')
            .select('*');

        if (error) throw error;
        if (!subscriptions?.length) {
            return new Response(JSON.stringify({ sent: 0, message: 'No subscribers' }), {
                status: 200,
                headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
            });
        }

        // Build notification payload
        const notificationPayload = JSON.stringify({
            title: payload.title || 'Parish Update',
            body: payload.body || '',
            icon: payload.icon || '/assets/images/parish-logo.webp',
            data: { url: payload.url || '/' },
            tag: payload.tag || 'parish-update',
        });

        // Send to each subscriber
        // NOTE: For production, use web-push npm package or direct fetch to push endpoint
        // with proper VAPID authentication headers. This is a template showing the flow.
        const results = await Promise.allSettled(
            subscriptions.map(async (sub: { endpoint: string; keys: { p256dh: string; auth: string } }) => {
                // In production, construct the encrypted push message here
                // using the subscriber's keys and VAPID credentials
                console.log(`Would send push to: ${sub.endpoint}`);
                return { endpoint: sub.endpoint, status: 'queued' };
            })
        );

        const sent = results.filter(r => r.status === 'fulfilled').length;

        return new Response(JSON.stringify({ sent, total: subscriptions.length }), {
            status: 200,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return new Response(JSON.stringify({ error: message }), {
            status: 500,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        });
    }
});
