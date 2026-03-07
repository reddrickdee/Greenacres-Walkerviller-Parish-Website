-- ============================================================================
-- Community Hub Phase 2: Schema Migration
-- Adds 'contributor' role and source_post_id for suggestion promotion
-- ============================================================================

-- 1. Expand the role check on community_profiles to include 'contributor'
ALTER TABLE community_profiles
    DROP CONSTRAINT IF EXISTS community_profiles_role_check;

ALTER TABLE community_profiles
    ADD CONSTRAINT community_profiles_role_check
    CHECK (role IN ('user', 'contributor', 'admin'));

-- 2. Add source_post_id to community_posts for linking public summaries
--    to their original private suggestions
ALTER TABLE community_posts
    ADD COLUMN IF NOT EXISTS source_post_id UUID
    REFERENCES community_posts(id) ON DELETE SET NULL;

-- Index for efficient lookups of linked summaries
CREATE INDEX IF NOT EXISTS idx_community_posts_source_post_id
    ON community_posts(source_post_id)
    WHERE source_post_id IS NOT NULL;

-- 3. Add a partial index for type-filtered public feeds (mini_articles, suggestions)
CREATE INDEX IF NOT EXISTS idx_community_posts_public_by_type
    ON community_posts(post_type, created_at DESC)
    WHERE status = 'approved' AND visibility = 'public';
