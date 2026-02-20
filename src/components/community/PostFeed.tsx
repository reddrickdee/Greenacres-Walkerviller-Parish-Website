import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { communityApi } from '../../lib/communityApi';
import { CommunityPost, CommunityPostType } from '../../types';
import { PostCard } from './PostCard';
import { useAuth } from '../../context/AuthContext';

interface PostFeedProps {
    postType: CommunityPostType;
    onRequireAuth: () => void;
}

export function PostFeed({ postType, onRequireAuth }: PostFeedProps) {
    const { user } = useAuth();
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;

        const fetchPosts = async () => {
            setLoading(true);
            setError('');
            try {
                const allPosts = await communityApi.getPublishedPosts();
                if (!cancelled) {
                    // Supabase returns snake_case columns; map to camelCase
                    const mapped = allPosts.map((raw: any) => ({
                        id: raw.id,
                        postType: raw.post_type ?? raw.postType,
                        status: raw.status,
                        visibility: raw.visibility,
                        title: raw.title,
                        content: raw.content,
                        createdAt: raw.created_at ?? raw.createdAt,
                        updatedAt: raw.updated_at ?? raw.updatedAt,
                        authorId: raw.author_id ?? raw.authorId,
                        isAnonymous: raw.is_anonymous ?? raw.isAnonymous ?? false,
                        intentionType: raw.intention_type ?? raw.intentionType ?? 'general',
                        intentionName: raw.intention_name ?? raw.intentionName,
                        author: raw.author,
                        images: raw.images,
                        prayers: raw.prayers,
                        comments: raw.comments,
                        prayerCount: raw.prayers?.length ?? raw.prayerCount ?? 0,
                        hasPrayed: user ? (raw.prayers?.some((pr: any) => pr.user_id === user.id) ?? false) : false,
                    })) as CommunityPost[];
                    const filtered = mapped.filter(p => p.postType === postType);
                    setPosts(filtered);
                }
            } catch (err: any) {
                console.error('Failed to fetch posts:', err);
                if (!cancelled) {
                    setError('Could not load posts. Please try again later.');
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchPosts();
        return () => { cancelled = true; };
    }, [postType, user]);

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-parish-surface border border-parish-border/10 rounded-2xl p-6 animate-pulse">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 rounded-full bg-parish-border/20" />
                            <div className="space-y-2 flex-1">
                                <div className="h-3 w-24 bg-parish-border/20 rounded" />
                                <div className="h-2 w-16 bg-parish-border/10 rounded" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-3 bg-parish-border/15 rounded w-full" />
                            <div className="h-3 bg-parish-border/10 rounded w-3/4" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-8 text-center">
                <p className="font-serif text-red-500 text-sm">{error}</p>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="p-12 text-center rounded-2xl border border-dashed border-parish-border/20 bg-parish-elevated">
                <p className="font-serif text-parish-muted italic text-lg mb-2">
                    {postType === 'prayer_request'
                        ? 'No prayer requests yet. Be the first to share.'
                        : 'No messages of hope yet. Share yours.'
                    }
                </p>
                <p className="font-display text-xs uppercase tracking-widest text-parish-muted/60">
                    Submissions appear here after pastoral review
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <AnimatePresence>
                {posts.map(post => (
                    <PostCard
                        key={post.id}
                        post={post}
                        onRequireAuth={onRequireAuth}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}
