import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useParishData } from '../context/ParishDataContext';
import { usePageSEO } from '../hooks/usePageSEO';
import { ActionBand, InfoCard, ScriptureBlock, SectionIntro, UtilityPageTemplate } from '../components/layout/PageTemplates';

export function SacramentsServicesPage() {
    const { content, isLoading } = useParishData();

    usePageSEO({
        title: 'Sacraments & Services',
        description: 'Baptism, Marriage, RCIA, Reconciliation, and community services at Greenacres Walkerville Catholic Parish. Preparation pathways and how to get started.',
        path: '/sacraments',
    });

    if (isLoading || !content) {
        return <div className="flex h-screen items-center justify-center bg-parish-bg text-lg text-parish-fg">Loading…</div>;
    }

    return (
        <UtilityPageTemplate
            eyebrow="Sacraments & Services"
            title={<>The sacraments mark the milestones of a life lived in faith.</>}
            description="Baptism, Marriage, Reconciliation, RCIA, and Anointing of the Sick each follow a preparation pathway. This page explains what to expect and how to begin."
            imageSrc="/assets/refurbishment/st_monica_4.webp"
            imageAlt="Sanctuary of St Monica's Church"
            actions={(
                <>
                    <Link to="/sacraments/request" className="pilgrimage-button">
                        Request A Sacrament
                    </Link>
                    <Link to="/contact" className="pilgrimage-button-secondary">
                        Contact The Office
                    </Link>
                </>
            )}
            aside={(
                <div className="rounded-[1.5rem] border border-parish-brass/20 bg-parish-border/5 px-5 py-5">
                    <div className="ornamental-kicker">Scripture</div>
                    <p className="mt-3 text-sm italic leading-relaxed text-parish-muted">
                        "The Lord is my shepherd; I shall not want." — Psalm 23:1
                    </p>
                </div>
            )}
        >
            <section className="page-section">
                <div className="page-section-inner">
                    <SectionIntro
                        eyebrow="Sacramental Life"
                        title={<>Each sacrament is a channel of grace and a step deeper into the life of the Church.</>}
                    />

                    <div className="mt-10 grid gap-6 md:grid-cols-2">
                        {content.sacraments.map((sacrament, index) => (
                            <motion.div
                                key={sacrament.title}
                                initial={{ opacity: 0, y: 22 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-60px' }}
                                transition={{ duration: 0.65, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <InfoCard>
                                    <div className="ornamental-kicker">{sacrament.title}</div>
                                    <p className="mt-4 text-base leading-relaxed text-parish-muted md:text-lg">{sacrament.details}</p>
                                </InfoCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {content.sacramentalJourneys.length > 0 && (
                <section className="page-section mt-16 md:mt-20">
                    <div className="page-section-inner">
                        <SectionIntro
                            eyebrow="Preparation Pathways"
                            title={<>Each sacrament involves a journey of preparation. Here is what to expect.</>}
                            align="center"
                        />

                        <div className="mt-12 space-y-12">
                            {content.sacramentalJourneys.map(journey => (
                                <div key={journey.id} className="sanctuary-panel px-7 py-8 md:px-10 md:py-12">
                                    <div className="ornamental-kicker">{journey.title}</div>
                                    <h3 className="mt-3 text-3xl text-parish-fg">{journey.subtitle}</h3>
                                    <p className="mt-4 text-base leading-relaxed text-parish-muted md:text-lg">{journey.intro}</p>

                                    <div className="relative ml-4 mt-10 border-l-2 border-parish-brass/30">
                                        {journey.steps.map(step => (
                                            <div key={step.id} className="relative mb-8 pl-8 md:pl-10">
                                                <div className="absolute -left-[9px] top-2 h-4 w-4 rounded-full bg-parish-brass ring-4 ring-parish-surface" />
                                                <div className="ornamental-kicker">{step.phaseLabel}</div>
                                                <h4 className="mt-2 text-2xl text-parish-fg">{step.title}</h4>
                                                <p className="mt-3 text-base leading-relaxed text-parish-muted">{step.details}</p>
                                                {step.meetingLabel && (
                                                    <p className="mt-2 text-sm italic text-parish-muted">📅 {step.meetingLabel}</p>
                                                )}
                                                {step.prerequisites.length > 0 && (
                                                    <ul className="mt-3 space-y-1">
                                                        {step.prerequisites.map((p, j) => (
                                                            <li key={j} className="flex items-start gap-2 text-sm text-parish-muted">
                                                                <span className="mt-0.5 text-parish-brass">→</span> {p}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {journey.ctaLabel && (
                                        <Link
                                            to={journey.ctaRoute || '/contact'}
                                            className="pilgrimage-button mt-8"
                                        >
                                            {journey.ctaLabel}
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <section className="page-section mt-16 md:mt-20">
                <div className="page-section-inner grid gap-8 lg:grid-cols-2">
                    <div>
                        <SectionIntro
                            eyebrow="Community Services"
                            title={<>Practical ways the parish serves its people and neighbours.</>}
                        />
                        <div className="mt-8 space-y-4">
                            {content.communityServices.map((service, i) => (
                                <div key={i} className="border-b border-parish-border/10 pb-4 text-base leading-relaxed text-parish-muted last:border-b-0 last:pb-0">
                                    {service}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <SectionIntro
                            eyebrow="Faith Formation"
                            title={<>Grow in understanding and practice of the faith.</>}
                        />
                        <div className="mt-8 space-y-4">
                            {content.faithFormation.map((item, i) => (
                                <div key={i} className="border-b border-parish-border/10 pb-4 text-base leading-relaxed text-parish-muted last:border-b-0 last:pb-0">
                                    {item}
                                </div>
                            ))}
                        </div>

                        <ScriptureBlock className="mt-8">
                            <div className="ornamental-kicker !text-parish-brass">Volunteering</div>
                            <p className="mt-4 text-lg leading-relaxed text-parish-inverse/85">{content.volunteerInfo}</p>
                        </ScriptureBlock>
                    </div>
                </div>
            </section>

            <section className="page-section mt-16 md:mt-20">
                <div className="page-section-inner">
                    <ActionBand>
                        <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
                            <div className="lg:col-span-8">
                                <span className="section-label mb-4">Ready To Begin</span>
                                <h2 className="text-[clamp(2.2rem,4vw,3.9rem)] text-parish-fg">
                                    The first step is always a conversation. Reach out to the parish office.
                                </h2>
                            </div>
                            <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
                                <Link to="/sacraments/request" className="pilgrimage-button">
                                    Request A Sacrament
                                </Link>
                                <Link to="/contact" className="pilgrimage-button-secondary">
                                    Contact The Office
                                </Link>
                            </div>
                        </div>
                    </ActionBand>
                </div>
            </section>
        </UtilityPageTemplate>
    );
}
