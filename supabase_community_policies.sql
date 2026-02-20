-- ============================================================================
-- Greenacres Walkerville Parish — Community Hub Policies
-- ============================================================================

-- Helper functions for role checks
CREATE OR REPLACE FUNCTION is_community_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM community_profiles
    WHERE id = (select auth.uid()) AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── 1. Profiles ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Public read profiles" ON community_profiles;
CREATE POLICY "Public read profiles" ON community_profiles
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON community_profiles;
CREATE POLICY "Users can update own profile" ON community_profiles
    FOR UPDATE USING ((select auth.uid()) = id);

-- ── 2. Posts ────────────────────────────────────────────────────────────────
-- (Combined SELECT rules to fix multiple permissive policies warning)
DROP POLICY IF EXISTS "Public can read approved public posts" ON community_posts;
DROP POLICY IF EXISTS "Admins can read all posts" ON community_posts;
DROP POLICY IF EXISTS "Users can read own posts" ON community_posts;
DROP POLICY IF EXISTS "Select access for community_posts" ON community_posts;

CREATE POLICY "Select access for community_posts" ON community_posts
    FOR SELECT USING (
        (status = 'approved' AND visibility = 'public') OR
        (author_id = (select auth.uid())) OR
        (is_community_admin())
    );

DROP POLICY IF EXISTS "Authenticated users can create posts" ON community_posts;
CREATE POLICY "Authenticated users can create posts" ON community_posts
    FOR INSERT WITH CHECK ((select auth.uid()) = author_id);

DROP POLICY IF EXISTS "Admins can update posts" ON community_posts;
CREATE POLICY "Admins can update posts" ON community_posts
    FOR UPDATE USING (is_community_admin());

DROP POLICY IF EXISTS "Admins can delete posts" ON community_posts;
CREATE POLICY "Admins can delete posts" ON community_posts
    FOR DELETE USING (is_community_admin());

-- ── 3. Post Images ─────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Public can read images of approved posts" ON community_post_images;
DROP POLICY IF EXISTS "Admins can read all post images" ON community_post_images;
DROP POLICY IF EXISTS "Users can read own post images" ON community_post_images;
DROP POLICY IF EXISTS "Admins can manage post images" ON community_post_images;
DROP POLICY IF EXISTS "Select access for community_post_images" ON community_post_images;
DROP POLICY IF EXISTS "Insert access for community_post_images" ON community_post_images;
DROP POLICY IF EXISTS "Update access for community_post_images" ON community_post_images;
DROP POLICY IF EXISTS "Delete access for community_post_images" ON community_post_images;

CREATE POLICY "Select access for community_post_images" ON community_post_images
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM community_posts p
            WHERE p.id = community_post_images.post_id
              AND p.status = 'approved'
              AND p.visibility = 'public'
        ) OR
        EXISTS (
            SELECT 1 FROM community_posts p
            WHERE p.id = community_post_images.post_id
              AND p.author_id = (select auth.uid())
        ) OR
        (is_community_admin())
    );

-- Replace FOR ALL with explicit insert/update/delete to avoid multiple permissive queries on SELECT
CREATE POLICY "Insert access for community_post_images" ON community_post_images
    FOR INSERT WITH CHECK (is_community_admin());

CREATE POLICY "Update access for community_post_images" ON community_post_images
    FOR UPDATE USING (is_community_admin());

CREATE POLICY "Delete access for community_post_images" ON community_post_images
    FOR DELETE USING (is_community_admin());

-- ── 4. Comments ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Public can read approved comments" ON community_comments;
DROP POLICY IF EXISTS "Admins can read all comments" ON community_comments;
DROP POLICY IF EXISTS "Users can read own comments" ON community_comments;
DROP POLICY IF EXISTS "Select access for community_comments" ON community_comments;

CREATE POLICY "Select access for community_comments" ON community_comments
    FOR SELECT USING (
        (
            status = 'approved' AND EXISTS (
                SELECT 1 FROM community_posts p
                WHERE p.id = community_comments.post_id
                  AND p.status = 'approved'
                  AND p.visibility = 'public'
            )
        ) OR
        (author_id = (select auth.uid())) OR
        (is_community_admin())
    );

DROP POLICY IF EXISTS "Authenticated users can create comments" ON community_comments;
CREATE POLICY "Authenticated users can create comments" ON community_comments
    FOR INSERT WITH CHECK ((select auth.uid()) = author_id);

DROP POLICY IF EXISTS "Admins can update comments" ON community_comments;
CREATE POLICY "Admins can update comments" ON community_comments
    FOR UPDATE USING (is_community_admin());

DROP POLICY IF EXISTS "Admins can delete comments" ON community_comments;
CREATE POLICY "Admins can delete comments" ON community_comments
    FOR DELETE USING (is_community_admin());

-- ── 5. Prayers (Reactions) ──────────────────────────────────────────────────
DROP POLICY IF EXISTS "Public can read prayers on approved posts" ON community_prayers;
CREATE POLICY "Public can read prayers on approved posts" ON community_prayers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM community_posts p
            WHERE p.id = community_prayers.post_id
              AND p.status = 'approved'
              AND p.visibility = 'public'
        )
    );

DROP POLICY IF EXISTS "Users can delete own prayers" ON community_prayers;
CREATE POLICY "Users can delete own prayers" ON community_prayers
    FOR DELETE USING ((select auth.uid()) = user_id);

-- Edge Function toggle-prayer will insert/delete using Service Role or standard user role.
DROP POLICY IF EXISTS "Users can add prayers" ON community_prayers;
CREATE POLICY "Users can add prayers" ON community_prayers
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

-- ── 6. Weekly Intentions ────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Public can read finalized batches" ON weekly_intention_batches;
DROP POLICY IF EXISTS "Admins full access to batches" ON weekly_intention_batches;
DROP POLICY IF EXISTS "Select access for weekly_intention_batches" ON weekly_intention_batches;
DROP POLICY IF EXISTS "Insert access for weekly_intention_batches" ON weekly_intention_batches;
DROP POLICY IF EXISTS "Update access for weekly_intention_batches" ON weekly_intention_batches;
DROP POLICY IF EXISTS "Delete access for weekly_intention_batches" ON weekly_intention_batches;

CREATE POLICY "Select access for weekly_intention_batches" ON weekly_intention_batches
    FOR SELECT USING (status = 'finalized' OR is_community_admin());

CREATE POLICY "Insert access for weekly_intention_batches" ON weekly_intention_batches
    FOR INSERT WITH CHECK (is_community_admin());

CREATE POLICY "Update access for weekly_intention_batches" ON weekly_intention_batches
    FOR UPDATE USING (is_community_admin());

CREATE POLICY "Delete access for weekly_intention_batches" ON weekly_intention_batches
    FOR DELETE USING (is_community_admin());

DROP POLICY IF EXISTS "Public can read items of finalized batches" ON weekly_intention_items;
DROP POLICY IF EXISTS "Admins full access to batch items" ON weekly_intention_items;
DROP POLICY IF EXISTS "Select access for weekly_intention_items" ON weekly_intention_items;
DROP POLICY IF EXISTS "Insert access for weekly_intention_items" ON weekly_intention_items;
DROP POLICY IF EXISTS "Update access for weekly_intention_items" ON weekly_intention_items;
DROP POLICY IF EXISTS "Delete access for weekly_intention_items" ON weekly_intention_items;

CREATE POLICY "Select access for weekly_intention_items" ON weekly_intention_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM weekly_intention_batches b
            WHERE b.id = weekly_intention_items.batch_id
              AND b.status = 'finalized'
        ) OR is_community_admin()
    );

CREATE POLICY "Insert access for weekly_intention_items" ON weekly_intention_items
    FOR INSERT WITH CHECK (is_community_admin());

CREATE POLICY "Update access for weekly_intention_items" ON weekly_intention_items
    FOR UPDATE USING (is_community_admin());

CREATE POLICY "Delete access for weekly_intention_items" ON weekly_intention_items
    FOR DELETE USING (is_community_admin());

-- ── 7. Moderation Audit Log ─────────────────────────────────────────────────
DROP POLICY IF EXISTS "Admins can read moderation logs" ON moderation_events;
CREATE POLICY "Admins can read moderation logs" ON moderation_events
    FOR SELECT USING (is_community_admin());

-- ── Storage Policies For Buckets ────────────────────────────────────────────

-- Pending bucket: Admins can read all. Users can insert. Users can read own.
DROP POLICY IF EXISTS "Admins can view pending images" ON storage.objects;
CREATE POLICY "Admins can view pending images" ON storage.objects
    FOR SELECT USING (bucket_id = 'community-images-pending' AND is_community_admin());

DROP POLICY IF EXISTS "Users can upload to pending images" ON storage.objects;
CREATE POLICY "Users can upload to pending images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'community-images-pending' AND ((select auth.uid()) IS NOT NULL));

DROP POLICY IF EXISTS "Users can view own pending images" ON storage.objects;
CREATE POLICY "Users can view own pending images" ON storage.objects
    FOR SELECT USING (bucket_id = 'community-images-pending' AND owner = ((select auth.uid())::text));

-- Public bucket: Public can read.
DROP POLICY IF EXISTS "Public can view public images" ON storage.objects;
CREATE POLICY "Public can view public images" ON storage.objects
    FOR SELECT USING (bucket_id = 'community-images-public');

-- Edge functions will move objects, so we need Admin policies to manage both.
-- We replace FOR ALL with explicit policies for storage Admin access if Multiple Permissive policies warned, but for storage it might differ. Let's keep FOR ALL or explicitly define. Storage doesn't have the same lint warnings usually, but let's play safe and leave as ALL unless told otherwise.
DROP POLICY IF EXISTS "Admins can manage all pending images" ON storage.objects;
CREATE POLICY "Admins can manage all pending images" ON storage.objects
    FOR ALL USING (bucket_id = 'community-images-pending' AND is_community_admin());

DROP POLICY IF EXISTS "Admins can manage all public images" ON storage.objects;
CREATE POLICY "Admins can manage all public images" ON storage.objects
    FOR ALL USING (bucket_id = 'community-images-public' AND is_community_admin());
