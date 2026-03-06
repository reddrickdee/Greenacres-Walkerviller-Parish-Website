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
import { HighlightPageTemplate } from '../components/layout/PageTemplates';

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
        <HighlightPageTemplate
            eyebrow="Community Hub"
            title={<>A digital gathering space for the parish family.</>}
            description="Share prayer requests, offer words of hope, and stay connected with fellow parishioners — wherever you are."
            imageSrc="/assets/source/our_parish_2.webp"
            imageAlt="Parish community"
            actions={(
                <>
                    {!session ? (
                        <button onClick={() => setShowAuthModal(true)} className="pilgrimage-button">
                            Sign In / Register
                        </button>
                    ) : (
                        <div className="flex flex-col items-start gap-3">
                            <p className="text-base text-parish-muted">
                                Welcome, <span className="text-parish-brass">{profile?.firstName || 'Parishioner'}</span>
                            </p>
                            <div className="flex items-center gap-3">
                                {isAdmin && (
                                    <Link
                                        to="/admin/community"
                                        className="inline-flex items-center gap-2 rounded-full border border-parish-brass/30 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-parish-brass transition-colors hover:bg-parish-brass/10"
                                    >
                                        <ShieldAlert size={14} />
                                        Admin
                                    </Link>
                                )}
                                <button
                                    onClick={signOut}
                                    className="text-xs uppercase tracking-[0.22em] text-parish-muted transition-colors hover:text-parish-fg"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
            aside={(
                <div className="rounded-[1.5rem] border border-parish-brass/20 bg-parish-border/5 px-5 py-5">
                    <div className="ornamental-kicker">Matthew 18:20</div>
                    <p className="mt-3 text-sm italic leading-relaxed text-parish-muted">
                        "For where two or three gather in my name, there am I with them."
                    </p>
                </div>
            )}
        >
            <section className="page-section">
                <div className="page-section-inner">
                    {/* Tab navigation */}
                    <div className="flex flex-wrap items-center gap-2 border-b border-parish-border/10 pb-4 md:gap-3">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => { setActiveTab(tab.id); setShowSubmitForm(false); }}
                                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.2em] transition-all duration-300
                                    ${activeTab === tab.id
                                        ? 'bg-parish-fg text-parish-inverse shadow-halo'
                                        : tab.phase1
                                            ? 'border border-parish-border/10 text-parish-muted hover:border-parish-brass/30 hover:text-parish-fg'
                                            : 'text-parish-muted/40 cursor-not-allowed'
                                    }`}
                                disabled={!tab.phase1}
                            >
                                {tab.icon}
                                {tab.label}
                                {!tab.phase1 && <span className="text-[0.55rem] ml-1 opacity-60">SOON</span>}
                            </button>
                        ))}
                    </div>

                    {/* Tab content header + CTA */}
                    <div className="mt-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={activeTab}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.2 }}
                                className="max-w-2xl text-base leading-relaxed text-parish-muted md:text-lg"
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
                                className={`flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.2em] transition-all
                                    ${showSubmitForm
                                        ? 'border border-parish-border/10 text-parish-muted'
                                        : 'bg-parish-fg text-parish-inverse shadow-halo hover:opacity-90'
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

                    {/* Submit form */}
                    <AnimatePresence>
                        {showSubmitForm && isPhase1Tab && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-6 overflow-hidden"
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
                    <div className="mt-8 min-h-[400px]">
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
                                    <div className="sanctuary-panel px-8 py-12 text-center">
                                        <div className="ornamental-kicker">
                                            {activeTab === 'mini_articles' ? 'Mini Articles' : 'Suggestions'} — Coming Soon
                                        </div>
                                        <p className="mt-3 text-sm italic text-parish-muted">
                                            This feature is being prepared for the next phase.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </HighlightPageTemplate>
    );
}
