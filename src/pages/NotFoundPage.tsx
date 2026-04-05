import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, CalendarClock, ArrowRight } from 'lucide-react';
import { usePageSEO } from '../hooks/usePageSEO';

export function NotFoundPage() {
    usePageSEO({
        title: 'Page Not Found',
        description: 'The page you were looking for could not be found. Return to the homepage or view Mass times.',
        path: '/404',
        noindex: true,
    });

    return (
        <div className="page-shell">
            <section className="page-section">
                <div className="page-section-inner">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="mx-auto max-w-2xl text-center"
                    >
                        <span className="section-label justify-center mb-6">Page Not Found</span>

                        <h1 className="text-[clamp(3rem,6vw,5.5rem)] leading-[0.95] text-parish-fg">
                            We couldn&apos;t find <br />
                            <span className="text-parish-brass">that page.</span>
                        </h1>

                        <p className="mt-6 text-lg leading-relaxed text-parish-muted md:text-xl">
                            The page you were looking for may have been moved or no longer exists.
                            Here are a few places you can go instead.
                        </p>

                        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                            <Link to="/" className="pilgrimage-button inline-flex items-center gap-2">
                                <Home className="h-4 w-4" />
                                Back to Home
                            </Link>
                            <Link to="/mass-times" className="pilgrimage-button-secondary inline-flex items-center gap-2">
                                <CalendarClock className="h-4 w-4" />
                                View Mass Times
                            </Link>
                        </div>

                        <div className="mt-12 sanctuary-card mx-auto max-w-md p-6">
                            <div className="ornamental-kicker">Looking for something?</div>
                            <p className="mt-3 text-sm leading-relaxed text-parish-muted">
                                If you followed a link to get here, the page may have moved.
                                Try the links below or contact the parish office.
                            </p>
                            <div className="mt-5 space-y-2">
                                <Link
                                    to="/new-here"
                                    className="flex items-center justify-between rounded-[1.2rem] bg-parish-border/5 px-4 py-3 text-sm font-semibold text-parish-fg no-underline transition hover:bg-parish-border/10"
                                >
                                    I&apos;m New Here <ArrowRight className="h-4 w-4 opacity-60" />
                                </Link>
                                <Link
                                    to="/contact"
                                    className="flex items-center justify-between rounded-[1.2rem] bg-parish-border/5 px-4 py-3 text-sm font-semibold text-parish-fg no-underline transition hover:bg-parish-border/10"
                                >
                                    Contact the Parish <ArrowRight className="h-4 w-4 opacity-60" />
                                </Link>
                                <Link
                                    to="/news-events"
                                    className="flex items-center justify-between rounded-[1.2rem] bg-parish-border/5 px-4 py-3 text-sm font-semibold text-parish-fg no-underline transition hover:bg-parish-border/10"
                                >
                                    News &amp; Events <ArrowRight className="h-4 w-4 opacity-60" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
