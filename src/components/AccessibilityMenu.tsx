import { useState, useEffect } from 'react';
import { Settings, Check } from 'lucide-react';

export function AccessibilityMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [isDyslexic, setIsDyslexic] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('dyslexic-font');
        if (saved === 'true') {
            setIsDyslexic(true);
            document.documentElement.classList.add('font-dyslexic');
        }
    }, []);

    const toggleDyslexic = () => {
        const newValue = !isDyslexic;
        setIsDyslexic(newValue);
        localStorage.setItem('dyslexic-font', newValue.toString());
        if (newValue) {
            document.documentElement.classList.add('font-dyslexic');
        } else {
            document.documentElement.classList.remove('font-dyslexic');
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-parish-muted hover:text-parish-fg hover:bg-parish-border/5 transition-colors"
                aria-label="Accessibility Settings"
                title="Accessibility Settings"
            >
                <Settings size={20} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-parish-surface border border-parish-border/10 rounded-xl shadow-lg z-50 overflow-hidden transform origin-top-right transition-all">
                        <div className="px-4 py-3 border-b border-parish-border/5">
                            <h3 className="font-display tracking-widest text-xs uppercase text-parish-accent">Accessibility</h3>
                        </div>
                        <div className="p-2">
                            <button
                                onClick={toggleDyslexic}
                                className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-parish-border/5 transition-colors text-left"
                            >
                                <span className={`text-sm ${isDyslexic ? 'font-dyslexic line-height-tight' : 'font-body'}`}>
                                    Dyslexia-friendly font
                                </span>
                                {isDyslexic && <Check size={16} className="text-parish-accent flex-shrink-0" />}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
