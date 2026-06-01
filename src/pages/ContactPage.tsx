import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPinned, MapPinOff, Phone } from 'lucide-react';
import { useParishData } from '../context/ParishDataContext';
import { usePageSEO } from '../hooks/usePageSEO';
import { ActionBand, InfoCard, SectionIntro, UtilityPageTemplate } from '../components/layout/PageTemplates';
import { ContentLoading, ContentError } from '../components/ContentStates';

/**
 * Lifecycle of an embedded Google Maps iframe.
 * Task 4.4 added 'loading'/'loaded'; task 4.5 adds 'error' for load failure or block.
 */
type MapStatus = 'loading' | 'loaded' | 'error';

/**
 * How long to wait for the iframe `onLoad` before treating the map as
 * unavailable. Cross-origin iframes (Google Maps) do not reliably fire
 * `onError` when blocked, so a timeout fallback surfaces the unavailable
 * indication even when the frame is silently blocked.
 */
const MAP_LOAD_TIMEOUT_MS = 10_000;

interface MapEmbedProps {
    /** Non-empty, AT-friendly title naming the mapped location (church + suburb). */
    title: string;
    /** Google Maps search query for this church. */
    query: string;
    /** Human-readable location text, retained when the map is unavailable. */
    address: string;
}

/**
 * Google Maps embed with visible loading and failure states.
 *
 * While the iframe loads, a spinner is shown inside a rounded container that
 * uses the warm-tinted Shadow_Token_System (`--shadow-md`). When the iframe's
 * `onLoad` fires, the loader is replaced by the revealed map.
 *
 * If the iframe errors, or fails to load before {@link MAP_LOAD_TIMEOUT_MS}
 * (covering blocked third-party frames that never fire `onError`), a
 * map-unavailable indication is shown in the same container while the visible
 * text address is retained.
 */
function MapEmbed({ title, query, address }: MapEmbedProps) {
    const [status, setStatus] = useState<MapStatus>('loading');
    const isLoaded = status === 'loaded';
    const isError = status === 'error';

    // Timeout fallback: a blocked iframe may never fire `onError`, so flip to
    // the unavailable state if the map has not loaded in time.
    useEffect(() => {
        if (status !== 'loading') return;
        const timer = window.setTimeout(() => {
            setStatus(current => (current === 'loading' ? 'error' : current));
        }, MAP_LOAD_TIMEOUT_MS);
        return () => window.clearTimeout(timer);
    }, [status]);

    return (
        <div
            className="relative mt-5 h-72 w-full overflow-hidden rounded-[1.5rem] border border-parish-border/10 bg-parish-surface"
            style={{ boxShadow: 'var(--shadow-md)' }}
        >
            {isError ? (
                <div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-parish-surface px-6 text-center"
                    role="status"
                    aria-live="polite"
                >
                    <MapPinOff className="h-7 w-7 text-parish-brass" aria-hidden="true" />
                    <p className="text-sm font-semibold text-parish-fg">Map unavailable</p>
                    <p className="text-sm leading-relaxed text-parish-muted">
                        We couldn&apos;t load the interactive map. You can still find us at:
                    </p>
                    <p className="text-sm leading-relaxed text-parish-fg">{address}</p>
                </div>
            ) : (
                <>
                    {!isLoaded && (
                        <div
                            className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-parish-surface"
                            role="status"
                            aria-live="polite"
                        >
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-parish-border/20 border-t-parish-accent" />
                            <p className="text-sm text-parish-muted">Loading map…</p>
                        </div>
                    )}
                    <iframe
                        title={title}
                        className={`h-full w-full transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`}
                        loading="lazy"
                        onLoad={() => setStatus('loaded')}
                        onError={() => setStatus('error')}
                    />
                </>
            )}
        </div>
    );
}

export function ContactPage() {
    const { content, isLoading } = useParishData();

    usePageSEO({
        title: 'Contact Us',
        description: 'Contact Greenacres Walkerville Catholic Parish, find office hours, church locations, and parish school details.',
        path: '/contact',
        ogImage: '/assets/source/hero_2.webp',
    });

    if (isLoading) return <ContentLoading />;
    if (!content) return <ContentError />;

    const { contact, schools } = content;

    return (
        <UtilityPageTemplate
            eyebrow="Contact And Directions"
            title={<>Reach the parish quickly, whether you need support or simply directions.</>}
            description="Find the parish office, phone, email, and church locations — everything you need to reach us or plan your visit."
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
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-parish-accent">
                        Details last checked {content.lastVerified}
                    </p>
                </div>
            )}
        >
            <section className="page-section">
                <div className="page-section-inner grid gap-6 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                        <SectionIntro
                            eyebrow="Parish Office"
                            title={<>Start with the office if you are unsure where your question belongs.</>}
                            description="The office handles pastoral care, sacraments, administration, and first-visit questions. Call or email during the hours below."
                        />
                    </div>

                    <div className="grid gap-6 lg:col-span-7 md:grid-cols-2">
                        <InfoCard>
                            <MapPinned className="h-6 w-6 text-parish-brass" aria-hidden="true" />
                            <div className="mt-4 ornamental-kicker">Address</div>
                            <p className="mt-3 text-lg leading-relaxed text-parish-fg">{contact.address}</p>
                            <div className="mt-5 ornamental-kicker">Postal Address</div>
                            <p className="mt-3 text-sm leading-relaxed text-parish-muted">{contact.postalAddress}</p>
                        </InfoCard>
                        <InfoCard>
                            <Phone className="h-6 w-6 text-parish-brass" aria-hidden="true" />
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

            <section className="page-section mt-16 md:mt-24">
                <div className="page-section-inner">
                    <SectionIntro
                        eyebrow="Church Maps"
                        title={<>Find either church on the map and plan your route.</>}
                        description="Both churches are easy to reach by car or public transport. Parking details are available on the Mass Times page."
                    />

                    <div className="mt-10 grid gap-6 lg:grid-cols-2">
                        <InfoCard className="p-5 md:p-6">
                            <div className="ornamental-kicker">St Monica&apos;s Church</div>
                            <p className="mt-3 text-sm leading-relaxed text-parish-muted">{contact.stMonicaQuery}</p>
                            <MapEmbed
                                title="Map of St Monica's Church, Walkerville"
                                query={contact.stMonicaQuery}
                                address={contact.stMonicaQuery}
                            />
                        </InfoCard>

                        <InfoCard className="p-5 md:p-6">
                            <div className="ornamental-kicker">St Martin&apos;s Church</div>
                            <p className="mt-3 text-sm leading-relaxed text-parish-muted">{contact.stMartinQuery}</p>
                            <MapEmbed
                                title="Map of St Martin's Church, Greenacres"
                                query={contact.stMartinQuery}
                                address={contact.stMartinQuery}
                            />
                        </InfoCard>
                    </div>
                </div>
            </section>

            <section className="page-section mt-16 md:mt-24">
                <div className="page-section-inner">
                    <SectionIntro
                        eyebrow="Parish Schools"
                        title={<>Our parish is supported by two Catholic schools.</>}
                        description="Contact the schools directly for enrolment inquiries and school-related questions."
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

            <section className="page-section mt-16 md:mt-24">
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
