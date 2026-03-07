import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Check, XCircle, AlertTriangle, Clock, ArrowLeft, Newspaper, Lightbulb, MessageSquare, Eye, PenLine } from 'lucide-react';
import { Link } from 'react-router-dom';
import { communityApi } from '../lib/communityApi';
import { usePageSEO } from '../hooks/usePageSEO';

type ReviewItem = {
    type: 'post' | 'comment';
    id: string;
    authorName: string;
    content: string;
    title?: string;
    postType?: string;
    createdAt: string;
};

type AdminTab = 'moderation' | 'articles' | 'suggestions';

export function AdminCommunityPage() {
    usePageSEO({
        title: 'Admin — Community Dashboard',
        description: 'Community moderation and editorial dashboard.',
        path: '/admin/community',
        noindex: true,
    });

    const [adminTab, setAdminTab] = useState<AdminTab>('moderation');

    // ── Moderation State ──
    const [items, setItems] = useState<ReviewItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionInProgress, setActionInProgress] = useState<string | null>(null);

    // ── Suggestions State ──
    const [privateSuggestions, setPrivateSuggestions] = useState<any[]>([]);
    const [suggestionsLoading, setSuggestionsLoading] = useState(false);
    const [promoteState, setPromoteState] = useState<{ id: string; title: string; content: string } | null>(null);
    const [promoteSubmitting, setPromoteSubmitting] = useState(false);

    const fetchQueue = async () => {
        setLoading(true);
        try {
            const { posts, comments } = await communityApi.getPendingQueue();

            const postItems: ReviewItem[] = (posts ?? []).map((p: any) => ({
                type: 'post' as const,
                id: p.id,
                authorName: p.author?.first_name || p.author?.firstName || 'Unknown',
                content: p.content,
                title: p.title,
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

    const fetchPrivateSuggestions = async () => {
        setSuggestionsLoading(true);
        try {
            const { data, error } = await (await import('../lib/supabaseClient')).supabase
                .from('community_posts')
                .select(`
                    *,
                    author:community_profiles(id, first_name, last_name),
                    linked_public:community_posts!community_posts_source_post_id_fkey(id)
                `)
                .eq('post_type', 'suggestion')
                .eq('visibility', 'admin_private')
                .order('created_at', { ascending: false });
            if (error) throw error;
            setPrivateSuggestions(data || []);
        } catch (err) {
            console.error('Failed to fetch suggestions:', err);
        } finally {
            setSuggestionsLoading(false);
        }
    };

    useEffect(() => { fetchQueue(); }, []);

    useEffect(() => {
        if (adminTab === 'suggestions') fetchPrivateSuggestions();
    }, [adminTab]);

    const handleAction = async (item: ReviewItem, action: 'approve' | 'reject' | 'escalate') => {
        setActionInProgress(item.id);
        try {
            await communityApi.reviewAction(item.type, item.id, action);
            setItems(prev => prev.filter(i => i.id !== item.id));
        } catch (err) {
            console.error('Review action failed:', err);
        } finally {
            setActionInProgress(null);
        }
    };

    const handlePromote = async () => {
        if (!promoteState) return;
        setPromoteSubmitting(true);
        try {
            await communityApi.promoteSuggestion({
                sourcePostId: promoteState.id,
                title: promoteState.title,
                content: promoteState.content,
            });
            setPromoteState(null);
            fetchPrivateSuggestions();
        } catch (err) {
            console.error('Promote failed:', err);
        } finally {
            setPromoteSubmitting(false);
        }
    };

    // Filter items by tab context
    const moderationItems = items;
    const articleItems = items.filter(i => i.postType === 'mini_article');
    const pendingCount = moderationItems.length;

    const adminTabs: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number }[] = [
        { id: 'moderation', label: 'Moderation', icon: <ShieldCheck size={16} />, badge: pendingCount },
        { id: 'articles', label: 'Articles', icon: <Newspaper size={16} />, badge: articleItems.length },
        { id: 'suggestions', label: 'Suggestions', icon: <Lightbulb size={16} /> },
    ];

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
                            Community Dashboard
                        </h1>
                    </div>
                    <p className="font-serif text-parish-muted mt-3">
                        Moderate submissions, manage articles, and respond to community suggestions.
                    </p>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 md:px-12 py-10">
                {/* Admin Tabs */}
                <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-parish-border/10 pb-4">
                    {adminTabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setAdminTab(tab.id)}
                            className={`flex items-center gap-2 rounded-full px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.2em] transition-all
                                ${adminTab === tab.id
                                    ? 'bg-parish-fg text-parish-inverse shadow-halo'
                                    : 'border border-parish-border/10 text-parish-muted hover:border-parish-brass/30 hover:text-parish-fg'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                            {tab.badge !== undefined && tab.badge > 0 && (
                                <span className="bg-parish-accent/15 text-parish-accent px-1.5 py-0.5 rounded-full text-[9px] font-bold min-w-[18px] text-center">
                                    {tab.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* ═══════════════ Moderation Tab ═══════════════ */}
                {adminTab === 'moderation' && (
                    <>
                        <div className="flex items-center gap-3 mb-8">
                            <h2 className="font-display text-xl tracking-wider">Pending Review</h2>
                            <span className="bg-parish-accent/10 text-parish-accent px-3 py-1 rounded-full font-display text-sm font-semibold">
                                {loading ? '…' : pendingCount}
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
                        ) : moderationItems.length === 0 ? (
                            <div className="p-16 text-center rounded-2xl border border-dashed border-parish-border/20 bg-parish-elevated">
                                <ShieldCheck size={36} className="text-green-500 mx-auto mb-4" />
                                <p className="font-display text-lg tracking-wider text-parish-fg mb-2">All Clear!</p>
                                <p className="font-serif text-parish-muted italic">No pending submissions to review.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <AnimatePresence>
                                    {moderationItems.map(item => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -100, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="bg-parish-surface border border-parish-border/10 rounded-2xl p-5 md:p-6"
                                        >
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`font-display text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full
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

                                            {item.title && (
                                                <h4 className="font-display text-base font-semibold text-parish-fg mb-1">{item.title}</h4>
                                            )}

                                            <p className="font-serif text-parish-fg/90 leading-relaxed mb-5 whitespace-pre-line">
                                                {item.content}
                                            </p>

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
                    </>
                )}

                {/* ═══════════════ Articles Tab ═══════════════ */}
                {adminTab === 'articles' && (
                    <>
                        <div className="flex items-center justify-between gap-4 mb-8">
                            <div className="flex items-center gap-3">
                                <h2 className="font-display text-xl tracking-wider">Article Management</h2>
                                {articleItems.length > 0 && (
                                    <span className="bg-parish-accent/10 text-parish-accent px-3 py-1 rounded-full font-display text-sm font-semibold">
                                        {articleItems.length} pending
                                    </span>
                                )}
                            </div>
                            <Link
                                to="/community/editor/articles/new"
                                className="flex items-center gap-2 rounded-full bg-parish-fg text-parish-inverse px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-halo"
                            >
                                <PenLine size={14} />
                                Write Article
                            </Link>
                        </div>

                        {articleItems.length === 0 ? (
                            <div className="p-16 text-center rounded-2xl border border-dashed border-parish-border/20 bg-parish-elevated">
                                <Newspaper size={36} className="text-parish-muted/30 mx-auto mb-4" />
                                <p className="font-display text-lg tracking-wider text-parish-fg mb-2">No Pending Articles</p>
                                <p className="font-serif text-parish-muted italic">All submitted articles have been reviewed.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <AnimatePresence>
                                    {articleItems.map(item => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -100, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="bg-parish-surface border border-parish-border/10 rounded-2xl p-5 md:p-6"
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="font-display text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600">
                                                    mini article
                                                </span>
                                                <span className="font-display text-sm text-parish-fg tracking-wide">
                                                    by {item.authorName}
                                                </span>
                                                <span className="flex items-center gap-1 text-parish-muted text-xs ml-auto">
                                                    <Clock size={11} />
                                                    {new Date(item.createdAt).toLocaleString('en-AU', {
                                                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                            {item.title && (
                                                <h4 className="font-display text-base font-semibold text-parish-fg mb-1">{item.title}</h4>
                                            )}
                                            <p className="font-serif text-parish-fg/90 leading-relaxed mb-4 whitespace-pre-line line-clamp-3">
                                                {item.content}
                                            </p>
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
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </>
                )}

                {/* ═══════════════ Suggestions Tab ═══════════════ */}
                {adminTab === 'suggestions' && (
                    <>
                        <div className="flex items-center gap-3 mb-8">
                            <h2 className="font-display text-xl tracking-wider">Private Suggestions</h2>
                        </div>

                        {/* Promote Form */}
                        <AnimatePresence>
                            {promoteState && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-6 overflow-hidden"
                                >
                                    <div className="bg-parish-accent/5 border border-parish-accent/20 rounded-2xl p-6">
                                        <h3 className="font-display text-lg text-parish-accent tracking-wider mb-4">
                                            Write Public Summary
                                        </h3>
                                        <p className="font-serif text-sm text-parish-muted mb-4 italic">
                                            Create a public "You Asked, We Heard" summary. The original suggestion remains private.
                                        </p>
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                value={promoteState.title}
                                                onChange={e => setPromoteState(prev => prev ? { ...prev, title: e.target.value } : null)}
                                                placeholder="Summary title"
                                                className="w-full bg-parish-elevated text-parish-fg border border-parish-border/20 rounded-xl px-4 py-3 outline-none focus:border-parish-accent/50 focus:ring-1 focus:ring-parish-accent/50 transition-all font-sans"
                                            />
                                            <textarea
                                                value={promoteState.content}
                                                onChange={e => setPromoteState(prev => prev ? { ...prev, content: e.target.value } : null)}
                                                placeholder="Write a public summary of the parish team's response..."
                                                className="w-full bg-parish-elevated text-parish-fg border border-parish-border/20 rounded-xl px-4 py-3 outline-none focus:border-parish-accent/50 focus:ring-1 focus:ring-parish-accent/50 transition-all font-serif min-h-[120px] resize-y"
                                            />
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={handlePromote}
                                                    disabled={promoteSubmitting || !promoteState.content.trim()}
                                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-parish-accent text-parish-inverse font-display text-xs uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50"
                                                >
                                                    {promoteSubmitting ? 'Publishing…' : 'Publish Summary'}
                                                </button>
                                                <button
                                                    onClick={() => setPromoteState(null)}
                                                    className="px-5 py-2.5 rounded-xl border border-parish-border/20 text-parish-muted font-display text-xs uppercase tracking-widest hover:border-parish-brass/30 transition-all"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {suggestionsLoading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="bg-parish-surface border border-parish-border/10 rounded-2xl p-6 animate-pulse">
                                        <div className="h-4 w-32 bg-parish-border/20 rounded mb-3" />
                                        <div className="h-3 w-full bg-parish-border/15 rounded mb-2" />
                                        <div className="h-3 w-2/3 bg-parish-border/10 rounded" />
                                    </div>
                                ))}
                            </div>
                        ) : privateSuggestions.length === 0 ? (
                            <div className="p-16 text-center rounded-2xl border border-dashed border-parish-border/20 bg-parish-elevated">
                                <MessageSquare size={36} className="text-parish-muted/30 mx-auto mb-4" />
                                <p className="font-display text-lg tracking-wider text-parish-fg mb-2">No Suggestions</p>
                                <p className="font-serif text-parish-muted italic">No community suggestions have been submitted yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {privateSuggestions.map((sug: any) => {
                                    const hasPublicVersion = (sug.linked_public?.length ?? 0) > 0;
                                    return (
                                        <div key={sug.id} className="bg-parish-surface border border-parish-border/10 rounded-2xl p-5 md:p-6">
                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                <span className={`font-display text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full
                                                    ${sug.status === 'pending' ? 'bg-amber-500/10 text-amber-600'
                                                        : sug.status === 'approved' ? 'bg-green-500/10 text-green-600'
                                                            : 'bg-red-500/10 text-red-500'
                                                    }`}>
                                                    {sug.status}
                                                </span>
                                                <span className="font-display text-sm text-parish-fg tracking-wide">
                                                    by {sug.author?.first_name || 'Anonymous'}
                                                </span>
                                                {hasPublicVersion && (
                                                    <span className="flex items-center gap-1 rounded-full bg-parish-accent/10 px-2.5 py-0.5 text-[10px] font-display uppercase tracking-widest text-parish-accent">
                                                        <Eye size={11} /> Published
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1 text-parish-muted text-xs ml-auto">
                                                    <Clock size={11} />
                                                    {new Date(sug.created_at).toLocaleString('en-AU', {
                                                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                            {sug.title && (
                                                <h4 className="font-display text-sm font-semibold text-parish-fg mb-1">{sug.title}</h4>
                                            )}
                                            <p className="font-serif text-parish-fg/90 leading-relaxed mb-4 whitespace-pre-line">
                                                {sug.content}
                                            </p>
                                            {!hasPublicVersion && (
                                                <div className="pt-3 border-t border-parish-border/5">
                                                    <button
                                                        onClick={() => setPromoteState({ id: sug.id, title: '', content: '' })}
                                                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-parish-accent/10 text-parish-accent font-display text-xs uppercase tracking-widest hover:bg-parish-accent/20 transition-all active:scale-95"
                                                    >
                                                        <Lightbulb size={14} /> Promote to Public
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
