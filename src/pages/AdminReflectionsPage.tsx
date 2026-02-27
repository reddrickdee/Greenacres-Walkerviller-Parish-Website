import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, Save, Check, AlertCircle, ArrowLeft, Calendar,
    ChevronDown, ChevronLeft, ChevronRight, BookOpenText, Heart, HandHeart, Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchUniversalisReadings } from '../lib/universalisApi';
import { loadDailyReflectionFromCMS, upsertReflection } from '../lib/api';
import type { DailyReflection } from '../types';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export function AdminReflectionsPage() {
    const [selectedDate, setSelectedDate] = useState(() => new Date().toLocaleDateString('en-CA'));
    const [readings, setReadings] = useState<DailyReflection | null>(null);
    const [loadingReadings, setLoadingReadings] = useState(true);

    // Reflection form state
    const [reflectionContext, setReflectionContext] = useState('');
    const [reflectionBody, setReflectionBody] = useState('');
    const [reflectionPrayer, setReflectionPrayer] = useState('');
    const [reflectionAuthor, setReflectionAuthor] = useState('');
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

    // Readings accordion
    const [expandedReading, setExpandedReading] = useState('');

    // Fetch readings and existing reflection data for the selected date
    const fetchData = useCallback(async () => {
        setLoadingReadings(true);
        setSaveStatus('idle');

        const [universalisData, cmsData] = await Promise.all([
            fetchUniversalisReadings(selectedDate).catch(() => null),
            loadDailyReflectionFromCMS(selectedDate).catch(() => null),
        ]);

        setReadings(universalisData || cmsData);

        // Populate form with existing reflection data from CMS
        setReflectionContext(cmsData?.reflectionContext ?? '');
        setReflectionBody(cmsData?.reflectionBody ?? '');
        setReflectionPrayer(cmsData?.reflectionPrayer ?? '');
        setReflectionAuthor(cmsData?.reflectionAuthor ?? '');

        setLoadingReadings(false);
    }, [selectedDate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Date navigation
    const adjustDate = (days: number) => {
        const d = new Date(selectedDate + 'T00:00:00');
        d.setDate(d.getDate() + days);
        setSelectedDate(d.toLocaleDateString('en-CA'));
    };

    const handleSave = async () => {
        setSaveStatus('saving');
        const success = await upsertReflection(selectedDate, {
            reflectionContext: reflectionContext || undefined,
            reflectionBody: reflectionBody || undefined,
            reflectionPrayer: reflectionPrayer || undefined,
            reflectionAuthor: reflectionAuthor || undefined,
            title: readings?.title,
            liturgicalColor: readings?.liturgicalColor,
        });
        setSaveStatus(success ? 'saved' : 'error');
        if (success) {
            setTimeout(() => setSaveStatus('idle'), 3000);
        }
    };

    // Build readings list for preview
    const readingsList: { key: string; label: string; html?: string }[] = [];
    if (readings?.firstReadingHtml) readingsList.push({ key: 'r1', label: 'First Reading', html: readings.firstReadingHtml });
    if (readings?.psalmHtml) readingsList.push({ key: 'ps', label: 'Responsorial Psalm', html: readings.psalmHtml });
    if (readings?.secondReadingHtml) readingsList.push({ key: 'r2', label: 'Second Reading', html: readings.secondReadingHtml });
    if (readings?.gospelAcclamationHtml) readingsList.push({ key: 'ga', label: 'Gospel Acclamation', html: readings.gospelAcclamationHtml });
    if (readings?.gospelHtml) readingsList.push({ key: 'g', label: 'Gospel', html: readings.gospelHtml });

    const colorMap: Record<string, string> = {
        'Green': 'bg-emerald-600',
        'Violet': 'bg-purple-700',
        'Purple': 'bg-purple-700',
        'White': 'bg-amber-100',
        'Red': 'bg-red-700',
        'Rose': 'bg-pink-400',
    };
    const accentColor = colorMap[readings?.liturgicalColor ?? ''] || 'bg-parish-accent';

    return (
        <div className="bg-parish-surface min-h-screen text-parish-fg">
            {/* Header */}
            <header className="bg-parish-accent/5 py-12 md:py-16 border-b border-parish-border/10">
                <div className="max-w-5xl mx-auto px-6 md:px-12">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-parish-muted hover:text-parish-accent font-display text-xs uppercase tracking-widest transition-colors mb-6"
                    >
                        <ArrowLeft size={14} /> Back to Home
                    </Link>
                    <div className="flex items-center gap-3">
                        <Sparkles size={28} className="text-parish-accent" />
                        <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-wider text-parish-accent">
                            Daily Reflection Editor
                        </h1>
                    </div>
                    <p className="font-serif text-parish-muted mt-3 italic">
                        Readings are fetched automatically from Universalis. Use this page to write your daily reflection.
                    </p>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 md:px-12 py-10 space-y-10">
                {/* Date Selector */}
                <div className="flex items-center gap-4 justify-center">
                    <button
                        onClick={() => adjustDate(-1)}
                        className="p-2 rounded-xl bg-parish-bg border border-parish-border/10 hover:bg-parish-accent/10 transition-colors"
                        aria-label="Previous day"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex items-center gap-3 bg-parish-bg px-6 py-3 rounded-2xl border border-parish-border/10 min-w-[280px] justify-center">
                        <Calendar size={18} className="text-parish-brass" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-transparent font-display tracking-wider text-lg text-center outline-none text-parish-fg"
                        />
                    </div>
                    <button
                        onClick={() => adjustDate(1)}
                        className="p-2 rounded-xl bg-parish-bg border border-parish-border/10 hover:bg-parish-accent/10 transition-colors"
                        aria-label="Next day"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                <p className="text-center font-serif text-parish-muted text-lg italic">
                    {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-AU', {
                        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                    })}
                </p>

                {/* Auto-Fetched Readings Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-parish-bg rounded-3xl border border-parish-border/10 overflow-hidden"
                >
                    {/* Liturgical color bar */}
                    <div className={`h-2 w-full ${accentColor}`} />

                    <div className="px-6 md:px-8 py-6 border-b border-parish-border/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <BookOpen size={18} className="text-parish-brass" />
                            <h2 className="font-display text-xl tracking-wider text-parish-fg">
                                Today&apos;s Readings
                            </h2>
                            <span className="text-xs font-display tracking-widest text-parish-muted uppercase ml-2">
                                (Auto-fetched from Universalis)
                            </span>
                        </div>
                        {readings?.title && (
                            <span className="font-serif text-sm text-parish-muted italic hidden md:inline">{readings.title}</span>
                        )}
                    </div>

                    {loadingReadings ? (
                        <div className="p-12 flex justify-center">
                            <div className="w-8 h-8 border-2 border-parish-accent border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : readingsList.length > 0 ? (
                        <div className="divide-y divide-parish-border/5">
                            {readingsList.map((reading) => (
                                <div key={reading.key}>
                                    <button
                                        onClick={() => setExpandedReading(expandedReading === reading.key ? '' : reading.key)}
                                        className="w-full px-6 md:px-8 py-4 flex items-center justify-between gap-4 text-left hover:bg-parish-border/[0.02] transition-colors"
                                    >
                                        <span className="font-display text-parish-brass tracking-widest text-xs uppercase">
                                            {reading.label}
                                        </span>
                                        <motion.div
                                            animate={{ rotate: expandedReading === reading.key ? 180 : 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <ChevronDown size={18} className="text-parish-muted" />
                                        </motion.div>
                                    </button>
                                    <AnimatePresence initial={false}>
                                        {expandedReading === reading.key && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                className="overflow-hidden"
                                            >
                                                <div
                                                    className="px-6 md:px-8 pb-6 font-serif text-base leading-relaxed text-parish-fg universals-reading"
                                                    dangerouslySetInnerHTML={{ __html: reading.html || '' }}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="px-8 py-12 text-center">
                            <AlertCircle size={28} className="text-parish-muted mx-auto mb-3 opacity-50" />
                            <p className="font-serif text-parish-muted italic">
                                No readings available for this date from Universalis.
                            </p>
                        </div>
                    )}
                </motion.div>

                {/* Reflection Editor */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-parish-bg rounded-3xl border border-parish-border/10 overflow-hidden"
                >
                    <div className="px-6 md:px-8 py-6 border-b border-parish-border/5 flex items-center gap-2">
                        <Sparkles size={18} className="text-parish-brass" />
                        <h2 className="font-display text-xl tracking-wider text-parish-fg">
                            Parish Reflection
                        </h2>
                        <span className="text-xs font-display tracking-widest text-parish-muted uppercase ml-2">
                            (Your content)
                        </span>
                    </div>

                    <div className="p-6 md:p-8 space-y-6">
                        {/* Context */}
                        <div>
                            <label className="flex items-center gap-2 mb-2">
                                <BookOpenText size={14} className="text-parish-brass" />
                                <span className="font-display text-xs uppercase tracking-widest text-parish-brass">Context</span>
                            </label>
                            <textarea
                                value={reflectionContext}
                                onChange={(e) => setReflectionContext(e.target.value)}
                                placeholder="Brief context about today's readings (optional)…"
                                rows={3}
                                className="w-full bg-parish-surface border border-parish-border/10 rounded-2xl px-5 py-4 font-serif text-base text-parish-fg placeholder:text-parish-muted/50 resize-y outline-none focus:border-parish-accent/30 transition-colors"
                            />
                        </div>

                        {/* Body */}
                        <div>
                            <label className="flex items-center gap-2 mb-2">
                                <Heart size={14} className="text-parish-brass" />
                                <span className="font-display text-xs uppercase tracking-widest text-parish-brass">Reflection</span>
                            </label>
                            <textarea
                                value={reflectionBody}
                                onChange={(e) => setReflectionBody(e.target.value)}
                                placeholder="Your reflection on today's readings…"
                                rows={8}
                                className="w-full bg-parish-surface border border-parish-border/10 rounded-2xl px-5 py-4 font-serif text-base text-parish-fg placeholder:text-parish-muted/50 resize-y outline-none focus:border-parish-accent/30 transition-colors"
                            />
                        </div>

                        {/* Prayer */}
                        <div>
                            <label className="flex items-center gap-2 mb-2">
                                <HandHeart size={14} className="text-parish-brass" />
                                <span className="font-display text-xs uppercase tracking-widest text-parish-brass">Prayer</span>
                            </label>
                            <textarea
                                value={reflectionPrayer}
                                onChange={(e) => setReflectionPrayer(e.target.value)}
                                placeholder="A closing prayer (optional)…"
                                rows={4}
                                className="w-full bg-parish-surface border border-parish-border/10 rounded-2xl px-5 py-4 font-serif text-base text-parish-fg placeholder:text-parish-muted/50 resize-y outline-none focus:border-parish-accent/30 transition-colors"
                            />
                        </div>

                        {/* Author */}
                        <div className="max-w-sm">
                            <label className="block font-display text-xs uppercase tracking-widest text-parish-brass mb-2">
                                Reflection Author
                            </label>
                            <input
                                type="text"
                                value={reflectionAuthor}
                                onChange={(e) => setReflectionAuthor(e.target.value)}
                                placeholder="e.g. Fr. John Smith"
                                className="w-full bg-parish-surface border border-parish-border/10 rounded-xl px-5 py-3 font-serif text-base text-parish-fg placeholder:text-parish-muted/50 outline-none focus:border-parish-accent/30 transition-colors"
                            />
                        </div>

                        {/* Save Button */}
                        <div className="flex items-center gap-4 pt-4 border-t border-parish-border/5">
                            <button
                                onClick={handleSave}
                                disabled={saveStatus === 'saving'}
                                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-parish-accent/10 text-parish-accent font-display text-sm uppercase tracking-widest hover:bg-parish-accent/20 transition-all active:scale-[0.97] disabled:opacity-50"
                            >
                                {saveStatus === 'saving' ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-parish-accent border-t-transparent rounded-full animate-spin" />
                                        Saving…
                                    </>
                                ) : saveStatus === 'saved' ? (
                                    <>
                                        <Check size={16} /> Saved!
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} /> Save Reflection
                                    </>
                                )}
                            </button>

                            {saveStatus === 'error' && (
                                <span className="text-red-500 font-serif text-sm italic">
                                    Failed to save. Please try again.
                                </span>
                            )}
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
