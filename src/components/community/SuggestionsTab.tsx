import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquarePlus } from 'lucide-react';
import { communityApi } from '../../lib/communityApi';
import { CommunityPost } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { SuggestionSummaryCard } from './SuggestionSummaryCard';
import { MySuggestionCard } from './MySuggestionCard';
import { SubmitSuggestionForm } from './SubmitSuggestionForm';

interface SuggestionsTabProps {
    onRequireAuth: () => void;
}

export function SuggestionsTab({ onRequireAuth }: SuggestionsTabProps) {
    const { session } = useAuth();

    // Public summaries
    const [publicSummaries, setPublicSummaries] = useState<CommunityPost[]>([]);
    const [publicLoading, setPublicLoading] = useState(true);
    const [publicError, setPublicError] = useState('');

    // User's own suggestions
    const [mySuggestions, setMySuggestions] = useState<(CommunityPost & { linked_summary?: { id: string }[] })[]>([]);
    const [myLoading, setMyLoading] = useState(false);

    // Form toggle
    const [showForm, setShowForm] = useState(false);

    // Fetch public summaries
    useEffect(() => {
        let cancelled = false;
        const fetch = async () => {
            setPublicLoading(true);
            setPublicError('');
            try {
                const data = await communityApi.getPublicPostsByType('suggestion');
                if (!cancelled) {
                    const mapped = data.map((raw: any) => ({
                        id: raw.id,
                        postType: raw.post_type ?? raw.postType,
                        status: raw.status,
                        visibility: raw.visibility,
                        sourcePostId: raw.source_post_id ?? raw.sourcePostId,
                        title: raw.title,
                        content: raw.content,
                        createdAt: raw.created_at ?? raw.createdAt,
                        updatedAt: raw.updated_at ?? raw.updatedAt,
                        authorId: raw.author_id ?? raw.authorId,
                        isAnonymous: raw.is_anonymous ?? raw.isAnonymous ?? false,
                        intentionType: raw.intention_type ?? raw.intentionType ?? 'general',
                        author: raw.author,
                    })) as CommunityPost[];
                    setPublicSummaries(mapped);
                }
            } catch (err: any) {
                console.error('Failed to fetch public suggestion summaries:', err);
                if (!cancelled) setPublicError('Could not load updates. Please try again later.');
            } finally {
                if (!cancelled) setPublicLoading(false);
            }
        };
        fetch();
        return () => { cancelled = true; };
    }, []);

    // Fetch user's own suggestions when signed in
    useEffect(() => {
        if (!session) return;
        let cancelled = false;

        const fetch = async () => {
            setMyLoading(true);
            try {
                const data = await communityApi.getUserSuggestions();
                if (!cancelled) {
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
                        isAnonymous: false,
                        intentionType: 'general' as const,
                        linked_summary: raw.linked_summary,
                    })) as (CommunityPost & { linked_summary?: { id: string }[] })[];
                    setMySuggestions(mapped);
                }
            } catch (err: any) {
                console.error('Failed to fetch user suggestions:', err);
            } finally {
                if (!cancelled) setMyLoading(false);
            }
        };
        fetch();
        return () => { cancelled = true; };
    }, [session]);

    const refreshMySuggestions = async () => {
        if (!session) return;
        try {
            const data = await communityApi.getUserSuggestions();
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
                isAnonymous: false,
                intentionType: 'general' as const,
                linked_summary: raw.linked_summary,
            })) as (CommunityPost & { linked_summary?: { id: string }[] })[];
            setMySuggestions(mapped);
        } catch { /* silent */ }
    };

    return (
        <div className="space-y-12">
            {/* ── Public Section: "You Asked, We Heard" ── */}
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <div className="ornamental-kicker">You Asked, We Heard</div>
                </div>
                <p className="text-sm text-parish-muted mb-6 font-serif">
                    Responses and updates from the parish team on community feedback.
                </p>

                {publicLoading ? (
                    <div className="space-y-4">
                        {[1, 2].map(i => (
                            <div key={i} className="rounded-2xl border border-parish-border/10 bg-parish-surface p-6 animate-pulse">
                                <div className="h-3 w-32 bg-parish-border/20 rounded mb-3" />
                                <div className="h-3 w-full bg-parish-border/15 rounded mb-2" />
                                <div className="h-3 w-3/4 bg-parish-border/10 rounded" />
                            </div>
                        ))}
                    </div>
                ) : publicError ? (
                    <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-8 text-center">
                        <p className="font-serif text-red-500 text-sm">{publicError}</p>
                    </div>
                ) : publicSummaries.length === 0 ? (
                    <div className="p-8 text-center rounded-2xl border border-dashed border-parish-border/20 bg-parish-elevated">
                        <p className="font-serif text-parish-muted italic">
                            No public updates yet. Check back soon.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence>
                            {publicSummaries.map(post => (
                                <SuggestionSummaryCard key={post.id} post={post} />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* ── Suggest CTA ── */}
            <div className="flex justify-center">
                <button
                    onClick={() => {
                        if (!session) {
                            onRequireAuth();
                        } else {
                            setShowForm(!showForm);
                        }
                    }}
                    className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.2em] transition-all
                        ${showForm
                            ? 'border border-parish-border/10 text-parish-muted'
                            : 'bg-parish-fg text-parish-inverse shadow-halo hover:opacity-90'
                        }`}
                >
                    {showForm ? <X size={16} /> : <MessageSquarePlus size={16} />}
                    {showForm ? 'Close Form' : 'Share a Suggestion'}
                </button>
            </div>

            {/* ── Submission form ── */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <SubmitSuggestionForm
                            onRequireAuth={onRequireAuth}
                            onSuccess={() => {
                                setShowForm(false);
                                refreshMySuggestions();
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Private Section: "My Suggestions" ── */}
            {session && (
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="ornamental-kicker">My Suggestions</div>
                    </div>

                    {myLoading ? (
                        <div className="space-y-4">
                            {[1, 2].map(i => (
                                <div key={i} className="rounded-2xl border border-parish-border/10 bg-parish-surface p-6 animate-pulse">
                                    <div className="h-3 w-24 bg-parish-border/20 rounded mb-3" />
                                    <div className="h-3 w-full bg-parish-border/15 rounded mb-2" />
                                    <div className="h-3 w-2/3 bg-parish-border/10 rounded" />
                                </div>
                            ))}
                        </div>
                    ) : mySuggestions.length === 0 ? (
                        <div className="p-8 text-center rounded-2xl border border-dashed border-parish-border/20 bg-parish-elevated">
                            <p className="font-serif text-parish-muted italic">
                                You haven't submitted any suggestions yet.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <AnimatePresence>
                                {mySuggestions.map(post => (
                                    <MySuggestionCard key={post.id} post={post} />
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
