import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { usePageSEO } from '../hooks/usePageSEO';
import { Play, BookOpen, User } from 'lucide-react';
import { ActionBand, SectionIntro, HighlightPageTemplate } from '../components/layout/PageTemplates';

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
        <HighlightPageTemplate
            eyebrow="Homily Archive"
            title={<>Revisit the Word proclaimed across the seasons of the year.</>}
            description="Browse past homilies by liturgical season. Each homily is paired with its scripture reference and date so you can follow the rhythm of the liturgical year."
            imageSrc="/assets/source/hero_4.webp"
            imageAlt="Parish worship during liturgy"
            actions={(
                <>
                    <Link to="/mass-times" className="pilgrimage-button">
                        View Mass Times
                    </Link>
                    <Link to="/live" className="pilgrimage-button-secondary">
                        Watch Live
                    </Link>
                </>
            )}
        >
            <section className="page-section">
                <div className="page-section-inner">
                    <SectionIntro
                        eyebrow="Browse By Season"
                        title={<>Filter homilies by liturgical season.</>}
                    />

                    <div className="mt-6 flex flex-wrap items-center gap-2">
                        {SEASONS.map(season => (
                            <button
                                key={season}
                                onClick={() => setSelectedSeason(season)}
                                className={`rounded-full px-4 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.24em] transition-all duration-300 ${selectedSeason === season
                                    ? 'bg-parish-fg text-parish-inverse shadow-halo'
                                    : 'border border-parish-border/10 bg-parish-surface/70 text-parish-muted hover:border-parish-brass/30 hover:text-parish-fg'
                                    }`}
                            >
                                {season}
                            </button>
                        ))}
                    </div>

                    <div className="mt-10 space-y-4">
                        {filtered.map((homily, i) => (
                            <motion.div
                                key={homily.id}
                                initial={{ opacity: 0, y: 18 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-60px' }}
                                transition={{ duration: 0.55, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                                className="sanctuary-card flex flex-col gap-4 md:flex-row md:items-center"
                            >
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-parish-brass/25 bg-parish-elevated/65 text-parish-brass transition-colors">
                                    <Play size={20} className="ml-0.5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-2xl text-parish-fg">{homily.title}</h3>
                                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-parish-muted">
                                        <span>{homily.date}</span>
                                        <span className="h-1 w-1 rounded-full bg-parish-border/30" />
                                        <span className="flex items-center gap-1"><User size={12} /> {homily.priest}</span>
                                        <span className="h-1 w-1 rounded-full bg-parish-border/30" />
                                        <span className="flex items-center gap-1"><BookOpen size={12} /> {homily.scriptureRef}</span>
                                    </div>
                                </div>
                                <span className="ornamental-kicker shrink-0">{homily.season}</span>
                            </motion.div>
                        ))}
                    </div>

                    {filtered.length === 0 && (
                        <div className="py-16 text-center">
                            <p className="text-lg italic text-parish-muted">No homilies found for this season yet.</p>
                        </div>
                    )}
                </div>
            </section>

            <section className="page-section mt-16 md:mt-20">
                <div className="page-section-inner">
                    <ActionBand>
                        <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
                            <div className="lg:col-span-8">
                                <span className="section-label mb-4">Join Us This Weekend</span>
                                <h2 className="text-[clamp(2.2rem,4vw,3.9rem)] text-parish-fg">
                                    Hear the Word proclaimed in person or watch online from home.
                                </h2>
                            </div>
                            <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
                                <Link to="/mass-times" className="pilgrimage-button">
                                    View Mass Times
                                </Link>
                                <Link to="/live" className="pilgrimage-button-secondary">
                                    Watch Live Stream
                                </Link>
                            </div>
                        </div>
                    </ActionBand>
                </div>
            </section>
        </HighlightPageTemplate>
    );
}
