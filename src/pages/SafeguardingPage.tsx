import { Link } from 'react-router-dom';
import { Phone, ShieldCheck, ExternalLink } from 'lucide-react';
import { usePageSEO } from '../hooks/usePageSEO';
import { useJsonLd } from '../hooks/useJsonLd';
import { SectionIntro, InfoCard, UtilityPageTemplate } from '../components/layout/PageTemplates';

const ARCHDIOCESE_POLICIES_URL =
    'https://adelaide.catholic.org.au/our-people/child-protection/policies-and-resources';
const ACSL_URL = 'https://www.acsltd.org.au';

const EMERGENCY_CONTACTS = [
    { label: 'Life-threatening emergency', value: '000', href: 'tel:000' },
    { label: 'Child Abuse Report Line (CARL)', value: '13 14 78', href: 'tel:131478' },
    { label: 'SA Police (non-emergency)', value: '131 444', href: 'tel:131444' },
    { label: 'Archdiocese Safeguarding Office', value: '(08) 8210 8150', href: 'tel:0882108150' },
];

const REPORTING_STEPS = [
    'If a child is in immediate danger, call 000 without delay.',
    'To report suspected abuse, neglect, or a disclosure, contact the Child Abuse Report Line on 13 14 78.',
    'You may also speak in confidence with our Parish Child Safe Contact, who will support you and help you make a report.',
    'Concerns involving Church personnel can be reported directly to the Archdiocese Safeguarding Office or to ACSL.',
];

export function SafeguardingPage() {
    usePageSEO({
        title: 'Safeguarding',
        description:
            'Greenacres Walkerville Parish is committed to the safety of children and vulnerable adults. Find our safeguarding commitment, reporting procedures, and key contacts.',
        path: '/safeguarding',
    });

    useJsonLd(
        {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Safeguarding — Greenacres Walkerville Catholic Parish',
            description:
                'Parish safeguarding commitment, reporting procedures, and contacts in line with the National Catholic Safeguarding Standards.',
            url: 'https://www.gwparish.org.au/safeguarding',
        },
        'safeguarding-webpage',
    );

    return (
        <UtilityPageTemplate
            eyebrow="Safeguarding"
            title={<>A safe community for children and vulnerable people.</>}
            description="Greenacres Walkerville Parish holds a zero-tolerance position on abuse and is committed to the National Catholic Safeguarding Standards."
            imageSrc="/assets/refurbishment/st_monica_3.webp"
            imageAlt="St Monica's Church"
            actions={(
                <a href="tel:131478" className="pilgrimage-button">
                    <Phone className="h-4 w-4" aria-hidden="true" /> Report a Concern: 13 14 78
                </a>
            )}
        >
            <section className="page-section">
                <div className="page-section-inner max-w-3xl">
                    <SectionIntro eyebrow="Our Commitment" title={<>Everyone has the right to be safe</>} />
                    <p className="mt-6 text-[1.125rem] leading-relaxed text-parish-muted">
                        The safety, wellbeing, and dignity of children, young people, and adults at risk is central to the life and ministry of our parish. We commit to a culture of safeguarding, to listening to and believing those who raise concerns, and to acting promptly on any disclosure or allegation. Abuse in any form will not be tolerated.
                    </p>
                </div>
            </section>

            <section className="page-section mt-12 md:mt-16">
                <div className="page-section-inner">
                    <SectionIntro
                        eyebrow="Who to Contact"
                        title={<>Parish Child Safe Contact</>}
                        description="Our representative is your first point of contact within the parish for any safeguarding matter."
                    />
                    <div className="mt-10 grid gap-6 lg:grid-cols-2">
                        <InfoCard>
                            <ShieldCheck className="h-6 w-6 text-parish-accent" aria-hidden="true" />
                            <h3 className="mt-3 font-display text-2xl text-parish-fg">Rebecca Haines</h3>
                            <p className="mt-1 text-[1rem] font-semibold uppercase tracking-[0.16em] text-parish-accent">
                                Parish Secretary &amp; Child Safe Contact
                            </p>
                            <div className="mt-4 space-y-2 text-[1rem] text-parish-muted">
                                <p>
                                    Phone:{' '}
                                    <a href="tel:0882616200" className="font-semibold text-parish-accent hover:underline">(08) 8261 6200</a>
                                </p>
                                <p>
                                    Email:{' '}
                                    <a href="mailto:admin@gwparish.org.au" className="font-semibold text-parish-accent hover:underline">admin@gwparish.org.au</a>
                                </p>
                            </div>
                        </InfoCard>

                        <InfoCard>
                            <div className="ornamental-kicker">Emergency &amp; Reporting Lines</div>
                            <ul className="mt-4 space-y-3">
                                {EMERGENCY_CONTACTS.map(c => (
                                    <li key={c.label} className="flex items-center justify-between gap-4 text-[1rem]">
                                        <span className="text-parish-muted">{c.label}</span>
                                        <a href={c.href} className="shrink-0 font-semibold text-parish-accent hover:underline">{c.value}</a>
                                    </li>
                                ))}
                            </ul>
                        </InfoCard>
                    </div>
                </div>
            </section>

            <section className="page-section mt-16 md:mt-24">
                <div className="page-section-inner max-w-3xl">
                    <SectionIntro eyebrow="How to Report" title={<>Raising a concern</>} />
                    <ol className="mt-8 space-y-4">
                        {REPORTING_STEPS.map((step, i) => (
                            <li key={i} className="flex gap-4">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-parish-accent/10 font-display text-[1rem] font-bold text-parish-accent">
                                    {i + 1}
                                </span>
                                <p className="text-[1.0625rem] leading-relaxed text-parish-muted">{step}</p>
                            </li>
                        ))}
                    </ol>
                    <p className="mt-6 text-[0.875rem] leading-relaxed text-parish-muted/70">
                        Reporting procedures should be verified with the Parish Office; this page is a guide, not a substitute for professional or legal advice.
                    </p>
                </div>
            </section>

            <section className="page-section mt-16 md:mt-24">
                <div className="page-section-inner">
                    <SectionIntro
                        eyebrow="Volunteers"
                        title={<>Working With Children Checks</>}
                        description="All clergy, staff, and volunteers in child-related ministry hold a current Working With Children Check (WWCC) and complete safeguarding induction, in line with Archdiocese policy."
                    />
                    <div className="mt-8 flex flex-wrap gap-4">
                        <a href={ARCHDIOCESE_POLICIES_URL} target="_blank" rel="noopener noreferrer" className="pilgrimage-button-secondary">
                            Archdiocese Policies &amp; Resources <ExternalLink className="h-4 w-4" aria-hidden="true" />
                        </a>
                        <a href={ACSL_URL} target="_blank" rel="noopener noreferrer" className="pilgrimage-button-secondary">
                            Australian Catholic Safeguarding Ltd <ExternalLink className="h-4 w-4" aria-hidden="true" />
                        </a>
                        <Link to="/volunteer" className="pilgrimage-button-ghost">Volunteer with us</Link>
                    </div>
                </div>
            </section>
        </UtilityPageTemplate>
    );
}
