import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePageSEO } from '../hooks/usePageSEO';
import { Radio, Clock, Play, Calendar } from 'lucide-react';

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
        <div className="min-h-screen bg-parish-bg pt-28 pb-24 px-6 md:px-16 lg:px-24">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="mb-12 text-center"
                >
                    <div className="text-parish-accent font-display tracking-widest text-base uppercase mb-4">Live Stream</div>
                    <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-parish-fg leading-tight mb-6 text-balance">
                        Worship <em className="font-serif italic text-parish-accent">Together</em>
                    </h1>
                    <p className="font-serif text-xl text-parish-muted max-w-2xl mx-auto italic">
                        Join us for Mass from wherever you are. Our live stream brings the parish to your home.
                    </p>
                </motion.div>

                {/* Live player area */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="relative w-full aspect-video rounded-[2rem] overflow-hidden bg-parish-fg mb-12 shadow-2xl"
                >
                    {isLive ? (
                        <iframe
                            src="https://www.youtube.com/embed/live_stream?channel=YOUR_CHANNEL_ID&autoplay=1"
                            title="Live Mass Stream"
                            className="absolute inset-0 w-full h-full"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            loading="lazy"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-parish-surface/80 gap-4 p-8">
                            <Radio size={48} className="opacity-40" />
                            <p className="font-display text-2xl">Currently Offline</p>
                            <p className="font-serif text-lg text-parish-surface/50 italic text-center max-w-md">
                                Our next scheduled stream will begin at the times shown below. Check back soon!
                            </p>
                        </div>
                    )}
                    {isLive && (
                        <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-display tracking-wider uppercase shadow-lg">
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            LIVE NOW
                        </div>
                    )}
                </motion.div>

                {/* Schedule */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mb-16"
                >
                    <h2 className="font-display text-3xl text-parish-fg mb-8 flex items-center gap-3">
                        <Calendar size={24} className="text-parish-accent" />
                        Streaming Schedule
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {STREAM_SCHEDULE.map((item, i) => (
                            <div key={i} className="bg-parish-surface border border-parish-border/10 rounded-2xl p-6 hover:border-parish-accent/30 transition-colors">
                                <div className="font-display tracking-widest text-xs uppercase text-parish-accent mb-2">{item.day}</div>
                                <div className="font-display text-2xl text-parish-fg mb-1 flex items-center gap-2">
                                    <Clock size={18} className="text-parish-muted" /> {item.time}
                                </div>
                                <p className="font-serif text-base text-parish-muted">{item.label}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Past Recordings */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    <h2 className="font-display text-3xl text-parish-fg mb-8 flex items-center gap-3">
                        <Play size={24} className="text-parish-accent" />
                        Past Recordings
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {PAST_RECORDINGS.map(rec => (
                            <div key={rec.id} className="bg-parish-surface border border-parish-border/10 rounded-2xl p-6 flex items-center gap-4 hover:border-parish-accent/30 transition-colors group cursor-pointer">
                                <div className="w-14 h-14 rounded-xl bg-parish-accent/10 flex items-center justify-center shrink-0 group-hover:bg-parish-accent/20 transition-colors">
                                    <Play size={20} className="text-parish-accent ml-0.5" />
                                </div>
                                <div>
                                    <div className="font-display text-lg text-parish-fg group-hover:text-parish-accent transition-colors">{rec.title}</div>
                                    <div className="font-serif text-sm text-parish-muted">{rec.date}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="font-serif text-sm text-parish-muted text-center mt-6 italic">
                        More recordings available on our YouTube channel.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
