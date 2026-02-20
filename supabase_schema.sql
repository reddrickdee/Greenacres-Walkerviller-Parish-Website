-- ============================================================================
-- Greenacres Walkerville Parish — Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================================

-- ── 1. Daily Reflections ────────────────────────────────────────────────────
-- (Updated from supabase_daily_reflections_schema.sql)

CREATE TABLE IF NOT EXISTS daily_reflections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE UNIQUE NOT NULL,
    liturgical_color TEXT NOT NULL,
    title TEXT NOT NULL,
    first_reading_ref TEXT,
    first_reading_text TEXT,
    psalm_ref TEXT,
    psalm_response TEXT,
    psalm_text TEXT,
    second_reading_ref TEXT,
    second_reading_text TEXT,
    gospel_acclamation TEXT,
    gospel_ref TEXT,
    gospel_text TEXT,
    sequence TEXT,
    reflection_context TEXT,
    reflection_body TEXT,
    reflection_prayer TEXT,
    reflection_author TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE daily_reflections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read daily_reflections" ON daily_reflections;
DROP POLICY IF EXISTS "Allow public read access" ON daily_reflections;
CREATE POLICY "Public read daily_reflections"
    ON daily_reflections FOR SELECT
    USING (true);


-- ── 2. Mass Schedule Entries ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS mass_schedule_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    church TEXT NOT NULL,
    address TEXT NOT NULL,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
    start_time TIME NOT NULL,
    type TEXT NOT NULL,
    notes TEXT,
    duration_minutes INT DEFAULT 60,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE mass_schedule_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read mass_schedule_entries" ON mass_schedule_entries;
CREATE POLICY "Public read mass_schedule_entries"
    ON mass_schedule_entries FOR SELECT
    USING (true);


-- ── 3. Newsletters ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS newsletters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    pdf_url TEXT NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    published_at DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read newsletters" ON newsletters;
CREATE POLICY "Public read newsletters"
    ON newsletters FOR SELECT
    USING (true);


-- ── 4. Seed Mass Schedule Data ──────────────────────────────────────────────
-- These match your current mass_schedule.json / parish_content.json data.

INSERT INTO mass_schedule_entries (church, address, day_of_week, start_time, type, notes, duration_minutes, is_active, sort_order)
VALUES
    ('St Monica''s Church', '90 North East Road, Walkerville', 6, '18:00', 'Weekend Vigil Mass', NULL, 60, TRUE, 1),
    ('St Monica''s Church', '90 North East Road, Walkerville', 7, '11:00', 'Sunday Mass', 'Ordinariate of Our Lady of the Southern Cross', 60, TRUE, 2),
    ('St Monica''s Church', '90 North East Road, Walkerville', 3, '09:00', 'Weekday Mass', NULL, 30, TRUE, 3),
    ('St Martin''s Church', 'Corner Muller and Hampstead Roads, Greenacres', 7, '09:30', 'Sunday Mass', NULL, 60, TRUE, 4),
    ('St Martin''s Church', 'Corner Muller and Hampstead Roads, Greenacres', 2, '09:00', 'Weekday Mass', NULL, 30, TRUE, 5),
    ('St Martin''s Church', 'Corner Muller and Hampstead Roads, Greenacres', 4, '09:00', 'Weekday Mass', NULL, 30, TRUE, 6)
ON CONFLICT DO NOTHING;


-- ── 5. Seed Daily Reflection (Test Data) ────────────────────────────────────

INSERT INTO daily_reflections (date, liturgical_color, title, first_reading_ref, first_reading_text, psalm_ref, psalm_response, psalm_text, gospel_ref, gospel_text, reflection_body)
VALUES (
    CURRENT_DATE,
    'Violet',
    'Friday after Ash Wednesday',
    'Isaiah 58:1-9',
    'Thus says the Lord: Shout for all you are worth, raise your voice like a trumpet. Proclaim their faults to my people...',
    'Psalm 50:3-6, 12-14, 17',
    'A broken, humbled heart, O God, you will not scorn.',
    'A broken, humbled heart, O God, you will not scorn.',
    'Matthew 9:14-15',
    'John''s disciples came to Jesus and said, ''Why is it that we and the Pharisees fast, but your disciples do not?''',
    'Lent is about prayer and fasting. When we think of ''fasting'' we probably think first of eating less food as a form of penance. Today Isaiah is challenging us to rethink what fasting really means. He states that God does not want to see a show of sacrifice but, rather, how that sacrifice changes our hearts.'
) ON CONFLICT (date) DO NOTHING;


-- ── 6. Hallow Featured Resources ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS featured_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  link_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE featured_resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on featured_resources." ON featured_resources;
CREATE POLICY "Allow public read access on featured_resources."
  ON featured_resources FOR SELECT
  USING (true);

INSERT INTO featured_resources (title, description, image_url, link_url, is_active)
SELECT 
  'Lent Pray40: The Return',
  'Join the 2026 Lenten challenge on Hallow. A journey back to God inspired by The Brothers Karamazov and the Parable of the Prodigal Son.',
  'https://assets.hallow.com/hallow-web-assets/images/challenges/pray40-2024/pray40-share-img.jpg',
  'https://hallow.com/collections/2845?is_shared=true',
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM featured_resources WHERE title = 'Lent Pray40: The Return'
);
