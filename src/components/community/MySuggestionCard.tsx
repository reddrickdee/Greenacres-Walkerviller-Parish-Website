import { motion } from 'framer-motion';
import { Clock, CheckCircle2, XCircle, Hourglass, Globe } from 'lucide-react';
import { CommunityPost, CommunityStatus } from '../../types';

interface MySuggestionCardProps {
    post: CommunityPost & { linked_summary?: { id: string }[] };
}

const STATUS_CONFIG: Record<CommunityStatus, { label: string; icon: React.ReactNode; className: string }> = {
    pending: {
        label: 'Under Review',
        icon: <Hourglass size={12} />,
        className: 'bg-amber-500/10 text-amber-600',
    },
    approved: {
        label: 'Received',
        icon: <CheckCircle2 size={12} />,
        className: 'bg-green-500/10 text-green-600',
    },
    rejected: {
        label: 'Not Published',
        icon: <XCircle size={12} />,
        className: 'bg-red-500/10 text-red-500',
    },
    escalated: {
        label: 'Under Review',
        icon: <Hourglass size={12} />,
        className: 'bg-amber-500/10 text-amber-600',
    },
};

export function MySuggestionCard({ post }: MySuggestionCardProps) {
    const date = new Date(post.createdAt).toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

    const statusInfo = STATUS_CONFIG[post.status] || STATUS_CONFIG.pending;
    const hasPublicSummary = (post.linked_summary?.length ?? 0) > 0;

    return (
        <motion.article
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-parish-border/10 bg-parish-surface p-5 md:p-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-display uppercase tracking-widest ${statusInfo.className}`}>
                        {statusInfo.icon}
                        {statusInfo.label}
                    </span>

                    {hasPublicSummary && (
                        <span className="flex items-center gap-1 rounded-full bg-parish-accent/10 px-2.5 py-0.5 text-[10px] font-display uppercase tracking-widest text-parish-accent">
                            <Globe size={11} />
                            Shared Publicly
                        </span>
                    )}
                </div>

                <span className="flex items-center gap-1 shrink-0 text-xs text-parish-muted font-sans">
                    <Clock size={11} />
                    {date}
                </span>
            </div>

            {/* Content */}
            {post.title && (
                <h4 className="font-display text-sm font-semibold tracking-wide text-parish-fg mb-1">
                    {post.title}
                </h4>
            )}
            <p className="font-serif text-parish-fg/85 text-[0.95rem] leading-relaxed whitespace-pre-line">
                {post.content}
            </p>
        </motion.article>
    );
}
