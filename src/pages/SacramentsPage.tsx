import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useParishData } from '../context/ParishDataContext';
import { usePageSEO } from '../hooks/usePageSEO';
import { useJsonLd } from '../hooks/useJsonLd';
import { SectionIntro, ActionBand, StoryPageTemplate } from '../components/layout/PageTemplates';
import { ContentLoading, ContentError } from '../components/ContentStates';

/** Sacraments not stored in parish_content.json but required on this page. */
const EXTRA_SACRAMENTS = [
    {
        title: 'First Holy Communion & Confirmation',
        details:
            'Celebrated as part of the parish Sacramental Program for school-aged children, with parent participation in every preparation session across the two-year cycle.',
    },
    {
        title: 'Anointing of the Sick',
        details:
            'Available for anyone who is seriously ill, frail, or preparing for surgery. Communal anointing is offered during certain weekend Masses; otherwise contact the Parish Office at any time to arrange a priest.',
    },
    {
        title: 'RCIA — Becoming Catholic',
        details:
            'Adults exploring the Catholic faith, or seeking Baptism, Confirmation, or Eucharist, are warmly welcomed through the Rite of Christian Initiation of Adults. Contact the Parish Office to begin the journey.',
    },
];

function Accordion({ items }: { items: { title: string; details: string }[] }) {
    const [open, setOpen] = useState<string | null>(items[0]?.title ?? null);

    return (
        <div className="mt-10 space-y-4">
            {items.map(item => {
                const isOpen = open === item.title;
                const panelId = `sacrament-${item.title.replace(/\s+/g, '-').toLowerCase()}`;
                return (
                    <div key={item.title} className="sanctuary-card !px-0 !py-0 overflow-hidden">
                        <h3>
                            <button
                                type="button"
                                onClick={() => setOpen(isOpen ? null : item.title)}
                                aria-expanded={isOpen}
                                aria-controls={panelId}
                                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-display text-xl text-parish-fg md:text-2xl"
                            >
                                {item.title}
                                <ChevronDown
                                    className={`h-5 w-5 shrink-0 text-parish-accent transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                                    aria-hidden="true"
                                />
                            </button>
                        </h3>
                        {isOpen && (
                            <div id={panelId} className="px-6 pb-6 text-[1rem] leading-relaxed text-parish-muted">
                                {item.details}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export function SacramentsPage() {
    const { content, isLoading } = useParishData();

    usePageSEO({
        title: 'Sacraments',
        description:
            "Sacraments at Greenacres Walkerville Parish — Reconciliation, Baptism, Weddings, the children's Sacramental Program, Anointing of the Sick, and RCIA.",
        path: '/sacraments',
        ogImage: '/assets/refurbishment/st_monica_4.webp',
    });

    const sacraments = [...(content?.sacraments ?? []), ...EXTRA_SACRAMENTS];

    useJsonLd(
        {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: sacraments.map(s => ({
                '@type': 'Question',
                name: s.title,
                acceptedAnswer: { '@type': 'Answer', text: s.details },
            })),
        },
        'sacraments-faq',
    );

    if (isLoading) return <ContentLoading />;
    if (!content) return <ContentError />;

    return (
        <StoryPageTemplate
            eyebrow="The Sacraments"
            title={<>Encountering Christ through the life of the Church.</>}
            description="From Baptism to Anointing of the Sick, the sacraments mark the journey of faith. Here is how each is celebrated across our two churches."
            imageSrc="/assets/refurbishment/st_monica_4.webp"
            imageAlt="The sanctuary at St Monica's Church"
            actions={(
                <>
                    <Link to="/contact" className="pilgrimage-button">Contact the Parish Office</Link>
                    <Link to="/mass-times" className="pilgrimage-button-secondary">Mass &amp; Reconciliation Times</Link>
                </>
            )}
        >
            <section className="page-section">
                <div className="page-section-inner">
                    <SectionIntro
                        eyebrow="Preparation & Celebration"
                        title={<>Each sacrament, explained</>}
                        description="Tap a sacrament to see when and how it is celebrated. For anything not covered here, the Parish Office is glad to help."
                    />
                    <Accordion items={sacraments} />
                </div>
            </section>

            <section className="page-section mt-16 md:mt-24">
                <div className="page-section-inner">
                    <ActionBand>
                        <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
                            <div className="lg:col-span-8">
                                <span className="section-label mb-4">Begin the Journey</span>
                                <h2 className="text-[clamp(2.2rem,4vw,3.9rem)] text-parish-fg">
                                    Preparing for a sacrament? The Parish Office will walk with you.
                                </h2>
                            </div>
                            <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
                                <Link to="/contact" className="pilgrimage-button">Contact the Office</Link>
                                <Link to="/new-here" className="pilgrimage-button-secondary">I&apos;m New Here</Link>
                            </div>
                        </div>
                    </ActionBand>
                </div>
            </section>
        </StoryPageTemplate>
    );
}
