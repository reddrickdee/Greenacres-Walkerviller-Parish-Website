import { useState } from 'react';
import { motion } from 'framer-motion';
import { communityApi } from '../../lib/communityApi';
import { useAuth } from '../../context/AuthContext';

interface PrayButtonProps {
    postId: string;
    initialCount: number;
    initialHasPrayed: boolean;
    onRequireAuth: () => void;
}

export function PrayButton({ postId, initialCount, initialHasPrayed, onRequireAuth }: PrayButtonProps) {
    const { session } = useAuth();
    const [hasPrayed, setHasPrayed] = useState(initialHasPrayed);
    const [count, setCount] = useState(initialCount);
    const [isPending, setIsPending] = useState(false);

    const handleToggle = async () => {
        if (!session) {
            onRequireAuth();
            return;
        }

        if (isPending) return;

        // Optimistic update
        const previousHasPrayed = hasPrayed;
        const previousCount = count;

        setHasPrayed(!previousHasPrayed);
        setCount(prev => previousHasPrayed ? prev - 1 : prev + 1);
        setIsPending(true);

        try {
            await communityApi.togglePrayer(postId);
        } catch (error) {
            console.error('Failed to toggle prayer:', error);
            // Revert on failure
            setHasPrayed(previousHasPrayed);
            setCount(previousCount);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isPending}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-display uppercase tracking-widest transition-all
                ${hasPrayed
                    ? 'bg-parish-accent/10 text-parish-accent border border-parish-accent/20'
                    : 'bg-parish-surface-alt text-parish-muted hover:text-parish-fg hover:bg-parish-border/5 border border-transparent'
                }
                ${isPending ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}
            `}
            aria-label={hasPrayed ? "Remove prayer" : "Pray for this"}
        >
            <motion.div
                animate={hasPrayed ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill={hasPrayed ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-flame"
                >
                    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                </svg>
            </motion.div>
            <span>{count > 0 ? count : 'Pray'}</span>
        </button>
    );
}
