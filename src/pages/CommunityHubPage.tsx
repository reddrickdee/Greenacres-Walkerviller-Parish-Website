import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircleHeart, Newspaper, Lightbulb, ShieldAlert, Plus, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { usePageSEO } from '../hooks/usePageSEO';
import { PostFeed } from '../components/community/PostFeed';
import { SubmitPostForm } from '../components/community/SubmitPostForm';
import { AuthModal } from '../components/community/AuthModal';
import { CommunityPostType } from '../types';
import { PageMeta } from '../components/PageMeta';

type TabId = 'prayer_wall' | 'words_of_hope' | 'mini_articles' | 'suggestions';

const TAB_TO_POST_TYPE: Record<TabId, CommunityPostType> = {
    prayer_wall: 'prayer_request',
    words_of_hope: 'words_of_hope',
    mini_articles: 'mini_article',
    suggestions: 'suggestion',
};

export function CommunityHubPage() {
    const { session, profile, isAdmin, signOut } = useAuth();

    usePageSEO({
        title: 'Community Hub',
        description: 'Join the Greenacres Walkerville Parish community online. Share prayer requests, words of hope, and connect with fellow parishioners.',
        path: '/community',
    });
    const [activeTab, setActiveTab] = useState<TabId>('prayer_wall');
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showSubmitForm, setShowSubmitForm] = useState(false);

    const tabs: { id: TabId; label: string; icon: React.ReactNode; intro: string; phase1: boolean }[] = [
        {
            id: 'prayer_wall',
            label: 'Prayer Wall',
            icon: <Heart size={18} />,
            intro: 'Share your intentions with our parish family, so we may lift them up together in prayer.',
            phase1: true,
        },
        {
            id: 'words_of_hope',
            label: 'Words of Hope',
            icon: <MessageCircleHeart size={18} />,
            intro: 'Offer short reflections, encouragements, and blessings to uplift others in our community.',
            phase1: true,
        },
        {
            id: 'mini_articles',
            label: 'Mini Articles',
            icon: <Newspaper size={18} />,
            intro: 'Read and share longer updates, testimonies, and visual memories from parish life.',
            phase1: false,
        },
        {
            id: 'suggestions',
            label: 'Suggestions',
            icon: <Lightbulb size={18} />,
            intro: 'Share private feedback and ideas with the parish administration to help us grow together.',
            phase1: false,
        },
    ];

    const currentTab = tabs.find(t => t.id === activeTab)!;
    const isPhase1Tab = currentTab.phase1;

    return (
        <div className="bg-parish-surface min-h-screen text-parish-fg">
            <PageMeta title="Community Hub" description="Join the Greenacres Walkerville Parish community — share prayer requests, words of hope, and connect with fellow parishioners." path="/community" />
            {/* Header Hero */}
            <header className="bg-parish-accent/5 py-16 md:py-24 border-b border-parish-border/10 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23a18a5b\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>

                <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10 text-center">
                    <h1 className="font-display text-4xl md:text-6xl font-semibold tracking-wider text-parish-accent mb-6">
                        Community Hub
                    </h1>
                    <p className="font-serif text-xl md:text-2xl text-parish-muted max-w-2xl mx-auto leading-relaxed italic mb-8">
                        "For where two or three gather in my name, there am I with them." — Matthew 18:20
                    </p>

                    {!session ? (
                        <div className="flex flex-col items-center gap-3">
                            <p className="font-sans text-sm text-parish-muted">Join the parish community to share your voice.</p>
                            <button
                                onClick={() => setShowAuthModal(true)}
                                className="inline-flex items-center gap-2 bg-parish-accent text-parish-inverse px-6 py-3 rounded-full font-display uppercase tracking-wider text-sm hover:opacity-90 transition-opacity"
                            >
                                Sign In / Register
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3">
                            <p className="font-serif text-parish-muted text-lg">
                                Welcome, <span className="text-parish-accent font-medium">{profile?.firstName || 'Parishioner'}</span>
                            </p>
                            <div className="flex items-center gap-3">
                                {isAdmin && (
                                    <Link
                                        to="/admin/community"
                                        className="inline-flex items-center gap-2 border border-parish-accent text-parish-accent px-4 py-2 rounded-full font-display uppercase tracking-wider text-xs hover:bg-parish-accent hover:text-parish-inverse transition-colors"
                                    >
                                        <ShieldAlert size={14} />
                                        Admin Dashboard
                                    </Link>
                                )}
                                <button
                                    onClick={signOut}
                                    className="text-parish-muted font-display text-xs uppercase tracking-wider hover:text-parish-fg transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-5xl mx-auto px-6 md:px-12 py-12">

                {/* Tabs Navigation */}
                <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-10 pb-4 border-b border-parish-border/10 overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setShowSubmitForm(false); }}
                            className={`flex flex-shrink-0 items-center gap-2 px-5 py-3 rounded-xl font-display uppercase tracking-wider text-sm transition-all duration-300
                                ${activeTab === tab.id
                                    ? 'bg-parish-accent text-parish-inverse shadow-md scale-105'
                                    : tab.phase1
                                        ? 'text-parish-muted hover:bg-parish-border/5 hover:text-parish-fg'
                                        : 'text-parish-muted/70 cursor-not-allowed'
                                }`}
                            disabled={!tab.phase1}
                        >
                            {tab.icon}
                            {tab.label}
                            {!tab.phase1 && <span className="text-xs ml-1 opacity-60">SOON</span>}
                        </button>
                    ))}
                </div>

                {/* Tab Content Header + CTA */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={activeTab}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.2 }}
                            className="font-serif text-lg text-parish-muted max-w-2xl"
                        >
                            {currentTab.intro}
                        </motion.p>
                    </AnimatePresence>

                    {isPhase1Tab && (
                        <button
                            onClick={() => {
                                if (!session) {
                                    setShowAuthModal(true);
                                } else {
                                    setShowSubmitForm(!showSubmitForm);
                                }
                            }}
                            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-display uppercase tracking-wider text-sm transition-all shrink-0
                                ${showSubmitForm
                                    ? 'bg-parish-border/10 text-parish-muted'
                                    : 'bg-parish-accent text-parish-inverse shadow-md hover:opacity-90'
                                }`}
                        >
                            {showSubmitForm ? <X size={16} /> : <Plus size={16} />}
                            {showSubmitForm
                                ? 'Close Form'
                                : activeTab === 'prayer_wall' ? 'Share a Prayer' : 'Share Hope'
                            }
                        </button>
                    )}
                </div>

                {/* Submit Form (collapsible) */}
                <AnimatePresence>
                    {showSubmitForm && isPhase1Tab && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden mb-8"
                        >
                            <SubmitPostForm
                                postType={TAB_TO_POST_TYPE[activeTab]}
                                onRequireAuth={() => setShowAuthModal(true)}
                                onSuccess={() => setShowSubmitForm(false)}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Feed */}
                <div className="min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {isPhase1Tab ? (
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <PostFeed
                                    postType={TAB_TO_POST_TYPE[activeTab]}
                                    onRequireAuth={() => setShowAuthModal(true)}
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="p-12 text-center rounded-2xl border border-dashed border-parish-border/20 bg-parish-elevated">
                                    <p className="font-display tracking-wider uppercase text-parish-muted text-sm">
                                        {activeTab === 'mini_articles' ? 'Mini Articles' : 'Suggestions'} — Coming Soon
                                    </p>
                                    <p className="font-serif text-parish-muted/80 text-sm mt-2 italic">
                                        This feature is being prepared for the next phase.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* Auth Modal */}
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </div>
    );
}
