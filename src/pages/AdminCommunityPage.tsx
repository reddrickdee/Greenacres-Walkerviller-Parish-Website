import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Check, XCircle, AlertTriangle, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { communityApi } from '../lib/communityApi';
import { usePageSEO } from '../hooks/usePageSEO';

type ReviewItem = {
    type: 'post' | 'comment';
    id: string;
    authorName: string;
    content: string;
    postType?: string;
    createdAt: string;
};

export function AdminCommunityPage() {
    usePageSEO({
        title: 'Admin — Moderation',
        description: 'Community moderation dashboard.',
        path: '/admin/community',
        noindex: true,
    });
    const [items, setItems] = useState<ReviewItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionInProgress, setActionInProgress] = useState<string | null>(null);

    const fetchQueue = async () => {
        setLoading(true);
        try {
            const { posts, comments } = await communityApi.getPendingQueue();

            const postItems: ReviewItem[] = (posts ?? []).map((p: any) => ({
                type: 'post' as const,
                id: p.id,
                authorName: p.author?.first_name || p.author?.firstName || 'Unknown',
                content: p.content,
                postType: p.post_type || p.postType,
                createdAt: p.created_at || p.createdAt,
            }));

            const commentItems: ReviewItem[] = (comments ?? []).map((c: any) => ({
                type: 'comment' as const,
                id: c.id,
                authorName: c.author?.first_name || c.author?.firstName || 'Unknown',
                content: c.content,
                createdAt: c.created_at || c.createdAt,
            }));

            setItems([...postItems, ...commentItems].sort(
                (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            ));
        } catch (err) {
            console.error('Failed to fetch moderation queue:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchQueue(); }, []);

    const handleAction = async (item: ReviewItem, action: 'approve' | 'reject' | 'escalate') => {
        setActionInProgress(item.id);
        try {
            await communityApi.reviewAction(item.type, item.id, action);
            // Remove from queue on success
            setItems(prev => prev.filter(i => i.id !== item.id));
        } catch (err) {
            console.error('Review action failed:', err);
        } finally {
            setActionInProgress(null);
        }
    };

    return (
        <div className="bg-parish-surface min-h-screen text-parish-fg">
            {/* Header */}
            <header className="bg-parish-accent/5 py-12 md:py-16 border-b border-parish-border/10">
                <div className="max-w-5xl mx-auto px-6 md:px-12">
                    <Link
                        to="/community"
                        className="inline-flex items-center gap-2 text-parish-muted hover:text-parish-accent font-display text-xs uppercase tracking-widest transition-colors mb-6"
                    >
                        <ArrowLeft size={14} /> Back to Community Hub
                    </Link>
                    <div className="flex items-center gap-3">
                        <ShieldCheck size={28} className="text-parish-accent" />
                        <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-wider text-parish-accent">
                            Moderation Dashboard
                        </h1>
                    </div>
                    <p className="font-serif text-parish-muted mt-3">
                        Review and moderate pending submissions from parishioners.
                    </p>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 md:px-12 py-10">
                {/* Pending Count Badge */}
                <div className="flex items-center gap-3 mb-8">
                    <h2 className="font-display text-xl tracking-wider">Pending Review</h2>
                    <span className="bg-parish-accent/10 text-parish-accent px-3 py-1 rounded-full font-display text-sm font-semibold">
                        {loading ? '…' : items.length}
                    </span>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-parish-surface border border-parish-border/10 rounded-2xl p-6 animate-pulse">
                                <div className="h-4 w-32 bg-parish-border/20 rounded mb-3" />
                                <div className="h-3 w-full bg-parish-border/15 rounded mb-2" />
                                <div className="h-3 w-2/3 bg-parish-border/10 rounded" />
                            </div>
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <div className="p-16 text-center rounded-2xl border border-dashed border-parish-border/20 bg-parish-elevated">
                        <ShieldCheck size={36} className="text-green-500 mx-auto mb-4" />
                        <p className="font-display text-lg tracking-wider text-parish-fg mb-2">All Clear!</p>
                        <p className="font-serif text-parish-muted italic">No pending submissions to review.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence>
                            {items.map(item => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-parish-surface border border-parish-border/10 rounded-2xl p-5 md:p-6"
                                >
                                    {/* Item Header */}
                                    <div className="flex items-start justify-between gap-4 mb-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`font-display text-sm uppercase tracking-widest px-2.5 py-0.5 rounded-full
                                                    ${item.type === 'post'
                                                        ? 'bg-blue-500/10 text-blue-600'
                                                        : 'bg-purple-500/10 text-purple-600'
                                                    }`}>
                                                    {item.type === 'post' ? item.postType?.replace('_', ' ') : 'Comment'}
                                                </span>
                                                <span className="font-display text-sm text-parish-fg tracking-wide">
                                                    by {item.authorName}
                                                </span>
                                            </div>
                                            <p className="flex items-center gap-1 text-parish-muted text-xs">
                                                <Clock size={11} />
                                                {new Date(item.createdAt).toLocaleString('en-AU', {
                                                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Content Preview */}
                                    <p className="font-serif text-parish-fg/90 leading-relaxed mb-5 whitespace-pre-line">
                                        {item.content}
                                    </p>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-3 pt-3 border-t border-parish-border/5">
                                        <button
                                            onClick={() => handleAction(item, 'approve')}
                                            disabled={actionInProgress === item.id}
                                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-500/10 text-green-600 font-display text-xs uppercase tracking-widest hover:bg-green-500/20 transition-all active:scale-95 disabled:opacity-50"
                                        >
                                            <Check size={14} /> Approve
                                        </button>
                                        <button
                                            onClick={() => handleAction(item, 'reject')}
                                            disabled={actionInProgress === item.id}
                                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 font-display text-xs uppercase tracking-widest hover:bg-red-500/20 transition-all active:scale-95 disabled:opacity-50"
                                        >
                                            <XCircle size={14} /> Reject
                                        </button>
                                        <button
                                            onClick={() => handleAction(item, 'escalate')}
                                            disabled={actionInProgress === item.id}
                                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/10 text-amber-600 font-display text-xs uppercase tracking-widest hover:bg-amber-500/20 transition-all active:scale-95 disabled:opacity-50"
                                        >
                                            <AlertTriangle size={14} /> Escalate
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </main>
        </div>
    );
}
