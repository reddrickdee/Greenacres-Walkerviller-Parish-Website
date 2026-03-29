import { motion } from 'framer-motion';
import { useParishData } from '../context/ParishDataContext';
import { usePageSEO } from '../hooks/usePageSEO';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ActionBand, SectionIntro, StoryPageTemplate } from '../components/layout/PageTemplates';

export function HistoryPage() {
    const { content, isLoading } = useParishData();

    usePageSEO({
        title: 'Parish History',
        description: 'Over a century of Catholic faith in Adelaide — from a Druids Hall in 1912 to today\'s thriving two-church parish at Greenacres and Walkerville.',
        path: '/history',
    });

    if (isLoading || !content) {
        return <div className="flex h-screen items-center justify-center bg-parish-bg text-lg text-parish-fg">Loading…</div>;
    }

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
                    <Link to="/contact" className="pilgrimage-button-secondary">
                        Contact Us
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
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: '-60px' }}
                                transition={{ duration: 0.7, delay: Math.min(index * 0.05, 0.4), ease: [0.22, 1, 0.36, 1] }}
                                className="relative mb-10 pl-10 md:pl-14"
                            >
                                <div className="absolute -left-[9px] top-2 h-4 w-4 rounded-full bg-parish-brass ring-4 ring-parish-bg" />
                                <div className="ornamental-kicker">{item.year}</div>
                                <p className="mt-3 text-lg leading-relaxed text-parish-muted md:text-xl">{item.description}</p>
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
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </ActionBand>
                </div>
            </section>
        </StoryPageTemplate>
    );
}
