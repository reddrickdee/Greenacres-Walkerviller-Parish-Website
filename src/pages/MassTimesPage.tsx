import { Link } from 'react-router-dom';
import { Clock3, MapPinned } from 'lucide-react';
import { useParishData } from '../context/ParishDataContext';
import { usePageSEO } from '../hooks/usePageSEO';
import { useMassCountdowns } from '../hooks/useMassCountdowns';
import { isCoreCountdownMass } from '../lib/massCountdown';
import { ActionBand, InfoCard, SectionIntro, UtilityPageTemplate } from '../components/layout/PageTemplates';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function MassTimesPage() {
    const { content, isLoading } = useParishData();

    usePageSEO({
        title: 'Mass Times',
        description: 'Weekend and weekday Mass schedule for St Monica\'s Walkerville and St Martin\'s Greenacres, plus sacrament and reconciliation information.',
        path: '/mass-times',
        ogImage: '/assets/refurbishment/st_monica_4.webp',
    });

    const { countdownsById } = useMassCountdowns(content?.massSchedule ?? []);

    if (isLoading || !content) {
        return <div className="flex h-screen items-center justify-center bg-parish-bg text-lg text-parish-fg">Loading…</div>;
    }

    const monicaMasses = content.massSchedule.filter(mass => mass.church.includes('Monica'));
    const martinMasses = content.massSchedule.filter(mass => mass.church.includes('Martin'));

    return (
        <UtilityPageTemplate
            eyebrow="Worship Schedule"
            title={<>Know the times. Choose a church. Arrive with peace.</>}
            description="The Mass schedule now leads with legibility: clear addresses, church-by-church grouping, and a visual rhythm that makes the information easy to scan."
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
                        description="Grouping Mass times by church removes friction for visitors and regular parishioners alike."
                    />

                    <div className="mt-10 grid gap-6 lg:grid-cols-2">
                        {[{ title: "St Monica's Church", masses: monicaMasses }, { title: "St Martin's Church", masses: martinMasses }].map(group => (
                            <InfoCard key={group.title}>
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="ornamental-kicker">{group.title}</div>
                                        <h2 className="mt-3 text-3xl text-parish-fg">{group.masses[0]?.address}</h2>
                                    </div>
                                    <MapPinned className="mt-1 h-5 w-5 shrink-0 text-parish-brass" />
                                </div>

                                <div className="mt-8 space-y-5">
                                    {group.masses.map(mass => {
                                        const countdown = isCoreCountdownMass(mass) ? countdownsById[mass.id] : null;

                                        return (
                                            <div key={mass.id} className="rounded-[1.4rem] border border-parish-border/10 bg-parish-border/5 px-5 py-5">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <div className="text-2xl text-parish-fg">{WEEKDAYS[mass.dayOfWeek - 1]} {mass.startTime}</div>
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
                            </InfoCard>
                        ))}
                    </div>
                </div>
            </section>

            <section className="page-section mt-16 md:mt-20">
                <div className="page-section-inner">
                    <SectionIntro
                        eyebrow="Sacraments"
                        title={<>Mass times matter, but sacramental life is the wider rhythm.</>}
                        description="The redesign keeps the schedule practical while linking it to reconciliation, baptisms, weddings, and family sacramental preparation."
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
                                    If you are unsure which Mass or sacrament detail is right for you, contact the parish office directly.
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
