import { useState } from 'react';
import { Sparkles, X, ArrowRight } from 'lucide-react';

const STORAGE_KEY = 'synod-banner-dismissed';
/** Banner auto-hides after this date (2026 Diocesan Synod second session, 27 Jun 2026). */
const EXPIRES = new Date('2026-06-30T23:59:59+09:30');

export function SynodBanner() {
    const [dismissed, setDismissed] = useState(
        () => typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEY) === '1',
    );

    if (dismissed || Date.now() > EXPIRES.getTime()) return null;

    const dismiss = () => {
        try {
            localStorage.setItem(STORAGE_KEY, '1');
        } catch {
            /* ignore storage failures */
        }
        setDismissed(true);
    };

    return (
        <div className="page-section">
            <div className="page-section-inner">
                <div className="scripture-panel !py-7 md:!py-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-start gap-4">
                            <Sparkles className="mt-1 h-6 w-6 shrink-0 text-white/80" aria-hidden="true" />
                            <div>
                                <div className="ornamental-kicker !text-white/80">2026 Diocesan Synod</div>
                                <h2 className="mt-1 font-display text-2xl text-white md:text-3xl">
                                    Becoming a Synodal Church on Mission
                                </h2>
                                <p className="mt-2 max-w-2xl text-[1rem] leading-relaxed text-white/85">
                                    Our parish journeys with the Archdiocese as it discerns its future. Fr Dean Marin chairs the Synod Preparatory Commission.
                                </p>
                            </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-2 md:flex-col md:items-end">
                            <a
                                href="https://www.togetherontheway.au"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-body text-[var(--type-button)] font-bold uppercase tracking-[0.18em] text-parish-accent no-underline"
                            >
                                Learn More <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </a>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={dismiss}
                        aria-label="Dismiss Synod banner"
                        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                    >
                        <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </div>
    );
}
