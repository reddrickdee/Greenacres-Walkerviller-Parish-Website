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
    first_reading_html TEXT,
    psalm_html TEXT,
    second_reading_html TEXT,
    gospel_acclamation_html TEXT,
    gospel_html TEXT,
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

-- Prevent duplicate entries for the same church/day/time
ALTER TABLE mass_schedule_entries
    ADD CONSTRAINT uq_mass_church_day_time
    UNIQUE (church, day_of_week, start_time);

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
ON CONFLICT (church, day_of_week, start_time) DO NOTHING;


-- ── 5. Seed Daily Reflection (Test Data) ────────────────────────────────────

INSERT INTO daily_reflections (date, liturgical_color, title, first_reading_html, psalm_html, gospel_acclamation_html, gospel_html, reflection_body)
VALUES (
    CURRENT_DATE,
    'Violet',
    'Friday after Ash Wednesday',
    '<div>Thus says the Lord: Shout for all you are worth, raise your voice like a trumpet. Proclaim their faults to my people...</div>',
    '<div>A broken, humbled heart, O God, you will not scorn.</div>',
    '<div>Glory and praise to you, Lord Jesus Christ!</div>',
    '<div>John''s disciples came to Jesus and said, ''Why is it that we and the Pharisees fast, but your disciples do not?''</div>',
    'Lent is about prayer and fasting. When we think of ''fasting'' we probably think first of eating less food as a form of penance. Today Isaiah is challenging us to rethink what fasting really means. He states that God does not want to see a show of sacrifice but, rather, how that sacrifice changes our hearts.'
) ON CONFLICT (date) DO NOTHING;

