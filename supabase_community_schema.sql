-- ============================================================================
-- Greenacres Walkerville Parish — Community Hub Schema
-- ============================================================================

-- ── 1. Enums ────────────────────────────────────────────────────────────────

CREATE TYPE community_post_type AS ENUM ('prayer_request', 'words_of_hope', 'mini_article', 'suggestion');
CREATE TYPE community_status AS ENUM ('pending', 'approved', 'rejected', 'escalated');
CREATE TYPE community_visibility AS ENUM ('public', 'admin_private');
CREATE TYPE intention_kind AS ENUM ('ill', 'deceased', 'general');
CREATE TYPE weekly_batch_status AS ENUM ('draft', 'finalized');

-- ── 2. Tables ───────────────────────────────────────────────────────────────

-- User Profiles & Roles
CREATE TABLE IF NOT EXISTS community_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community Posts
CREATE TABLE IF NOT EXISTS community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES community_profiles(id) ON DELETE CASCADE,
    post_type community_post_type NOT NULL,
    status community_status DEFAULT 'pending' NOT NULL,
    visibility community_visibility DEFAULT 'public' NOT NULL,
    title TEXT,
    content TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT FALSE,
    intention_type intention_kind DEFAULT 'general',
    intention_name TEXT, -- Name of the ill or deceased person
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Post Images (max 3 per post)
CREATE TABLE IF NOT EXISTS community_post_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    bucket_id TEXT NOT NULL, -- pending or public bucket
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments (Encouragement)
CREATE TABLE IF NOT EXISTS community_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    author_id UUID REFERENCES community_profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    status community_status DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prayers (Reactions)
CREATE TABLE IF NOT EXISTS community_prayers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES community_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- Weekly Intentions
CREATE TABLE IF NOT EXISTS weekly_intention_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL, -- e.g. "Fourth Sunday in Ordinary Time"
    target_date DATE NOT NULL,
    status weekly_batch_status DEFAULT 'draft' NOT NULL,
    created_by UUID REFERENCES community_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS weekly_intention_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID REFERENCES weekly_intention_batches(id) ON DELETE CASCADE,
    post_id UUID REFERENCES community_posts(id) ON DELETE SET NULL, -- Can link to original post
    intention_type intention_kind NOT NULL,
    name TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Moderation Audit Log
CREATE TABLE IF NOT EXISTS moderation_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES community_profiles(id) ON DELETE SET NULL,
    target_type TEXT NOT NULL CHECK (target_type IN ('post', 'comment', 'image')),
    target_id UUID NOT NULL,
    previous_status TEXT,
    new_status TEXT NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 3. Enable Row Level Security ────────────────────────────────────────────

ALTER TABLE community_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_post_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_prayers ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_intention_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_intention_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_events ENABLE ROW LEVEL SECURITY;

-- ── 4. Storage Buckets ──────────────────────────────────────────────────────
-- These will be managed via code/dashboard, but laying out the SQL setup logic here.

INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('community-images-pending', 'community-images-pending', false),
  ('community-images-public', 'community-images-public', true)
ON CONFLICT (id) DO NOTHING;

-- ── 5. Auth Triggers ────────────────────────────────────────────────────────
-- Automatically create a profile when a new user signs up

CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.community_profiles (id, first_name, last_name, role)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'first_name', 
    new.raw_user_meta_data->>'last_name', 
    'user'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

