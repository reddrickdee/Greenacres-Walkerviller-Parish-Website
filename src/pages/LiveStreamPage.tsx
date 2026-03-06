import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePageSEO } from '../hooks/usePageSEO';
import { Radio, Clock, Play } from 'lucide-react';
import { ActionBand, InfoCard, SectionIntro, UtilityPageTemplate } from '../components/layout/PageTemplates';

const STREAM_SCHEDULE = [
    { day: 'Saturday', time: '6:00 PM', label: 'Saturday Vigil Mass — St Monica\'s' },
    { day: 'Sunday', time: '9:30 AM', label: 'Sunday Mass — St Martin\'s' },
    { day: 'Special', time: 'As announced', label: 'Holy Days & Special Liturgies' },
];

const PAST_RECORDINGS = [
    { id: 'rec-1', title: '5th Sunday of Lent — Sunday Mass', date: '2 March 2026', videoId: '' },
    { id: 'rec-2', title: '4th Sunday of Lent — Sunday Mass', date: '23 February 2026', videoId: '' },
    { id: 'rec-3', title: 'Ash Wednesday Mass', date: '18 February 2026', videoId: '' },
    { id: 'rec-4', title: '6th Sunday in Ordinary Time', date: '16 February 2026', videoId: '' },
];

export function LiveStreamPage() {
    const [isLive] = useState(false); // Would be driven by Supabase config in production

    usePageSEO({
        title: 'Live Stream — Watch Mass Online',
        description: 'Watch Mass live from Greenacres Walkerville Catholic Parish. Saturday Vigil and Sunday Mass streamed online.',
        path: '/live',
    });

    return (
        <UtilityPageTemplate
            eyebrow="Live Stream"
            title={<>Worship together, wherever you are.</>}
            description="Join us for Mass from home. Our live stream brings the parish to your screen during Saturday Vigil and Sunday Mass."
            imageSrc="/assets/source/hero_4.webp"
            imageAlt="Parish worship space"
            actions={(
                <>
                    <Link to="/mass-times" className="pilgrimage-button">
                        View Mass Times
                    </Link>
                    <Link to="/homilies" className="pilgrimage-button-secondary">
                        Homily Archive
                    </Link>
                </>
            )}
            aside={(
                <div className="rounded-[1.5rem] border border-parish-brass/20 bg-parish-border/5 px-5 py-5">
                    <div className="ornamental-kicker">Stream Status</div>
                    <p className="mt-3 text-sm leading-relaxed text-parish-muted">
                        {isLive ? 'We are currently live. Join now.' : 'Currently offline. Check the schedule below for the next stream.'}
                    </p>
                </div>
            )}
        >
            <section className="page-section">
                <div className="page-section-inner">
                    <SectionIntro
                        eyebrow="Watch Now"
                        title={<>The live player will activate when Mass begins.</>}
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
                        className="image-panel relative mt-8 aspect-video w-full overflow-hidden"
                    >
                        {isLive ? (
                            <iframe
                                src="https://www.youtube.com/embed/live_stream?channel=YOUR_CHANNEL_ID&autoplay=1"
                                title="Live Mass Stream"
                                className="absolute inset-0 h-full w-full"
                                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                loading="lazy"
                            />
                        ) : (
                            <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-parish-muted">
                                <Radio size={48} className="opacity-40" />
                                <p className="text-2xl text-parish-fg">Currently Offline</p>
                                <p className="max-w-md text-center text-lg italic text-parish-muted">
                                    Our next scheduled stream will begin at the times shown below. Check back soon!
                                </p>
                            </div>
                        )}
                        {isLive && (
                            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-red-600 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-lg">
                                <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                                LIVE NOW
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            <section className="page-section mt-16 md:mt-20">
                <div className="page-section-inner">
                    <SectionIntro
                        eyebrow="Streaming Schedule"
                        title={<>Know when to tune in.</>}
                        description="All streams are broadcast via YouTube from the parish channel."
                    />
                    <div className="mt-10 grid gap-5 md:grid-cols-3">
                        {STREAM_SCHEDULE.map(item => (
                            <InfoCard key={item.day}>
                                <div className="ornamental-kicker">{item.day}</div>
                                <div className="mt-3 flex items-center gap-2 text-2xl text-parish-fg">
                                    <Clock size={18} className="text-parish-brass" />
                                    {item.time}
                                </div>
                                <p className="mt-3 text-sm leading-relaxed text-parish-muted">{item.label}</p>
                            </InfoCard>
                        ))}
                    </div>
                </div>
            </section>

            <section className="page-section mt-16 md:mt-20">
                <div className="page-section-inner">
                    <SectionIntro
                        eyebrow="Past Recordings"
                        title={<>Missed a Mass? Watch it here.</>}
                    />
                    <div className="mt-10 grid gap-4 sm:grid-cols-2">
                        {PAST_RECORDINGS.map((rec, i) => (
                            <motion.div
                                key={rec.id}
                                initial={{ opacity: 0, y: 18 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-60px' }}
                                transition={{ duration: 0.55, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                                className="sanctuary-card flex cursor-pointer items-center gap-4"
                            >
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-parish-brass/25 bg-parish-elevated/65 text-parish-brass">
                                    <Play size={20} className="ml-0.5" />
                                </div>
                                <div>
                                    <div className="text-lg text-parish-fg">{rec.title}</div>
                                    <div className="text-sm text-parish-muted">{rec.date}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <p className="mt-6 text-center text-sm italic text-parish-muted">
                        More recordings available on our YouTube channel.
                    </p>
                </div>
            </section>

            <section className="page-section mt-16 md:mt-20">
                <div className="page-section-inner">
                    <ActionBand>
                        <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
                            <div className="lg:col-span-8">
                                <span className="section-label mb-4">Prefer To Be There In Person</span>
                                <h2 className="text-[clamp(2.2rem,4vw,3.9rem)] text-parish-fg">
                                    Nothing replaces the experience of worshipping together. Come this weekend.
                                </h2>
                            </div>
                            <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
                                <Link to="/mass-times" className="pilgrimage-button">
                                    View Mass Times
                                </Link>
                                <Link to="/new-here" className="pilgrimage-button-secondary">
                                    First Visit Guide
                                </Link>
                            </div>
                        </div>
                    </ActionBand>
                </div>
            </section>
        </UtilityPageTemplate>
    );
}
