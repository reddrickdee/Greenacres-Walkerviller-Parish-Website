import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { communityApi } from '../../lib/communityApi';
import { CommunityPost } from '../../types';
import { ArticleCard } from './ArticleCard';

export function ArticleFeed() {
    const [articles, setArticles] = useState<CommunityPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;

        const fetchArticles = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await communityApi.getPublicPostsByType('mini_article');
                if (!cancelled) {
                    // Normalize snake_case from Supabase
                    const mapped = data.map((raw: any) => ({
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
                        author: raw.author,
                        images: raw.images,
                    })) as CommunityPost[];
                    setArticles(mapped);
                }
            } catch (err: any) {
                console.error('Failed to fetch articles:', err);
                if (!cancelled) setError('Could not load articles. Please try again later.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchArticles();
        return () => { cancelled = true; };
    }, []);

    if (loading) {
        return (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map(i => (
                    <div key={i} className="rounded-2xl border border-parish-border/10 bg-parish-surface overflow-hidden animate-pulse">
                        <div className="aspect-[16/9] bg-parish-border/10" />
                        <div className="p-5 space-y-3">
                            <div className="h-4 w-3/4 bg-parish-border/15 rounded" />
                            <div className="h-3 w-full bg-parish-border/10 rounded" />
                            <div className="h-3 w-1/2 bg-parish-border/10 rounded" />
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

    if (articles.length === 0) {
        return (
            <div className="p-12 text-center rounded-2xl border border-dashed border-parish-border/20 bg-parish-elevated">
                <p className="font-serif text-parish-muted italic text-lg mb-2">
                    No articles published yet.
                </p>
                <p className="font-display text-xs uppercase tracking-widest text-parish-muted/60">
                    Check back soon for parish stories and updates.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
                {articles.map(article => (
                    <ArticleCard key={article.id} post={article} />
                ))}
            </AnimatePresence>
        </div>
    );
}
