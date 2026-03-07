import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    BookOpenText,
    CalendarClock,
    Church,
    Clock3,
    HeartHandshake,
    MapPinned,
    Users,
} from 'lucide-react';
import { useParishData } from '../context/ParishDataContext';
import { usePageSEO } from '../hooks/usePageSEO';
import { useMassCountdowns } from '../hooks/useMassCountdowns';
import { JsonLdSchema } from '../components/JsonLdSchema';
import { PrayerWallSection } from '../components/PrayerWallSection';
import { DailyReflectionCard } from '../components/home/DailyReflectionCard';
import { ReflectionDateNavigator } from '../components/home/ReflectionDateNavigator';
import { useAvailableReflectionDates } from '../hooks/useAvailableReflectionDates';
import { FacebookFeed } from '../components/social/FacebookFeed';
import { HeroSection } from '../components/home/HeroSection';
import { TestimonialsCarousel } from '../components/ui/TestimonialsCarousel';
import { ActionBand, InfoCard, ScriptureBlock, SectionIntro } from '../components/layout/PageTemplates';
import { ContentLoading, ContentError } from '../components/ContentStates';
import {
    isWeekdayMass,
    isSaturdayMonicaMass,
    isSundayMartinMass,
    getSoonestCountdown,
    DAY_NAMES,
} from '../lib/massCountdown';

function compactText(text: string, sentenceCount: number) {
    return text
        .split(/(?<=[.!?])\s+/)
        .filter(Boolean)
        .slice(0, sentenceCount)
        .join(' ');
}

export function HomePage() {
    const { content, isLoading } = useParishData();
    const [selectedDate, setSelectedDate] = useState(() => new Date().toLocaleDateString('en-CA'));
    const { availableDates } = useAvailableReflectionDates();

    usePageSEO({
        title: 'Greenacres Walkerville Catholic Parish',
        description: 'A welcoming Catholic parish in Adelaide with Mass at St Monica\'s Walkerville and St Martin\'s Greenacres. Find Mass times, first-visit guidance, and parish life.',
        path: '/',
        ogImage: '/assets/source/hero_4.webp',
    });

    const schedule = content?.massSchedule ?? [];
    const countdownEntries = schedule.filter(
        entry => isWeekdayMass(entry) || isSaturdayMonicaMass(entry) || isSundayMartinMass(entry)
    );
    const { now } = useMassCountdowns(countdownEntries);

    if (isLoading) return <ContentLoading />;
    if (!content) return <ContentError />;

    const weekdayEntries = content.massSchedule.filter(isWeekdayMass);
    const saturdayMonicaEntry = content.massSchedule.find(isSaturdayMonicaMass);
    const sundayMartinEntry = content.massSchedule.find(isSundayMartinMass);

    const weekdayCountdown = getSoonestCountdown(weekdayEntries, now);
    const saturdayCountdown = saturdayMonicaEntry
        ? getSoonestCountdown([saturdayMonicaEntry], now)
        : null;
    const sundayCountdown = sundayMartinEntry
        ? getSoonestCountdown([sundayMartinEntry], now)
        : null;

    const monicaMasses = content.massSchedule.filter(mass => mass.church.includes('Monica'));
    const martinMasses = content.massSchedule.filter(mass => mass.church.includes('Martin'));
    const welcomeExcerpt = compactText(content.priestWelcome, 3);
    const councilExcerpt = compactText(content.pastoralChairMessage, 2);

    return (
        <>
            <JsonLdSchema />
            <HeroSection />

            <div className="relative z-20 -mt-16 pb-24 md:pb-32">
                <section className="page-section">
                    <div className="page-section-inner">
                        <motion.div
                            initial={{ opacity: 0, y: 28 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="sanctuary-panel px-6 py-7 md:px-8 md:py-8 lg:px-10 lg:py-10"
                        >
                            <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
                                <div className="lg:col-span-4">
                                    <span className="section-label mb-4">Start Here</span>
                                    <h2 className="text-3xl text-parish-fg md:text-4xl">
                                        First things first: know where to go and when to arrive.
                                    </h2>
                                    <p className="mt-4 text-base leading-relaxed text-parish-muted md:text-lg">
                                        Newcomers should be able to orient themselves in seconds. These are the three pathways most people need immediately.
                                    </p>
                                </div>

                                <div className="grid gap-4 md:grid-cols-3 lg:col-span-8">
                                    <InfoCard className="bg-parish-surface/85">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-parish-brass/25 bg-parish-elevated/65 text-parish-brass">
                                            <CalendarClock className="h-5 w-5" />
                                        </div>
                                        <div className="mt-5 ornamental-kicker">Weekend Masses</div>
                                        <div className="mt-3 text-2xl text-parish-fg">Saturday 6:00pm</div>
                                        <p className="text-sm text-parish-muted">St Monica&apos;s Walkerville</p>
                                        <div className="mt-3 text-2xl text-parish-fg">Sunday 9:30am</div>
                                        <p className="text-sm text-parish-muted">St Martin&apos;s Greenacres</p>
                                        {saturdayCountdown && (
                                            <p className="mt-4 text-sm italic text-parish-accent">
                                                Saturday Mass begins in {saturdayCountdown.countdown.display}
                                            </p>
                                        )}
                                        <Link to="/mass-times" className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-parish-accent no-underline">
                                            Full schedule
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </InfoCard>

                                    <InfoCard>
                                        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-parish-brass/25 bg-parish-elevated/65 text-parish-brass">
                                            <MapPinned className="h-5 w-5" />
                                        </div>
                                        <div className="mt-5 ornamental-kicker">Plan Your Visit</div>
                                        <h3 className="mt-3 text-2xl text-parish-fg">Two churches, one parish family.</h3>
                                        <p className="mt-3 text-sm leading-relaxed text-parish-muted">
                                            View directions, office contact details, and what to expect if you are joining us for the first time.
                                        </p>
                                        <div className="mt-5 space-y-2 text-sm text-parish-muted">
                                            <p>St Monica&apos;s: 90 North East Road, Walkerville</p>
                                            <p>St Martin&apos;s: Corner Muller and Hampstead Roads, Greenacres</p>
                                        </div>
                                        <Link to="/contact" className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-parish-accent no-underline">
                                            Contact and maps
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </InfoCard>

                                    <InfoCard>
                                        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-parish-brass/25 bg-parish-elevated/65 text-parish-brass">
                                            <HeartHandshake className="h-5 w-5" />
                                        </div>
                                        <div className="mt-5 ornamental-kicker">You Belong Here</div>
                                        <h3 className="mt-3 text-2xl text-parish-fg">Not sure what your first visit looks like?</h3>
                                        <p className="mt-3 text-sm leading-relaxed text-parish-muted">
                                            We&apos;ve laid out the first steps clearly so you can arrive with confidence instead of uncertainty.
                                        </p>
                                        <ul className="mt-5 space-y-2 text-sm leading-relaxed text-parish-muted">
                                            {content.newHereSteps.slice(0, 2).map(step => (
                                                <li key={step}>{step}</li>
                                            ))}
                                        </ul>
                                        <Link to="/new-here" className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-parish-accent no-underline">
                                            Read the welcome guide
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </InfoCard>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                <section className="page-section mt-16 md:mt-24">
                    <div className="page-section-inner">
                        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
                            <div className="lg:col-span-5">
                                <SectionIntro
                                    eyebrow="For Newcomers"
                                    title={<>You do not need to know everything before you arrive.</>}
                                    description="This parish should feel calm and legible to first-time visitors. The aim is to make showing up easier than staying away."
                                />
                            </div>
                            <div className="lg:col-span-7 grid gap-6 lg:grid-cols-12">
                                <motion.div
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-70px' }}
                                    transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
                                    className="image-panel min-h-[420px] lg:col-span-5"
                                >
                                    <img
                                        src="/assets/source/welcome_thumb.webp"
                                        alt="Greenacres Walkerville parish welcome scene"
                                        className="h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 z-10 p-6">
                                        <div className="rounded-[1.5rem] border border-parish-overlay-border/15 bg-parish-overlay-bg/30 px-5 py-4 text-parish-overlay-text/88 backdrop-blur-md">
                                            <div className="ornamental-kicker !text-parish-overlay-muted">Sunday Welcome</div>
                                            <p className="mt-2 text-sm leading-relaxed text-parish-overlay-text/82">
                                                Warm hospitality, meaningful worship, and a clear path into parish life.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>

                                <div className="lg:col-span-7 grid gap-4">
                                    {content.newHereSteps.slice(0, 3).map((step, index) => (
                                        <motion.div
                                            key={step}
                                            initial={{ opacity: 0, x: 22 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true, margin: '-80px' }}
                                            transition={{ duration: 0.65, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                                            className="sanctuary-card flex gap-4"
                                        >
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-parish-brass/25 bg-parish-elevated text-sm font-semibold text-parish-brass">
                                                0{index + 1}
                                            </div>
                                            <p className="text-base leading-relaxed text-parish-muted md:text-lg">{step}</p>
                                        </motion.div>
                                    ))}

                                    <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                                        <Link to="/new-here" className="pilgrimage-button">
                                            See The Full Welcome Guide
                                        </Link>
                                        <Link to="/contact" className="pilgrimage-button-secondary">
                                            Contact The Parish Office
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="page-section mt-16 md:mt-24">
                    <div className="page-section-inner">
                        <SectionIntro
                            eyebrow="Mass Locations"
                            title={<>Worship across two churches, each with a clear rhythm and place.</>}
                            description="The quickest way to reduce hesitation is to show visitors exactly where each church is, what Masses happen there, and when the next service begins."
                        />

                        <div className="mt-10 grid gap-6 lg:grid-cols-2">
                            <InfoCard className="p-0">
                                <div className="image-panel min-h-[280px] rounded-none border-x-0 border-t-0 border-b border-parish-border/10">
                                    <img
                                        src="/assets/refurbishment/st_monica_4.webp"
                                        alt="St Monica's Church interior"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="px-6 py-7 md:px-8">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-parish-brass/25 bg-parish-elevated/70 text-parish-brass">
                                            <Church className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="ornamental-kicker">St Monica&apos;s Walkerville</div>
                                            <h3 className="mt-2 text-3xl text-parish-fg">Saturday vigil and weekday worship</h3>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-base leading-relaxed text-parish-muted">{monicaMasses[0]?.address}</p>
                                    <div className="mt-6 space-y-4">
                                        {monicaMasses.map(mass => (
                                            <div key={mass.id} className="flex items-start justify-between gap-4 border-b border-parish-border/10 pb-4 last:border-b-0 last:pb-0">
                                                <div>
                                                    <div className="text-2xl text-parish-fg">{DAY_NAMES[mass.dayOfWeek - 1]} {mass.startTime}</div>
                                                    <p className="text-sm leading-relaxed text-parish-muted">{mass.type}{mass.notes ? ` — ${mass.notes}` : ''}</p>
                                                </div>
                                                <Clock3 className="mt-1 h-5 w-5 shrink-0 text-parish-brass" />
                                            </div>
                                        ))}
                                    </div>
                                    {saturdayCountdown && (
                                        <p className="mt-5 text-sm italic text-parish-accent">
                                            Next vigil Mass begins in {saturdayCountdown.countdown.display}.
                                        </p>
                                    )}
                                </div>
                            </InfoCard>

                            <InfoCard className="p-0">
                                <div className="image-panel min-h-[280px] rounded-none border-x-0 border-t-0 border-b border-parish-border/10">
                                    <img
                                        src="/assets/refurbishment/st_monica_5.webp"
                                        alt="St Martin's Church worship space"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="px-6 py-7 md:px-8">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-parish-brass/25 bg-parish-elevated/70 text-parish-brass">
                                            <Church className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="ornamental-kicker">St Martin&apos;s Greenacres</div>
                                            <h3 className="mt-2 text-3xl text-parish-fg">Sunday morning anchor and weekday prayer</h3>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-base leading-relaxed text-parish-muted">{martinMasses[0]?.address}</p>
                                    <div className="mt-6 space-y-4">
                                        {martinMasses.map(mass => (
                                            <div key={mass.id} className="flex items-start justify-between gap-4 border-b border-parish-border/10 pb-4 last:border-b-0 last:pb-0">
                                                <div>
                                                    <div className="text-2xl text-parish-fg">{DAY_NAMES[mass.dayOfWeek - 1]} {mass.startTime}</div>
                                                    <p className="text-sm leading-relaxed text-parish-muted">{mass.type}{mass.notes ? ` — ${mass.notes}` : ''}</p>
                                                </div>
                                                <Clock3 className="mt-1 h-5 w-5 shrink-0 text-parish-brass" />
                                            </div>
                                        ))}
                                    </div>
                                    {sundayCountdown && (
                                        <p className="mt-5 text-sm italic text-parish-accent">
                                            Next Sunday Mass begins in {sundayCountdown.countdown.display}.
                                        </p>
                                    )}
                                </div>
                            </InfoCard>
                        </div>

                        <ActionBand className="mt-6">
                            <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
                                <div className="lg:col-span-4">
                                    <div className="ornamental-kicker">Weekday Rhythm</div>
                                    <h3 className="mt-3 text-3xl text-parish-fg">Weekday Mass keeps prayer close to daily life.</h3>
                                    {weekdayCountdown && (
                                        <p className="mt-3 text-base leading-relaxed text-parish-muted">
                                            The next weekday Mass is {DAY_NAMES[weekdayCountdown.entry.dayOfWeek - 1]} at {weekdayCountdown.entry.startTime}, beginning in {weekdayCountdown.countdown.display}.
                                        </p>
                                    )}
                                </div>
                                <div className="grid gap-4 md:grid-cols-2 lg:col-span-8">
                                    {content.sacraments.slice(0, 4).map(item => (
                                        <div key={item.title} className="rounded-[1.5rem] border border-parish-border/10 bg-parish-border/5 px-5 py-5">
                                            <div className="ornamental-kicker">{item.title}</div>
                                            <p className="mt-3 text-sm leading-relaxed text-parish-muted">{item.details}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </ActionBand>
                    </div>
                </section>

                <section className="page-section mt-16 md:mt-24">
                    <div className="page-section-inner">
                        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
                            <div className="lg:col-span-5">
                                <SectionIntro
                                    eyebrow="Parish Story"
                                    title={<>A parish identity shaped by welcome, worship, and shared responsibility.</>}
                                    description="The redesign should surface the parish mission without making it feel like a document archive. These sections turn the mission back into a lived invitation."
                                />
                            </div>
                            <div className="lg:col-span-7 grid gap-6">
                                <InfoCard>
                                    <div className="ornamental-kicker">From the Parish</div>
                                    <p className="mt-4 text-lg leading-relaxed text-parish-muted md:text-xl">{welcomeExcerpt}</p>
                                    <p className="mt-4 text-sm leading-relaxed text-parish-muted">{councilExcerpt}</p>
                                    <Link to="/about" className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-parish-accent no-underline">
                                        Read the full parish story
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </InfoCard>

                                <div className="grid gap-6 lg:grid-cols-2">
                                    <ScriptureBlock>
                                        <div className="ornamental-kicker !text-parish-brass">Vision Statement</div>
                                        <p className="mt-4 text-2xl leading-relaxed text-parish-inverse/88 md:text-[1.95rem]">
                                            {content.visionStatement}
                                        </p>
                                        <p className="mt-5 text-sm leading-relaxed text-parish-inverse/68">
                                            {content.parishPrayerText}
                                        </p>
                                    </ScriptureBlock>

                                    <InfoCard>
                                        <div className="ornamental-kicker">Mission in Practice</div>
                                        <div className="mt-4 space-y-4">
                                            {content.missionPoints.slice(0, 4).map(point => (
                                                <div key={point.title} className="flex gap-3">
                                                    <span className="mt-1 text-parish-brass">✦</span>
                                                    <p className="text-sm leading-relaxed text-parish-muted">{point.title}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </InfoCard>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="page-section mt-16 md:mt-24">
                    <div className="page-section-inner">
                        <SectionIntro
                            eyebrow="Community Life"
                            title={<>Parish life is more than Sunday attendance.</>}
                            description="Show the texture of the community: prayer, service, formation, and ordinary ways of belonging."
                        />

                        <div className="mt-10 grid gap-6 lg:grid-cols-12">
                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-80px' }}
                                transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
                                className="image-panel min-h-[360px] lg:col-span-5"
                            >
                                <img
                                    src="/assets/source/our_parish_2.webp"
                                    alt="Members of the parish community gathered together"
                                    className="h-full w-full object-cover"
                                />
                            </motion.div>

                            <div className="grid gap-5 md:grid-cols-2 lg:col-span-7">
                                <InfoCard>
                                    <Users className="h-6 w-6 text-parish-brass" />
                                    <div className="mt-4 ornamental-kicker">Ways to Belong</div>
                                    <div className="mt-3 space-y-3">
                                        {content.communityServices.slice(0, 3).map(item => (
                                            <p key={item} className="text-sm leading-relaxed text-parish-muted">{item}</p>
                                        ))}
                                    </div>
                                </InfoCard>
                                <InfoCard>
                                    <BookOpenText className="h-6 w-6 text-parish-brass" />
                                    <div className="mt-4 ornamental-kicker">Faith Formation</div>
                                    <div className="mt-3 space-y-3">
                                        {content.faithFormation.slice(0, 3).map(item => (
                                            <p key={item} className="text-sm leading-relaxed text-parish-muted">{item}</p>
                                        ))}
                                    </div>
                                </InfoCard>
                                <InfoCard>
                                    <HeartHandshake className="h-6 w-6 text-parish-brass" />
                                    <div className="mt-4 ornamental-kicker">Serve Generously</div>
                                    <p className="mt-3 text-sm leading-relaxed text-parish-muted">
                                        Volunteer pathways, outreach, music, and practical parish service all shape the welcome people feel when they come through the doors.
                                    </p>
                                    <Link to="/volunteer" className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-parish-accent no-underline">
                                        Explore service opportunities
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </InfoCard>
                                <InfoCard>
                                    <MapPinned className="h-6 w-6 text-parish-brass" />
                                    <div className="mt-4 ornamental-kicker">Stay Connected</div>
                                    <p className="mt-3 text-sm leading-relaxed text-parish-muted">
                                        Follow upcoming events, bulletin updates, and parish rhythms without hunting across the site.
                                    </p>
                                    <Link to="/news-events" className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-parish-accent no-underline">
                                        View news and events
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </InfoCard>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="page-section mt-16 md:mt-24">
                    <div className="page-section-inner">
                        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
                            <div className="lg:col-span-7">
                                <SectionIntro
                                    eyebrow="Daily Reflection"
                                    title={<>Carry a moment of prayer into the rest of the week.</>}
                                    description="The daily reflection remains a core interactive feature, now positioned as a contemplative stop in the overall journey."
                                />
                                <div className="mt-8 space-y-6">
                                    <ReflectionDateNavigator
                                        selectedDate={selectedDate}
                                        onDateChange={setSelectedDate}
                                        availableDates={availableDates}
                                    />
                                    <DailyReflectionCard selectedDate={selectedDate} />
                                </div>
                            </div>

                            <div className="lg:col-span-5">
                                <InfoCard className="h-full">
                                    <div className="ornamental-kicker">Why People Stay</div>
                                    <h3 className="mt-3 text-3xl text-parish-fg">A parish website should feel like the parish itself.</h3>
                                    <p className="mt-4 text-base leading-relaxed text-parish-muted">
                                        Reverence matters. So does clarity. The strongest church website is one that lowers anxiety, respects tradition, and gives people a clear next step.
                                    </p>
                                    <div className="mt-6 grid gap-4">
                                        <div className="rounded-[1.5rem] border border-parish-border/10 bg-parish-border/5 px-5 py-5">
                                            <div className="ornamental-kicker">Practical</div>
                                            <p className="mt-3 text-sm leading-relaxed text-parish-muted">Mass times, maps, office contact, and first-visit details are surfaced early.</p>
                                        </div>
                                        <div className="rounded-[1.5rem] border border-parish-border/10 bg-parish-border/5 px-5 py-5">
                                            <div className="ornamental-kicker">Prayerful</div>
                                            <p className="mt-3 text-sm leading-relaxed text-parish-muted">Scripture, reflections, prayer intentions, and visual calm give the site a devotional center.</p>
                                        </div>
                                        <div className="rounded-[1.5rem] border border-parish-border/10 bg-parish-border/5 px-5 py-5">
                                            <div className="ornamental-kicker">Personal</div>
                                            <p className="mt-3 text-sm leading-relaxed text-parish-muted">Newcomers can move from curiosity to belonging without decoding church jargon.</p>
                                        </div>
                                    </div>
                                </InfoCard>
                            </div>
                        </div>
                    </div>
                </section>

                <TestimonialsCarousel />

                <section className="page-section mt-16 md:mt-24">
                    <div className="page-section-inner">
                        <SectionIntro
                            eyebrow="Community Pulse"
                            title={<>See the parish breathing in real time.</>}
                            description="The prayer wall and parish updates stay interactive, but they now sit inside the stronger visual hierarchy instead of competing with the hero."
                        />

                        <div className="mt-10 grid items-start gap-8 lg:grid-cols-12 xl:gap-12">
                            <div className="lg:col-span-7">
                                <div className="sanctuary-panel px-6 py-6 md:px-8 md:py-8">
                                    <PrayerWallSection embedded={true} maxItems={4} />
                                </div>
                            </div>
                            <div className="lg:col-span-5">
                                <div className="sanctuary-panel px-5 py-5 md:px-6 md:py-6">
                                    <div className="mb-4">
                                        <div className="ornamental-kicker">Parish Updates</div>
                                        <h3 className="mt-3 text-3xl text-parish-fg">From the official parish feed</h3>
                                    </div>
                                    <FacebookFeed pageId="61584973342464" height={560} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="page-section mt-16 md:mt-24">
                    <div className="page-section-inner">
                        <ActionBand>
                            <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
                                <div className="lg:col-span-7">
                                    <span className="section-label mb-4">Come This Weekend</span>
                                    <h2 className="text-[clamp(2.4rem,4vw,4.4rem)] text-parish-fg">
                                        If this is your first visit, start with Mass times and let the rest unfold from there.
                                    </h2>
                                    <p className="mt-4 max-w-2xl text-base leading-relaxed text-parish-muted md:text-lg">
                                        The site should help people arrive, not overwhelm them. Begin with the schedule, bring your questions, and know that there is already space for you here.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-3 lg:col-span-5 lg:items-end">
                                    <Link to="/mass-times" className="pilgrimage-button">
                                        View This Weekend&apos;s Mass Times
                                    </Link>
                                    <Link to="/new-here" className="pilgrimage-button-secondary">
                                        Read The First-Visit Guide
                                    </Link>
                                </div>
                            </div>
                        </ActionBand>
                    </div>
                </section>
            </div>
        </>
    );
}
