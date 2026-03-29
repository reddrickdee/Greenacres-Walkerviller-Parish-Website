import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { useParishData } from '../context/ParishDataContext';
import { usePageSEO } from '../hooks/usePageSEO';
import { ActionBand, InfoCard, ScriptureBlock, SectionIntro, StoryPageTemplate } from '../components/layout/PageTemplates';

export function AboutPage() {
    const { content, isLoading } = useParishData();

    usePageSEO({
        title: 'About Us',
        description: 'Read the vision, mission, parish prayer, and leadership story of Greenacres Walkerville Catholic Parish.',
        path: '/about',
        ogImage: '/assets/source/our_parish.webp',
    });

    if (isLoading || !content) {
        return <div className="flex h-screen items-center justify-center bg-parish-bg text-lg text-parish-fg">Loading…</div>;
    }

    return (
        <StoryPageTemplate
            eyebrow="About Our Parish"
            title={<>Our story of worship, community, and service.</>}
            description="Learn about our vision, our leadership, and the people who serve our community."
            imageSrc="/assets/source/our_parish.webp"
            imageAlt="Greenacres Walkerville parish community gathering"
            actions={(
                <>
                    <Link to="/mass-times" className="pilgrimage-button">
                        View Mass Times
                    </Link>
                    <Link to="/new-here" className="pilgrimage-button-secondary">
                        I&apos;m New Here
                    </Link>
                </>
            )}
            aside={(
                <div className="rounded-[1.5rem] border border-parish-brass/20 bg-parish-border/5 px-5 py-5">
                    <div className="ornamental-kicker">Parish Vision</div>
                    <p className="mt-3 text-base leading-relaxed text-parish-muted">{content.visionStatement}</p>
                </div>
            )}
        >
            <section className="page-section">
                <div className="page-section-inner grid gap-8 lg:grid-cols-12 lg:gap-10">
                    <div className="lg:col-span-5">
                        <SectionIntro
                            eyebrow="Pastoral Voice"
                            title={<>Meet our parish leadership.</>}
                            description="Our parish priest and pastoral council work together to guide worship, community life, and pastoral care."
                        />
                    </div>
                    <div className="lg:col-span-7 grid gap-6">
                        <InfoCard>
                            <div className="ornamental-kicker">From the Parish Priest</div>
                            <p className="mt-4 text-lg leading-relaxed text-parish-muted md:text-xl">{content.priestWelcome}</p>
                        </InfoCard>
                        <InfoCard>
                            <div className="ornamental-kicker">From the Pastoral Council</div>
                            <p className="mt-4 text-base leading-relaxed text-parish-muted md:text-lg">{content.pastoralChairMessage}</p>
                        </InfoCard>
                    </div>
                </div>
            </section>

            <section className="page-section mt-16 md:mt-20">
                <div className="page-section-inner grid gap-6 lg:grid-cols-2">
                    <ScriptureBlock>
                        <div className="ornamental-kicker !text-parish-brass">Parish Prayer</div>
                        <p className="mt-4 text-2xl leading-relaxed text-parish-inverse/88 md:text-[2rem]">
                            &ldquo;{content.parishPrayerText}&rdquo;
                        </p>
                    </ScriptureBlock>

                    <InfoCard>
                        <div className="ornamental-kicker">Mission Commitments</div>
                        <div className="mt-4 space-y-4">
                            {content.missionPoints.map(point => (
                                <div key={point.title} className="flex gap-3">
                                    <Star size={14} className="mt-1 shrink-0 text-parish-brass" />
                                    <p className="text-sm leading-relaxed text-parish-muted md:text-base">{point.title}</p>
                                </div>
                            ))}
                        </div>
                    </InfoCard>
                </div>
            </section>

            <section className="page-section mt-16 md:mt-20">
                <div className="page-section-inner">
                    <SectionIntro
                        eyebrow="Pastoral Council"
                        title={<>Our Pastoral Council.</>}
                        description="Guiding and supporting our parish."
                        align="center"
                    />

                    <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {content.councilMembers.map((member, index) => (
                            <motion.div
                                key={member.name}
                                initial={{ opacity: 0, y: 22 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-70px' }}
                                transition={{ duration: 0.65, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                                className="sanctuary-card p-0"
                            >
                                {member.photoAsset ? (
                                    <div className="image-panel min-h-[260px] rounded-none border-x-0 border-t-0 border-b border-parish-border/10">
                                        <img
                                            src={`/${member.photoAsset}`}
                                            alt={member.name}
                                            loading="lazy"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex min-h-[220px] items-end rounded-t-[1.75rem] bg-gradient-to-br from-parish-elevated to-parish-surface px-6 py-6">
                                        <div className="ornamental-kicker">Pastoral Profile</div>
                                    </div>
                                )}
                                <div className="px-6 py-7">
                                    <div className="ornamental-kicker">{member.role}</div>
                                    <h3 className="mt-3 text-3xl text-parish-fg">{member.name}</h3>
                                    <p className="mt-4 text-sm leading-relaxed text-parish-muted">{member.bio}</p>
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
                                <span className="section-label mb-4">Next Step</span>
                                <h2 className="text-[clamp(2.2rem,4vw,4rem)] text-parish-fg">
                                    Join our community.
                                </h2>
                            </div>
                            <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
                                <Link to="/mass-times" className="pilgrimage-button">
                                    Plan A Visit
                                </Link>
                                <Link to="/history" className="pilgrimage-button-secondary inline-flex items-center">
                                    Explore Parish History
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
