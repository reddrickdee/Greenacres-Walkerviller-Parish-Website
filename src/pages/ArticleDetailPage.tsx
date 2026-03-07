import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, User } from 'lucide-react';
import { communityApi } from '../lib/communityApi';
import { CommunityPost } from '../types';
import { usePageSEO } from '../hooks/usePageSEO';
import { supabase } from '../lib/supabaseClient';

function getCoverImageUrl(post: CommunityPost): string | null {
    const coverImage = post.images?.find((img: any) => (img.display_order ?? img.displayOrder) === 0) || post.images?.[0];
    if (!coverImage) return null;
    const path = (coverImage as any).storage_path ?? coverImage.storagePath;
    const bucket = (coverImage as any).bucket_id ?? coverImage.bucketId;
    if (!path || !bucket) return null;
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data?.publicUrl || null;
}

export function ArticleDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [article, setArticle] = useState<CommunityPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    usePageSEO({
        title: article?.title || 'Article',
        description: article?.content?.substring(0, 155) || 'A community article from Greenacres Walkerville Parish.',
        path: `/community/articles/${id}`,
    });

    useEffect(() => {
        if (!id) return;
        let cancelled = false;

        const fetch = async () => {
            setLoading(true);
            setError('');
            try {
                const raw: any = await communityApi.getArticleById(id);
                if (!cancelled) {
                    setArticle({
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
                    } as CommunityPost);
                }
            } catch (err: any) {
                console.error('Failed to fetch article:', err);
                if (!cancelled) setError('Could not load this article. It may not exist.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        fetch();
        return () => { cancelled = true; };
    }, [id]);

    if (loading) {
        return (
            <div className="bg-parish-surface min-h-screen text-parish-fg">
                <div className="max-w-3xl mx-auto px-6 md:px-12 py-16">
                    <div className="animate-pulse space-y-6">
                        <div className="h-4 w-32 bg-parish-border/20 rounded" />
                        <div className="aspect-[16/9] bg-parish-border/10 rounded-2xl" />
                        <div className="h-6 w-3/4 bg-parish-border/15 rounded" />
                        <div className="space-y-3">
                            <div className="h-3 w-full bg-parish-border/10 rounded" />
                            <div className="h-3 w-full bg-parish-border/10 rounded" />
                            <div className="h-3 w-2/3 bg-parish-border/10 rounded" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="bg-parish-surface min-h-screen text-parish-fg">
                <div className="max-w-3xl mx-auto px-6 md:px-12 py-16 text-center">
                    <Link
                        to="/community"
                        className="inline-flex items-center gap-2 text-parish-muted hover:text-parish-accent font-display text-xs uppercase tracking-widest transition-colors mb-8"
                    >
                        <ArrowLeft size={14} /> Back to Community Hub
                    </Link>
                    <div className="p-12 rounded-2xl border border-dashed border-parish-border/20 bg-parish-elevated">
                        <p className="font-serif text-parish-muted italic text-lg">
                            {error || 'Article not found.'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const coverUrl = getCoverImageUrl(article);
    const authorName = article.author?.firstName || article.author?.lastName || 'Parish Team';
    const date = new Date(article.createdAt).toLocaleDateString('en-AU', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <div className="bg-parish-surface min-h-screen text-parish-fg">
            <article className="max-w-3xl mx-auto px-6 md:px-12 py-12 md:py-16">
                {/* Back link */}
                <Link
                    to="/community"
                    className="inline-flex items-center gap-2 text-parish-muted hover:text-parish-accent font-display text-xs uppercase tracking-widest transition-colors mb-8"
                >
                    <ArrowLeft size={14} /> Back to Community Hub
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    {/* Cover Image */}
                    {coverUrl && (
                        <div className="rounded-2xl overflow-hidden mb-8 shadow-md">
                            <img
                                src={coverUrl}
                                alt={article.title || 'Article cover'}
                                className="w-full aspect-[16/9] object-cover"
                            />
                        </div>
                    )}

                    {/* Title */}
                    {article.title && (
                        <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-wide text-parish-fg leading-tight mb-4">
                            {article.title}
                        </h1>
                    )}

                    {/* Byline */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-parish-muted mb-10 pb-6 border-b border-parish-border/10">
                        <span className="flex items-center gap-1.5 font-display uppercase tracking-widest text-xs">
                            <User size={13} />
                            {authorName}
                        </span>
                        <span className="flex items-center gap-1 font-sans">
                            <Clock size={13} />
                            {date}
                        </span>
                    </div>

                    {/* Body */}
                    <div className="font-serif text-parish-fg/90 text-lg leading-[1.85] whitespace-pre-line">
                        {article.content}
                    </div>
                </motion.div>
            </article>
        </div>
    );
}
