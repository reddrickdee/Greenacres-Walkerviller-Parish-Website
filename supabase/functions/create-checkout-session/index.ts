// @ts-nocheck — This file runs in Supabase's Deno runtime, not the Vite/Node project.
// supabase/functions/create-checkout-session/index.ts
// ─────────────────────────────────────────────────────────────────────────────
// Supabase Edge Function — Creates a Stripe Checkout Session for online giving.
//
// Deploy:  supabase functions deploy create-checkout-session
// Secrets: supabase secrets set STRIPE_SECRET_KEY=sk_live_...
//          supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
// ─────────────────────────────────────────────────────────────────────────────

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY') ?? '';
const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2024-12-18.acacia' });

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CheckoutRequest {
    amount: number;       // in AUD cents (e.g. 5000 = $50.00)
    fund: string;         // e.g. 'general', 'building', 'youth'
    frequency: 'one_time' | 'monthly';
    email: string;
    donorName?: string;
    successUrl: string;   // e.g. https://yoursite.com/giving?success=true
    cancelUrl: string;    // e.g. https://yoursite.com/giving?cancelled=true
}

serve(async (req: Request) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: CORS_HEADERS });
    }

    try {
        const body: CheckoutRequest = await req.json();
        const { amount, fund, frequency, email, donorName, successUrl, cancelUrl } = body;

        // Validate
        if (!amount || amount < 100) {
            return new Response(JSON.stringify({ error: 'Minimum amount is $1.00 AUD' }), {
                status: 400,
                headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
            });
        }

        // Build line items
        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
            {
                price_data: {
                    currency: 'aud',
                    unit_amount: amount,
                    product_data: {
                        name: `Parish Giving — ${fund.charAt(0).toUpperCase() + fund.slice(1)} Fund`,
                        description: `Donation to Greenacres Walkerville Catholic Parish (${fund} fund)`,
                    },
                    ...(frequency === 'monthly' ? { recurring: { interval: 'month' } } : {}),
                },
                quantity: 1,
            },
        ];

        // Create Checkout session
        const session = await stripe.checkout.sessions.create({
            mode: frequency === 'monthly' ? 'subscription' : 'payment',
            payment_method_types: ['card'],
            customer_email: email,
            line_items: lineItems,
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: {
                fund,
                donor_name: donorName ?? 'Anonymous',
                parish: 'greenacres-walkerville',
            },
        });

        return new Response(JSON.stringify({ checkoutUrl: session.url }), {
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
