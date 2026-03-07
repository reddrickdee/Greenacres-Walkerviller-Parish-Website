import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, User } from 'lucide-react';
import { CommunityPost } from '../../types';
import { supabase } from '../../lib/supabaseClient';

interface ArticleCardProps {
    post: CommunityPost;
}

function getExcerpt(content: string, maxLength = 120): string {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).replace(/\s+\S*$/, '') + '…';
}

function getCoverImageUrl(post: CommunityPost): string | null {
    const coverImage = post.images?.find(img => img.displayOrder === 0) || post.images?.[0];
    if (!coverImage) return null;

    // Handle both camelCase and snake_case from Supabase
    const path = coverImage.storagePath || (coverImage as any).storage_path;
    const bucket = coverImage.bucketId || (coverImage as any).bucket_id;
    if (!path || !bucket) return null;

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data?.publicUrl || null;
}

export function ArticleCard({ post }: ArticleCardProps) {
    const authorName = post.author?.firstName || post.author?.lastName || 'Parish Team';
    const date = new Date(post.createdAt).toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
    const coverUrl = getCoverImageUrl(post);

    return (
        <motion.article
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Link
                to={`/community/articles/${post.id}`}
                className="group block overflow-hidden rounded-2xl border border-parish-border/10 bg-parish-surface shadow-sm transition-all hover:shadow-md hover:border-parish-brass/20"
            >
                {/* Cover Image */}
                {coverUrl ? (
                    <div className="aspect-[16/9] overflow-hidden bg-parish-elevated">
                        <img
                            src={coverUrl}
                            alt={post.title || 'Article cover'}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                        />
                    </div>
                ) : (
                    <div className="aspect-[16/9] bg-gradient-to-br from-parish-accent/5 to-parish-brass/10 flex items-center justify-center">
                        <span className="font-display text-4xl text-parish-accent/20">✦</span>
                    </div>
                )}

                {/* Content */}
                <div className="p-5">
                    {post.title && (
                        <h3 className="font-display text-lg font-semibold tracking-wide text-parish-fg mb-2 group-hover:text-parish-accent transition-colors line-clamp-2">
                            {post.title}
                        </h3>
                    )}
                    <p className="font-serif text-sm text-parish-muted leading-relaxed line-clamp-2 mb-4">
                        {getExcerpt(post.content)}
                    </p>

                    {/* Byline */}
                    <div className="flex items-center justify-between text-xs text-parish-muted">
                        <span className="flex items-center gap-1.5 font-display uppercase tracking-widest">
                            <User size={12} />
                            {authorName}
                        </span>
                        <span className="flex items-center gap-1 font-sans">
                            <Clock size={11} />
                            {date}
                        </span>
                    </div>
                </div>
            </Link>
        </motion.article>
    );
}
