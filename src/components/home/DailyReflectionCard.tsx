import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Sparkles, AlertCircle } from 'lucide-react';
import { useDailyReflection } from '../../hooks/useDailyReflection';

export function DailyReflectionCard() {
    // We use today's date formatted to YYYY-MM-DD in local time
    const todayStr = new Date().toLocaleDateString('en-CA');
    const { reflection, isLoading, error } = useDailyReflection(todayStr);
    const [activeTab, setActiveTab] = useState<'readings' | 'reflection'>('readings');

    if (isLoading) {
        return (
            <div className="w-full bg-white rounded-3xl p-8 shadow-sm border border-black/5 animate-pulse flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-8 h-8 border-2 border-parish-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !reflection) {
        return (
            <div className="w-full bg-white rounded-3xl p-8 shadow-sm border border-black/5 flex flex-col items-center justify-center min-h-[300px] text-center">
                <AlertCircle className="w-10 h-10 text-parish-muted opacity-50 mb-4" />
                <h3 className="font-display text-2xl text-parish-fg mb-2">Daily Reflection Unavailable</h3>
                <p className="font-serif text-parish-muted">We could not load today's readings. Please check your physical Jerusalem Bible for today's Liturgy.</p>
            </div>
        );
    }

    // Determine Accent Color based on liturgical_color
    const colorMap: Record<string, string> = {
        'Green': 'bg-emerald-600',
        'Violet': 'bg-purple-700',
        'Purple': 'bg-purple-700',
        'White': 'bg-amber-100', // Gold/White representation
        'Red': 'bg-red-700',
        'Rose': 'bg-pink-400',
    };
    const accentColor = colorMap[reflection.liturgicalColor] || 'bg-parish-accent';

    return (
        <div className="w-full bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] border border-black/5 overflow-hidden flex flex-col">
            {/* Header */}
            <div className={`h-2 w-full ${accentColor}`}></div>
            <div className="px-8 pt-8 pb-6 border-b border-black/5 flex justify-between items-start flex-wrap gap-4">
                <div>
                    <div className="flex items-center gap-2 text-parish-accent font-display tracking-widest text-sm uppercase mb-3">
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
                    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-parish-bg text-sm font-display tracking-wider border border-black/5">
                        <span className={`w-3 h-3 rounded-full ${accentColor}`}></span>
                        {reflection.liturgicalColor}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="px-8 pt-4 flex gap-8 border-b border-black/5 relative">
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
            <div className="p-8 md:p-10 bg-[#FAFAFA] flex-1 min-h-[400px]">
                <AnimatePresence mode="popLayout" initial={false}>
                    {activeTab === 'readings' ? (
                        <motion.div
                            key="readings"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-10"
                        >
                            {reflection.firstReading && (
                                <div>
                                    <h4 className="font-display text-parish-accent tracking-widest text-sm uppercase mb-4">First Reading</h4>
                                    <p className="font-serif text-lg md:text-xl leading-relaxed text-parish-fg whitespace-pre-wrap">
                                        {reflection.firstReading}
                                    </p>
                                </div>
                            )}

                            {reflection.psalm && (
                                <div className="pl-6 border-l-2 border-parish-accent/30">
                                    <h4 className="font-display text-parish-accent tracking-widest text-sm uppercase mb-3">Responsorial Psalm</h4>
                                    <p className="font-serif text-lg md:text-xl leading-relaxed italic text-parish-fg whitespace-pre-wrap">
                                        {reflection.psalm}
                                    </p>
                                </div>
                            )}

                            {reflection.gospel && (
                                <div>
                                    <h4 className="font-display text-parish-accent tracking-widest text-sm uppercase mb-4">Gospel</h4>
                                    <p className="font-serif text-lg md:text-xl leading-relaxed text-parish-fg whitespace-pre-wrap">
                                        {reflection.gospel}
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
                            className="space-y-6"
                        >
                            {reflection.reflection ? (
                                <p className="font-serif text-xl md:text-2xl leading-relaxed text-parish-fg whitespace-pre-wrap">
                                    {reflection.reflection}
                                </p>
                            ) : (
                                <p className="font-serif text-lg italic text-parish-muted">
                                    No parish reflection has been provided for today.
                                </p>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
