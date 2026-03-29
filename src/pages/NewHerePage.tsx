import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarClock, MapPinned, Accessibility, Car, Users } from 'lucide-react';
import { useParishData } from '../context/ParishDataContext';
import { usePageSEO } from '../hooks/usePageSEO';
import { ActionBand, InfoCard, ScriptureBlock, SectionIntro, HighlightPageTemplate } from '../components/layout/PageTemplates';
import { ContentLoading, ContentError } from '../components/ContentStates';

export function NewHerePage() {
    const { content, isLoading } = useParishData();

    usePageSEO({
        title: "I'm New Here",
        description: 'Find what to expect at your first Mass, how to arrive with confidence, and how Greenacres Walkerville Catholic Parish welcomes new visitors.',
        path: '/new-here',
        ogImage: '/assets/source/welcome_thumb.webp',
    });

    if (isLoading) return <ContentLoading />;
    if (!content) return <ContentError />;

    const visitorInfo = content.visitorInfo;

    return (
        <HighlightPageTemplate
            eyebrow="First Visit Guide"
            title={<>Come as you are. We&apos;ll help you know what comes next.</>}
            description="Whether you're joining us from the local area or from further afield, our parish community — including Sri Lankan, Filipino, and broader Australian families — is glad to welcome you."
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
            {/* What to expect at Mass */}
            <section className="page-section">
                <div className="page-section-inner grid gap-8 lg:grid-cols-12 lg:gap-10">
                    <div className="lg:col-span-5">
                        <SectionIntro
                            eyebrow="What to Expect"
                            title={<>You do not need to arrive already knowing parish life.</>}
                            description={visitorInfo?.whatToExpect ?? "Sit, stand, and kneel when the congregation does — printed guides are available, and no one will mind if you simply follow along."}
                        />
                    </div>
                    <div className="lg:col-span-7">
                        <ScriptureBlock>
                            <div className="ornamental-kicker !text-parish-brass">Scripture</div>
                            <p className="mt-4 text-2xl leading-relaxed text-parish-inverse/88 md:text-[2rem]">
                                &ldquo;Come to me, all you who are weary and burdened, and I will give you rest.&rdquo;
                            </p>
                            <p className="mt-4 text-sm uppercase tracking-[0.22em] text-parish-brass">Matthew 11:28</p>
                        </ScriptureBlock>
                    </div>
                </div>
            </section>

            {/* When to arrive */}
            <section className="page-section mt-16 md:mt-20">
                <div className="page-section-inner">
                    <SectionIntro
                        eyebrow="When to Arrive"
                        title={<>Your first steps, clearly laid out.</>}
                        description={visitorInfo?.arrivalGuidance ?? "Arrive 10–15 minutes before Mass so you can find a seat and settle in."}
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

            {/* Where to go — church cards with logistics */}
            {visitorInfo && visitorInfo.churches.length > 0 && (
                <section className="page-section mt-16 md:mt-20">
                    <div className="page-section-inner">
                        <SectionIntro
                            eyebrow="Where to Go"
                            title={<>Two churches, one welcoming parish family.</>}
                            description="Choose whichever church suits you — both are easy to find and fully accessible."
                        />

                        <div className="mt-10 grid gap-6 lg:grid-cols-2">
                            {visitorInfo.churches.map(church => (
                                <InfoCard key={church.id}>
                                    <div className="ornamental-kicker">{church.name}</div>
                                    <p className="mt-3 text-lg text-parish-fg">{church.address}</p>

                                    <div className="mt-5 space-y-3">
                                        <div className="flex items-start gap-3 rounded-[1.2rem] border border-parish-border/10 bg-parish-border/5 px-4 py-3">
                                            <Car className="mt-0.5 h-4 w-4 shrink-0 text-parish-accent" />
                                            <p className="text-sm leading-relaxed text-parish-muted">{church.parkingSummary}</p>
                                        </div>
                                        <div className="flex items-start gap-3 rounded-[1.2rem] border border-parish-border/10 bg-parish-border/5 px-4 py-3">
                                            <Accessibility className="mt-0.5 h-4 w-4 shrink-0 text-parish-accent" />
                                            <p className="text-sm leading-relaxed text-parish-muted">{church.accessibilitySummary}</p>
                                        </div>
                                        <p className="text-sm leading-relaxed text-parish-muted italic">{church.arrivalTip}</p>
                                    </div>

                                    <div className="mt-5 flex flex-wrap gap-4">
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(church.mapQuery)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-parish-accent no-underline"
                                        >
                                            <MapPinned className="h-4 w-4" />
                                            Directions
                                        </a>
                                    </div>
                                </InfoCard>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Accessibility support */}
            {visitorInfo?.accessibilitySupport && (
                <section className="page-section mt-16 md:mt-20">
                    <div className="page-section-inner grid gap-6 lg:grid-cols-3">
                        <InfoCard>
                            <Accessibility className="h-6 w-6 text-parish-brass" />
                            <div className="mt-4 ornamental-kicker">Accessibility Support</div>
                            <p className="mt-3 text-sm leading-relaxed text-parish-muted">{visitorInfo.accessibilitySupport}</p>
                        </InfoCard>
                        <InfoCard>
                            <Users className="h-6 w-6 text-parish-brass" />
                            <div className="mt-4 ornamental-kicker">A Diverse Parish Family</div>
                            <p className="mt-3 text-sm leading-relaxed text-parish-muted">
                                Our parish includes Sri Lankan, Filipino, and broader Australian families. Children are welcome at every Mass, with children's liturgy on the first and third weekends.
                            </p>
                        </InfoCard>
                        <InfoCard>
                            <CalendarClock className="h-6 w-6 text-parish-brass" />
                            <div className="mt-4 ornamental-kicker">What Happens Next</div>
                            <p className="mt-3 text-sm leading-relaxed text-parish-muted">
                                After your first visit, the easiest way to keep moving is through community groups, parish news, and sacramental life.
                            </p>
                            <Link to="/news-events" className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-parish-accent no-underline">
                                Weekly bulletin &amp; news
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </InfoCard>
                    </div>
                </section>
            )}

            {/* Contact prompt */}
            <section className="page-section mt-16 md:mt-20">
                <div className="page-section-inner">
                    <ActionBand>
                        <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
                            <div className="lg:col-span-8">
                                <span className="section-label mb-4">Ready To Come</span>
                                <h2 className="text-[clamp(2.1rem,4vw,3.8rem)] text-parish-fg">
                                    {visitorInfo?.contactPrompt ?? "The most practical next step is simply choosing a Mass and arriving."}
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
