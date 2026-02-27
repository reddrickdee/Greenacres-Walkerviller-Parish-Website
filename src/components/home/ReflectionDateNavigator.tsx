import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Sun } from 'lucide-react';

interface ReflectionDateNavigatorProps {
    selectedDate: string;
    onDateChange: (dateIso: string) => void;
    availableDates: Set<string>;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function toIso(d: Date): string {
    return d.toLocaleDateString('en-CA'); // returns YYYY-MM-DD
}

function getPreviousSunday(from: Date): Date {
    const d = new Date(from);
    const day = d.getDay(); // 0 = Sunday
    if (day === 0) {
        d.setDate(d.getDate() - 7); // already Sunday → go back one week
    } else {
        d.setDate(d.getDate() - day);
    }
    return d;
}

function getNextSunday(from: Date): Date {
    const d = new Date(from);
    const day = d.getDay();
    d.setDate(d.getDate() + (7 - day));
    return d;
}

function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
    // Returns 0=Sun … 6=Sat. We shift so Mon=0.
    const raw = new Date(year, month, 1).getDay();
    return raw === 0 ? 6 : raw - 1;
}

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

const DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// ── Component ────────────────────────────────────────────────────────────────

export function ReflectionDateNavigator({
    selectedDate,
    onDateChange,
    availableDates,
}: ReflectionDateNavigatorProps) {
    const today = useMemo(() => toIso(new Date()), []);
    const todayDate = useMemo(() => new Date(), []);

    // Calendar month navigation
    const [viewYear, setViewYear] = useState(() => new Date().getFullYear());
    const [viewMonth, setViewMonth] = useState(() => new Date().getMonth());

    const prevSunday = useMemo(() => toIso(getPreviousSunday(todayDate)), [todayDate]);
    const nextSunday = useMemo(() => toIso(getNextSunday(todayDate)), [todayDate]);

    // Calendar grid data
    const calendarDays = useMemo(() => {
        const daysInMonth = getDaysInMonth(viewYear, viewMonth);
        const startDow = getFirstDayOfMonth(viewYear, viewMonth); // Mon=0-based
        const cells: (null | { iso: string; day: number })[] = [];

        // Leading empty cells
        for (let i = 0; i < startDow; i++) cells.push(null);

        for (let d = 1; d <= daysInMonth; d++) {
            const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            cells.push({ iso, day: d });
        }

        return cells;
    }, [viewYear, viewMonth]);

    const goToPrevMonth = () => {
        if (viewMonth === 0) {
            setViewYear(viewYear - 1);
            setViewMonth(11);
        } else {
            setViewMonth(viewMonth - 1);
        }
    };

    const goToNextMonth = () => {
        if (viewMonth === 11) {
            setViewYear(viewYear + 1);
            setViewMonth(0);
        } else {
            setViewMonth(viewMonth + 1);
        }
    };

    const handleDateClick = (iso: string) => {
        onDateChange(iso);
    };

    const handleQuickNav = (iso: string) => {
        onDateChange(iso);
        // Also navigate the calendar view to that month
        const d = new Date(iso + 'T00:00:00');
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
    };

    return (
        <div className="w-full space-y-4">
            {/* Quick-Access Sunday Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleQuickNav(prevSunday)}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-display text-sm tracking-wider uppercase transition-all border ${selectedDate === prevSunday
                        ? 'bg-parish-accent text-white border-parish-accent shadow-lg shadow-parish-accent/20'
                        : 'bg-parish-surface text-parish-fg border-parish-border/10 hover:border-parish-accent/40 hover:text-parish-accent'
                        }`}
                >
                    <ChevronLeft className="w-4 h-4" />
                    <Sun className="w-4 h-4" />
                    Last Sunday
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleQuickNav(today)}
                    className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-display text-sm tracking-wider uppercase transition-all border ${selectedDate === today
                        ? 'bg-parish-accent text-white border-parish-accent shadow-lg shadow-parish-accent/20'
                        : 'bg-parish-surface text-parish-fg border-parish-border/10 hover:border-parish-accent/40 hover:text-parish-accent'
                        }`}
                >
                    <Calendar className="w-4 h-4" />
                    Today
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleQuickNav(nextSunday)}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-display text-sm tracking-wider uppercase transition-all border ${selectedDate === nextSunday
                        ? 'bg-parish-accent text-white border-parish-accent shadow-lg shadow-parish-accent/20'
                        : 'bg-parish-surface text-parish-fg border-parish-border/10 hover:border-parish-accent/40 hover:text-parish-accent'
                        }`}
                >
                    Next Sunday
                    <Sun className="w-4 h-4" />
                    <ChevronRight className="w-4 h-4" />
                </motion.button>
            </div>

            {/* Mini Calendar */}
            <div className="bg-parish-surface rounded-2xl border border-parish-border/5 shadow-sm overflow-hidden max-w-sm mx-auto">
                {/* Month/Year header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-parish-border/5">
                    <button
                        onClick={goToPrevMonth}
                        className="p-1.5 rounded-lg hover:bg-parish-border/10 transition-colors text-parish-muted hover:text-parish-fg"
                        aria-label="Previous month"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="font-display text-sm tracking-widest uppercase text-parish-fg">
                        {MONTH_NAMES[viewMonth]} {viewYear}
                    </span>
                    <button
                        onClick={goToNextMonth}
                        className="p-1.5 rounded-lg hover:bg-parish-border/10 transition-colors text-parish-muted hover:text-parish-fg"
                        aria-label="Next month"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Day-of-week headers */}
                <div className="grid grid-cols-7 px-3 pt-2">
                    {DAY_HEADERS.map((d) => (
                        <div key={d} className="text-center text-xs font-display tracking-wider text-parish-muted/60 uppercase py-1">
                            {d}
                        </div>
                    ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 px-3 pb-3 gap-y-0.5">
                    {calendarDays.map((cell, i) => {
                        if (!cell) {
                            return <div key={`empty-${i}`} />;
                        }

                        const hasReflection = availableDates.has(cell.iso);
                        const isSelected = selectedDate === cell.iso;
                        const isToday = today === cell.iso;
                        const isSunday = new Date(cell.iso + 'T00:00:00').getDay() === 0;

                        return (
                            <button
                                key={cell.iso}
                                onClick={() => handleDateClick(cell.iso)}
                                className={`
                                    relative flex flex-col items-center justify-center py-1.5 rounded-lg text-sm transition-all
                                    cursor-pointer hover:bg-parish-accent/10
                                    ${isSelected
                                        ? 'bg-parish-accent text-white font-semibold shadow-md shadow-parish-accent/20'
                                        : isToday
                                            ? 'ring-2 ring-parish-accent/40 text-parish-fg font-semibold'
                                            : 'text-parish-fg font-medium'
                                    }
                                    ${isSunday && !isSelected ? 'text-parish-accent font-semibold' : ''}
                                `}
                                aria-label={`${cell.iso}${hasReflection ? ' — reflection available' : ''}`}
                            >
                                <span>{cell.day}</span>
                                {/* Gold dot = admin reflection exists for this date */}
                                {hasReflection && !isSelected && (
                                    <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-parish-accent" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
