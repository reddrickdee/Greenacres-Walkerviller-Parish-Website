import { Link } from 'react-router-dom';
import { Clock3, MapPinned, Car, Accessibility, ArrowRight } from 'lucide-react';
import { useParishData } from '../context/ParishDataContext';
import { usePageSEO } from '../hooks/usePageSEO';
import { useMassCountdowns } from '../hooks/useMassCountdowns';
import { isCoreCountdownMass } from '../lib/massCountdown';
import type { MassCountdown } from '../lib/massCountdown';
import { ActionBand, InfoCard, SectionIntro, UtilityPageTemplate } from '../components/layout/PageTemplates';
import { ContentLoading, ContentError } from '../components/ContentStates';
import type { MassScheduleEntry, VisitorChurchInfo } from '../types';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/** Sort masses so weekend services appear before weekday. */
function weekendFirst(masses: MassScheduleEntry[]): MassScheduleEntry[] {
    return [...masses].sort((a, b) => {
        const aIsWeekend = a.dayOfWeek >= 6 ? 0 : 1;
        const bIsWeekend = b.dayOfWeek >= 6 ? 0 : 1;
        return aIsWeekend - bIsWeekend || a.dayOfWeek - b.dayOfWeek;
    });
}

function formatTime(time: string): string {
    const [h, m] = time.split(':').map(Number);
    const ampm = h >= 12 ? 'pm' : 'am';
    return `${h > 12 ? h - 12 : h}:${String(m).padStart(2, '0')}${ampm}`;
}

export function MassTimesPage() {
    const { content, isLoading } = useParishData();

    usePageSEO({
        title: 'Mass Times',
        description: 'Weekend and weekday Mass schedule for St Monica\'s Walkerville and St Martin\'s Greenacres, plus sacrament and reconciliation information.',
        path: '/mass-times',
        ogImage: '/assets/refurbishment/st_monica_4.webp',
    });

    const { countdownsById } = useMassCountdowns(content?.massSchedule ?? []);

    if (isLoading) return <ContentLoading />;
    if (!content) return <ContentError />;

    const monicaMasses = weekendFirst(content.massSchedule.filter(mass => mass.church.includes('Monica')));
    const martinMasses = weekendFirst(content.massSchedule.filter(mass => mass.church.includes('Martin')));
    const visitorChurches = content.visitorInfo?.churches ?? [];

    const churchGroups = [
        { title: "St Monica's Church", masses: monicaMasses, info: visitorChurches.find(c => c.id === 'st-monicas') },
        { title: "St Martin's Church", masses: martinMasses, info: visitorChurches.find(c => c.id === 'st-martins') },
    ];

    return (
        <UtilityPageTemplate
            eyebrow="Worship Schedule"
            title={<>Know the times. Choose a church. Arrive with peace.</>}
            description="Two churches, one parish family. Weekend services are listed first under each church, followed by weekday Mass."
            imageSrc="/assets/refurbishment/st_monica_4.webp"
            imageAlt="Sanctuary at St Monica's Church"
            actions={(
                <>
                    <Link to="/new-here" className="pilgrimage-button">
                        First Visit Guide
                    </Link>
                    <Link to="/contact" className="pilgrimage-button-secondary">
                        Contact And Directions
                    </Link>
                </>
            )}
            aside={(
                <div className="rounded-[1.5rem] border border-parish-brass/20 bg-parish-border/5 px-5 py-5">
                    <div className="ornamental-kicker">Weekend Anchor</div>
                    <p className="mt-3 text-sm leading-relaxed text-parish-muted">
                        Saturday 6:00pm at St Monica&apos;s Walkerville and Sunday 9:30am at St Martin&apos;s Greenacres.
                    </p>
                </div>
            )}
        >
            <section className="page-section">
                <div className="page-section-inner">
                    <SectionIntro
                        eyebrow="Two Churches"
                        title={<>One parish family, worshipping across two local communities.</>}
                        description="Each church is listed with its schedule, directions, and practical logistics for visitors."
                    />

                    <div className="mt-10 grid gap-6 lg:grid-cols-2">
                        {churchGroups.map(group => (
                            <ChurchCard
                                key={group.title}
                                title={group.title}
                                masses={group.masses}
                                info={group.info}
                                countdownsById={countdownsById}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <section className="page-section mt-16 md:mt-20">
                <div className="page-section-inner">
                    <SectionIntro
                        eyebrow="Sacraments"
                        title={<>The wider rhythm of sacramental life.</>}
                        description="Reconciliation, baptisms, weddings, and preparation programs are available alongside the regular Mass schedule."
                    />

                    <div className="mt-10 grid gap-5 md:grid-cols-2">
                        {content.sacraments.map(item => (
                            <InfoCard key={item.title}>
                                <div className="ornamental-kicker">{item.title}</div>
                                <p className="mt-4 text-sm leading-relaxed text-parish-muted md:text-base">{item.details}</p>
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
                                <span className="section-label mb-4">Need More Help</span>
                                <h2 className="text-[clamp(2.2rem,4vw,3.9rem)] text-parish-fg">
                                    Contact the parish office to ask about services, sacraments, or how to get involved.
                                </h2>
                            </div>
                            <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
                                <Link to="/contact" className="pilgrimage-button">
                                    Contact The Parish Office
                                </Link>
                                <Link to="/sacraments" className="pilgrimage-button-secondary">
                                    Explore Sacraments
                                </Link>
                            </div>
                        </div>
                    </ActionBand>
                </div>
            </section>
        </UtilityPageTemplate>
    );
}

/** Per-church card with schedule, visitor logistics, and map link. */
function ChurchCard({
    title,
    masses,
    info,
    countdownsById,
}: {
    title: string;
    masses: MassScheduleEntry[];
    info?: VisitorChurchInfo;
    countdownsById: Record<string, MassCountdown | null>;
}) {
    const mapUrl = info?.mapQuery
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(info.mapQuery)}`
        : null;

    return (
        <InfoCard>
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="ornamental-kicker">{title}</div>
                    <h2 className="mt-3 text-3xl text-parish-fg">{masses[0]?.address}</h2>
                </div>
                <MapPinned className="mt-1 h-5 w-5 shrink-0 text-parish-brass" />
            </div>

            {/* Visitor logistics from visitorInfo */}
            {info && (
                <div className="mt-6 space-y-3">
                    <div className="flex items-start gap-3 rounded-[1.2rem] border border-parish-border/10 bg-parish-border/5 px-4 py-3">
                        <Car className="mt-0.5 h-4 w-4 shrink-0 text-parish-accent" />
                        <p className="text-sm leading-relaxed text-parish-muted">{info.parkingSummary}</p>
                    </div>
                    <div className="flex items-start gap-3 rounded-[1.2rem] border border-parish-border/10 bg-parish-border/5 px-4 py-3">
                        <Accessibility className="mt-0.5 h-4 w-4 shrink-0 text-parish-accent" />
                        <p className="text-sm leading-relaxed text-parish-muted">{info.accessibilitySummary}</p>
                    </div>
                    <p className="text-sm leading-relaxed text-parish-muted italic">{info.arrivalTip}</p>
                </div>
            )}

            {/* Mass schedule with live countdowns */}
            <div className="mt-8 space-y-5">
                {masses.map(mass => {
                    const countdown = isCoreCountdownMass(mass) ? countdownsById[mass.id] : null;

                    return (
                        <div key={mass.id} className="rounded-[1.4rem] border border-parish-border/10 bg-parish-border/5 px-5 py-5">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="text-2xl text-parish-fg">{WEEKDAYS[mass.dayOfWeek - 1]} {formatTime(mass.startTime)}</div>
                                    <p className="mt-1 text-sm leading-relaxed text-parish-muted">
                                        {mass.type}{mass.notes ? ` — ${mass.notes}` : ''}
                                    </p>
                                </div>
                                <Clock3 className="mt-1 h-5 w-5 shrink-0 text-parish-brass" />
                            </div>
                            {countdown && (
                                <p className="mt-3 text-sm italic text-parish-accent" aria-live="polite">
                                    Next celebration begins in {countdown.display}.
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Map/contact actions */}
            <div className="mt-6 flex flex-wrap gap-3">
                {mapUrl && (
                    <a
                        href={mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-parish-accent no-underline"
                    >
                        <MapPinned className="h-4 w-4" />
                        Directions
                    </a>
                )}
                <Link to="/contact" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-parish-accent no-underline">
                    Contact Office
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </InfoCard>
    );
}
