import { useParishData } from '../context/ParishDataContext';
import { Phone, Mail, RefreshCw } from 'lucide-react';

interface ContentLoadingProps {
    message?: string;
}

/**
 * Structured loading state — replaces generic "Loading…" text
 * with a visually consistent skeleton-style message.
 */
export function ContentLoading({ message = 'Loading parish content…' }: ContentLoadingProps) {
    return (
        <div className="flex min-h-[60vh] items-center justify-center bg-parish-bg">
            <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-parish-border/20 border-t-parish-accent" />
                <p className="mt-4 text-base text-parish-muted">{message}</p>
            </div>
        </div>
    );
}

interface ContentErrorProps {
    title?: string;
    message?: string;
}

/**
 * Structured error state — shows a retry button (using context reload)
 * and fallback contact details so visitors can still reach the parish.
 */
export function ContentError({
    title = 'Something went wrong',
    message = 'We couldn\'t load the parish content. Please try again, or contact the office directly.',
}: ContentErrorProps) {
    const { reload } = useParishData();

    return (
        <div className="flex min-h-[60vh] items-center justify-center bg-parish-bg px-6">
            <div className="max-w-md text-center">
                <h2 className="text-2xl font-display text-parish-fg">{title}</h2>
                <p className="mt-3 text-base leading-relaxed text-parish-muted">{message}</p>

                <button
                    onClick={reload}
                    className="pilgrimage-button-secondary mt-6 mx-auto"
                >
                    <RefreshCw className="h-4 w-4" aria-hidden="true" />
                    Try Again
                </button>

                <div className="mt-8 rounded-[1.5rem] border border-parish-border/10 bg-parish-surface/80 px-5 py-5 text-left">
                    <p className="text-[1rem] font-semibold text-parish-fg">Contact the parish office</p>
                    <div className="mt-3 space-y-2 text-[1rem] text-parish-muted">
                        <a href="tel:(08) 8261 6200" className="flex items-center gap-2 text-parish-fg no-underline hover:text-parish-accent">
                            <Phone className="h-4 w-4 text-parish-brass" aria-hidden="true" />
                            (08) 8261 6200
                        </a>
                        <a href="mailto:admin@gwparish.org.au" className="flex items-center gap-2 text-parish-fg no-underline hover:text-parish-accent">
                            <Mail className="h-4 w-4 text-parish-brass" aria-hidden="true" />
                            admin@gwparish.org.au
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Empty content state — for pages that load successfully but have no
 * content to display (e.g. empty newsletter archives, no events).
 */
export function ContentEmpty({ message = 'Nothing to show right now.' }: { message?: string }) {
    return (
        <div className="flex min-h-[40vh] items-center justify-center bg-parish-bg">
            <p className="text-base text-parish-muted">{message}</p>
        </div>
    );
}
