// ── Community Data Mappers ───────────────────────────────────────────────────
// Type-safe row-to-domain mappers that replace `as unknown as` casts
// in communityApi.ts. Supabase returns snake_case; domain types use camelCase.

import type {
    CommunityPost,
    CommunityComment,
    CommunityProfile,
    CommunityPostImage,
    CommunityPrayer,
} from '../types';

// ── Supabase Row Shapes ──────────────────────────────────────────────────────
// These match what Supabase actually returns via .select().

export interface ProfileRow {
    id: string;
    first_name: string;
    last_name: string | null;
    role: 'user' | 'contributor' | 'admin';
    created_at?: string;
    updated_at?: string;
}

export interface PostImageRow {
    id: string;
    post_id: string;
    storage_path: string;
    bucket_id: string;
    display_order: number;
    created_at: string;
}

export interface PrayerRow {
    id: string;
    post_id: string;
    user_id: string;
    created_at?: string;
}

export interface CommentRow {
    id: string;
    post_id: string;
    author_id: string;
    content: string;
    status: string;
    created_at: string;
    updated_at: string;
    author?: ProfileRow;
}

export interface PostRow {
    id: string;
    author_id: string;
    post_type: string;
    status: string;
    visibility: string;
    source_post_id?: string;
    title?: string;
    content: string;
    is_anonymous: boolean;
    intention_type?: string;
    intention_name?: string;
    created_at: string;
    updated_at: string;
    author?: ProfileRow;
    images?: PostImageRow[];
    prayers?: PrayerRow[];
    comments?: CommentRow[];
}

// ── Mapper Functions ─────────────────────────────────────────────────────────

export function mapProfile(row: ProfileRow): CommunityProfile {
    return {
        id: row.id,
        firstName: row.first_name,
        lastName: row.last_name,
        role: row.role,
        createdAt: row.created_at ?? '',
        updatedAt: row.updated_at ?? '',
    };
}

export function mapPostImage(row: PostImageRow): CommunityPostImage {
    return {
        id: row.id,
        postId: row.post_id,
        storagePath: row.storage_path,
        bucketId: row.bucket_id,
        displayOrder: row.display_order,
        createdAt: row.created_at,
    };
}

export function mapComment(row: CommentRow): CommunityComment {
    return {
        id: row.id,
        postId: row.post_id,
        authorId: row.author_id,
        content: row.content,
        status: row.status as CommunityComment['status'],
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        author: row.author ? mapProfile(row.author) : undefined,
    };
}

export function mapPost(row: PostRow): CommunityPost {
    return {
        id: row.id,
        authorId: row.author_id,
        postType: row.post_type as CommunityPost['postType'],
        status: row.status as CommunityPost['status'],
        visibility: row.visibility as CommunityPost['visibility'],
        sourcePostId: row.source_post_id,
        title: row.title,
        content: row.content,
        isAnonymous: row.is_anonymous,
        intentionType: (row.intention_type ?? 'general') as CommunityPost['intentionType'],
        intentionName: row.intention_name,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        author: row.author ? mapProfile(row.author) : undefined,
        images: row.images?.map(mapPostImage),
        prayers: row.prayers?.map((p): CommunityPrayer => ({
            id: p.id,
            postId: p.post_id,
            userId: p.user_id,
            createdAt: p.created_at ?? '',
        })),
        prayerCount: row.prayers?.length ?? 0,
        comments: row.comments?.map(mapComment),
    };
}
