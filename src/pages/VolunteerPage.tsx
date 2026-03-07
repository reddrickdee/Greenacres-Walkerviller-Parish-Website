import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePageSEO } from '../hooks/usePageSEO';
import { Heart, Users, Music, BookOpen, HandHelping, Baby, Send, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ActionBand, InfoCard, ScriptureBlock, SectionIntro, HighlightPageTemplate } from '../components/layout/PageTemplates';

const MINISTRIES = [
    { id: 'reader', label: 'Reader / Lector', icon: BookOpen, description: 'Proclaim the Word of God at Mass.' },
    { id: 'eucharistic', label: 'Eucharistic Minister', icon: HandHelping, description: 'Assist with the distribution of Holy Communion.' },
    { id: 'music', label: 'Music Ministry', icon: Music, description: 'Join our choir or play an instrument at Mass.' },
    { id: 'altar_server', label: 'Altar Server', icon: Heart, description: 'Serve at the altar during Mass.' },
    { id: 'hospitality', label: 'Hospitality & Welcome', icon: Users, description: 'Greet parishioners and visitors at Mass.' },
    { id: 'childrens_liturgy', label: "Children's Liturgy", icon: Baby, description: 'Help lead the Liturgy of the Word for children.' },
    { id: 'maintenance', label: 'Property & Grounds', icon: HandHelping, description: 'Help maintain our church buildings and gardens.' },
    { id: 'outreach', label: 'Community Outreach', icon: Heart, description: 'Support those in need through parish programs.' },
];

export function VolunteerPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [selectedMinistries, setSelectedMinistries] = useState<string[]>([]);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    usePageSEO({
        title: 'Volunteer — Get Involved',
        description: 'Volunteer your time and talents at Greenacres Walkerville Catholic Parish. Join our ministries and make a difference in our community.',
        path: '/volunteer',
    });

    const toggleMinistry = (id: string) => {
        setSelectedMinistries(prev =>
            prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
        );
    };

    const isValid = name.trim() && email.includes('@') && selectedMinistries.length > 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1200));
        setIsSubmitting(false);
        setIsSubmitted(true);
    };

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
                            <h1 className="text-4xl text-parish-fg md:text-5xl">Thank You, {name}!</h1>
                            <p className="mt-6 text-xl leading-relaxed text-parish-muted">
                                Your volunteer interest has been submitted. A ministry coordinator will be in touch within a few days.
                            </p>
                            <InfoCard className="mt-8 text-left">
                                <div className="ornamental-kicker">Ministries Selected</div>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {selectedMinistries.map(id => {
                                        const m = MINISTRIES.find(m => m.id === id);
                                        return m ? (
                                            <span key={id} className="rounded-full border border-parish-brass/20 bg-parish-elevated/50 px-3 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-parish-brass">
                                                {m.label}
                                            </span>
                                        ) : null;
                                    })}
                                </div>
                            </InfoCard>
                            <ScriptureBlock className="mt-8">
                                <p className="text-lg leading-relaxed text-parish-inverse/85">
                                    "Each of you should use whatever gift you have received to serve others."
                                </p>
                                <p className="mt-4 text-sm uppercase tracking-[0.24em] text-parish-brass">1 Peter 4:10</p>
                            </ScriptureBlock>
                        </motion.div>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <HighlightPageTemplate
            eyebrow="Volunteer"
            title={<>Share your gifts with the parish community.</>}
            description="Our parish thrives because of generous volunteers. Find your place in one of our many ministries and help shape the welcome people feel when they walk through the doors."
            imageSrc="/assets/source/our_parish_2.webp"
            imageAlt="Parish community volunteers"
            actions={(
                <>
                    <Link to="/community" className="pilgrimage-button">
                        Community Hub
                    </Link>
                    <Link to="/contact" className="pilgrimage-button-secondary">
                        Contact The Office
                    </Link>
                </>
            )}
        >
            <form onSubmit={handleSubmit}>
                <section className="page-section">
                    <div className="page-section-inner">
                        <SectionIntro
                            eyebrow="Select Ministries"
                            title={<>Choose where your gifts can make the most difference.</>}
                            description="Select one or more ministries below. A coordinator will follow up with next steps."
                        />

                        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {MINISTRIES.map(ministry => {
                                const Icon = ministry.icon;
                                const isSelected = selectedMinistries.includes(ministry.id);
                                return (
                                    <button
                                        key={ministry.id}
                                        type="button"
                                        onClick={() => toggleMinistry(ministry.id)}
                                        aria-pressed={isSelected}
                                        className={`sanctuary-card text-left transition-all ${isSelected
                                            ? '!border-parish-brass/40 shadow-halo'
                                            : ''
                                            }`}
                                    >
                                        <Icon size={24} className={`mb-3 ${isSelected ? 'text-parish-brass' : 'text-parish-muted'} transition-colors`} />
                                        <div className="ornamental-kicker">{ministry.label}</div>
                                        <p className="mt-3 text-sm leading-relaxed text-parish-muted">{ministry.description}</p>
                                    </button>
                                );
                            })}
                        </div>
                        {selectedMinistries.length === 0 && (
                            <p className="mt-3 text-sm italic text-parish-muted">Please select at least one ministry.</p>
                        )}
                    </div>
                </section>

                <section className="page-section mt-12 md:mt-16">
                    <div className="page-section-inner">
                        <div className="sanctuary-panel px-7 py-8 md:px-10 md:py-10">
                            <div className="ornamental-kicker mb-6">Your Details</div>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <label htmlFor="vol-name" className="ornamental-kicker mb-2 block text-[0.68rem]">
                                        Full Name <span className="text-parish-fg">*</span>
                                    </label>
                                    <input id="vol-name" type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
                                        className="w-full rounded-[1.25rem] border border-parish-border/10 bg-parish-bg px-5 py-4 text-parish-fg transition-colors focus:border-parish-brass/40 focus:outline-none" />
                                </div>
                                <div>
                                    <label htmlFor="vol-email" className="ornamental-kicker mb-2 block text-[0.68rem]">
                                        Email <span className="text-parish-fg">*</span>
                                    </label>
                                    <input id="vol-email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                                        className="w-full rounded-[1.25rem] border border-parish-border/10 bg-parish-bg px-5 py-4 text-parish-fg transition-colors focus:border-parish-brass/40 focus:outline-none" />
                                </div>
                                <div>
                                    <label htmlFor="vol-phone" className="ornamental-kicker mb-2 block text-[0.68rem]">
                                        Phone <span className="text-parish-muted">(optional)</span>
                                    </label>
                                    <input id="vol-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="0412 345 678"
                                        className="w-full rounded-[1.25rem] border border-parish-border/10 bg-parish-bg px-5 py-4 text-parish-fg transition-colors focus:border-parish-brass/40 focus:outline-none" />
                                </div>
                                <div>
                                    <label htmlFor="vol-message" className="ornamental-kicker mb-2 block text-[0.68rem]">
                                        Anything else? <span className="text-parish-muted">(optional)</span>
                                    </label>
                                    <input id="vol-message" type="text" value={message} onChange={e => setMessage(e.target.value)} placeholder="Skills, availability, etc."
                                        className="w-full rounded-[1.25rem] border border-parish-border/10 bg-parish-bg px-5 py-4 text-parish-fg transition-colors focus:border-parish-brass/40 focus:outline-none" />
                                </div>
                            </div>

                            <div className="mt-8 text-center">
                                <button
                                    type="submit"
                                    disabled={!isValid || isSubmitting}
                                    className="pilgrimage-button inline-flex items-center gap-3 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    {isSubmitting ? (
                                        <><span className="h-5 w-5 animate-spin rounded-full border-2 border-current/30 border-t-current" /> Submitting…</>
                                    ) : (
                                        <><Send size={18} /> Sign Up To Volunteer</>
                                    )}
                                </button>
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
                                <span className="section-label mb-4">Not Sure Where To Start</span>
                                <h2 className="text-[clamp(2.2rem,4vw,3.9rem)] text-parish-fg">
                                    Speak with the parish office and we will help you find the right fit.
                                </h2>
                            </div>
                            <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
                                <Link to="/contact" className="pilgrimage-button">
                                    Contact The Parish
                                </Link>
                            </div>
                        </div>
                    </ActionBand>
                </div>
            </section>
        </HighlightPageTemplate>
    );
}
