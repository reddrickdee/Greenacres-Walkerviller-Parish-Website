import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { communityApi } from '../../lib/communityApi';
import { IntentionKind, CommunityVisibility, CommunityPostType } from '../../types';

interface SubmitPostFormProps {
    postType: CommunityPostType;
    onSuccess?: () => void;
    onRequireAuth: () => void;
}

export function SubmitPostForm({ postType, onSuccess, onRequireAuth }: SubmitPostFormProps) {
    const { session } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const [content, setContent] = useState('');
    const [visibility, setVisibility] = useState<CommunityVisibility>('public');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [intentionType, setIntentionType] = useState<IntentionKind>('general');
    const [intentionName, setIntentionName] = useState('');

    const isPrayer = postType === 'prayer_request';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!session) {
            onRequireAuth();
            return;
        }

        if (!content.trim()) {
            setErrorMsg(`Please write your ${isPrayer ? 'prayer request' : 'message of hope'}.`);
            return;
        }

        if (isPrayer && intentionType !== 'general' && !intentionName.trim()) {
            setErrorMsg('Please provide a name for this specific intention.');
            return;
        }

        setSubmitting(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            await communityApi.submitPost({
                postType,
                visibility,
                content: content.trim(),
                isAnonymous,
                intentionType: isPrayer ? intentionType : 'general',
                intentionName: isPrayer && intentionType !== 'general' ? intentionName.trim() : undefined
            });

            setSuccessMsg(`Your ${isPrayer ? 'prayer request' : 'message'} has been submitted for review. It will appear on the wall soon.`);

            // Reset form
            setContent('');
            setVisibility('public');
            setIsAnonymous(false);
            setIntentionType('general');
            setIntentionName('');

            if (onSuccess) onSuccess();

        } catch (error: any) {
            setErrorMsg(error.message || 'Failed to submit. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!session) {
        return (
            <div className="bg-parish-surface border border-parish-border/10 rounded-2xl p-6 text-center">
                <p className="font-serif text-parish-muted italic mb-4">
                    Sign in to join the conversation.
                </p>
                <button
                    onClick={onRequireAuth}
                    className="bg-parish-accent text-parish-inverse px-5 py-2.5 rounded-full font-display uppercase tracking-wider text-xs hover:opacity-90 transition-opacity"
                >
                    Sign In to Share
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-parish-surface border border-parish-border/10 rounded-3xl p-6 md:p-8 shadow-sm">
            <h3 className="font-display text-2xl text-parish-accent tracking-wider mb-6">
                {isPrayer ? 'Submit a Prayer Request' : 'Share Words of Hope'}
            </h3>

            <AnimatePresence mode="wait">
                {errorMsg && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl p-4 text-sm mb-6 font-medium"
                    >
                        {errorMsg}
                    </motion.div>
                )}
                {successMsg && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-green-500/10 text-green-600 border border-green-500/20 rounded-xl p-4 text-sm mb-6 font-medium"
                    >
                        {successMsg}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-5">
                {/* Intention Type (Only for Prayers) */}
                {isPrayer && (
                    <div className="flex flex-col gap-2">
                        <label className="font-display text-xs uppercase tracking-widest text-parish-muted">Intention Type</label>
                        <div className="flex flex-wrap gap-3">
                            <label className="flex items-center gap-2 cursor-pointer bg-parish-elevated text-parish-fg px-4 py-2 rounded-lg border border-parish-border/10 hover:border-parish-accent/30 transition-colors">
                                <input
                                    type="radio"
                                    name="intentionType"
                                    value="general"
                                    checked={intentionType === 'general'}
                                    onChange={() => setIntentionType('general')}
                                    className="text-parish-accent focus:ring-parish-accent"
                                />
                                <span className="font-sans text-sm text-parish-fg">General Request</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer bg-parish-elevated text-parish-fg px-4 py-2 rounded-lg border border-parish-border/10 hover:border-parish-accent/30 transition-colors">
                                <input
                                    type="radio"
                                    name="intentionType"
                                    value="ill"
                                    checked={intentionType === 'ill'}
                                    onChange={() => setIntentionType('ill')}
                                    className="text-parish-accent focus:ring-parish-accent"
                                />
                                <span className="font-sans text-sm text-parish-fg">For the Sick</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer bg-parish-elevated text-parish-fg px-4 py-2 rounded-lg border border-parish-border/10 hover:border-parish-accent/30 transition-colors">
                                <input
                                    type="radio"
                                    name="intentionType"
                                    value="deceased"
                                    checked={intentionType === 'deceased'}
                                    onChange={() => setIntentionType('deceased')}
                                    className="text-parish-accent focus:ring-parish-accent"
                                />
                                <span className="font-sans text-sm text-parish-fg">For the Deceased</span>
                            </label>
                        </div>
                    </div>
                )}

                {/* Name for Ill/Deceased (Only for Prayers) */}
                {isPrayer && (intentionType === 'ill' || intentionType === 'deceased') && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="flex flex-col gap-2"
                    >
                        <label className="font-display text-xs uppercase tracking-widest text-parish-muted flex justify-between">
                            <span>Name of Person</span>
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={intentionName}
                            onChange={e => setIntentionName(e.target.value)}
                            placeholder="e.g. John Smith"
                            className="bg-parish-elevated text-parish-fg border border-parish-border/20 rounded-xl px-4 py-3 outline-none focus:border-parish-accent/50 focus:ring-1 focus:ring-parish-accent/50 transition-all font-sans"
                            required
                        />
                    </motion.div>
                )}

                {/* Content */}
                <div className="flex flex-col gap-2">
                    <label className="font-display text-xs uppercase tracking-widest text-parish-muted">
                        {isPrayer ? 'Your Prayer' : 'Your Message'}
                    </label>
                    <textarea
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        placeholder={isPrayer ? "Lord, please watch over..." : "May God bless..."}
                        className="bg-parish-elevated text-parish-fg border border-parish-border/20 rounded-xl px-4 py-3 outline-none focus:border-parish-accent/50 focus:ring-1 focus:ring-parish-accent/50 transition-all font-sans min-h-[120px] resize-y"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    {/* Visibility */}
                    <div className="flex flex-col gap-2">
                        <label className="font-display text-xs uppercase tracking-widest text-parish-muted">Visibility</label>
                        <select
                            value={visibility}
                            onChange={(e) => setVisibility(e.target.value as CommunityVisibility)}
                            className="bg-parish-elevated text-parish-fg border border-parish-border/20 rounded-xl px-4 py-3 outline-none focus:border-parish-accent/50 focus:ring-1 focus:ring-parish-accent/50 transition-all font-sans appearance-none"
                        >
                            <option value="public">Public (Shared on the Wall)</option>
                            <option value="admin_private">Private (Admin & Priests only)</option>
                        </select>
                    </div>

                    {/* Anonymity */}
                    <div className="flex items-center gap-3 pt-6 md:pt-6">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={isAnonymous}
                                onChange={(e) => setIsAnonymous(e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-parish-border/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-parish-inverse after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-parish-inverse after:border-parish-border/30 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-parish-accent"></div>
                            <span className="ml-3 font-sans text-sm text-parish-muted">Post Anonymously</span>
                        </label>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full mt-6 bg-parish-accent text-parish-inverse px-6 py-4 rounded-xl font-display uppercase tracking-wider text-sm hover:opacity-90 transition-all shadow-md active:scale-[0.98] disabled:opacity-50 flex justify-center"
                >
                    {submitting ? 'Submitting...' : `Submit ${isPrayer ? 'Prayer Request' : 'Message'}`}
                </button>
                <p className="text-center font-serif text-xs text-parish-muted italic mt-3">
                    All submissions are reviewed by our pastoral team before being published on the public wall.
                </p>
            </div>
        </form>
    );
}
