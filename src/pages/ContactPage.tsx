import { Link } from 'react-router-dom';
import { MapPinned, Phone } from 'lucide-react';
import { useParishData } from '../context/ParishDataContext';
import { usePageSEO } from '../hooks/usePageSEO';
import { ActionBand, InfoCard, SectionIntro, UtilityPageTemplate } from '../components/layout/PageTemplates';

export function ContactPage() {
    const { content, isLoading } = useParishData();

    usePageSEO({
        title: 'Contact Us',
        description: 'Contact Greenacres Walkerville Catholic Parish, find office hours, church locations, and parish school details.',
        path: '/contact',
        ogImage: '/assets/source/hero_2.webp',
    });

    if (isLoading || !content) {
        return <div className="flex h-screen items-center justify-center bg-parish-bg text-lg text-parish-fg">Loading…</div>;
    }

    const { contact, schools } = content;

    return (
        <UtilityPageTemplate
            eyebrow="Contact And Directions"
            title={<>Reach the parish quickly, whether you need support or simply directions.</>}
            description="This page is treated as a service page first: practical contact details, clear maps, and a direct path to schools and office help."
            imageSrc="/assets/source/hero_2.webp"
            imageAlt="Church exterior at Greenacres Walkerville Parish"
            actions={(
                <>
                    <a href={`tel:${contact.phone}`} className="pilgrimage-button">
                        Call The Office
                    </a>
                    <a href={`mailto:${contact.email}`} className="pilgrimage-button-secondary">
                        Email The Parish
                    </a>
                </>
            )}
            aside={(
                <div className="rounded-[1.5rem] border border-parish-brass/20 bg-parish-border/5 px-5 py-5">
                    <div className="ornamental-kicker">Office Hours</div>
                    <p className="mt-3 text-sm leading-relaxed text-parish-muted">{contact.officeHours}</p>
                </div>
            )}
        >
            <section className="page-section">
                <div className="page-section-inner grid gap-6 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                        <SectionIntro
                            eyebrow="Parish Office"
                            title={<>Start with the office if you are unsure where your question belongs.</>}
                            description="Pastoral care, sacraments, administration, and first-visit questions should all have an obvious home."
                        />
                    </div>

                    <div className="grid gap-6 lg:col-span-7 md:grid-cols-2">
                        <InfoCard>
                            <MapPinned className="h-6 w-6 text-parish-brass" />
                            <div className="mt-4 ornamental-kicker">Address</div>
                            <p className="mt-3 text-lg leading-relaxed text-parish-fg">{contact.address}</p>
                            <div className="mt-5 ornamental-kicker">Postal Address</div>
                            <p className="mt-3 text-sm leading-relaxed text-parish-muted">{contact.postalAddress}</p>
                        </InfoCard>
                        <InfoCard>
                            <Phone className="h-6 w-6 text-parish-brass" />
                            <div className="mt-4 ornamental-kicker">Phone</div>
                            <a href={`tel:${contact.phone}`} className="mt-3 block text-lg text-parish-fg underline decoration-parish-brass/35 hover:text-parish-accent">
                                {contact.phone}
                            </a>
                            <div className="mt-5 ornamental-kicker">Email</div>
                            <a href={`mailto:${contact.email}`} className="mt-3 block break-all text-sm text-parish-fg underline decoration-parish-brass/35 hover:text-parish-accent">
                                {contact.email}
                            </a>
                        </InfoCard>
                    </div>
                </div>
            </section>

            <section className="page-section mt-16 md:mt-20">
                <div className="page-section-inner">
                    <SectionIntro
                        eyebrow="Church Maps"
                        title={<>Both churches are easy to find once the location is surfaced clearly.</>}
                        description="Maps are retained, but now presented inside the same visual system as the rest of the site."
                    />

                    <div className="mt-10 grid gap-6 lg:grid-cols-2">
                        <InfoCard className="p-5 md:p-6">
                            <div className="ornamental-kicker">St Monica&apos;s Church</div>
                            <p className="mt-3 text-sm leading-relaxed text-parish-muted">{contact.stMonicaQuery}</p>
                            <iframe
                                title="St Monica's Church location"
                                className="mt-5 h-72 w-full rounded-[1.5rem] border border-parish-border/10"
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(contact.stMonicaQuery)}&output=embed`}
                                loading="lazy"
                            />
                        </InfoCard>

                        <InfoCard className="p-5 md:p-6">
                            <div className="ornamental-kicker">St Martin&apos;s Church</div>
                            <p className="mt-3 text-sm leading-relaxed text-parish-muted">{contact.stMartinQuery}</p>
                            <iframe
                                title="St Martin's Church location"
                                className="mt-5 h-72 w-full rounded-[1.5rem] border border-parish-border/10"
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(contact.stMartinQuery)}&output=embed`}
                                loading="lazy"
                            />
                        </InfoCard>
                    </div>
                </div>
            </section>

            <section className="page-section mt-16 md:mt-20">
                <div className="page-section-inner">
                    <SectionIntro
                        eyebrow="Parish Schools"
                        title={<>School communities remain part of the wider parish story.</>}
                        description="These details stay practical and readable rather than buried in dense contact blocks."
                    />

                    <div className="mt-10 grid gap-6 md:grid-cols-2">
                        {schools.map(school => (
                            <InfoCard key={school.name}>
                                <div className="ornamental-kicker">{school.name}</div>
                                <div className="mt-4 space-y-3 text-sm leading-relaxed text-parish-muted">
                                    <p>{school.address}</p>
                                    <p>Principal: <span className="text-parish-fg">{school.principal}</span></p>
                                    <p>
                                        Phone:{' '}
                                        <a href={`tel:${school.phone}`} className="text-parish-fg underline decoration-parish-brass/35 hover:text-parish-accent">
                                            {school.phone}
                                        </a>
                                    </p>
                                    <p>
                                        Website:{' '}
                                        <a
                                            href={`https://${school.website}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-parish-fg underline decoration-parish-brass/35 hover:text-parish-accent"
                                        >
                                            {school.website}
                                        </a>
                                    </p>
                                </div>
                            </InfoCard>
                        ))}
                    </div>
                </div>
            </section>

            <section className="page-section mt-16 md:mt-20">
                <div className="page-section-inner">
                    <ActionBand>
                        <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
                            <div className="lg:col-span-8">
                                <span className="section-label mb-4">Need A Human Answer</span>
                                <h2 className="text-[clamp(2.2rem,4vw,3.9rem)] text-parish-fg">
                                    Email or call before you visit if that makes your first step easier.
                                </h2>
                            </div>
                            <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
                                <a href={`mailto:${contact.email}`} className="pilgrimage-button">
                                    Email The Parish
                                </a>
                                <Link to="/new-here" className="pilgrimage-button-secondary">
                                    Read The Welcome Guide
                                </Link>
                            </div>
                        </div>
                    </ActionBand>
                </div>
            </section>
        </UtilityPageTemplate>
    );
}
