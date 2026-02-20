-- ============================================================================
-- Greenacres Walkerville Parish — Community Hub Policies
-- ============================================================================

-- Helper functions for role checks
CREATE OR REPLACE FUNCTION is_community_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM community_profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── 1. Profiles ─────────────────────────────────────────────────────────────
-- Read: Admins can read all profiles. Users can read their own profile, plus public info of others? 
-- Let's make all profiles readable so we can show user names on posts/comments.
CREATE POLICY "Public read profiles" ON community_profiles
    FOR SELECT USING (true);

-- Update: Users can update their own names.
CREATE POLICY "Users can update own profile" ON community_profiles
    FOR UPDATE USING (auth.uid() = id);

-- ── 2. Posts ────────────────────────────────────────────────────────────────
-- Read: 
-- 1. Public can read approved, public visibility posts.
-- 2. Admins can read all posts.
-- 3. Authors can read their own posts regardless of status/visibility.
CREATE POLICY "Public can read approved public posts" ON community_posts
    FOR SELECT USING (
        status = 'approved' AND visibility = 'public'
    );

CREATE POLICY "Admins can read all posts" ON community_posts
    FOR SELECT USING (is_community_admin());

CREATE POLICY "Users can read own posts" ON community_posts
    FOR SELECT USING (auth.uid() = author_id);

-- Insert: Authenticated users can create posts. (Edge functions will handle validation, but DB layer accepts auth inserts)
CREATE POLICY "Authenticated users can create posts" ON community_posts
    FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Update/Delete: Not permitted directly for general users, use edge functions or let admins update via backend admin policies.
-- Let's use Edge Functions with Service Role for admin updates to bypass RLS, but we can also add admin RLS for dashboard usage.
CREATE POLICY "Admins can update posts" ON community_posts
    FOR UPDATE USING (is_community_admin());
CREATE POLICY "Admins can delete posts" ON community_posts
    FOR DELETE USING (is_community_admin());

-- ── 3. Post Images ─────────────────────────────────────────────────────────
-- Read: Public can read images of approved/public posts. 
-- For simplicity, if the bucket is public, anyone with URL can see. 
-- In DB: Admins see all, Authors see their own. Public sees if post is approved.
CREATE POLICY "Public can read images of approved posts" ON community_post_images
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM community_posts p
            WHERE p.id = community_post_images.post_id
              AND p.status = 'approved'
              AND p.visibility = 'public'
        )
    );

CREATE POLICY "Admins can read all post images" ON community_post_images
    FOR SELECT USING (is_community_admin());

CREATE POLICY "Users can read own post images" ON community_post_images
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM community_posts p
            WHERE p.id = community_post_images.post_id
              AND p.author_id = auth.uid()
        )
    );

-- Modifying images should be done via Edge Functions (Service Role). 
CREATE POLICY "Admins can manage post images" ON community_post_images
    FOR ALL USING (is_community_admin());

-- ── 4. Comments ─────────────────────────────────────────────────────────────
-- Read: Public can read approved comments on approved public posts. 
CREATE POLICY "Public can read approved comments" ON community_comments
    FOR SELECT USING (
        status = 'approved' AND EXISTS (
            SELECT 1 FROM community_posts p
            WHERE p.id = community_comments.post_id
              AND p.status = 'approved'
              AND p.visibility = 'public'
        )
    );

CREATE POLICY "Admins can read all comments" ON community_comments
    FOR SELECT USING (is_community_admin());

CREATE POLICY "Users can read own comments" ON community_comments
    FOR SELECT USING (auth.uid() = author_id);

-- Insert:
CREATE POLICY "Authenticated users can create comments" ON community_comments
    FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Update/Delete: Admins only.
CREATE POLICY "Admins can update comments" ON community_comments
    FOR UPDATE USING (is_community_admin());
CREATE POLICY "Admins can delete comments" ON community_comments
    FOR DELETE USING (is_community_admin());

-- ── 5. Prayers (Reactions) ──────────────────────────────────────────────────
-- Read: Everyone can count/read prayers on public posts.
CREATE POLICY "Public can read prayers on approved posts" ON community_prayers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM community_posts p
            WHERE p.id = community_prayers.post_id
              AND p.status = 'approved'
              AND p.visibility = 'public'
        )
    );

-- Delete: Users can delete their own reaction (unpray)
CREATE POLICY "Users can delete own prayers" ON community_prayers
    FOR DELETE USING (auth.uid() = user_id);

-- Edge Function toggle-prayer will insert/delete using Service Role or standard user role.
CREATE POLICY "Users can add prayers" ON community_prayers
    FOR INSERT WITH CHECK (auth.uid() = user_id);


-- ── 6. Weekly Intentions ────────────────────────────────────────────────────
-- Read: Public can read finalized batches.
CREATE POLICY "Public can read finalized batches" ON weekly_intention_batches
    FOR SELECT USING (status = 'finalized');
CREATE POLICY "Public can read items of finalized batches" ON weekly_intention_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM weekly_intention_batches b
            WHERE b.id = weekly_intention_items.batch_id
              AND b.status = 'finalized'
        )
    );

-- Admins full access.
CREATE POLICY "Admins full access to batches" ON weekly_intention_batches
    FOR ALL USING (is_community_admin());
CREATE POLICY "Admins full access to batch items" ON weekly_intention_items
    FOR ALL USING (is_community_admin());


-- ── 7. Moderation Audit Log ─────────────────────────────────────────────────
-- Admins only.
CREATE POLICY "Admins can read moderation logs" ON moderation_events
    FOR SELECT USING (is_community_admin());

-- ── Storage Policies For Buckets ────────────────────────────────────────────

-- Note: Storage policies usually need to be created against `storage.objects`.
-- Pending bucket: Admins can read all. Users can insert. Users can read own.
CREATE POLICY "Admins can view pending images" ON storage.objects
    FOR SELECT USING (bucket_id = 'community-images-pending' AND is_community_admin());

CREATE POLICY "Users can upload to pending images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'community-images-pending' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can view own pending images" ON storage.objects
    FOR SELECT USING (bucket_id = 'community-images-pending' AND owner = auth.uid());

-- Public bucket: Public can read.
CREATE POLICY "Public can view public images" ON storage.objects
    FOR SELECT USING (bucket_id = 'community-images-public');

-- Edge functions will move objects, so we need Admin policies to manage both.
CREATE POLICY "Admins can manage all pending images" ON storage.objects
    FOR ALL USING (bucket_id = 'community-images-pending' AND is_community_admin());
CREATE POLICY "Admins can manage all public images" ON storage.objects
    FOR ALL USING (bucket_id = 'community-images-public' AND is_community_admin());
