import { Link } from 'react-router-dom';
import { usePageSEO } from '../hooks/usePageSEO';
import { ActionBand, InfoCard, ScriptureBlock, SectionIntro, StoryPageTemplate } from '../components/layout/PageTemplates';

export function SafeguardingPage() {
    usePageSEO({
        title: 'Safeguarding & Child Protection',
        description: 'Greenacres Walkerville Parish is committed to the safety of children and vulnerable adults. Zero tolerance policy, reporting procedures, and privacy information.',
        path: '/safeguarding',
    });

    return (
        <StoryPageTemplate
            eyebrow="Our Commitment"
            title={<>Safeguarding the dignity and safety of every person.</>}
            description="The Catholic Archdiocese of Adelaide and Greenacres Walkerville Parish maintain a zero-tolerance approach to all forms of abuse. This page outlines our commitments, procedures, and how to report concerns."
            imageSrc="/assets/source/hero_2.webp"
            imageAlt="Parish community space"
            actions={(
                <>
                    <a href="tel:0882108150" className="pilgrimage-button">
                        Report A Concern
                    </a>
                    <Link to="/contact" className="pilgrimage-button-secondary">
                        Contact The Parish
                    </Link>
                </>
            )}
        >
            <section className="page-section">
                <div className="page-section-inner grid gap-8 lg:grid-cols-12 lg:gap-10">
                    <div className="lg:col-span-5">
                        <SectionIntro
                            eyebrow="Zero Tolerance"
                            title={<>Every person in this parish deserves care, safety, and respect.</>}
                            description="We proactively work to create an environment where everyone feels safe, respected, and empowered. Our practices strictly adhere to the National Catholic Safeguarding Standards."
                        />
                    </div>
                    <div className="lg:col-span-7 grid gap-6">
                        <InfoCard>
                            <div className="ornamental-kicker">Policy Framework</div>
                            <p className="mt-4 text-base leading-relaxed text-parish-muted md:text-lg">
                                Our parish fully endorses and actively implements the National Catholic Safeguarding Standards, which integrate recommendations from the Royal Commission into Institutional Responses to Child Sexual Abuse. These standards guide our leadership, culture, and human resource management — including rigorous screening and necessary Working with Children Checks for all clergy, staff, and volunteers.
                            </p>
                        </InfoCard>
                        <InfoCard>
                            <div className="ornamental-kicker">Parish Commitment</div>
                            <p className="mt-4 text-base leading-relaxed text-parish-muted md:text-lg">
                                We are deeply committed to the care, safety, and well-being of all children, young people, and adults at risk who interact with our parish community. We do not digitally publish the names or identifying photos of children without explicit, written parental consent.
                            </p>
                        </InfoCard>
                    </div>
                </div>
            </section>

            <section className="page-section mt-16 md:mt-20">
                <div className="page-section-inner grid gap-6 lg:grid-cols-2">
                    <ScriptureBlock>
                        <div className="ornamental-kicker !text-parish-brass">Reporting Concerns</div>
                        <p className="mt-4 text-xl leading-relaxed text-parish-inverse/88 md:text-2xl">
                            If you have any concerns regarding the safety of a child or vulnerable adult, please contact the Archdiocesan Safeguarding Unit immediately.
                        </p>
                        <div className="mt-6 space-y-3">
                            <div className="flex items-center gap-3 text-parish-inverse/85">
                                <span className="text-parish-brass">✦</span>
                                <span className="text-base"><strong>Phone:</strong> (08) 8210 8150</span>
                            </div>
                            <div className="flex items-center gap-3 text-parish-inverse/85">
                                <span className="text-parish-brass">✦</span>
                                <span className="text-base"><strong>Email:</strong> safeguarding@adelaide.catholic.org.au</span>
                            </div>
                        </div>
                        <p className="mt-6 text-sm italic text-parish-inverse/55">
                            If a child or vulnerable person is in immediate danger, always call Police on 000.
                        </p>
                    </ScriptureBlock>

                    <InfoCard>
                        <div className="ornamental-kicker">Privacy Policy</div>
                        <p className="mt-4 text-base leading-relaxed text-parish-muted md:text-lg">
                            Greenacres Walkerville Parish respects your privacy and is committed to protecting your personal information. Any information collected through this website, including contact forms or donation portals, is handled in accordance with the Privacy Act 1988 (Cth) and Archdiocesan privacy guidelines.
                        </p>
                    </InfoCard>
                </div>
            </section>

            <section className="page-section mt-16 md:mt-20">
                <div className="page-section-inner">
                    <ActionBand>
                        <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
                            <div className="lg:col-span-8">
                                <span className="section-label mb-4">Need Support</span>
                                <h2 className="text-[clamp(2.2rem,4vw,3.9rem)] text-parish-fg">
                                    If you need pastoral support or have questions about safeguarding, the parish office is here for you.
                                </h2>
                            </div>
                            <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
                                <Link to="/contact" className="pilgrimage-button">
                                    Contact The Parish Office
                                </Link>
                            </div>
                        </div>
                    </ActionBand>
                </div>
            </section>
        </StoryPageTemplate>
    );
}
