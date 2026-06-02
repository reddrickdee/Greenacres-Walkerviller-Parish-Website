import { type RefObject } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';
import { AccessibilityMenu } from '../AccessibilityMenu';
import { useOverlay } from '../../hooks/useOverlay';
import { DRAWER_GROUPS, QUICK_ACTIONS, isActive } from '../../lib/navigation';

interface MobileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    triggerRef: RefObject<HTMLButtonElement>;
}

export function MobileDrawer({ isOpen, onClose, triggerRef }: MobileDrawerProps) {
    const location = useLocation();

    const { overlayRef: drawerOverlayRef } = useOverlay({
        isOpen,
        onClose,
        triggerRef,
        skipScrollLock: true,
    });

    return (
        /* Mobile drawer */
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                    className="fixed inset-0 top-0 z-[-1] bg-parish-surface/98 backdrop-blur-xl lg:hidden"
                    id="mobile-drawer"
                    ref={drawerOverlayRef}
                    role="dialog"
                    aria-label="Site navigation menu"
                    aria-modal="true"
                >
                    <div className="flex h-full flex-col overflow-y-auto px-6 pb-8 pt-32 md:px-10">
                        <div className="mx-auto grid w-full max-w-[900px] gap-10 md:grid-cols-12">
                            <div className="md:col-span-7 grid gap-10 md:grid-cols-2">
                                {DRAWER_GROUPS.map((group, groupIdx) => (
                                    <div key={group.title}>
                                        <div className="ornamental-kicker mb-5">{group.title}</div>
                                        <div className="space-y-2">
                                            {group.links.map((link, linkIdx) => (
                                                <motion.div
                                                    key={link.to}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{
                                                        duration: 0.5,
                                                        delay: groupIdx * 0.1 + linkIdx * 0.06,
                                                        ease: [0.32, 0.72, 0, 1],
                                                    }}
                                                >
                                                    <Link
                                                        to={link.to}
                                                        onClick={onClose}
                                                        className={`flex items-center justify-between rounded-xl px-4 py-3 no-underline transition-all duration-300 active:scale-[0.98] ${isActive(location.pathname, link.to)
                                                            ? 'bg-parish-accent/10 text-parish-accent'
                                                            : 'text-parish-fg hover:bg-parish-elevated/50 hover:text-parish-accent'
                                                        }`}
                                                    >
                                                        <span className="text-[1rem] font-semibold">{link.label}</span>
                                                        <ArrowRight className="h-4 w-4 opacity-40" aria-hidden="true" />
                                                    </Link>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3, ease: [0.32, 0.72, 0, 1] }}
                                className="md:col-span-5 rounded-2xl border border-parish-border/15 bg-parish-elevated/50 p-6"
                            >
                                <div className="ornamental-kicker mb-5">Quick Actions</div>
                                <div className="space-y-3">
                                    {QUICK_ACTIONS.map(action => {
                                        const Icon = action.icon;
                                        return (
                                            <Link
                                                key={action.title}
                                                to={action.to}
                                                onClick={onClose}
                                                className="flex items-start gap-3 rounded-xl px-4 py-4 no-underline transition-all duration-300 hover:bg-parish-accent/5 active:scale-[0.98]"
                                            >
                                                <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-parish-accent/10 text-parish-accent">
                                                    <Icon className="h-5 w-5" aria-hidden="true" />
                                                </div>
                                                <div>
                                                    <div className="text-[1rem] font-semibold text-parish-fg">{action.title}</div>
                                                    <div className="mt-1 text-[1rem] leading-relaxed text-parish-muted">{action.detail}</div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        </div>

                        {/* Mobile accessibility controls */}
                        <div className="mt-8 flex items-center justify-center gap-3 md:hidden">
                            <AccessibilityMenu />
                            <ThemeToggle />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
