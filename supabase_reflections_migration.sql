-- ============================================================================
-- Daily Reflections Schema Migration — Full Liturgy of the Word
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================================

-- Step 1: Add new structured reading columns
ALTER TABLE daily_reflections
    ADD COLUMN IF NOT EXISTS first_reading_ref TEXT,
    ADD COLUMN IF NOT EXISTS first_reading_text TEXT,
    ADD COLUMN IF NOT EXISTS psalm_ref TEXT,
    ADD COLUMN IF NOT EXISTS psalm_response TEXT,
    ADD COLUMN IF NOT EXISTS psalm_text TEXT,
    ADD COLUMN IF NOT EXISTS second_reading_ref TEXT,
    ADD COLUMN IF NOT EXISTS second_reading_text TEXT,
    ADD COLUMN IF NOT EXISTS gospel_acclamation TEXT,
    ADD COLUMN IF NOT EXISTS gospel_ref TEXT,
    ADD COLUMN IF NOT EXISTS gospel_text TEXT,
    ADD COLUMN IF NOT EXISTS sequence TEXT,
    ADD COLUMN IF NOT EXISTS reflection_context TEXT,
    ADD COLUMN IF NOT EXISTS reflection_body TEXT,
    ADD COLUMN IF NOT EXISTS reflection_prayer TEXT,
    ADD COLUMN IF NOT EXISTS reflection_author TEXT;

-- Step 2: Migrate existing data from old columns to new columns
UPDATE daily_reflections SET
    first_reading_text = first_reading,
    psalm_text = psalm,
    gospel_text = gospel,
    reflection_body = reflection
WHERE first_reading IS NOT NULL OR psalm IS NOT NULL OR gospel IS NOT NULL OR reflection IS NOT NULL;

-- Step 3: Drop old columns (only run after confirming migration above worked)
ALTER TABLE daily_reflections
    DROP COLUMN IF EXISTS first_reading,
    DROP COLUMN IF EXISTS psalm,
    DROP COLUMN IF EXISTS gospel,
    DROP COLUMN IF EXISTS reflection;

-- Step 4: Update today's seed data with full references
UPDATE daily_reflections SET
    first_reading_ref = 'Isaiah 58:1-9',
    psalm_ref = 'Psalm 50:3-6, 12-14, 17',
    psalm_response = 'A broken, humbled heart, O God, you will not scorn.',
    gospel_ref = 'Matthew 9:14-15',
    gospel_acclamation = 'A pure heart create for me, O God; give me back the joy of your salvation.'
WHERE date = CURRENT_DATE;
