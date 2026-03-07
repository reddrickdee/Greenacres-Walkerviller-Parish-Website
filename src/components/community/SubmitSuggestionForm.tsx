import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { communityApi } from '../../lib/communityApi';

interface SubmitSuggestionFormProps {
    onSuccess?: () => void;
    onRequireAuth: () => void;
}

export function SubmitSuggestionForm({ onSuccess, onRequireAuth }: SubmitSuggestionFormProps) {
    const { session } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!session) {
            onRequireAuth();
            return;
        }

        if (!content.trim()) {
            setErrorMsg('Please describe your suggestion or feedback.');
            return;
        }

        setSubmitting(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            await communityApi.submitPost({
                postType: 'suggestion',
                visibility: 'admin_private',
                title: title.trim() || undefined,
                content: content.trim(),
                isAnonymous: false,
            });

            setSuccessMsg('Your suggestion has been submitted privately. The parish team will review it.');
            setContent('');
            setTitle('');

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
                    Sign in to share a suggestion with the parish team.
                </p>
                <button
                    onClick={onRequireAuth}
                    className="bg-parish-accent text-parish-inverse px-5 py-2.5 rounded-full font-display uppercase tracking-wider text-xs hover:opacity-90 transition-opacity"
                >
                    Sign In to Submit
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-parish-surface border border-parish-border/10 rounded-3xl p-6 md:p-8 shadow-sm">
            <h3 className="font-display text-2xl text-parish-accent tracking-wider mb-2">
                Share a Suggestion
            </h3>
            <p className="font-serif text-sm text-parish-muted mb-6">
                Your suggestion is submitted privately to the parish administration.
            </p>

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
                {/* Optional Title */}
                <div className="flex flex-col gap-2">
                    <label className="font-display text-xs uppercase tracking-widest text-parish-muted">
                        Subject <span className="normal-case tracking-normal text-parish-muted/50">(optional)</span>
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="e.g. Idea for parish events"
                        className="bg-parish-elevated text-parish-fg border border-parish-border/20 rounded-xl px-4 py-3 outline-none focus:border-parish-accent/50 focus:ring-1 focus:ring-parish-accent/50 transition-all font-sans"
                    />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2">
                    <label className="font-display text-xs uppercase tracking-widest text-parish-muted">
                        Your Suggestion
                    </label>
                    <textarea
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        placeholder="Share your thoughts, ideas, or feedback with the parish team..."
                        className="bg-parish-elevated text-parish-fg border border-parish-border/20 rounded-xl px-4 py-3 outline-none focus:border-parish-accent/50 focus:ring-1 focus:ring-parish-accent/50 transition-all font-sans min-h-[120px] resize-y"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full mt-4 bg-parish-accent text-parish-inverse px-6 py-4 rounded-xl font-display uppercase tracking-wider text-sm hover:opacity-90 transition-all shadow-md active:scale-[0.98] disabled:opacity-50 flex justify-center"
                >
                    {submitting ? 'Submitting...' : 'Submit Suggestion'}
                </button>
                <p className="text-center font-serif text-xs text-parish-muted italic mt-3">
                    Your submission is private and only visible to the parish administration.
                </p>
            </div>
        </form>
    );
}
