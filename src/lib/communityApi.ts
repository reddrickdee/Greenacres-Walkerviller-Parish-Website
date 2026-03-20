import { supabase } from './supabaseClient';
import type {
    CommunityPostType,
    CommunityVisibility
} from '../types';
import { mapPost, mapComment, type PostRow, type CommentRow } from './communityMappers';

export const communityApi = {
    // ── Posts ─────────────────────────────────────────────────────────────

    async getPublishedPosts() {
        // RLS restricts to approved + public posts
        const { data, error } = await supabase
            .from('community_posts')
            .select(`
                *,
                author:community_profiles(id, first_name, last_name, role),
                images:community_post_images(*),
                prayers:community_prayers(id, user_id),
                comments:community_comments(
                    *,
                    author:community_profiles(id, first_name, last_name, role)
                )
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform comments array mapping and prayer count
        return (data || []).map(row => mapPost(row as unknown as PostRow));
    },

    async submitPost(payload: {
        postType: CommunityPostType;
        visibility: CommunityVisibility;
        title?: string;
        content: string;
        isAnonymous?: boolean;
        intentionType?: string;
        intentionName?: string;
    }) {
        // In real app, we'd call the Edge Function for pre-moderation. 
        // For Phase 1 without the edge function deployed yet, we insert directly
        // (If edge function is required, we use supabase.functions.invoke)
        // Let's use the Edge Function invoke
        const { data, error } = await supabase.functions.invoke('community-submit-post', {
            body: payload
        });

        if (error) throw error;
        return data;
    },

    // ── Comments ──────────────────────────────────────────────────────────

    async submitComment(payload: { postId: string, content: string }) {
        const { data, error } = await supabase.functions.invoke('community-submit-comment', {
            body: payload
        });

        if (error) throw error;
        return data;
    },

    // ── Prayers ───────────────────────────────────────────────────────────

    async togglePrayer(postId: string) {
        const { data, error } = await supabase.functions.invoke('community-toggle-prayer', {
            body: { postId }
        });

        if (error) throw error;
        return data; // Returns action: 'added' | 'removed'
    },

    // ── Admin Moderation ──────────────────────────────────────────────────

    async getPendingQueue() {
        const [postsData, commentsData] = await Promise.all([
            supabase
                .from('community_posts')
                .select(`*, author:community_profiles(id, first_name, last_name)`)
                .eq('status', 'pending')
                .order('created_at', { ascending: true }),
            supabase
                .from('community_comments')
                .select(`*, author:community_profiles(id, first_name, last_name)`)
                .eq('status', 'pending')
                .order('created_at', { ascending: true })
        ]);

        if (postsData.error) throw postsData.error;
        if (commentsData.error) throw commentsData.error;

        return {
            posts: (postsData.data || []).map(row => mapPost(row as unknown as PostRow)),
            comments: (commentsData.data || []).map(row => mapComment(row as unknown as CommentRow)),
        };
    },

    async reviewAction(targetType: 'post' | 'comment', targetId: string, action: 'approve' | 'reject' | 'escalate', reason?: string) {
        const { data, error } = await supabase.functions.invoke('community-admin-review', {
            body: { targetType, targetId, action, reason }
        });

        if (error) throw error;
        return data;
    },

    // ── Phase 2: Mini Articles & Suggestions ──────────────────────────────

    async getPublicPostsByType(postType: CommunityPostType) {
        const { data, error } = await supabase
            .from('community_posts')
            .select(`
                *,
                author:community_profiles(id, first_name, last_name, role),
                images:community_post_images(*)
            `)
            .eq('post_type', postType)
            .eq('status', 'approved')
            .eq('visibility', 'public')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return (data || []).map(row => mapPost(row as unknown as PostRow));
    },

    async getArticleById(id: string) {
        const { data, error } = await supabase
            .from('community_posts')
            .select(`
                *,
                author:community_profiles(id, first_name, last_name, role),
                images:community_post_images(*)
            `)
            .eq('id', id)
            .eq('post_type', 'mini_article')
            .single();

        if (error) throw error;
        return mapPost(data as unknown as PostRow);
    },

    async getUserSuggestions() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('community_posts')
            .select(`
                *,
                linked_summary:community_posts!community_posts_source_post_id_fkey(id)
            `)
            .eq('author_id', user.id)
            .eq('post_type', 'suggestion')
            .eq('visibility', 'admin_private')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return (data || []).map(row => ({
            ...mapPost(row as unknown as PostRow),
            linked_summary: (row as Record<string, unknown>).linked_summary as { id: string }[] | undefined,
        }));
    },

    async submitMiniArticle(payload: { title: string; body: string; coverImage?: File }) {
        // Submit via edge function (same moderation pipeline)
        const { data, error } = await supabase.functions.invoke('community-submit-post', {
            body: {
                postType: 'mini_article' as CommunityPostType,
                visibility: 'public' as CommunityVisibility,
                title: payload.title,
                content: payload.body,
            }
        });

        if (error) throw error;

        // Upload cover image if provided
        if (payload.coverImage && data?.id) {
            const postId = data.id;
            const ext = payload.coverImage.name.split('.').pop() || 'jpg';
            const storagePath = `community/${postId}/cover.${ext}`;

            const { error: uploadError } = await supabase.storage
                .from('community-images')
                .upload(storagePath, payload.coverImage, { upsert: true });

            if (!uploadError) {
                // Insert into community_post_images
                await supabase.from('community_post_images').insert({
                    post_id: postId,
                    storage_path: storagePath,
                    bucket_id: 'community-images',
                    display_order: 0,
                });
            }
        }

        return data;
    },

    async submitMiniArticleDirect(payload: { title: string; body: string; coverImage?: File }) {
        // Admin direct-publish: insert approved post directly
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('community_posts')
            .insert({
                author_id: user.id,
                post_type: 'mini_article',
                status: 'approved',
                visibility: 'public',
                title: payload.title,
                content: payload.body,
            })
            .select()
            .single();

        if (error) throw error;

        // Upload cover image if provided
        if (payload.coverImage && data?.id) {
            const postId = data.id;
            const ext = payload.coverImage.name.split('.').pop() || 'jpg';
            const storagePath = `community/${postId}/cover.${ext}`;

            const { error: uploadError } = await supabase.storage
                .from('community-images')
                .upload(storagePath, payload.coverImage, { upsert: true });

            if (!uploadError) {
                await supabase.from('community_post_images').insert({
                    post_id: postId,
                    storage_path: storagePath,
                    bucket_id: 'community-images',
                    display_order: 0,
                });
            }
        }

        return data;
    },

    async promoteSuggestion(payload: { sourcePostId: string; title: string; content: string }) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('community_posts')
            .insert({
                author_id: user.id,
                post_type: 'suggestion',
                status: 'approved',
                visibility: 'public',
                source_post_id: payload.sourcePostId,
                title: payload.title,
                content: payload.content,
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },
};
