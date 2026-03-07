import { motion } from 'framer-motion';
import { Clock, Users } from 'lucide-react';
import { CommunityPost } from '../../types';

interface SuggestionSummaryCardProps {
    post: CommunityPost;
}

export function SuggestionSummaryCard({ post }: SuggestionSummaryCardProps) {
    const date = new Date(post.createdAt).toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

    return (
        <motion.article
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-parish-brass/15 bg-gradient-to-br from-parish-surface to-parish-brass/[0.03] p-5 md:p-6"
        >
            {/* Parish team badge */}
            <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center gap-1.5 rounded-full bg-parish-brass/10 px-3 py-1 text-[10px] font-display uppercase tracking-widest text-parish-brass">
                    <Users size={11} />
                    Parish Team Update
                </span>
            </div>

            {post.title && (
                <h4 className="font-display text-base font-semibold tracking-wide text-parish-fg mb-2">
                    {post.title}
                </h4>
            )}

            <p className="font-serif text-parish-fg/85 leading-relaxed text-[0.95rem] mb-4 whitespace-pre-line">
                {post.content}
            </p>

            <div className="flex items-center gap-1 text-xs text-parish-muted font-sans pt-2 border-t border-parish-border/5">
                <Clock size={11} />
                {date}
            </div>
        </motion.article>
    );
}
