import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { PrayerIntention } from '../types';
import { communityApi } from '../lib/communityApi';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import { PrayButton } from './community/PrayButton';
import { AuthModal } from './community/AuthModal';

interface PrayerWallSectionProps {
    maxItems?: number;
    embedded?: boolean;
    onRequireAuth?: () => void;
}

const SAMPLE_INTENTIONS: PrayerIntention[] = [
    {
        id: 'sample_1',
        text: 'For the repose of the soul of Margaret, beloved mother and grandmother. May she rest in eternal peace.',
        submitted: new Date(Date.now() - 3 * 60 * 60 * 1000),
        prayerCount: 12,
    },
    {
        id: 'sample_2',
        text: 'Please pray for my son who is undergoing surgery this week. Lord, guide the hands of the surgeons.',
        submitted: new Date(Date.now() - 8 * 60 * 60 * 1000),
        prayerCount: 24,
    },
    {
        id: 'sample_3',
        text: 'For all those affected by the recent floods in our communities. May they find shelter, strength and hope.',
        submitted: new Date(Date.now() - 24 * 60 * 60 * 1000),
        prayerCount: 31,
    },
    {
        id: 'sample_4',
        text: 'For peace in our world and an end to all conflict. Lord, hear our prayer.',
        submitted: new Date(Date.now() - 48 * 60 * 60 * 1000),
        prayerCount: 18,
    },
    {
        id: 'sample_5',
        text: 'A prayer of thanksgiving for the safe arrival of our new baby, a precious gift from God.',
        submitted: new Date(Date.now() - 72 * 60 * 60 * 1000),
        prayerCount: 42,
    },
    {
        id: 'sample_6',
        text: 'For all who struggle with loneliness and isolation. May they know they are never alone in God\u2019s love.',
        submitted: new Date(Date.now() - 96 * 60 * 60 * 1000),
        prayerCount: 15,
    },
];

function timeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

export function PrayerWallSection({ maxItems = 4, embedded = false, onRequireAuth }: PrayerWallSectionProps) {
    const [intentions, setIntentions] = useState<PrayerIntention[]>(SAMPLE_INTENTIONS.slice(0, maxItems));
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const handleRequireAuth = () => {
        if (onRequireAuth) {
            onRequireAuth();
        } else {
            setShowAuthModal(true);
        }
    };

    // Try to fetch live data from Supabase
    useEffect(() => {
        if (!isSupabaseConfigured()) return;

        const fetchLive = async () => {
            try {
                const posts = await communityApi.getPublishedPosts();
                const prayers = posts
                    .filter((p: any) => (p.post_type ?? p.postType) === 'prayer_request')
                    .slice(0, maxItems)
                    .map((p: any) => ({
                        id: p.id,
                        text: p.content,
                        submitted: new Date(p.created_at ?? p.createdAt),
                        prayerCount: p.prayers?.length ?? p.prayerCount ?? 0,
                    }));

                if (prayers.length > 0) {
                    setIntentions(prayers);
                }
            } catch (error) {
                console.error("Failed to load prayers:", error);
                setHasError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLive();
    }, [maxItems]);

    const content = (
        <div className="w-full flex-1 flex flex-col pt-2 pb-6 relative z-10 w-full">
            <div className="flex justify-between items-end mb-8 w-full">
                <h2 className="text-3xl md:text-4xl text-parish-fg font-display italic">The Prayer Wall</h2>
                <Link
                    to="/community"
                    className="inline-flex items-center gap-2 bg-parish-accent text-parish-inverse px-5 py-2.5 rounded-full font-display uppercase tracking-widest text-xs hover:opacity-90 transition-all shadow-md active:scale-[0.98]"
                >
                    Submit Petition
                </Link>
            </div>

            {hasError ? (
                <div className="bg-parish-surface border border-parish-border/10 p-8 rounded-2xl text-center" aria-live="polite">
                    <p className="text-parish-muted font-serif italic mb-4">We are currently unable to load the latest prayer intentions.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <AnimatePresence>
                        {isLoading && isSupabaseConfigured() ? (
                            // Skeletons
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={`skeleton-${i}`} className="sacred-card animate-pulse flex flex-col justify-between h-[180px]">
                                    <div className="bg-parish-border/10 h-16 w-full rounded-md mb-6"></div>
                                    <div className="flex justify-between items-center">
                                        <div className="bg-parish-border/10 w-16 h-4 rounded"></div>
                                        <div className="bg-parish-border/10 w-16 h-8 rounded-full"></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            intentions.map((intention) => (
                                <motion.div
                                    key={intention.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.5 }}
                                    className="sacred-card flex flex-col justify-between"
                                >
                                    <div className="flex items-center gap-2 mb-4 text-parish-fg/70 font-display tracking-widest text-sm uppercase">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-flame text-parish-accent/60"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" /></svg>
                                        {intention.submitted.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    <p className="font-serif text-lg text-parish-fg leading-relaxed italic mb-6">
                                        "{intention.text}"
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <span className="font-display tracking-widest text-sm uppercase text-parish-muted">
                                            {timeAgo(intention.submitted)}
                                        </span>
                                        <PrayButton
                                            postId={intention.id}
                                            initialCount={intention.prayerCount}
                                            initialHasPrayed={false}
                                            onRequireAuth={handleRequireAuth}
                                        />
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );

    if (embedded) {
        return (
            <>
                {content}
                <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
            </>
        );
    }

    return (
        <section className="bg-parish-elevated py-24 px-8 md:px-24 border-y border-parish-border/5">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <div className="text-parish-accent font-display tracking-widest text-sm uppercase mb-4">Community Prayer</div>
                    <h2 className="font-display text-5xl md:text-7xl text-parish-fg leading-none mb-6">
                        Prayer <em className="font-serif italic text-parish-accent">Wall</em>
                    </h2>
                    <p className="font-serif text-xl text-parish-muted italic max-w-2xl mx-auto">
                        "Where two or three gather in my name, there am I with them." — Matthew 18:20
                    </p>
                </div>
                {content}
            </div>
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </section>
    );
}
