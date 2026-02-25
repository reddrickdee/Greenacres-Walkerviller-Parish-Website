import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Sparkles, AlertCircle, ChevronDown, BookOpenText, Heart, HandHeart } from 'lucide-react';
import { useDailyReflection } from '../../hooks/useDailyReflection';

interface ReadingSection {
    key: string;
    label: string;
    reference?: string;
    text?: string;
    isResponse?: boolean; // For psalm response styling
    responseText?: string;
    isHtml?: boolean;
}

interface DailyReflectionCardProps {
    selectedDate?: string;
}

export function DailyReflectionCard({ selectedDate }: DailyReflectionCardProps) {
    const dateIso = selectedDate || new Date().toLocaleDateString('en-CA');
    const { reflection, isLoading, error } = useDailyReflection(dateIso);
    const [activeTab, setActiveTab] = useState<'readings' | 'reflection'>('readings');
    const [expandedReading, setExpandedReading] = useState<string>('first-reading');

    if (isLoading) {
        return (
            <div className="w-full bg-parish-surface rounded-3xl p-8 shadow-sm border border-parish-border/5 animate-pulse flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-8 h-8 border-2 border-parish-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !reflection) {
        return (
            <div className="w-full bg-parish-surface rounded-3xl p-8 shadow-sm border border-parish-border/5 flex flex-col items-center justify-center min-h-[300px] text-center">
                <AlertCircle className="w-10 h-10 text-parish-muted opacity-50 mb-4" />
                <h3 className="font-display text-2xl text-parish-fg mb-2">Daily Reflection Unavailable</h3>
                <p className="font-serif text-parish-muted">We could not load today's readings. Please check your physical Jerusalem Bible for today's Liturgy.</p>
            </div>
        );
    }

    // Build the readings array dynamically (only include readings that have content)
    const readings: ReadingSection[] = [];

    if (reflection.firstReadingHtml) {
        readings.push({
            key: 'first-reading',
            label: 'First Reading',
            text: reflection.firstReadingHtml,
            isHtml: true,
        });
    }

    if (reflection.psalmHtml) {
        readings.push({
            key: 'psalm',
            label: 'Responsorial Psalm',
            text: reflection.psalmHtml,
            isHtml: true,
        });
    }

    if (reflection.secondReadingHtml) {
        readings.push({
            key: 'second-reading',
            label: 'Second Reading',
            text: reflection.secondReadingHtml,
            isHtml: true,
        });
    }

    if (reflection.gospelAcclamationHtml) {
        readings.push({
            key: 'gospel-acclamation',
            label: 'Gospel Acclamation',
            text: reflection.gospelAcclamationHtml,
            isHtml: true,
        });
    }

    if (reflection.gospelHtml) {
        readings.push({
            key: 'gospel',
            label: 'Gospel',
            text: reflection.gospelHtml,
            isHtml: true,
        });
    }

    if (reflection.sequence) {
        readings.push({
            key: 'sequence',
            label: 'Sequence',
            text: reflection.sequence,
        });
    }

    // Liturgical color mapping
    const colorMap: Record<string, string> = {
        'Green': 'bg-emerald-600',
        'Violet': 'bg-purple-700',
        'Purple': 'bg-purple-700',
        'White': 'bg-amber-100',
        'Red': 'bg-red-700',
        'Rose': 'bg-pink-400',
    };
    const accentColor = colorMap[reflection.liturgicalColor] || 'bg-parish-accent';

    const toggleReading = (key: string) => {
        setExpandedReading(expandedReading === key ? '' : key);
    };

    const hasReflectionContent = reflection.reflectionContext || reflection.reflectionBody || reflection.reflectionPrayer;

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full sacred-container flex flex-col overflow-hidden"
        >
            {/* Liturgical Color Bar */}
            <div className={`h-2 w-full ${accentColor}`}></div>

            {/* Header */}
            <div className="px-8 pt-8 pb-6 border-b border-parish-border/5 flex justify-between items-start flex-wrap gap-4">
                <div>
                    <div className="flex items-center gap-2 text-parish-brass font-display tracking-widest text-nav uppercase mb-4">
                        <BookOpen className="w-4 h-4" />
                        <span>God's Word - Daily Reflections</span>
                    </div>
                    <h3 className="font-display text-3xl md:text-4xl text-parish-fg">
                        {reflection.title}
                    </h3>
                </div>
                <div className="text-right">
                    <p className="font-serif italic text-parish-muted">
                        {new Date(reflection.date).toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-parish-bg text-sm font-display tracking-wider border border-parish-border/5">
                        <span className={`w-3 h-3 rounded-full ${accentColor}`}></span>
                        {reflection.liturgicalColor}
                    </div>
                </div>
            </div>

            {/* Main Tabs */}
            <div className="px-8 pt-4 flex gap-8 border-b border-parish-border/5 relative">
                <button
                    onClick={() => setActiveTab('readings')}
                    className={`font-display tracking-widest uppercase pb-4 transition-colors relative ${activeTab === 'readings' ? 'text-parish-fg' : 'text-parish-muted hover:text-parish-fg'}`}
                >
                    Today's Readings
                    {activeTab === 'readings' && (
                        <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-parish-accent" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('reflection')}
                    className={`font-display tracking-widest uppercase pb-4 transition-colors relative flex items-center gap-2 ${activeTab === 'reflection' ? 'text-parish-fg' : 'text-parish-muted hover:text-parish-fg'}`}
                >
                    <Sparkles className="w-4 h-4" />
                    Parish Reflection
                    {activeTab === 'reflection' && (
                        <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-parish-accent" />
                    )}
                </button>
            </div>

            {/* Content Area */}
            <div className="bg-transparent flex-1">
                <AnimatePresence mode="popLayout" initial={false}>
                    {activeTab === 'readings' ? (
                        <motion.div
                            key="readings"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {readings.length > 0 ? (
                                <div className="divide-y divide-black/5">
                                    {readings.map((reading) => {
                                        const isExpanded = expandedReading === reading.key;
                                        return (
                                            <div key={reading.key}>
                                                {/* Accordion Header */}
                                                <button
                                                    onClick={() => toggleReading(reading.key)}
                                                    className="w-full px-8 py-5 flex items-center justify-between gap-4 text-left hover:bg-parish-border/[0.02] transition-colors"
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <span className="font-display text-parish-brass tracking-widest text-xs uppercase">
                                                            {reading.label}
                                                        </span>
                                                        {reading.reference && (
                                                            <span className="font-serif text-parish-muted ml-3 text-sm">
                                                                — {reading.reference}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <motion.div
                                                        animate={{ rotate: isExpanded ? 180 : 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="flex-shrink-0"
                                                    >
                                                        <ChevronDown className="w-5 h-5 text-parish-muted" />
                                                    </motion.div>
                                                </button>

                                                {/* Accordion Content */}
                                                <AnimatePresence initial={false}>
                                                    {isExpanded && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="px-8 pb-8">
                                                                {/* Psalm response line */}
                                                                {reading.isResponse && reading.responseText && (
                                                                    <div className="mb-4 px-4 py-3 bg-parish-accent/5 border-l-2 border-parish-accent rounded-r-lg">
                                                                        <p className="font-display text-sm tracking-wider text-parish-accent uppercase mb-1">Response</p>
                                                                        <p className="font-serif text-lg italic text-parish-fg">
                                                                            {reading.responseText}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                                {reading.isHtml ? (
                                                                    <div
                                                                        className="font-serif text-lg md:text-xl leading-relaxed text-parish-fg universals-reading"
                                                                        dangerouslySetInnerHTML={{ __html: reading.text || '' }}
                                                                    />
                                                                ) : (
                                                                    <p className={`font-serif text-lg md:text-xl leading-relaxed text-parish-fg whitespace-pre-wrap ${reading.isResponse ? 'italic' : ''}`}>
                                                                        {reading.text}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="px-8 py-12 text-center">
                                    <p className="font-serif text-lg italic text-parish-muted">
                                        Today's readings have not been entered yet. Please check your physical Jerusalem Bible.
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="reflection"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="p-8 md:p-10 space-y-8"
                        >
                            {hasReflectionContent ? (
                                <>
                                    {/* Context Section */}
                                    {reflection.reflectionContext && (
                                        <div className="bg-parish-surface rounded-2xl p-6 border border-parish-border/5 shadow-sm">
                                            <div className="flex items-center gap-2 mb-3">
                                                <BookOpenText className="w-4 h-4 text-parish-brass" />
                                                <h4 className="font-display text-parish-brass tracking-widest text-sm uppercase">Context</h4>
                                            </div>
                                            <p className="font-serif text-lg leading-relaxed text-parish-fg whitespace-pre-wrap">
                                                {reflection.reflectionContext}
                                            </p>
                                        </div>
                                    )}

                                    {/* Reflection Body */}
                                    {reflection.reflectionBody && (
                                        <div>
                                            <div className="flex items-center gap-2 mb-4">
                                                <Heart className="w-4 h-4 text-parish-brass" />
                                                <h4 className="font-display text-parish-brass tracking-widest text-sm uppercase">Reflection</h4>
                                            </div>
                                            <p className="font-serif text-xl md:text-2xl leading-relaxed text-parish-fg whitespace-pre-wrap">
                                                {reflection.reflectionBody}
                                            </p>
                                        </div>
                                    )}

                                    {/* Prayer */}
                                    {reflection.reflectionPrayer && (
                                        <div className="pl-6 border-l-2 border-parish-brass/30">
                                            <div className="flex items-center gap-2 mb-3">
                                                <HandHeart className="w-4 h-4 text-parish-brass" />
                                                <h4 className="font-display text-parish-brass tracking-widest text-sm uppercase">Prayer</h4>
                                            </div>
                                            <p className="font-serif text-lg md:text-xl leading-relaxed italic text-parish-fg whitespace-pre-wrap">
                                                {reflection.reflectionPrayer}
                                            </p>
                                        </div>
                                    )}

                                    {/* Author Attribution */}
                                    {reflection.reflectionAuthor && (
                                        <p className="text-right font-serif text-sm text-parish-muted italic pt-4 border-t border-parish-border/5">
                                            — {reflection.reflectionAuthor}
                                        </p>
                                    )}
                                </>
                            ) : (
                                <p className="font-serif text-lg italic text-parish-muted text-center py-8">
                                    No parish reflection has been provided for today.
                                </p>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
