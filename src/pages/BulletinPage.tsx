import { useParams, Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useParishData } from '../context/ParishDataContext';
import { usePageSEO } from '../hooks/usePageSEO';
import { ActionBand, StoryPageTemplate } from '../components/layout/PageTemplates';
import { ContentLoading, ContentError } from '../components/ContentStates';

export function BulletinPage() {
    const { id } = useParams<{ id: string }>();
    const { newsletters, isLoading } = useParishData();
    const prefersReducedMotion = useReducedMotion();

    usePageSEO({
        title: 'Parish Bulletin',
        description: 'Read the latest Connections newsletter from Greenacres Walkerville Catholic Parish.',
        path: `/news-events/bulletin/${id}`,
    });

    if (isLoading) return <ContentLoading />;
    if (!newsletters) return <ContentError />;

    const item = newsletters.items.find(i => i.id === id);

    if (!item || !item.nativeBulletin) {
        return (
            <div className="page-shell">
                <section className="page-section">
                    <div className="page-section-inner text-center">
                        <h1 className="text-5xl text-parish-fg">Bulletin Not Found</h1>
                        <p className="mt-6 text-xl text-parish-muted">This bulletin does not have a native digital edition.</p>
                        <Link to="/news-events" className="pilgrimage-button-secondary mt-8 inline-flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                            Back to News & Events
                        </Link>
                    </div>
                </section>
            </div>
        );
    }

    const bulletin = item.nativeBulletin;

    return (
        <StoryPageTemplate
            eyebrow="Connections Newsletter"
            title={<>{item.title}</>}
            description={bulletin.date}
            imageSrc="/assets/source/news_connections.webp"
            imageAlt="Connections newsletter"
            actions={(
                <>
                    <Link to="/news-events" className="pilgrimage-button-secondary inline-flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                        All News & Events
                    </Link>
                </>
            )}
        >
            {/* Priest's Reflection */}
            <section className="page-section">
                <div className="page-section-inner max-w-3xl">
                    <motion.div
                        initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.78, ease: [0.32, 0.72, 0, 1] }}
                    >
                        <div className="ornamental-kicker">Priest&apos;s Reflection</div>
                        {/* Reflection_Prose — parish-authored. The .reflection-prose class
                            scopes the ::first-letter drop cap to the FIRST paragraph only
                            (parish-accent + font-display). Liturgical text is never rendered here. */}
                        <div className="reflection-prose mt-6">
                            {bulletin.priestReflection.split('\n\n').map((para, i) => (
                                <p key={i} className="mb-6 font-body text-lg leading-relaxed text-parish-muted md:text-xl">
                                    {para}
                                </p>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Bulletin Sections */}
            {bulletin.sections.map((section, i) => (
                <section key={i} className="page-section mt-10 md:mt-14">
                    <div className="page-section-inner max-w-3xl">
                        <motion.div
                            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.68, delay: i * 0.06, ease: [0.32, 0.72, 0, 1] }}
                            className="border-t border-parish-border/5 pt-10"
                        >
                            <div className="ornamental-kicker">{section.title}</div>
                            {section.imageAsset && (
                                <div className="image-panel mt-5 overflow-hidden">
                                    <img
                                        src={`/${section.imageAsset}`}
                                        alt={section.title}
                                        className="w-full object-cover"
                                    />
                                </div>
                            )}
                            <p className="mt-5 text-lg leading-relaxed text-parish-muted md:text-xl">{section.content}</p>
                        </motion.div>
                    </div>
                </section>
            ))}

            <section className="page-section mt-16 md:mt-20">
                <div className="page-section-inner max-w-3xl">
                    <ActionBand>
                        <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
                            <div className="lg:col-span-8">
                                <span className="section-label mb-4">Stay In The Loop</span>
                                <h2 className="text-[clamp(2.2rem,4vw,3.9rem)] text-parish-fg">
                                    Browse more bulletins or see what is coming up this week.
                                </h2>
                            </div>
                            <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
                                <Link to="/news-events" className="pilgrimage-button">
                                    All News & Events
                                </Link>
                                <Link to="/mass-times" className="pilgrimage-button-secondary">
                                    Mass Times
                                </Link>
                            </div>
                        </div>
                    </ActionBand>
                </div>
            </section>
        </StoryPageTemplate>
    );
}
