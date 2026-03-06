import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarRange } from 'lucide-react';
import { useParishData } from '../context/ParishDataContext';
import { usePageSEO } from '../hooks/usePageSEO';
import { ActionBand, SectionIntro, HighlightPageTemplate } from '../components/layout/PageTemplates';

function normalizeAssetPath(path?: string) {
    if (!path) return '/assets/source/news_connections.webp';
    return `/${path.replace('assets/images/', 'assets/')}`;
}

export function NewsEventsPage() {
    const { content, newsletters, isLoading } = useParishData();

    usePageSEO({
        title: 'News & Events',
        description: 'Stay connected with parish bulletins, the newsletter archive, and upcoming events at Greenacres Walkerville Catholic Parish.',
        path: '/news-events',
        ogImage: '/assets/source/news_connections.webp',
    });

    if (isLoading || !content || !newsletters) {
        return <div className="flex h-screen items-center justify-center bg-parish-bg text-lg text-parish-fg">Loading…</div>;
    }

    return (
        <HighlightPageTemplate
            eyebrow="Parish Rhythm"
            title={<>News, bulletins, and upcoming events should feel active, not archival.</>}
            description="This page moves from generic link listing to a more current, editorial view of parish life while preserving the bulletin archive and event detail."
            imageSrc="/assets/source/news_connections.webp"
            imageAlt="Parish newsletter and updates"
            actions={(
                <>
                    <Link to="/community" className="pilgrimage-button">
                        Visit Community Hub
                    </Link>
                    <Link to="/contact" className="pilgrimage-button-secondary">
                        Contact The Parish
                    </Link>
                </>
            )}
            aside={(
                <div className="rounded-[1.5rem] border border-parish-brass/20 bg-parish-border/5 px-5 py-5">
                    <div className="ornamental-kicker">Current Rhythm</div>
                    <p className="mt-3 text-sm leading-relaxed text-parish-muted">
                        Upcoming events are paired with bulletins and newsletters so visitors can quickly understand what parish life looks like right now.
                    </p>
                </div>
            )}
        >
            <section className="page-section">
                <div className="page-section-inner">
                    <SectionIntro
                        eyebrow="Featured Resources"
                        title={<>Key resources should be visual and immediately understandable.</>}
                        description="The main bulletin resources are surfaced as editorial cards with their associated imagery."
                    />

                    <div className="mt-10 grid gap-6 lg:grid-cols-2">
                        {content.newsItems.map((item, index) => (
                            <motion.a
                                key={item.title}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 22 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-70px' }}
                                transition={{ duration: 0.68, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                                className="sanctuary-card p-0 no-underline"
                            >
                                <div className="image-panel min-h-[250px] rounded-none border-x-0 border-t-0 border-b border-parish-border/10">
                                    <img
                                        src={normalizeAssetPath(item.imageAsset)}
                                        alt={item.title}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="px-6 py-7">
                                    <div className="ornamental-kicker">Featured Resource</div>
                                    <h3 className="mt-3 text-3xl text-parish-fg">{item.title}</h3>
                                    <p className="mt-4 text-sm leading-relaxed text-parish-muted md:text-base">{item.summary}</p>
                                    <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-parish-accent">
                                        Open resource
                                        <ArrowRight className="h-4 w-4" />
                                    </span>
                                </div>
                            </motion.a>
                        ))}
                    </div>
                </div>
            </section>

            <section className="page-section mt-16 md:mt-20">
                <div className="page-section-inner grid gap-8 lg:grid-cols-12 lg:gap-10">
                    <div className="lg:col-span-8">
                        <SectionIntro
                            eyebrow="Upcoming Events"
                            title={<>Upcoming parish moments, arranged as a readable timeline.</>}
                            description="Events are treated as the living front edge of parish life rather than secondary metadata."
                        />
                        <div className="mt-10 space-y-5">
                            {content.eventItems.map((item, index) => (
                                <motion.div
                                    key={`${item.title}-${item.dateLabel}`}
                                    initial={{ opacity: 0, x: -16 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: '-70px' }}
                                    transition={{ duration: 0.6, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                                    className="sanctuary-card flex flex-col gap-4 md:flex-row md:items-start"
                                >
                                    <div className="flex min-w-[144px] items-center justify-center rounded-[1.3rem] border border-parish-brass/20 bg-parish-elevated/70 px-4 py-4 text-center">
                                        <div>
                                            <div className="ornamental-kicker">{item.dateLabel}</div>
                                            <CalendarRange className="mx-auto mt-3 h-5 w-5 text-parish-brass" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl text-parish-fg">{item.title}</h3>
                                        <p className="mt-3 text-sm leading-relaxed text-parish-muted md:text-base">{item.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-4">
                        <div className="sanctuary-panel sticky top-32 px-6 py-7">
                            <div className="ornamental-kicker">Newsletter Archive</div>
                            <h3 className="mt-3 text-3xl text-parish-fg">Connections</h3>
                            <p className="mt-4 text-sm leading-relaxed text-parish-muted">
                                Past and current newsletter issues remain available here, with the current issue called out first.
                            </p>
                            <div className="mt-6 max-h-[560px] space-y-3 overflow-y-auto pr-2">
                                {newsletters.items.map(item => (
                                    <div key={item.id} className="rounded-[1.25rem] border border-parish-border/10 bg-parish-border/5 px-4 py-4">
                                        {item.isCurrent && (
                                            <div className="ornamental-kicker">Current Issue</div>
                                        )}
                                        {item.nativeBulletin ? (
                                            <Link to={`/news-events/bulletin/${item.id}`} className="mt-2 block text-sm font-semibold uppercase tracking-[0.14em] text-parish-fg no-underline hover:text-parish-accent">
                                                {item.title}
                                            </Link>
                                        ) : (
                                            <a
                                                href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-2 block text-sm font-semibold uppercase tracking-[0.14em] text-parish-fg no-underline hover:text-parish-accent"
                                            >
                                                {item.title}
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="page-section mt-16 md:mt-20">
                <div className="page-section-inner">
                    <ActionBand>
                        <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
                            <div className="lg:col-span-8">
                                <span className="section-label mb-4">Stay Connected</span>
                                <h2 className="text-[clamp(2.2rem,4vw,3.9rem)] text-parish-fg">
                                    The simplest way to stay in step with parish life is to follow these updates regularly.
                                </h2>
                            </div>
                            <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
                                <Link to="/community" className="pilgrimage-button">
                                    Open Community Hub
                                </Link>
                                <Link to="/contact" className="pilgrimage-button-secondary">
                                    Contact The Parish
                                </Link>
                            </div>
                        </div>
                    </ActionBand>
                </div>
            </section>
        </HighlightPageTemplate>
    );
}
