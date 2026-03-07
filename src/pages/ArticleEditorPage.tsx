import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Upload, X, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { communityApi } from '../lib/communityApi';
import { usePageSEO } from '../hooks/usePageSEO';

export function ArticleEditorPage() {
    const { isAdmin } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    usePageSEO({
        title: 'Write an Article',
        description: 'Create a new mini article for the parish community.',
        path: '/community/editor/articles/new',
        noindex: true,
    });

    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setErrorMsg('Please select an image file (JPG, PNG, WebP).');
            return;
        }
        // Validate file size (5 MB limit)
        if (file.size > 5 * 1024 * 1024) {
            setErrorMsg('Image must be under 5 MB.');
            return;
        }

        setCoverImage(file);
        setCoverPreview(URL.createObjectURL(file));
        setErrorMsg('');
    };

    const handleRemoveImage = () => {
        setCoverImage(null);
        if (coverPreview) {
            URL.revokeObjectURL(coverPreview);
            setCoverPreview(null);
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (publishNow: boolean) => {
        if (!title.trim()) {
            setErrorMsg('Please enter a title for your article.');
            return;
        }
        if (!body.trim()) {
            setErrorMsg('Please write the article body.');
            return;
        }

        setSubmitting(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            if (publishNow && isAdmin) {
                await communityApi.submitMiniArticleDirect({
                    title: title.trim(),
                    body: body.trim(),
                    coverImage: coverImage || undefined,
                });
                setSuccessMsg('Article published successfully!');
            } else {
                await communityApi.submitMiniArticle({
                    title: title.trim(),
                    body: body.trim(),
                    coverImage: coverImage || undefined,
                });
                setSuccessMsg('Article submitted for review. It will be published after approval.');
            }

            // Reset form after success
            setTitle('');
            setBody('');
            handleRemoveImage();

            // Redirect after a short delay
            setTimeout(() => navigate('/community'), 2000);
        } catch (error: any) {
            setErrorMsg(error.message || 'Failed to submit article. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-parish-surface min-h-screen text-parish-fg">
            <header className="bg-parish-accent/5 py-12 md:py-16 border-b border-parish-border/10">
                <div className="max-w-3xl mx-auto px-6 md:px-12">
                    <Link
                        to="/community"
                        className="inline-flex items-center gap-2 text-parish-muted hover:text-parish-accent font-display text-xs uppercase tracking-widest transition-colors mb-6"
                    >
                        <ArrowLeft size={14} /> Back to Community Hub
                    </Link>
                    <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-wider text-parish-accent">
                        Write an Article
                    </h1>
                    <p className="font-serif text-parish-muted mt-3">
                        Share a story, reflection, or update with the parish community.
                    </p>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 md:px-12 py-10">
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

                <div className="space-y-6">
                    {/* Cover Image Upload */}
                    <div className="flex flex-col gap-2">
                        <label className="font-display text-xs uppercase tracking-widest text-parish-muted">
                            Cover Image
                        </label>

                        {coverPreview ? (
                            <div className="relative rounded-2xl overflow-hidden border border-parish-border/10">
                                <img
                                    src={coverPreview}
                                    alt="Cover preview"
                                    className="w-full aspect-[16/9] object-cover"
                                />
                                <button
                                    onClick={handleRemoveImage}
                                    className="absolute top-3 right-3 bg-parish-fg/80 text-parish-inverse p-2 rounded-full hover:bg-parish-fg transition-colors"
                                    aria-label="Remove image"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-parish-border/20 bg-parish-elevated/50 p-12 transition-colors hover:border-parish-accent/30 hover:bg-parish-elevated"
                            >
                                <ImageIcon size={32} className="text-parish-muted/40" />
                                <span className="font-display text-xs uppercase tracking-widest text-parish-muted">
                                    Click to upload a cover image
                                </span>
                                <span className="text-xs text-parish-muted/60 font-sans">
                                    JPG, PNG, or WebP · Max 5 MB
                                </span>
                            </button>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleImageSelect}
                            className="hidden"
                        />
                    </div>

                    {/* Title */}
                    <div className="flex flex-col gap-2">
                        <label className="font-display text-xs uppercase tracking-widest text-parish-muted">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="e.g. A Weekend of Fellowship"
                            className="bg-parish-elevated text-parish-fg border border-parish-border/20 rounded-xl px-4 py-3 outline-none focus:border-parish-accent/50 focus:ring-1 focus:ring-parish-accent/50 transition-all font-sans text-lg"
                            required
                        />
                    </div>

                    {/* Body */}
                    <div className="flex flex-col gap-2">
                        <label className="font-display text-xs uppercase tracking-widest text-parish-muted">
                            Article Body <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={body}
                            onChange={e => setBody(e.target.value)}
                            placeholder="Write your article here..."
                            className="bg-parish-elevated text-parish-fg border border-parish-border/20 rounded-xl px-4 py-3 outline-none focus:border-parish-accent/50 focus:ring-1 focus:ring-parish-accent/50 transition-all font-serif text-base leading-relaxed min-h-[300px] resize-y"
                            required
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button
                            onClick={() => handleSubmit(false)}
                            disabled={submitting}
                            className="flex-1 bg-parish-accent text-parish-inverse px-6 py-4 rounded-xl font-display uppercase tracking-wider text-sm hover:opacity-90 transition-all shadow-md active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <Upload size={16} />
                            {submitting ? 'Submitting…' : 'Submit for Review'}
                        </button>

                        {isAdmin && (
                            <button
                                onClick={() => handleSubmit(true)}
                                disabled={submitting}
                                className="flex-1 bg-green-600 text-parish-inverse px-6 py-4 rounded-xl font-display uppercase tracking-wider text-sm hover:opacity-90 transition-all shadow-md active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {submitting ? 'Publishing…' : 'Publish Now'}
                            </button>
                        )}
                    </div>

                    <p className="text-center font-serif text-xs text-parish-muted italic mt-2">
                        {isAdmin
                            ? 'You can publish directly or submit for the standard review process.'
                            : 'Your article will be reviewed by the pastoral team before being published.'
                        }
                    </p>
                </div>
            </main>
        </div>
    );
}
