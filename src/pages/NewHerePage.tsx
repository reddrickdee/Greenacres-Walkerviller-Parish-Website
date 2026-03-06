import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarClock, MapPinned } from 'lucide-react';
import { useParishData } from '../context/ParishDataContext';
import { usePageSEO } from '../hooks/usePageSEO';
import { ActionBand, InfoCard, ScriptureBlock, SectionIntro, HighlightPageTemplate } from '../components/layout/PageTemplates';

export function NewHerePage() {
    const { content, isLoading } = useParishData();

    usePageSEO({
        title: "I'm New Here",
        description: 'Find what to expect at your first Mass, how to arrive with confidence, and how Greenacres Walkerville Catholic Parish welcomes new visitors.',
        path: '/new-here',
        ogImage: '/assets/source/welcome_thumb.webp',
    });

    if (isLoading || !content) {
        return <div className="flex h-screen items-center justify-center bg-parish-bg text-lg text-parish-fg">Loading…</div>;
    }

    return (
        <HighlightPageTemplate
            eyebrow="First Visit Guide"
            title={<>Come as you are. We&apos;ll help you know what comes next.</>}
            description="This page is designed for the anxious first scroll: where to go, what to expect, and how the parish will welcome you once you arrive."
            imageSrc="/assets/source/welcome_thumb.webp"
            imageAlt="Visitors arriving at parish grounds"
            actions={(
                <>
                    <Link to="/mass-times" className="pilgrimage-button">
                        See Mass Times
                    </Link>
                    <Link to="/contact" className="pilgrimage-button-secondary">
                        Contact The Office
                    </Link>
                </>
            )}
            aside={(
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[1.4rem] border border-parish-border/10 bg-parish-border/5 px-5 py-4">
                        <div className="ornamental-kicker">Saturday</div>
                        <p className="mt-2 text-sm leading-relaxed text-parish-muted">6:00pm at St Monica&apos;s Walkerville</p>
                    </div>
                    <div className="rounded-[1.4rem] border border-parish-border/10 bg-parish-border/5 px-5 py-4">
                        <div className="ornamental-kicker">Sunday</div>
                        <p className="mt-2 text-sm leading-relaxed text-parish-muted">9:30am at St Martin&apos;s Greenacres</p>
                    </div>
                </div>
            )}
        >
            <section className="page-section">
                <div className="page-section-inner grid gap-8 lg:grid-cols-12 lg:gap-10">
                    <div className="lg:col-span-5">
                        <SectionIntro
                            eyebrow="You Belong Here"
                            title={<>You do not need to arrive already knowing parish life.</>}
                            description="The strongest first-visit language is warm and concrete. It lowers uncertainty without sounding generic."
                        />
                    </div>
                    <div className="lg:col-span-7">
                        <ScriptureBlock>
                            <div className="ornamental-kicker !text-parish-brass">Scripture</div>
                            <p className="mt-4 text-2xl leading-relaxed text-parish-inverse/88 md:text-[2rem]">
                                &ldquo;Come to me, all you who are weary and burdened, and I will give you rest.&rdquo;
                            </p>
                            <p className="mt-4 text-sm uppercase tracking-[0.24em] text-parish-brass">Matthew 11:28</p>
                        </ScriptureBlock>
                    </div>
                </div>
            </section>

            <section className="page-section mt-16 md:mt-20">
                <div className="page-section-inner">
                    <SectionIntro
                        eyebrow="Your First Steps"
                        title={<>A clearer path from curiosity to confidence.</>}
                        description="These steps become the newcomer blueprint across the redesign."
                    />

                    <div className="mt-10 grid gap-5">
                        {content.newHereSteps.map((step, index) => (
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: '-70px' }}
                                transition={{ duration: 0.62, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                                className="sanctuary-card flex flex-col gap-4 md:flex-row md:items-start"
                            >
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-parish-brass/25 bg-parish-elevated/75 font-semibold text-parish-brass">
                                    {index + 1}
                                </div>
                                <p className="text-base leading-relaxed text-parish-muted md:pt-1 md:text-lg">{step}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="page-section mt-16 md:mt-20">
                <div className="page-section-inner grid gap-6 lg:grid-cols-3">
                    <InfoCard>
                        <CalendarClock className="h-6 w-6 text-parish-brass" />
                        <div className="mt-4 ornamental-kicker">When to Come</div>
                        <p className="mt-3 text-sm leading-relaxed text-parish-muted">
                            Weekend Masses are the simplest entry point if you are visiting the parish for the first time.
                        </p>
                        <Link to="/mass-times" className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-parish-accent no-underline">
                            View the schedule
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </InfoCard>
                    <InfoCard>
                        <MapPinned className="h-6 w-6 text-parish-brass" />
                        <div className="mt-4 ornamental-kicker">Where to Go</div>
                        <p className="mt-3 text-sm leading-relaxed text-parish-muted">
                            Use the contact page for maps, church addresses, and direct parish office details before you travel.
                        </p>
                        <Link to="/contact" className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-parish-accent no-underline">
                            Open contact details
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </InfoCard>
                    <InfoCard>
                        <ArrowRight className="h-6 w-6 text-parish-brass" />
                        <div className="mt-4 ornamental-kicker">What Happens Next</div>
                        <p className="mt-3 text-sm leading-relaxed text-parish-muted">
                            After your first visit, the easiest way to keep moving is through parish news, community groups, and sacramental life.
                        </p>
                        <Link to="/community" className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-parish-accent no-underline">
                            Explore community life
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </InfoCard>
                </div>
            </section>

            <section className="page-section mt-16 md:mt-20">
                <div className="page-section-inner">
                    <ActionBand>
                        <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
                            <div className="lg:col-span-8">
                                <span className="section-label mb-4">Ready To Come</span>
                                <h2 className="text-[clamp(2.1rem,4vw,3.8rem)] text-parish-fg">
                                    The most practical next step is simply choosing a Mass and arriving.
                                </h2>
                            </div>
                            <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
                                <Link to="/mass-times" className="pilgrimage-button">
                                    Choose A Mass Time
                                </Link>
                                <Link to="/contact" className="pilgrimage-button-secondary">
                                    Reach Out First
                                </Link>
                            </div>
                        </div>
                    </ActionBand>
                </div>
            </section>
        </HighlightPageTemplate>
    );
}
