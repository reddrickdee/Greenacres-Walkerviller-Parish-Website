-- Run this in your Supabase SQL Editor to safely add the new HTML columns
-- Without dropping any of your existing reflections!

ALTER TABLE daily_reflections
ADD COLUMN IF NOT EXISTS first_reading_html TEXT,
ADD COLUMN IF NOT EXISTS psalm_html TEXT,
ADD COLUMN IF NOT EXISTS second_reading_html TEXT,
ADD COLUMN IF NOT EXISTS gospel_acclamation_html TEXT,
ADD COLUMN IF NOT EXISTS gospel_html TEXT;

-- (Optional) We can leave the old raw text columns there for now so no historical data is lost.
