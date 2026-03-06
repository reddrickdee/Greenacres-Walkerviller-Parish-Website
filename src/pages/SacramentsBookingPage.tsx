import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { usePageSEO } from '../hooks/usePageSEO';
import { Send, CheckCircle, Droplets, Heart as HeartIcon, Cross, BookOpen } from 'lucide-react';
import { ActionBand, InfoCard, ScriptureBlock, SectionIntro, UtilityPageTemplate } from '../components/layout/PageTemplates';

const SACRAMENT_TYPES = [
    { id: 'baptism', label: 'Baptism', icon: Droplets, description: 'For infants, children, or adults seeking to receive the Sacrament of Baptism.' },
    { id: 'marriage', label: 'Marriage Preparation', icon: HeartIcon, description: 'Six months advance notice required. Includes preparation course.' },
    { id: 'rcia', label: 'RCIA — Becoming Catholic', icon: BookOpen, description: 'For adults interested in learning about and entering the Catholic faith.' },
    { id: 'anointing', label: 'Anointing of the Sick', icon: Cross, description: 'For those who are seriously ill, facing surgery, or elderly.' },
];

export function SacramentsBookingPage() {
    const [selectedSacrament, setSelectedSacrament] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [preferredDate, setPreferredDate] = useState('');
    const [additionalInfo, setAdditionalInfo] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    usePageSEO({
        title: 'Sacrament Request — Book a Consultation',
        description: 'Request information or book a consultation for Baptism, Marriage, RCIA, or Anointing of the Sick at Greenacres Walkerville Catholic Parish.',
        path: '/sacraments/request',
    });

    const isValid = selectedSacrament && fullName.trim() && email.includes('@');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1200));
        setIsSubmitting(false);
        setIsSubmitted(true);
    };

    const currentSacrament = SACRAMENT_TYPES.find(s => s.id === selectedSacrament);

    if (isSubmitted) {
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
                                <CheckCircle className="h-10 w-10 text-parish-brass" />
                            </div>
                            <h1 className="text-4xl text-parish-fg md:text-5xl">Request Received</h1>
                            <p className="mt-6 text-xl leading-relaxed text-parish-muted">
                                Thank you, {fullName}. Your request for <strong className="text-parish-fg">{currentSacrament?.label}</strong> has been submitted
                                to the parish office.
                            </p>

                            <InfoCard className="mt-8 text-left">
                                <div className="ornamental-kicker">What Happens Next</div>
                                <ol className="mt-4 list-inside list-decimal space-y-3 text-base leading-relaxed text-parish-muted">
                                    <li>A parish team member will review your request within 2–3 business days.</li>
                                    <li>You will receive an email at <strong className="text-parish-fg">{email}</strong> to arrange an initial meeting.</li>
                                    <li>During the meeting, we'll discuss the preparation pathway and answer your questions.</li>
                                </ol>
                            </InfoCard>

                            <ScriptureBlock className="mt-8">
                                <p className="text-lg leading-relaxed text-parish-inverse/85">
                                    "I am the way, the truth, and the life."
                                </p>
                                <p className="mt-4 text-sm uppercase tracking-[0.24em] text-parish-brass">John 14:6</p>
                            </ScriptureBlock>
                        </motion.div>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <UtilityPageTemplate
            eyebrow="Sacramental Life"
            title={<>Begin your journey toward receiving a Sacrament.</>}
            description="Request information about Baptism, Marriage, RCIA, or Anointing of the Sick. A parish team member will follow up to arrange a conversation."
            imageSrc="/assets/refurbishment/st_monica_4.webp"
            imageAlt="Sanctuary interior"
            actions={(
                <>
                    <Link to="/sacraments" className="pilgrimage-button-secondary">
                        View All Sacraments
                    </Link>
                </>
            )}
            aside={(
                <div className="rounded-[1.5rem] border border-parish-brass/20 bg-parish-border/5 px-5 py-5">
                    <div className="ornamental-kicker">How It Works</div>
                    <p className="mt-3 text-sm leading-relaxed text-parish-muted">
                        Select a sacrament, fill in your details, and submit. A coordinator will contact you within a few days.
                    </p>
                </div>
            )}
        >
            <form onSubmit={handleSubmit}>
                <section className="page-section">
                    <div className="page-section-inner">
                        <SectionIntro
                            eyebrow="Which Sacrament"
                            title={<>Select the sacrament you are enquiring about.</>}
                        />

                        <div className="mt-10 grid gap-4 sm:grid-cols-2">
                            {SACRAMENT_TYPES.map(sacrament => {
                                const Icon = sacrament.icon;
                                const isSelected = selectedSacrament === sacrament.id;
                                return (
                                    <button
                                        key={sacrament.id}
                                        type="button"
                                        onClick={() => setSelectedSacrament(sacrament.id)}
                                        aria-pressed={isSelected}
                                        className={`sanctuary-card text-left transition-all ${isSelected
                                            ? '!border-parish-brass/40 shadow-halo'
                                            : ''
                                            }`}
                                    >
                                        <Icon size={24} className={`mb-3 ${isSelected ? 'text-parish-brass' : 'text-parish-muted'} transition-colors`} />
                                        <div className="ornamental-kicker">{sacrament.label}</div>
                                        <p className="mt-3 text-sm leading-relaxed text-parish-muted">{sacrament.description}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section className="page-section mt-12 md:mt-16">
                    <div className="page-section-inner">
                        <div className="sanctuary-panel px-7 py-8 md:px-10 md:py-10">
                            <div className="ornamental-kicker mb-6">Your Details</div>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <label htmlFor="sac-name" className="ornamental-kicker mb-2 block text-[0.68rem]">
                                        Full Name <span className="text-parish-fg">*</span>
                                    </label>
                                    <input id="sac-name" type="text" required value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your name"
                                        className="w-full rounded-[1.25rem] border border-parish-border/10 bg-parish-bg px-5 py-4 text-parish-fg transition-colors focus:border-parish-brass/40 focus:outline-none" />
                                </div>
                                <div>
                                    <label htmlFor="sac-email" className="ornamental-kicker mb-2 block text-[0.68rem]">
                                        Email <span className="text-parish-fg">*</span>
                                    </label>
                                    <input id="sac-email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                                        className="w-full rounded-[1.25rem] border border-parish-border/10 bg-parish-bg px-5 py-4 text-parish-fg transition-colors focus:border-parish-brass/40 focus:outline-none" />
                                </div>
                                <div>
                                    <label htmlFor="sac-phone" className="ornamental-kicker mb-2 block text-[0.68rem]">
                                        Phone <span className="text-parish-muted">(optional)</span>
                                    </label>
                                    <input id="sac-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="0412 345 678"
                                        className="w-full rounded-[1.25rem] border border-parish-border/10 bg-parish-bg px-5 py-4 text-parish-fg transition-colors focus:border-parish-brass/40 focus:outline-none" />
                                </div>
                                <div>
                                    <label htmlFor="sac-date" className="ornamental-kicker mb-2 block text-[0.68rem]">
                                        Preferred Date <span className="text-parish-muted">(if applicable)</span>
                                    </label>
                                    <input id="sac-date" type="date" value={preferredDate} onChange={e => setPreferredDate(e.target.value)}
                                        className="w-full rounded-[1.25rem] border border-parish-border/10 bg-parish-bg px-5 py-4 text-parish-fg transition-colors focus:border-parish-brass/40 focus:outline-none" />
                                </div>
                            </div>
                            <div className="mt-6">
                                <label htmlFor="sac-info" className="ornamental-kicker mb-2 block text-[0.68rem]">
                                    Additional Information <span className="text-parish-muted">(optional)</span>
                                </label>
                                <textarea
                                    id="sac-info"
                                    rows={3}
                                    value={additionalInfo}
                                    onChange={e => setAdditionalInfo(e.target.value)}
                                    placeholder="Any questions or details you'd like us to know…"
                                    className="w-full resize-none rounded-[1.25rem] border border-parish-border/10 bg-parish-bg px-5 py-4 text-parish-fg transition-colors focus:border-parish-brass/40 focus:outline-none"
                                />
                            </div>

                            <div className="mt-8 text-center">
                                <button
                                    type="submit"
                                    disabled={!isValid || isSubmitting}
                                    className="pilgrimage-button inline-flex items-center gap-3 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    {isSubmitting ? (
                                        <><span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Submitting…</>
                                    ) : (
                                        <><Send size={18} /> Submit Request</>
                                    )}
                                </button>
                                <p className="mt-4 text-sm text-parish-muted">
                                    Your request will be reviewed by the parish office and a team member will contact you.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </form>

            <section className="page-section mt-16 md:mt-20">
                <div className="page-section-inner">
                    <ActionBand>
                        <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
                            <div className="lg:col-span-8">
                                <span className="section-label mb-4">Learn More First</span>
                                <h2 className="text-[clamp(2.2rem,4vw,3.9rem)] text-parish-fg">
                                    Read about each sacrament and the preparation pathways before you request.
                                </h2>
                            </div>
                            <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
                                <Link to="/sacraments" className="pilgrimage-button">
                                    View All Sacraments
                                </Link>
                                <Link to="/contact" className="pilgrimage-button-secondary">
                                    Contact The Office
                                </Link>
                            </div>
                        </div>
                    </ActionBand>
                </div>
            </section>
        </UtilityPageTemplate>
    );
}
