import { supabase } from './supabaseClient';
import {
    CommunityPost,
    CommunityComment,
    CommunityPostType,
    CommunityVisibility
} from '../types';

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
        return (data || []).map(post => ({
            ...post,
            prayerCount: post.prayers?.length || 0
        })) as unknown as CommunityPost[];
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
            posts: postsData.data as unknown as CommunityPost[],
            comments: commentsData.data as unknown as CommunityComment[]
        };
    },

    async reviewAction(targetType: 'post' | 'comment', targetId: string, action: 'approve' | 'reject' | 'escalate', reason?: string) {
        const { data, error } = await supabase.functions.invoke('community-admin-review', {
            body: { targetType, targetId, action, reason }
        });

        if (error) throw error;
        return data;
    }
};
