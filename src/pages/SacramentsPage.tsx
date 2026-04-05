import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Phone, Mail, ArrowRight, Droplets, Heart, BookOpen, Users } from 'lucide-react';
import { useParishData } from '../context/ParishDataContext';
import { usePageSEO } from '../hooks/usePageSEO';
import { useJsonLd } from '../hooks/useJsonLd';
import { ActionBand, InfoCard, ScriptureBlock, SectionIntro, HighlightPageTemplate } from '../components/layout/PageTemplates';
import { ContentLoading, ContentError } from '../components/ContentStates';

const SACRAMENT_ICONS: Record<string, typeof Droplets> = {
    Reconciliation: BookOpen,
    Baptisms: Droplets,
    Weddings: Heart,
    'Sacramental Program': Users,
};

const reveal = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
};

const noMotion = {
    initial: { opacity: 1, y: 0 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0 },
};

export function SacramentsPage() {
    const { content, isLoading } = useParishData();
    const prefersReduced = useReducedMotion();
    const m = prefersReduced ? noMotion : reveal;

    usePageSEO({
        title: 'Sacraments',
        description: 'Information about Reconciliation, Baptism, Weddings, and the Sacramental Program at Greenacres Walkerville Catholic Parish.',
        path: '/sacraments',
    });

    const sacramentsSchema = useMemo(() => ({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Sacraments — Greenacres Walkerville Catholic Parish',
        description: 'Information about Reconciliation, Baptism, Weddings, and the Sacramental Program at Greenacres Walkerville Catholic Parish.',
        url: 'https://www.gwparish.org.au/sacraments',
        mainEntity: {
            '@type': 'ItemList',
            itemListElement: [
                {
                    '@type': 'ListItem',
                    position: 1,
                    item: {
                        '@type': 'Service',
                        name: 'Sacrament of Reconciliation',
                        description: 'The Sacrament of Reconciliation (Confession) is available at Greenacres Walkerville Catholic Parish.',
                        provider: { '@id': 'https://www.gwparish.org.au/#organization' },
                        areaServed: { '@type': 'City', name: 'Adelaide', addressRegion: 'SA', addressCountry: 'AU' },
                    },
                },
                {
                    '@type': 'ListItem',
                    position: 2,
                    item: {
                        '@type': 'Service',
                        name: 'Baptism',
                        description: 'Infant and adult Baptism preparation and celebration at Greenacres Walkerville Catholic Parish.',
                        provider: { '@id': 'https://www.gwparish.org.au/#organization' },
                        areaServed: { '@type': 'City', name: 'Adelaide', addressRegion: 'SA', addressCountry: 'AU' },
                    },
                },
                {
                    '@type': 'ListItem',
                    position: 3,
                    item: {
                        '@type': 'Service',
                        name: 'Catholic Weddings',
                        description: 'Wedding preparation and celebration in the Catholic tradition at Greenacres Walkerville Catholic Parish.',
                        provider: { '@id': 'https://www.gwparish.org.au/#organization' },
                        areaServed: { '@type': 'City', name: 'Adelaide', addressRegion: 'SA', addressCountry: 'AU' },
                    },
                },
                {
                    '@type': 'ListItem',
                    position: 4,
                    item: {
                        '@type': 'Service',
                        name: 'Sacramental Program',
                        description: 'Preparation for First Communion, Confirmation, and RCIA at Greenacres Walkerville Catholic Parish.',
                        provider: { '@id': 'https://www.gwparish.org.au/#organization' },
                        areaServed: { '@type': 'City', name: 'Adelaide', addressRegion: 'SA', addressCountry: 'AU' },
                    },
                },
            ],
        },
    }), []);

    useJsonLd(sacramentsSchema, 'sacraments-page');

    if (isLoading) return <ContentLoading />;
    if (!content) return <ContentError />;

    const sacraments = content.sacraments;

    return (
        <HighlightPageTemplate
            eyebrow="The Sacraments"
            title={<>Grace made visible in our lives.</>}
            description="The sacraments are encounters with Christ that mark the great milestones of the Christian life. Our parish welcomes you to experience these sacred moments."
            imageSrc="/assets/source/hero_4.webp"
            imageAlt="Church sanctuary"
            actions={(
                <>
                    <Link to="/contact" className="pilgrimage-button inline-flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Contact The Office
                    </Link>
                    <Link to="/mass-times" className="pilgrimage-button-secondary">
                        Mass Times
                    </Link>
                </>
            )}
        >
            {/* Sacrament Cards */}
            <section className="page-section">
                <div className="page-section-inner">
                    <SectionIntro
                        eyebrow="Our Sacraments"
                        title={<>Key information for each sacrament.</>}
                        description="Contact the parish office to arrange any sacrament or ask questions about preparation."
                    />

                    <div className="mt-10 grid gap-6 lg:grid-cols-2">
                        {sacraments.map((sac, index) => {
                            const Icon = SACRAMENT_ICONS[sac.title] ?? BookOpen;
                            return (
                                <motion.div
                                    key={sac.title}
                                    {...m}
                                    transition={{
                                        ...m.transition,
                                        delay: prefersReduced ? 0 : index * 0.08,
                                    }}
                                >
                                    <InfoCard className="h-full">
                                        <Icon className="h-6 w-6 text-parish-brass" />
                                        <div className="mt-4 ornamental-kicker">{sac.title}</div>
                                        <p className="mt-3 text-base leading-relaxed text-parish-muted">
                                            {sac.details}
                                        </p>
                                        <Link
                                            to="/contact"
                                            className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-parish-accent no-underline"
                                        >
                                            Enquire <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </InfoCard>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Scripture */}
            <section className="page-section mt-12 md:mt-16">
                <div className="page-section-inner grid gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                        <SectionIntro
                            eyebrow="A Journey of Faith"
                            title={<>Preparing for the Sacraments</>}
                            description="Each sacrament involves a period of preparation — whether you are preparing a child for First Communion, planning a wedding, or exploring the faith for yourself. The parish team will walk alongside you."
                        />
                    </div>
                    <div className="lg:col-span-7">
                        <ScriptureBlock>
                            <div className="ornamental-kicker !text-parish-brass">Scripture</div>
                            <p className="mt-4 text-2xl leading-relaxed text-parish-inverse/88 md:text-[2rem]">
                                &ldquo;Go therefore and make disciples of all nations, baptising them in the name of the Father and of the Son and of the Holy Spirit.&rdquo;
                            </p>
                            <p className="mt-4 text-sm uppercase tracking-[0.22em] text-parish-brass">Matthew 28:19</p>
                        </ScriptureBlock>
                    </div>
                </div>
            </section>

            {/* Contact Prompt */}
            <section className="page-section mt-16 md:mt-20">
                <div className="page-section-inner">
                    <ActionBand>
                        <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
                            <div className="lg:col-span-8">
                                <span className="section-label mb-4">Ready To Take The Next Step</span>
                                <h2 className="text-[clamp(2.1rem,4vw,3.8rem)] text-parish-fg">
                                    Reach out to us — we are here to help you prepare.
                                </h2>
                                <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:gap-6">
                                    <a href="tel:+61882616200" className="flex items-center gap-2 text-sm text-parish-muted no-underline">
                                        <Phone className="h-4 w-4 text-parish-brass" />
                                        (08) 8261 6200
                                    </a>
                                    <a href="mailto:admin@gwparish.org.au" className="flex items-center gap-2 text-sm text-parish-muted no-underline">
                                        <Mail className="h-4 w-4 text-parish-brass" />
                                        admin@gwparish.org.au
                                    </a>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
                                <Link to="/new-here" className="pilgrimage-button">
                                    I&apos;m New Here
                                </Link>
                                <Link to="/mass-times" className="pilgrimage-button-secondary">
                                    View Mass Times
                                </Link>
                            </div>
                        </div>
                    </ActionBand>
                </div>
            </section>
        </HighlightPageTemplate>
    );
}
