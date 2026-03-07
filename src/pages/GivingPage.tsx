import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { usePageSEO } from '../hooks/usePageSEO';
import { Heart, CreditCard, RefreshCw, Shield, ChevronDown } from 'lucide-react';
import { InfoCard, ScriptureBlock, SectionIntro, UtilityPageTemplate } from '../components/layout/PageTemplates';

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
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setShowThankYou(true);
    };

    if (showThankYou) {
        return (
            <div className="page-shell">
                <section className="page-section">
                    <div className="page-section-inner">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            className="mx-auto max-w-lg text-center"
                        >
                            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-parish-brass/25 bg-parish-elevated/65">
                                <Heart className="h-10 w-10 text-parish-brass" />
                            </div>
                            <h1 className="text-4xl text-parish-fg md:text-5xl">Thank You</h1>
                            <p className="mt-6 text-xl leading-relaxed text-parish-muted">
                                Your generous gift of <strong className="text-parish-fg">${effectiveAmount.toFixed(2)} AUD</strong> to the{' '}
                                <strong className="text-parish-fg">{currentFund.label}</strong> fund
                                {isRecurring ? ' (monthly)' : ''} has been received.
                            </p>

                            <ScriptureBlock className="mt-8">
                                <p className="text-lg leading-relaxed text-parish-inverse/85">
                                    "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."
                                </p>
                                <p className="mt-4 text-sm uppercase tracking-[0.24em] text-parish-brass">2 Corinthians 9:7</p>
                            </ScriptureBlock>

                            <InfoCard className="mt-8 text-left">
                                <div className="ornamental-kicker">Tax Information</div>
                                <p className="mt-3 text-base leading-relaxed text-parish-muted">
                                    Greenacres Walkerville Catholic Parish is a registered organisation. A receipt has been sent to <strong className="text-parish-fg">{donorEmail}</strong> for your records.
                                </p>
                            </InfoCard>

                            <button
                                onClick={() => {
                                    setShowThankYou(false);
                                    setSelectedAmount(50);
                                    setCustomAmount('');
                                    setDonorName('');
                                    setDonorEmail('');
                                }}
                                className="pilgrimage-button mt-8"
                            >
                                Make Another Gift
                            </button>
                        </motion.div>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <UtilityPageTemplate
            eyebrow="Online Giving"
            title={<>Your generosity sustains the worship, service, and growth of this community.</>}
            description="Give securely online to support parish ministries, building maintenance, youth programs, or community outreach. Choose a one-time gift or set up monthly giving."
            imageSrc="/assets/source/hero_2.webp"
            imageAlt="Parish community"
            actions={(
                <>
                    <Link to="/contact" className="pilgrimage-button">
                        Contact The Office
                    </Link>
                </>
            )}
            aside={(
                <div className="rounded-[1.5rem] border border-parish-brass/20 bg-parish-border/5 px-5 py-5">
                    <div className="ornamental-kicker">Secure Payments</div>
                    <p className="mt-3 flex items-center gap-2 text-sm leading-relaxed text-parish-muted">
                        <Shield size={14} className="text-parish-brass" />
                        All transactions processed securely via Stripe.
                    </p>
                </div>
            )}
        >
            <section className="page-section">
                <div className="page-section-inner grid gap-10 lg:grid-cols-5">
                    {/* Main Form */}
                    <div className="lg:col-span-3">
                        <div className="sanctuary-panel px-7 py-8 md:px-10 md:py-10">
                            <SectionIntro
                                eyebrow="Choose Amount"
                                title={<>Select or enter a custom donation amount.</>}
                            />

                            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                {PRESET_AMOUNTS.map(amount => (
                                    <button
                                        key={amount}
                                        onClick={() => handleSelectPreset(amount)}
                                        className={`rounded-[1.25rem] border-2 py-4 text-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-parish-brass ${selectedAmount === amount
                                            ? 'border-parish-brass bg-parish-fg text-parish-inverse shadow-halo'
                                            : 'border-parish-border/10 bg-parish-bg text-parish-fg hover:border-parish-brass/40'
                                            }`}
                                        aria-pressed={selectedAmount === amount}
                                    >
                                        ${amount}
                                    </button>
                                ))}
                            </div>

                            <div className="relative mt-4">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-parish-muted">$</span>
                                <input
                                    type="number"
                                    min="1"
                                    step="0.01"
                                    placeholder="Custom amount"
                                    value={customAmount}
                                    onChange={e => handleCustomChange(e.target.value)}
                                    onFocus={() => setSelectedAmount(null)}
                                    className="w-full rounded-[1.25rem] border border-parish-border/10 bg-parish-bg py-4 pl-8 pr-4 text-lg text-parish-fg transition-colors focus:border-parish-brass/40 focus:outline-none"
                                    aria-label="Custom donation amount in AUD"
                                />
                            </div>

                            {/* Recurring */}
                            <div className="mt-8 flex items-center justify-between rounded-[1.25rem] border border-parish-border/5 bg-parish-bg px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <RefreshCw size={18} className="text-parish-brass" />
                                    <span className="text-base text-parish-fg">Give Monthly (Recurring)</span>
                                </div>
                                <button
                                    role="switch"
                                    aria-checked={isRecurring}
                                    onClick={() => setIsRecurring(!isRecurring)}
                                    className={`relative h-7 w-12 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-parish-brass ${isRecurring ? 'bg-parish-brass' : 'bg-parish-border/20'}`}
                                >
                                    <span className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-200 ${isRecurring ? 'translate-x-5' : ''}`} />
                                </button>
                            </div>

                            {/* Fund selector */}
                            <div className="mt-8">
                                <div className="ornamental-kicker mb-3">Designate Your Gift</div>
                                <div className="relative">
                                    <button
                                        onClick={() => setShowFundDropdown(!showFundDropdown)}
                                        className="flex w-full items-center justify-between rounded-[1.25rem] border border-parish-border/10 bg-parish-bg px-5 py-4 text-left transition-colors hover:border-parish-brass/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-parish-brass"
                                        aria-haspopup="listbox"
                                        aria-expanded={showFundDropdown}
                                    >
                                        <span className="text-lg text-parish-fg">{currentFund.label}</span>
                                        <ChevronDown size={18} className={`text-parish-muted transition-transform ${showFundDropdown ? 'rotate-180' : ''}`} />
                                    </button>
                                    {showFundDropdown && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setShowFundDropdown(false)} />
                                            <ul
                                                role="listbox"
                                                className="absolute z-50 mt-2 w-full overflow-hidden rounded-[1.25rem] border border-parish-border/10 bg-parish-surface shadow-xl"
                                            >
                                                {FUNDS.map(fund => (
                                                    <li key={fund.id}>
                                                        <button
                                                            role="option"
                                                            aria-selected={selectedFund === fund.id}
                                                            onClick={() => { setSelectedFund(fund.id); setShowFundDropdown(false); }}
                                                            className={`w-full px-5 py-4 text-left transition-colors hover:bg-parish-brass/5 ${selectedFund === fund.id ? 'bg-parish-brass/10' : ''}`}
                                                        >
                                                            <div className="text-base text-parish-fg">{fund.label}</div>
                                                            <div className="text-sm text-parish-muted">{fund.description}</div>
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Donor info */}
                            <div className="mt-8 space-y-4">
                                <div>
                                    <label htmlFor="donor-name" className="ornamental-kicker mb-2 block text-[0.68rem]">
                                        Your Name <span className="text-parish-muted">(optional)</span>
                                    </label>
                                    <input
                                        id="donor-name"
                                        type="text"
                                        value={donorName}
                                        onChange={e => setDonorName(e.target.value)}
                                        placeholder="John Smith"
                                        className="w-full rounded-[1.25rem] border border-parish-border/10 bg-parish-bg px-5 py-4 text-parish-fg transition-colors focus:border-parish-brass/40 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="donor-email" className="ornamental-kicker mb-2 block text-[0.68rem]">
                                        Email Address <span className="text-parish-fg text-xs">*</span>
                                    </label>
                                    <input
                                        id="donor-email"
                                        type="email"
                                        required
                                        value={donorEmail}
                                        onChange={e => setDonorEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        className="w-full rounded-[1.25rem] border border-parish-border/10 bg-parish-bg px-5 py-4 text-parish-fg transition-colors focus:border-parish-brass/40 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                onClick={handleSubmit}
                                disabled={!isValid || isSubmitting}
                                className="pilgrimage-button mt-8 w-full disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-3">
                                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-current/30 border-t-current" />
                                        Processing…
                                    </span>
                                ) : (
                                    `Donate $${effectiveAmount > 0 ? effectiveAmount.toFixed(2) : '0.00'} AUD${isRecurring ? ' / month' : ''}`
                                )}
                            </button>

                            <p className="mt-4 flex items-center justify-center gap-2 text-center text-sm text-parish-muted">
                                <CreditCard size={14} className="text-parish-brass" /> Payments processed securely via Stripe
                            </p>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6 lg:col-span-2">
                        <ScriptureBlock>
                            <div className="ornamental-kicker !text-parish-brass">Your Impact</div>
                            <ul className="mt-4 space-y-4 text-lg leading-relaxed text-parish-inverse/85">
                                <li className="flex items-start gap-3">
                                    <span className="mt-0.5 text-xl text-parish-brass">✦</span>
                                    <span>Supports daily Mass, liturgy, and music ministry</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-0.5 text-xl text-parish-brass">✦</span>
                                    <span>Funds youth programs and faith formation</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-0.5 text-xl text-parish-brass">✦</span>
                                    <span>Maintains our historic church buildings</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-0.5 text-xl text-parish-brass">✦</span>
                                    <span>Helps those in need through community outreach</span>
                                </li>
                            </ul>
                        </ScriptureBlock>

                        <InfoCard>
                            <div className="ornamental-kicker">Other Ways To Give</div>
                            <div className="mt-4 space-y-4 text-sm leading-relaxed text-parish-muted">
                                <div>
                                    <div className="ornamental-kicker text-[0.62rem]">Planned Giving</div>
                                    <p className="mt-1">Set up regular contributions via your bank. Contact the parish office for details.</p>
                                </div>
                                <div>
                                    <div className="ornamental-kicker text-[0.62rem]">Collection Plate</div>
                                    <p className="mt-1">Traditional cash or envelope donations are always welcome at any Mass.</p>
                                </div>
                                <div>
                                    <div className="ornamental-kicker text-[0.62rem]">Direct Deposit</div>
                                    <p className="mt-1">BSB: Contact parish office<br />Account: Contact parish office</p>
                                </div>
                            </div>
                        </InfoCard>
                    </div>
                </div>
            </section>
        </UtilityPageTemplate>
    );
}
