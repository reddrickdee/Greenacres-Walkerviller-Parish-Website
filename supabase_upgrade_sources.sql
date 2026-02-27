-- ============================================================================
-- Add source reference and heading columns to daily_reflections table
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================================

ALTER TABLE daily_reflections ADD COLUMN IF NOT EXISTS first_reading_source TEXT;
ALTER TABLE daily_reflections ADD COLUMN IF NOT EXISTS first_reading_heading TEXT;
ALTER TABLE daily_reflections ADD COLUMN IF NOT EXISTS psalm_source TEXT;
ALTER TABLE daily_reflections ADD COLUMN IF NOT EXISTS second_reading_source TEXT;
ALTER TABLE daily_reflections ADD COLUMN IF NOT EXISTS second_reading_heading TEXT;
ALTER TABLE daily_reflections ADD COLUMN IF NOT EXISTS gospel_acclamation_source TEXT;
ALTER TABLE daily_reflections ADD COLUMN IF NOT EXISTS gospel_source TEXT;
ALTER TABLE daily_reflections ADD COLUMN IF NOT EXISTS gospel_heading TEXT;
