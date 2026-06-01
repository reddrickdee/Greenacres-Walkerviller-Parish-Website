import { useState, useEffect, useCallback, useRef } from 'react';
import { Settings, Check, ZoomIn, ZoomOut, Eye } from 'lucide-react';
import { useOverlay } from '../hooks/useOverlay';

type FontSize = 'normal' | 'large' | 'xlarge';

const FONT_SIZE_SCALE: Record<FontSize, string> = {
    normal: '100%',
    large: '112.5%',
    xlarge: '125%',
};

function applyFontSize(size: FontSize) {
    document.documentElement.style.fontSize = FONT_SIZE_SCALE[size];
    localStorage.setItem('font-size', size);
}

function applyReducedMotion(enabled: boolean) {
    if (enabled) {
        document.documentElement.classList.add('reduce-motion');
    } else {
        document.documentElement.classList.remove('reduce-motion');
    }
    localStorage.setItem('reduce-motion', enabled.toString());
}

export function AccessibilityMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [isDyslexic, setIsDyslexic] = useState(false);
    const [fontSize, setFontSize] = useState<FontSize>('normal');
    const [reduceMotion, setReduceMotion] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);

    // ── useOverlay for focus trapping, Escape, and scroll lock ──────────────
    const closeMenu = useCallback(() => setIsOpen(false), []);
    const { overlayRef } = useOverlay({
        isOpen,
        onClose: closeMenu,
        triggerRef,
    });

    // ── Restore saved preferences ────────────────────────────────────────────
    useEffect(() => {
        const savedDyslexic = localStorage.getItem('dyslexic-font') === 'true';
        const savedSize = (localStorage.getItem('font-size') as FontSize) ?? 'normal';
        const savedMotion = localStorage.getItem('reduce-motion') === 'true';

        if (savedDyslexic) {
            setIsDyslexic(true);
            document.documentElement.classList.add('font-dyslexic');
        }
        if (savedSize !== 'normal') {
            setFontSize(savedSize);
            applyFontSize(savedSize);
        }
        if (savedMotion) {
            setReduceMotion(true);
            applyReducedMotion(true);
        }
    }, []);

    // ── Toggles ──────────────────────────────────────────────────────────────
    const toggleDyslexic = useCallback(() => {
        const newValue = !isDyslexic;
        setIsDyslexic(newValue);
        localStorage.setItem('dyslexic-font', newValue.toString());
        document.documentElement.classList.toggle('font-dyslexic', newValue);
    }, [isDyslexic]);

    const cycleFontSize = useCallback((direction: 'up' | 'down') => {
        const sizes: FontSize[] = ['normal', 'large', 'xlarge'];
        const idx = sizes.indexOf(fontSize);
        const next = direction === 'up'
            ? Math.min(idx + 1, sizes.length - 1)
            : Math.max(idx - 1, 0);
        const newSize = sizes[next];
        setFontSize(newSize);
        applyFontSize(newSize);
    }, [fontSize]);

    const toggleReduceMotion = useCallback(() => {
        const newValue = !reduceMotion;
        setReduceMotion(newValue);
        applyReducedMotion(newValue);
    }, [reduceMotion]);

    const resetAll = useCallback(() => {
        setIsDyslexic(false);
        setFontSize('normal');
        setReduceMotion(false);
        document.documentElement.classList.remove('font-dyslexic', 'reduce-motion');
        document.documentElement.style.fontSize = '';
        localStorage.removeItem('dyslexic-font');
        localStorage.removeItem('font-size');
        localStorage.removeItem('reduce-motion');
    }, []);

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <div className="relative">
            <button
                ref={triggerRef}
                id="accessibility-menu-btn"
                onClick={() => setIsOpen(!isOpen)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-lg text-parish-muted hover:text-parish-fg hover:bg-parish-border/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-parish-accent"
                aria-label="Accessibility Settings"
                aria-expanded={isOpen}
                aria-haspopup="dialog"
                title="Accessibility Settings"
            >
                <Settings size={20} aria-hidden="true" />
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        aria-hidden="true"
                        onClick={closeMenu}
                    />

                    {/* Panel — focus-trapped via useOverlay */}
                    <div
                        ref={overlayRef}
                        role="dialog"
                        aria-label="Accessibility settings"
                        aria-modal="true"
                        className="absolute right-0 mt-2 w-64 bg-parish-surface border border-parish-border/10 rounded-xl shadow-xl z-50 overflow-hidden"
                    >
                        <div className="px-4 py-3 border-b border-parish-border/5 flex items-center justify-between">
                            <h2 className="font-display tracking-widest text-[0.8125rem] uppercase text-parish-accent">
                                Accessibility
                            </h2>
                            <span className="text-parish-muted text-[0.8125rem] font-serif">{fontSize !== 'normal' || isDyslexic || reduceMotion ? '● Active' : ''}</span>
                        </div>

                        <div className="p-2 flex flex-col gap-1">
                            {/* Font size */}
                            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg">
                                <span className="text-[1rem] font-body text-parish-fg">Text size</span>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => cycleFontSize('down')}
                                        disabled={fontSize === 'normal'}
                                        aria-label="Decrease text size"
                                        className="min-h-[44px] min-w-[44px] flex items-center justify-center p-1.5 rounded-md hover:bg-parish-border/5 disabled:opacity-30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-parish-accent"
                                    >
                                        <ZoomOut size={16} aria-hidden="true" />
                                    </button>
                                    <span className="text-[0.8125rem] text-parish-muted w-8 text-center font-display">
                                        {fontSize === 'normal' ? '100%' : fontSize === 'large' ? '112%' : '125%'}
                                    </span>
                                    <button
                                        onClick={() => cycleFontSize('up')}
                                        disabled={fontSize === 'xlarge'}
                                        aria-label="Increase text size"
                                        className="min-h-[44px] min-w-[44px] flex items-center justify-center p-1.5 rounded-md hover:bg-parish-border/5 disabled:opacity-30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-parish-accent"
                                    >
                                        <ZoomIn size={16} aria-hidden="true" />
                                    </button>
                                </div>
                            </div>

                            {/* Dyslexia font */}
                            <button
                                onClick={toggleDyslexic}
                                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-parish-border/5 transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-parish-accent"
                                aria-pressed={isDyslexic}
                            >
                                <span className="text-[1rem] font-body text-parish-fg">Dyslexia-friendly font</span>
                                {isDyslexic && <Check size={16} className="text-parish-accent flex-shrink-0" aria-hidden="true" />}
                            </button>

                            {/* Reduce motion */}
                            <button
                                onClick={toggleReduceMotion}
                                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-parish-border/5 transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-parish-accent"
                                aria-pressed={reduceMotion}
                            >
                                <span className="text-[1rem] font-body text-parish-fg flex items-center gap-2">
                                    <Eye size={14} aria-hidden="true" />
                                    Reduce motion
                                </span>
                                {reduceMotion && <Check size={16} className="text-parish-accent flex-shrink-0" aria-hidden="true" />}
                            </button>



                            {/* Reset */}
                            {(isDyslexic || fontSize !== 'normal' || reduceMotion) && (
                                <button
                                    onClick={resetAll}
                                    className="w-full text-center px-3 py-2 text-[0.8125rem] text-parish-muted hover:text-parish-accent font-display tracking-widest uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-parish-accent rounded-lg"
                                >
                                    Reset all
                                </button>
                            )}
                        </div>

                        <p className="px-4 pb-3 text-parish-muted font-serif text-[0.8125rem] text-center leading-relaxed">
                            Settings saved to your browser.
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}
