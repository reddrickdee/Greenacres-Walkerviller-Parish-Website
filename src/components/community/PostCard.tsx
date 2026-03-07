import { motion } from 'framer-motion';
import { MessageCircle, Clock } from 'lucide-react';
import { CommunityPost } from '../../types';
import { PrayButton } from './PrayButton';

interface PostCardProps {
    post: CommunityPost;
    onRequireAuth: () => void;
}

function timeAgo(dateStr: string): string {
    const now = Date.now();
    const then = new Date(dateStr).getTime();
    const diff = now - then;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
}

export function PostCard({ post, onRequireAuth }: PostCardProps) {
    const displayName = post.isAnonymous
        ? 'Anonymous Parishioner'
        : post.author?.firstName || 'A Parishioner';

    const intentionLabel = post.intentionType === 'ill'
        ? '🕯️ For the Sick'
        : post.intentionType === 'deceased'
            ? '✝️ For the Deceased'
            : null;

    return (
        <motion.article
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-parish-surface border border-parish-border/10 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow"
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-parish-accent/10 flex items-center justify-center text-parish-accent font-display text-sm font-semibold shrink-0">
                        {displayName[0].toUpperCase()}
                    </div>
                    <div>
                        <p className="font-display text-sm font-medium text-parish-fg tracking-wide">{displayName}</p>
                        <p className="flex items-center gap-1 text-parish-muted text-sm font-sans">
                            <Clock size={11} /> {timeAgo(post.createdAt)}
                        </p>
                    </div>
                </div>

                {intentionLabel && (
                    <span className="text-sm font-display uppercase tracking-widest text-parish-muted bg-parish-elevated px-3 py-1 rounded-full border border-parish-border/10 shrink-0">
                        {intentionLabel}
                    </span>
                )}
            </div>

            {/* Intention Name */}
            {post.intentionName && (
                <p className="font-serif text-parish-accent italic text-base mb-2">
                    For: {post.intentionName}
                </p>
            )}

            {/* Title (mini-articles) */}
            {post.title && (
                <h3 className="font-display text-lg font-semibold text-parish-fg tracking-wide mb-2">{post.title}</h3>
            )}

            {/* Content */}
            <p className="font-serif text-parish-fg/90 leading-relaxed text-base whitespace-pre-line mb-4">
                {post.content}
            </p>

            {/* Footer Actions */}
            <div className="flex items-center gap-4 pt-3 border-t border-parish-border/5">
                <PrayButton
                    postId={post.id}
                    initialCount={post.prayerCount ?? 0}
                    initialHasPrayed={post.hasPrayed ?? false}
                    onRequireAuth={onRequireAuth}
                />

                {(post.comments?.length ?? 0) > 0 && (
                    <span className="flex items-center gap-1 text-xs text-parish-muted font-display uppercase tracking-widest">
                        <MessageCircle size={14} />
                        {post.comments!.length}
                    </span>
                )}
            </div>
        </motion.article>
    );
}
