import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePageSEO } from '../hooks/usePageSEO';
import { Heart, CreditCard, RefreshCw, Shield, ChevronDown } from 'lucide-react';

const PRESET_AMOUNTS = [20, 50, 100, 250];

const FUNDS = [
    { id: 'general', label: 'General Parish Fund', description: 'Supports the day-to-day operations and ministries of our parish.' },
    { id: 'building', label: 'Building & Maintenance', description: 'Helps maintain and improve our church buildings.' },
    { id: 'youth', label: 'Youth Ministry', description: 'Supports programs for young people in our community.' },
    { id: 'missions', label: 'Missions & Outreach', description: 'Funds outreach programs and charitable works.' },
    { id: 'flowers', label: 'Altar Flowers & Liturgy', description: 'Provides for altar flowers, candles, and liturgical needs.' },
];

export function GivingPage() {
    const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
    const [customAmount, setCustomAmount] = useState('');
    const [isRecurring, setIsRecurring] = useState(false);
    const [selectedFund, setSelectedFund] = useState('general');
    const [showFundDropdown, setShowFundDropdown] = useState(false);
    const [donorName, setDonorName] = useState('');
    const [donorEmail, setDonorEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showThankYou, setShowThankYou] = useState(false);

    usePageSEO({
        title: 'Online Giving — Support Our Parish',
        description: 'Give online to Greenacres Walkerville Catholic Parish. Support our ministries, building fund, youth programs, and community outreach.',
        path: '/giving',
    });

    const effectiveAmount = selectedAmount ?? (customAmount ? parseFloat(customAmount) : 0);
    const isValid = effectiveAmount >= 1 && donorEmail.includes('@');
    const currentFund = FUNDS.find(f => f.id === selectedFund)!;

    const handleSelectPreset = (amount: number) => {
        setSelectedAmount(amount);
        setCustomAmount('');
    };

    const handleCustomChange = (value: string) => {
        setCustomAmount(value);
        setSelectedAmount(null);
    };

    const handleSubmit = async () => {
        if (!isValid) return;
        setIsSubmitting(true);

        // In production, this would call a Supabase Edge Function
        // that creates a Stripe Checkout session and redirects the user.
        // For now, simulate a short delay and show the thank-you state.
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setShowThankYou(true);
    };

    if (showThankYou) {
        return (
            <div className="min-h-screen bg-parish-bg pt-28 pb-24 px-6 md:px-16 lg:px-24">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-lg mx-auto text-center"
                >
                    <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-parish-accent/10 flex items-center justify-center">
                        <Heart className="w-10 h-10 text-parish-accent" />
                    </div>
                    <h1 className="font-display text-4xl md:text-5xl text-parish-fg mb-6">Thank You</h1>
                    <p className="font-serif text-xl text-parish-muted italic mb-4 leading-relaxed">
                        Your generous gift of <strong className="text-parish-fg">${effectiveAmount.toFixed(2)} AUD</strong> to the{' '}
                        <strong className="text-parish-fg">{currentFund.label}</strong> fund
                        {isRecurring ? ' (monthly)' : ''} has been received.
                    </p>
                    <p className="font-serif text-lg text-parish-muted italic mb-10">
                        "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."
                    </p>
                    <p className="font-display tracking-widest text-sm uppercase text-parish-accent mb-10">— 2 Corinthians 9:7</p>

                    <div className="bg-parish-surface border border-parish-border/10 rounded-2xl p-6 text-left mb-8">
                        <h3 className="font-display tracking-widest text-xs uppercase text-parish-accent mb-3">Tax Information</h3>
                        <p className="font-serif text-base text-parish-muted leading-relaxed">
                            Greenacres Walkerville Catholic Parish is a registered organisation. A receipt has been sent to <strong className="text-parish-fg">{donorEmail}</strong> for your records.
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            setShowThankYou(false);
                            setSelectedAmount(50);
                            setCustomAmount('');
                            setDonorName('');
                            setDonorEmail('');
                        }}
                        className="ethereal-button"
                    >
                        Make Another Gift
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-parish-bg pt-28 pb-24 px-6 md:px-16 lg:px-24">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="mb-16 text-center"
                >
                    <div className="text-parish-accent font-display tracking-widest text-base uppercase mb-4">Online Giving</div>
                    <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-parish-fg leading-tight mb-6 text-balance">
                        Support Our <em className="font-serif italic text-parish-accent">Parish</em>
                    </h1>
                    <p className="font-serif text-xl md:text-2xl text-parish-muted max-w-2xl mx-auto leading-relaxed italic">
                        Your generosity enables our parish to worship, serve, and grow as a community of faith.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                    {/* ── Main Form (Left) ─────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.15 }}
                        className="lg:col-span-3"
                    >
                        <div className="bg-parish-surface border border-parish-border/10 rounded-[2rem] p-8 md:p-10 shadow-sm">
                            {/* Amount Selection */}
                            <h2 className="font-display text-2xl text-parish-fg mb-6">Choose an Amount</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                                {PRESET_AMOUNTS.map(amount => (
                                    <button
                                        key={amount}
                                        onClick={() => handleSelectPreset(amount)}
                                        className={`py-4 rounded-xl font-display text-xl tracking-wide transition-all duration-200 border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-parish-accent ${selectedAmount === amount
                                            ? 'bg-parish-accent text-white border-parish-accent shadow-lg shadow-parish-accent/20'
                                            : 'bg-parish-bg border-parish-border/10 text-parish-fg hover:border-parish-accent/40'
                                            }`}
                                        aria-pressed={selectedAmount === amount}
                                    >
                                        ${amount}
                                    </button>
                                ))}
                            </div>

                            {/* Custom amount */}
                            <div className="relative mb-8">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-parish-muted font-display text-lg">$</span>
                                <input
                                    type="number"
                                    min="1"
                                    step="0.01"
                                    placeholder="Custom amount"
                                    value={customAmount}
                                    onChange={e => handleCustomChange(e.target.value)}
                                    onFocus={() => setSelectedAmount(null)}
                                    className="w-full pl-8 pr-4 py-4 rounded-xl border-2 border-parish-border/10 bg-parish-bg text-parish-fg font-display text-lg focus:border-parish-accent focus:outline-none transition-colors"
                                    aria-label="Custom donation amount in AUD"
                                />
                            </div>

                            {/* Recurring toggle */}
                            <div className="flex items-center justify-between mb-8 py-4 px-5 rounded-xl bg-parish-bg border border-parish-border/5">
                                <div className="flex items-center gap-3">
                                    <RefreshCw size={18} className="text-parish-accent" />
                                    <span className="font-display text-base text-parish-fg">Give Monthly (Recurring)</span>
                                </div>
                                <button
                                    role="switch"
                                    aria-checked={isRecurring}
                                    onClick={() => setIsRecurring(!isRecurring)}
                                    className={`relative w-12 h-7 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-parish-accent ${isRecurring ? 'bg-parish-accent' : 'bg-parish-border/20'}`}
                                >
                                    <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-200 ${isRecurring ? 'translate-x-5' : ''}`} />
                                </button>
                            </div>

                            {/* Fund selector */}
                            <div className="mb-8">
                                <label className="font-display tracking-widest text-xs uppercase text-parish-accent mb-3 block">Designate Your Gift</label>
                                <div className="relative">
                                    <button
                                        onClick={() => setShowFundDropdown(!showFundDropdown)}
                                        className="w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 border-parish-border/10 bg-parish-bg text-left hover:border-parish-accent/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-parish-accent"
                                        aria-haspopup="listbox"
                                        aria-expanded={showFundDropdown}
                                    >
                                        <span className="font-serif text-lg text-parish-fg">{currentFund.label}</span>
                                        <ChevronDown size={18} className={`text-parish-muted transition-transform ${showFundDropdown ? 'rotate-180' : ''}`} />
                                    </button>
                                    {showFundDropdown && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setShowFundDropdown(false)} />
                                            <ul
                                                role="listbox"
                                                className="absolute z-50 mt-2 w-full bg-parish-surface border border-parish-border/10 rounded-xl shadow-xl overflow-hidden"
                                            >
                                                {FUNDS.map(fund => (
                                                    <li key={fund.id}>
                                                        <button
                                                            role="option"
                                                            aria-selected={selectedFund === fund.id}
                                                            onClick={() => { setSelectedFund(fund.id); setShowFundDropdown(false); }}
                                                            className={`w-full text-left px-5 py-4 hover:bg-parish-accent/5 transition-colors ${selectedFund === fund.id ? 'bg-parish-accent/10' : ''}`}
                                                        >
                                                            <div className="font-display text-base text-parish-fg">{fund.label}</div>
                                                            <div className="font-serif text-sm text-parish-muted">{fund.description}</div>
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Donor info */}
                            <div className="space-y-4 mb-8">
                                <div>
                                    <label htmlFor="donor-name" className="font-display tracking-widest text-xs uppercase text-parish-accent mb-2 block">
                                        Your Name <span className="text-parish-muted">(optional)</span>
                                    </label>
                                    <input
                                        id="donor-name"
                                        type="text"
                                        value={donorName}
                                        onChange={e => setDonorName(e.target.value)}
                                        placeholder="John Smith"
                                        className="w-full px-5 py-4 rounded-xl border-2 border-parish-border/10 bg-parish-bg text-parish-fg font-serif text-lg focus:border-parish-accent focus:outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="donor-email" className="font-display tracking-widest text-xs uppercase text-parish-accent mb-2 block">
                                        Email Address <span className="text-parish-fg text-xs">*</span>
                                    </label>
                                    <input
                                        id="donor-email"
                                        type="email"
                                        required
                                        value={donorEmail}
                                        onChange={e => setDonorEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        className="w-full px-5 py-4 rounded-xl border-2 border-parish-border/10 bg-parish-bg text-parish-fg font-serif text-lg focus:border-parish-accent focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                onClick={handleSubmit}
                                disabled={!isValid || isSubmitting}
                                className="w-full py-5 rounded-full bg-parish-accent text-white font-display tracking-widest uppercase text-base hover:bg-parish-accent-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-parish-accent/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-parish-accent focus-visible:ring-offset-2"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-3">
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Processing…
                                    </span>
                                ) : (
                                    `Donate $${effectiveAmount > 0 ? effectiveAmount.toFixed(2) : '0.00'} AUD${isRecurring ? ' / month' : ''}`
                                )}
                            </button>

                            <p className="text-center text-parish-muted font-serif text-sm mt-4 flex items-center justify-center gap-2">
                                <Shield size={14} /> Payments processed securely via Stripe
                            </p>
                        </div>
                    </motion.div>

                    {/* ── Sidebar (Right) ──────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="lg:col-span-2 space-y-6"
                    >
                        {/* Impact card */}
                        <div className="bg-parish-fg text-parish-surface p-8 rounded-[2rem]">
                            <h3 className="font-display text-2xl mb-4">Your Impact</h3>
                            <ul className="space-y-4 font-serif text-lg leading-relaxed">
                                <li className="flex items-start gap-3">
                                    <span className="text-parish-accent text-xl mt-0.5">✦</span>
                                    <span>Supports daily Mass, liturgy, and music ministry</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-parish-accent text-xl mt-0.5">✦</span>
                                    <span>Funds youth programs and faith formation</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-parish-accent text-xl mt-0.5">✦</span>
                                    <span>Maintains our historic church buildings</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-parish-accent text-xl mt-0.5">✦</span>
                                    <span>Helps those in need through community outreach</span>
                                </li>
                            </ul>
                        </div>

                        {/* Other ways */}
                        <div className="bg-parish-surface border border-parish-border/10 p-8 rounded-[2rem]">
                            <h3 className="font-display text-xl text-parish-fg mb-4">Other Ways to Give</h3>
                            <div className="space-y-4 font-serif text-base text-parish-muted leading-relaxed">
                                <div>
                                    <div className="font-display tracking-widest text-xs uppercase text-parish-accent mb-1">Planned Giving</div>
                                    <p>Set up regular contributions via your bank. Contact the parish office for details.</p>
                                </div>
                                <div>
                                    <div className="font-display tracking-widest text-xs uppercase text-parish-accent mb-1">Collection Plate</div>
                                    <p>Traditional cash or envelope donations are always welcome at any Mass.</p>
                                </div>
                                <div>
                                    <div className="font-display tracking-widest text-xs uppercase text-parish-accent mb-1">Direct Deposit</div>
                                    <p>BSB: Contact parish office<br />Account: Contact parish office</p>
                                </div>
                            </div>
                        </div>

                        {/* Security note */}
                        <div className="flex items-start gap-3 p-5 rounded-xl bg-parish-accent/5 border border-parish-accent/10">
                            <CreditCard size={20} className="text-parish-accent shrink-0 mt-0.5" />
                            <p className="font-serif text-sm text-parish-muted leading-relaxed">
                                All transactions are encrypted and processed securely. We never store your card details. Powered by Stripe with non-profit rates.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
