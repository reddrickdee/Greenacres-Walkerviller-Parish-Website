import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { PrayerIntention } from '../types';
import { communityApi } from '../lib/communityApi';
import { isSupabaseConfigured } from '../lib/supabaseClient';

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

export function PrayerWallSection() {
    const [intentions, setIntentions] = useState<PrayerIntention[]>(SAMPLE_INTENTIONS);

    // Try to fetch live data from Supabase
    useEffect(() => {
        if (!isSupabaseConfigured()) return;

        const fetchLive = async () => {
            try {
                const posts = await communityApi.getPublishedPosts();
                const prayers = posts
                    .filter((p: any) => (p.post_type ?? p.postType) === 'prayer_request')
                    .slice(0, 6)
                    .map((p: any) => ({
                        id: p.id,
                        text: p.content,
                        submitted: new Date(p.created_at ?? p.createdAt),
                        prayerCount: p.prayers?.length ?? p.prayerCount ?? 0,
                    }));

                if (prayers.length > 0) {
                    setIntentions(prayers);
                }
            } catch {
                // Fallback to sample data silently
            }
        };

        fetchLive();
    }, []);

    const handlePray = (id: string) => {
        setIntentions(prev =>
            prev.map(i => (i.id === id ? { ...i, prayerCount: i.prayerCount + 1 } : i))
        );
    };

    return (
        <section className="bg-parish-surface-alt py-24 px-8 md:px-24 border-y border-parish-border/5">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatePresence>
                        {intentions.map((intention) => (
                            <motion.div
                                key={intention.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.5 }}
                                className="bg-parish-surface border border-parish-border/10 p-8 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
                            >
                                <p className="font-serif text-lg text-parish-fg/80 leading-relaxed italic mb-6">
                                    "{intention.text}"
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className="font-display tracking-widest text-[10px] uppercase text-parish-muted">
                                        {timeAgo(intention.submitted)}
                                    </span>
                                    <button
                                        onClick={() => handlePray(intention.id)}
                                        className="flex items-center gap-2 bg-parish-border/5 hover:bg-parish-accent/10 px-4 py-2 rounded-full transition-colors group border border-parish-border/10 hover:border-parish-accent/20"
                                    >
                                        <span className="text-parish-accent text-lg">🕯️</span>
                                        <span className="font-display tracking-widest text-xs uppercase text-parish-muted group-hover:text-parish-accent transition-colors">
                                            Pray ({intention.prayerCount})
                                        </span>
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* CTA to full Community Hub */}
                <div className="mt-12 text-center">
                    <Link
                        to="/community"
                        className="inline-flex items-center gap-3 bg-parish-accent text-parish-inverse px-8 py-4 rounded-full font-display uppercase tracking-wider text-sm hover:opacity-90 transition-opacity shadow-lg group"
                    >
                        View Full Prayer Wall
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <p className="font-serif text-parish-muted italic text-sm mt-4">
                        Share your intentions, offer encouragement, and pray with the parish community.
                    </p>
                </div>
            </div>
        </section>
    );
}
