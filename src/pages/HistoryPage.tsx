import { motion, useReducedMotion } from 'framer-motion';
import { useParishData } from '../context/ParishDataContext';
import { usePageSEO } from '../hooks/usePageSEO';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ActionBand, SectionIntro, StoryPageTemplate } from '../components/layout/PageTemplates';
import { ContentLoading, ContentError } from '../components/ContentStates';

export function HistoryPage() {
    const { content, isLoading } = useParishData();
    const prefersReduced = useReducedMotion();

    usePageSEO({
        title: 'Parish History',
        description: 'Over a century of Catholic faith in Adelaide — from a Druids Hall in 1912 to today\'s thriving two-church parish at Greenacres and Walkerville.',
        path: '/history',
    });

    if (isLoading) return <ContentLoading />;
    if (!content) return <ContentError />;

    return (
        <StoryPageTemplate
            eyebrow="Parish History"
            title={<>A century of faith, shaped by generations of welcome.</>}
            description="From humble beginnings in a Druids Hall to a thriving two-church parish, the story of Greenacres Walkerville spans over a century of devotion, community, and renewal."
            imageSrc="/assets/source/our_parish.webp"
            imageAlt="Historic view of Greenacres Walkerville Parish"
            actions={(
                <>
                    <Link to="/about" className="pilgrimage-button">
                        About The Parish
                    </Link>
                    <Link to="/gallery" className="pilgrimage-button-secondary">
                        View Gallery
                    </Link>
                </>
            )}
        >
            <section className="page-section">
                <div className="page-section-inner">
                    <SectionIntro
                        eyebrow="Timeline"
                        title={<>Key moments in the life of this parish.</>}
                        description="Each milestone marks a moment when the community grew, built, or renewed its commitment to faith in this corner of Adelaide."
                    />

                    <div className="relative mt-10 ml-4 border-l-2 border-parish-brass/30 md:ml-8">
                        {content.historyMilestones.map((item, index) => (
                            <motion.div
                                key={item.year + index}
                                initial={prefersReduced ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: '-60px' }}
                                transition={prefersReduced
                                    ? { duration: 0 }
                                    : { duration: 0.7, delay: Math.min(index * 0.05, 0.4), ease: [0.32, 0.72, 0, 1] }}
                                className="relative mb-10"
                            >
                                {/* Inner wrapper owns the decorative hover lift so its CSS transform
                                    never fights Framer Motion's inline reveal transform on the parent.
                                    The pl-10/md:pl-14 padding moves here to preserve the brass dot's
                                    exact geometry. The CSS transition collapses to ~0 under the global
                                    prefers-reduced-motion rule in index.css. */}
                                <div className="relative pl-10 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 md:pl-14">
                                    <div className="absolute -left-[9px] top-2 h-4 w-4 rounded-full bg-parish-brass ring-4 ring-parish-bg" />
                                    <h3 className="font-display text-2xl font-bold leading-tight text-parish-accent md:text-3xl">{item.year}</h3>
                                    <p className="mt-3 font-body text-lg leading-relaxed text-parish-muted md:text-xl">{item.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="page-section mt-16 md:mt-20">
                <div className="page-section-inner">
                    <ActionBand>
                        <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
                            <div className="lg:col-span-8">
                                <span className="section-label mb-4">Continue The Story</span>
                                <h2 className="text-[clamp(2.2rem,4vw,4rem)] text-parish-fg">
                                    The parish story is still being written. Come and be part of it.
                                </h2>
                            </div>
                            <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
                                <Link to="/new-here" className="pilgrimage-button">
                                    Plan A First Visit
                                </Link>
                                <Link to="/about" className="pilgrimage-button-secondary inline-flex items-center">
                                    Meet The Parish
                                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                </Link>
                            </div>
                        </div>
                    </ActionBand>
                </div>
            </section>
        </StoryPageTemplate>
    );
}
