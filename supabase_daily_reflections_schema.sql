-- Create the daily_reflections table
CREATE TABLE daily_reflections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE UNIQUE NOT NULL,
    liturgical_color TEXT NOT NULL,
    title TEXT NOT NULL,
    first_reading TEXT,
    psalm TEXT,
    gospel TEXT,
    reflection TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE daily_reflections ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON daily_reflections
    FOR SELECT USING (true);

-- Insert dummy data for today's date (for testing)
INSERT INTO daily_reflections (date, liturgical_color, title, first_reading, psalm, gospel, reflection)
VALUES (
    CURRENT_DATE,
    'Violet',
    'Friday after Ash Wednesday',
    'Thus says the Lord: Shout for all you are worth, raise your voice like a trumpet. Proclaim their faults to my people...',
    'A broken, humbled heart, O God, you will not scorn.',
    'John''s disciples came to Jesus and said, ''Why is it that we and the Pharisees fast, but your disciples do not?''',
    'Lent is about prayer and fasting. When we think of ''fasting'' we probably think first of eating less food as a form of penance. Today Isaiah is challenging us to rethink what fasting really means. He states that God does not want to see a show of sacrifice but, rather, how that sacrifice changes our hearts.'
);
