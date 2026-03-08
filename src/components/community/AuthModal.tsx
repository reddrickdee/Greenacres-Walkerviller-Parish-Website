import { useState, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useOverlay } from '../../hooks/useOverlay';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    /** Ref to the button/element that triggered the modal so focus returns on close. */
    triggerRef?: React.RefObject<HTMLElement | null>;
}

export function AuthModal({ isOpen, onClose, triggerRef }: AuthModalProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Form inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const internalTriggerRef = useRef<HTMLElement | null>(null);

    const handleClose = () => {
        // Reset state on close
        setErrorMsg('');
        setSuccessMsg('');
        setEmail('');
        setPassword('');
        setFirstName('');
        setLastName('');
        setIsLogin(true);
        onClose();
    };

    const { overlayRef } = useOverlay({
        isOpen,
        onClose: handleClose,
        triggerRef: triggerRef ?? internalTriggerRef,
    });

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                handleClose(); // Successfully logged in, close modal
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            first_name: firstName,
                            last_name: lastName,
                        },
                        // In production with email verification, set emailRedirectTo to the community hub URI
                        emailRedirectTo: `${window.location.origin}/community`
                    }
                });

                if (error) throw error;

                setSuccessMsg('Registration successful! Please check your email to verify your account.');
                setEmail('');
                setPassword('');
                setIsLogin(true);
            }
        } catch (error: any) {
            setErrorMsg(error.message || 'An error occurred during authentication.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-modal flex items-center justify-center p-4"
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={isLogin ? 'Sign in' : 'Create account'}
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleClose}
                className="absolute inset-0 bg-parish-surface/80 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md bg-parish-elevated rounded-3xl p-8 md:p-10 shadow-xl border border-parish-border/20 z-10"
            >
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 text-parish-muted hover:text-parish-fg hover:bg-parish-border/10 rounded-full transition-colors"
                    aria-label="Close"
                >
                    <X size={20} />
                </button>

                <div className="text-center mb-8">
                    <h2 className="font-display text-2xl font-semibold tracking-wider text-parish-accent mb-2">
                        {isLogin ? 'Welcome Back' : 'Join Our Community'}
                    </h2>
                    <p className="font-serif text-parish-muted italic text-sm">
                        {isLogin
                            ? 'Sign in to share and pray with the parish family.'
                            : 'Create an account to participate in our digital hub.'}
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {errorMsg && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl p-3 text-sm mb-6 font-medium"
                            role="alert"
                        >
                            {errorMsg}
                        </motion.div>
                    )}
                    {successMsg && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-green-500/10 text-green-600 border border-green-500/20 rounded-xl p-3 text-sm mb-6 font-medium"
                            role="status"
                        >
                            {successMsg}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleAuth} className="flex flex-col gap-4">
                    {!isLogin && (
                        <div className="flex gap-4">
                            <div className="flex-1 flex flex-col gap-1.5">
                                <label htmlFor="auth-first-name" className="font-display text-[10px] uppercase tracking-widest text-parish-muted">First Name</label>
                                <input
                                    id="auth-first-name"
                                    type="text"
                                    required={!isLogin}
                                    value={firstName}
                                    onChange={e => setFirstName(e.target.value)}
                                    className="bg-parish-surface text-parish-fg border border-parish-border/20 rounded-xl px-4 py-3 outline-none focus:border-parish-accent/50 focus:ring-1 focus:ring-parish-accent/50 transition-all font-sans text-sm"
                                    placeholder="John"
                                />
                            </div>
                            <div className="flex-1 flex flex-col gap-1.5">
                                <label htmlFor="auth-last-name" className="font-display text-[10px] uppercase tracking-widest text-parish-muted">Last Name</label>
                                <input
                                    id="auth-last-name"
                                    type="text"
                                    required={!isLogin}
                                    value={lastName}
                                    onChange={e => setLastName(e.target.value)}
                                    className="bg-parish-surface text-parish-fg border border-parish-border/20 rounded-xl px-4 py-3 outline-none focus:border-parish-accent/50 focus:ring-1 focus:ring-parish-accent/50 transition-all font-sans text-sm"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="auth-email" className="font-display text-[10px] uppercase tracking-widest text-parish-muted">Email Address</label>
                        <input
                            id="auth-email"
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="bg-parish-surface text-parish-fg border border-parish-border/20 rounded-xl px-4 py-3 outline-none focus:border-parish-accent/50 focus:ring-1 focus:ring-parish-accent/50 transition-all font-sans text-sm"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="auth-password" className="font-display text-[10px] uppercase tracking-widest text-parish-muted">Password</label>
                        <input
                            id="auth-password"
                            type="password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="bg-parish-surface text-parish-fg border border-parish-border/20 rounded-xl px-4 py-3 outline-none focus:border-parish-accent/50 focus:ring-1 focus:ring-parish-accent/50 transition-all font-sans text-sm"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 bg-parish-accent text-parish-inverse px-6 py-3.5 rounded-xl font-display uppercase tracking-wider text-sm hover:opacity-90 transition-all shadow-md active:scale-[0.98] disabled:opacity-50 flex justify-center"
                    >
                        {loading ? (
                            <span className="animate-pulse">Processing...</span>
                        ) : (
                            isLogin ? 'Sign In' : 'Create Account'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center pt-5 border-t border-parish-border/10">
                    <p className="font-sans text-sm text-parish-muted">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setErrorMsg('');
                                setSuccessMsg('');
                            }}
                            className="text-parish-accent font-medium hover:underline focus:outline-none"
                        >
                            {isLogin ? 'Register here' : 'Sign in here'}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
