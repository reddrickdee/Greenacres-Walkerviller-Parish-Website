import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { usePageSEO } from '../hooks/usePageSEO';
import { Play, Filter, BookOpen, User } from 'lucide-react';

interface Homily {
    id: string;
    title: string;
    date: string;
    priest: string;
    scriptureRef: string;
    season: string;
    audioUrl?: string;
    videoUrl?: string;
}

// Sample data — in production sourced from public/data/homilies.json or Supabase
const HOMILIES: Homily[] = [
    { id: 'h1', title: 'The Prodigal Son', date: '2 March 2026', priest: 'Fr Steve Astill', scriptureRef: 'Luke 15:11-32', season: 'Lent', audioUrl: '#' },
    { id: 'h2', title: 'The Light of the World', date: '23 February 2026', priest: 'Fr Steve Astill', scriptureRef: 'John 8:12-20', season: 'Lent', audioUrl: '#' },
    { id: 'h3', title: 'Faith and Healing', date: '16 February 2026', priest: 'Fr Steve Astill', scriptureRef: 'Mark 1:40-45', season: 'Ordinary Time', audioUrl: '#' },
    { id: 'h4', title: 'Called to Serve', date: '9 February 2026', priest: 'Fr Steve Astill', scriptureRef: 'Mark 1:29-39', season: 'Ordinary Time', audioUrl: '#' },
    { id: 'h5', title: 'The Good Shepherd', date: '2 February 2026', priest: 'Fr Steve Astill', scriptureRef: 'John 10:11-18', season: 'Ordinary Time', audioUrl: '#' },
    { id: 'h6', title: 'Christmas Day Homily', date: '25 December 2025', priest: 'Fr Steve Astill', scriptureRef: 'John 1:1-14', season: 'Christmas', audioUrl: '#' },
];

const SEASONS = ['All', 'Lent', 'Ordinary Time', 'Christmas', 'Advent', 'Easter'];

export function HomiliesPage() {
    const [selectedSeason, setSelectedSeason] = useState('All');

    usePageSEO({
        title: 'Homily Archive — Past Homilies',
        description: 'Listen to past homilies from Greenacres Walkerville Catholic Parish. Browse by liturgical season.',
        path: '/homilies',
    });

    const filtered = useMemo(() =>
        selectedSeason === 'All'
            ? HOMILIES
            : HOMILIES.filter(h => h.season === selectedSeason),
        [selectedSeason]
    );

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
                    <div className="text-parish-accent font-display tracking-widest text-base uppercase mb-4">Homily Archive</div>
                    <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-parish-fg leading-tight mb-6 text-balance">
                        The Word <em className="font-serif italic text-parish-accent">Proclaimed</em>
                    </h1>
                    <p className="font-serif text-xl text-parish-muted max-w-2xl mx-auto italic">
                        Revisit and reflect on past homilies from our parish.
                    </p>
                </motion.div>

                {/* Season filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="flex items-center gap-2 mb-8 flex-wrap"
                >
                    <Filter size={16} className="text-parish-muted" />
                    {SEASONS.map(season => (
                        <button
                            key={season}
                            onClick={() => setSelectedSeason(season)}
                            className={`px-4 py-2 rounded-full font-display tracking-wider text-xs uppercase transition-all ${selectedSeason === season
                                ? 'bg-parish-accent text-white shadow-md'
                                : 'bg-parish-surface border border-parish-border/10 text-parish-muted hover:border-parish-accent/30'
                                }`}
                        >
                            {season}
                        </button>
                    ))}
                </motion.div>

                {/* Homily cards */}
                <div className="space-y-4">
                    {filtered.map((homily, i) => (
                        <motion.div
                            key={homily.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.05 }}
                            className="bg-parish-surface border border-parish-border/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4 hover:border-parish-accent/30 transition-colors group"
                        >
                            {/* Play button */}
                            <div className="w-14 h-14 rounded-xl bg-parish-accent/10 flex items-center justify-center shrink-0 group-hover:bg-parish-accent/20 transition-colors">
                                <Play size={20} className="text-parish-accent ml-0.5" />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-display text-xl text-parish-fg group-hover:text-parish-accent transition-colors mb-1">{homily.title}</h3>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-parish-muted font-serif">
                                    <span>{homily.date}</span>
                                    <span className="w-1 h-1 rounded-full bg-parish-border/30" />
                                    <span className="flex items-center gap-1"><User size={12} /> {homily.priest}</span>
                                    <span className="w-1 h-1 rounded-full bg-parish-border/30" />
                                    <span className="flex items-center gap-1"><BookOpen size={12} /> {homily.scriptureRef}</span>
                                </div>
                            </div>

                            {/* Season badge */}
                            <span className="px-3 py-1 bg-parish-accent/5 text-parish-accent rounded-full font-display text-xs tracking-wider uppercase shrink-0">
                                {homily.season}
                            </span>
                        </motion.div>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-16">
                        <p className="font-serif text-lg text-parish-muted italic">No homilies found for this season yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
