-- ============================================================================
-- Supabase pg_cron: Nightly fetch of daily readings from Universalis
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================================
-- 
-- Prerequisites:
--   1. Enable the pg_cron extension (Database → Extensions → pg_cron → Enable)
--   2. Enable the pg_net extension (Database → Extensions → pg_net → Enable)
--
-- This job runs every day at 13:30 UTC (midnight Adelaide ACDT = UTC+10:30)
-- and fetches tomorrow's readings from Universalis via the Edge Function.
-- ============================================================================

-- Enable extensions if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule the nightly fetch
SELECT cron.schedule(
    'fetch-daily-readings-nightly',       -- job name
    '30 13 * * *',                         -- cron expression: 1:30 PM UTC = midnight ACDT
    $$
    SELECT net.http_post(
        url := 'https://uixbijvmuuwhiteqbtcs.supabase.co/functions/v1/fetch-daily-readings',
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
        ),
        body := '{}'::jsonb
    );
    $$
);

-- ============================================================================
-- Verification: List scheduled jobs
-- SELECT * FROM cron.job;
--
-- To delete/unschedule:
-- SELECT cron.unschedule('fetch-daily-readings-nightly');
-- ============================================================================
