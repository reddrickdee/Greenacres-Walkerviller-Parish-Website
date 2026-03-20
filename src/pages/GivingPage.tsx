import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { usePageSEO } from '../hooks/usePageSEO';
import { Heart, ChevronDown, Star } from 'lucide-react';
import { InfoCard, ScriptureBlock, SectionIntro, UtilityPageTemplate } from '../components/layout/PageTemplates';
import { FormField } from '../components/ui/FormField';
import { FormErrorSummary } from '../components/ui/FormErrorSummary';

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
    const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

    usePageSEO({
        title: 'Support Our Parish — Pledge or Enquire',
        description: 'Express your intent to support Greenacres Walkerville Catholic Parish. Submit a giving pledge or enquiry and the parish office will follow up with you.',
        path: '/giving',
    });

    const effectiveAmount = selectedAmount ?? (customAmount ? parseFloat(customAmount) : 0);
    const currentFund = FUNDS.find(f => f.id === selectedFund)!;

    // Validation
    const errors: Record<string, string> = {};
    if (effectiveAmount < 1) errors.amount = 'Please select or enter an amount of at least $1.';
    if (!donorEmail.trim()) errors.email = 'An email address is required so the parish office can follow up.';
    else if (!donorEmail.includes('@')) errors.email = 'Please enter a valid email address.';
    const isValid = Object.keys(errors).length === 0;

    const handleSelectPreset = (amount: number) => {
        setSelectedAmount(amount);
        setCustomAmount('');
    };

    const handleCustomChange = (value: string) => {
        setCustomAmount(value);
        setSelectedAmount(null);
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setHasAttemptedSubmit(true);
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
                                Your pledge of <strong className="text-parish-fg">${effectiveAmount.toFixed(2)} AUD</strong> to the{' '}
                                <strong className="text-parish-fg">{currentFund.label}</strong> fund
                                {isRecurring ? ' (monthly)' : ''} has been received.
                            </p>
                            <p className="mt-4 text-lg leading-relaxed text-parish-muted">
                                The parish office will be in touch at <strong className="text-parish-fg">{donorEmail}</strong> to arrange the next steps.
                            </p>

                            <ScriptureBlock className="mt-8">
                                <p className="text-lg leading-relaxed text-parish-inverse/85">
                                    "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."
                                </p>
                                <p className="mt-4 text-sm uppercase tracking-[0.24em] text-parish-brass">2 Corinthians 9:7</p>
                            </ScriptureBlock>

                            <InfoCard className="mt-8 text-left">
                                <div className="ornamental-kicker">What Happens Next</div>
                                <p className="mt-3 text-base leading-relaxed text-parish-muted">
                                    A member of the parish team will contact you to confirm your pledge and discuss giving options, including direct deposit, planned giving envelopes, or bank transfer.
                                </p>
                            </InfoCard>

                            <button
                                onClick={() => {
                                    setShowThankYou(false);
                                    setSelectedAmount(50);
                                    setCustomAmount('');
                                    setDonorName('');
                                    setDonorEmail('');
                                    setHasAttemptedSubmit(false);
                                }}
                                className="pilgrimage-button mt-8"
                            >
                                Submit Another Pledge
                            </button>
                        </motion.div>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <UtilityPageTemplate
            eyebrow="Support Our Parish"
            title={<>Your generosity sustains the worship, service, and growth of this community.</>}
            description="Express your intent to support the parish by submitting a pledge or enquiry below. The parish office will follow up to arrange the details."
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
                    <div className="ornamental-kicker">How It Works</div>
                    <p className="mt-3 text-sm leading-relaxed text-parish-muted">
                        This form registers your intent to give. No payment is processed online. The parish office will contact you to arrange your preferred giving method.
                    </p>
                </div>
            )}
        >
            <section className="page-section">
                <div className="page-section-inner grid gap-10 lg:grid-cols-5">
                    {/* Main Form */}
                    <div className="lg:col-span-3">
                        <form onSubmit={handleSubmit} noValidate className="sanctuary-panel px-7 py-8 md:px-10 md:py-10">
                            <SectionIntro
                                eyebrow="Choose Amount"
                                title={<>Select or enter a custom pledge amount.</>}
                            />

                            {hasAttemptedSubmit && !isValid && (
                                <FormErrorSummary errors={errors} className="mt-6" />
                            )}

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
                                    id="giving-custom-amount"
                                    type="number"
                                    min="1"
                                    step="0.01"
                                    placeholder="Custom amount"
                                    value={customAmount}
                                    onChange={e => handleCustomChange(e.target.value)}
                                    onFocus={() => setSelectedAmount(null)}
                                    className="w-full rounded-[1.25rem] border border-parish-border/10 bg-parish-bg py-4 pl-8 pr-4 text-lg text-parish-fg transition-colors focus:border-parish-brass/40 focus:outline-none"
                                    aria-label="Custom pledge amount in AUD"
                                    aria-describedby={hasAttemptedSubmit && errors.amount ? 'giving-custom-amount-error' : undefined}
                                />
                                {hasAttemptedSubmit && errors.amount && (
                                    <p id="giving-custom-amount-error" role="alert" className="mt-1.5 text-sm text-red-500">{errors.amount}</p>
                                )}
                            </div>

                            {/* Recurring */}
                            <div className="mt-8 flex items-center justify-between rounded-[1.25rem] border border-parish-border/5 bg-parish-bg px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-base text-parish-fg">Give Monthly (Recurring)</span>
                                </div>
                                <button
                                    role="switch"
                                    aria-checked={isRecurring}
                                    aria-label="Monthly recurring pledge"
                                    onClick={() => setIsRecurring(!isRecurring)}
                                    className={`relative h-7 w-12 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-parish-brass ${isRecurring ? 'bg-parish-brass' : 'bg-parish-border/20'}`}
                                >
                                    <span className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-200 ${isRecurring ? 'translate-x-5' : ''}`} />
                                </button>
                            </div>

                            {/* Fund selector */}
                            <div className="mt-8">
                                <div className="ornamental-kicker mb-3">Designate Your Pledge</div>
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
                                            <div className="fixed inset-0 z-dropdown" onClick={() => setShowFundDropdown(false)} />
                                            <ul
                                                role="listbox"
                                                className="absolute z-dropdown mt-2 w-full overflow-hidden rounded-[1.25rem] border border-parish-border/10 bg-parish-surface shadow-xl"
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
                                <FormField
                                    id="donor-name"
                                    label={<>Your Name <span className="text-parish-muted">(optional)</span></>}
                                >
                                    <input
                                        id="donor-name"
                                        type="text"
                                        value={donorName}
                                        onChange={e => setDonorName(e.target.value)}
                                        placeholder="John Smith"
                                        className="w-full rounded-[1.25rem] border border-parish-border/10 bg-parish-bg px-5 py-4 text-parish-fg transition-colors focus:border-parish-brass/40 focus:outline-none"
                                    />
                                </FormField>
                                <FormField
                                    id="donor-email"
                                    label="Email Address"
                                    required
                                    error={hasAttemptedSubmit ? errors.email : undefined}
                                >
                                    <input
                                        id="donor-email"
                                        type="email"
                                        required
                                        value={donorEmail}
                                        onChange={e => setDonorEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        className="w-full rounded-[1.25rem] border border-parish-border/10 bg-parish-bg px-5 py-4 text-parish-fg transition-colors focus:border-parish-brass/40 focus:outline-none"
                                        aria-describedby={hasAttemptedSubmit && errors.email ? 'donor-email-error' : undefined}
                                    />
                                </FormField>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="pilgrimage-button mt-8 w-full disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-3">
                                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-current/30 border-t-current" />
                                        Submitting…
                                    </span>
                                ) : (
                                    `Submit Pledge — $${effectiveAmount > 0 ? effectiveAmount.toFixed(2) : '0.00'} AUD${isRecurring ? ' / month' : ''}`
                                )}
                            </button>

                            <p className="mt-4 text-center text-sm text-parish-muted">
                                No payment is processed online. The parish office will contact you to arrange your preferred giving method.
                            </p>
                        </form>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6 lg:col-span-2">
                        <ScriptureBlock>
                            <div className="ornamental-kicker !text-parish-brass">Your Impact</div>
                            <ul className="mt-4 space-y-4 text-lg leading-relaxed text-parish-inverse/85">
                                <li className="flex items-start gap-3">
                                    <Star size={16} className="mt-1 shrink-0 text-parish-brass" />
                                    <span>Supports daily Mass, liturgy, and music ministry</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Star size={16} className="mt-1 shrink-0 text-parish-brass" />
                                    <span>Funds youth programs and faith formation</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Star size={16} className="mt-1 shrink-0 text-parish-brass" />
                                    <span>Maintains our historic church buildings</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Star size={16} className="mt-1 shrink-0 text-parish-brass" />
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
