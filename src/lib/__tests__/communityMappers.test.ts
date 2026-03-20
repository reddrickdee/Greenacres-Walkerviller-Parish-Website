import { describe, it, expect } from 'vitest';
import {
    mapProfile,
    mapPostImage,
    mapComment,
    mapPost,
    type ProfileRow,
    type PostImageRow,
    type CommentRow,
    type PostRow,
} from '../../lib/communityMappers';

// ── Fixtures ─────────────────────────────────────────────────────────────────

const profileRow: ProfileRow = {
    id: 'u-1',
    first_name: 'Mary',
    last_name: 'Smith',
    role: 'contributor',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-02T00:00:00Z',
};

const imageRow: PostImageRow = {
    id: 'img-1',
    post_id: 'p-1',
    storage_path: 'community/p-1/cover.jpg',
    bucket_id: 'community-images',
    display_order: 0,
    created_at: '2026-01-01T00:00:00Z',
};

const commentRow: CommentRow = {
    id: 'c-1',
    post_id: 'p-1',
    author_id: 'u-1',
    content: 'God bless you',
    status: 'approved',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    author: profileRow,
};

const postRow: PostRow = {
    id: 'p-1',
    author_id: 'u-1',
    post_type: 'prayer_request',
    status: 'approved',
    visibility: 'public',
    title: 'Prayer for healing',
    content: 'Please pray for my family.',
    is_anonymous: false,
    intention_type: 'healing',
    intention_name: 'John',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-02T00:00:00Z',
    author: profileRow,
    images: [imageRow],
    prayers: [{ id: 'pr-1', post_id: 'p-1', user_id: 'u-2' }],
    comments: [commentRow],
};

// ── Tests ────────────────────────────────────────────────────────────────────

describe('mapProfile', () => {
    it('converts snake_case fields to camelCase', () => {
        const result = mapProfile(profileRow);
        expect(result.id).toBe('u-1');
        expect(result.firstName).toBe('Mary');
        expect(result.lastName).toBe('Smith');
        expect(result.role).toBe('contributor');
        expect(result.createdAt).toBe('2026-01-01T00:00:00Z');
    });

    it('handles null lastName', () => {
        const result = mapProfile({ ...profileRow, last_name: null });
        expect(result.lastName).toBeNull();
    });
});

describe('mapPostImage', () => {
    it('converts snake_case fields to camelCase', () => {
        const result = mapPostImage(imageRow);
        expect(result.postId).toBe('p-1');
        expect(result.storagePath).toBe('community/p-1/cover.jpg');
        expect(result.bucketId).toBe('community-images');
        expect(result.displayOrder).toBe(0);
    });
});

describe('mapComment', () => {
    it('converts snake_case and maps nested author', () => {
        const result = mapComment(commentRow);
        expect(result.postId).toBe('p-1');
        expect(result.authorId).toBe('u-1');
        expect(result.content).toBe('God bless you');
        expect(result.author?.firstName).toBe('Mary');
    });

    it('handles missing author', () => {
        const noAuthor = { ...commentRow, author: undefined };
        const result = mapComment(noAuthor);
        expect(result.author).toBeUndefined();
    });
});

describe('mapPost', () => {
    it('converts all snake_case fields to camelCase', () => {
        const result = mapPost(postRow);
        expect(result.id).toBe('p-1');
        expect(result.authorId).toBe('u-1');
        expect(result.postType).toBe('prayer_request');
        expect(result.isAnonymous).toBe(false);
        expect(result.intentionType).toBe('healing');
        expect(result.intentionName).toBe('John');
    });

    it('maps nested author, images, prayers, and comments', () => {
        const result = mapPost(postRow);
        expect(result.author?.firstName).toBe('Mary');
        expect(result.images).toHaveLength(1);
        expect(result.images?.[0].storagePath).toBe('community/p-1/cover.jpg');
        expect(result.prayers).toHaveLength(1);
        expect(result.prayers?.[0].userId).toBe('u-2');
        expect(result.comments).toHaveLength(1);
        expect(result.comments?.[0].content).toBe('God bless you');
    });

    it('computes prayerCount from prayers array length', () => {
        const result = mapPost(postRow);
        expect(result.prayerCount).toBe(1);
    });

    it('handles minimal post with no nested data', () => {
        const minimal: PostRow = {
            id: 'p-2',
            author_id: 'u-3',
            post_type: 'testimony',
            status: 'pending',
            visibility: 'public',
            content: 'My story.',
            is_anonymous: true,
            created_at: '2026-03-01T00:00:00Z',
            updated_at: '2026-03-01T00:00:00Z',
        };
        const result = mapPost(minimal);
        expect(result.author).toBeUndefined();
        expect(result.images).toBeUndefined();
        expect(result.prayers).toBeUndefined();
        expect(result.prayerCount).toBe(0);
        expect(result.comments).toBeUndefined();
    });
});
