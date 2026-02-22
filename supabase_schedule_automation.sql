-- Ensure required extensions are enabled
CREATE EXTENSION IF NOT EXISTS pg_net;
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the daily reading fetch (Runs every day at 01:00 AM UTC / 11:30 AM ACDT)
-- Replace <YOUR_PROJECT_REF> with your actual Supabase project reference
-- Replace <YOUR_ANON_KEY> with your Supabase Anon Key
SELECT cron.schedule(
    'fetch-daily-readings-job',
    '0 1 * * *', -- Every day at 01:00 AM
    $$
    SELECT net.http_post(
        url:='https://https://uixbijvmuuwhiteqbtcs.supabase.co/functions/v1/fetch-daily-readings',
        headers:='{"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpeGJpanZtdXV3aGl0ZXFidGNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MjI4NDYsImV4cCI6MjA4NzA5ODg0Nn0.2YvjKYVlJ3sadJVesl5AOug5mqkcVnZmZp_k2ocEtL0", "Content-Type": "application/json"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
    $$
);

-- Note: To unschedule in the future, you can run:
-- SELECT cron.unschedule('fetch-daily-readings-job');
