import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePageSEO } from '../hooks/usePageSEO';
import { Send, CheckCircle, Droplets, Heart as HeartIcon, Cross, BookOpen } from 'lucide-react';

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

        // In production this would POST to Supabase sacrament_requests table
        // and trigger an email notification to the parish office via Edge Function
        await new Promise(resolve => setTimeout(resolve, 1200));

        setIsSubmitting(false);
        setIsSubmitted(true);
    };

    const currentSacrament = SACRAMENT_TYPES.find(s => s.id === selectedSacrament);

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-parish-bg pt-28 pb-24 px-6 md:px-16 lg:px-24">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-lg mx-auto text-center"
                >
                    <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-parish-accent/10 flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-parish-accent" />
                    </div>
                    <h1 className="font-display text-4xl md:text-5xl text-parish-fg mb-6">Request Received</h1>
                    <p className="font-serif text-xl text-parish-muted italic mb-6 leading-relaxed">
                        Thank you, {fullName}. Your request for <strong className="text-parish-fg">{currentSacrament?.label}</strong> has been submitted
                        to the parish office.
                    </p>
                    <div className="bg-parish-surface border border-parish-border/10 rounded-2xl p-6 mb-8 text-left">
                        <h3 className="font-display tracking-widest text-xs uppercase text-parish-accent mb-3">What Happens Next</h3>
                        <ol className="space-y-3 font-serif text-base text-parish-muted leading-relaxed list-decimal list-inside">
                            <li>A parish team member will review your request within 2–3 business days.</li>
                            <li>You will receive an email at <strong className="text-parish-fg">{email}</strong> to arrange an initial meeting.</li>
                            <li>During the meeting, we'll discuss the preparation pathway and answer your questions.</li>
                        </ol>
                    </div>
                    <p className="font-serif text-lg text-parish-muted italic">
                        "I am the way, the truth, and the life." — John 14:6
                    </p>
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
                    <div className="text-parish-accent font-display tracking-widest text-base uppercase mb-4">Sacramental Life</div>
                    <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-parish-fg leading-tight mb-6 text-balance">
                        Begin Your <em className="font-serif italic text-parish-accent">Journey</em>
                    </h1>
                    <p className="font-serif text-xl md:text-2xl text-parish-muted max-w-2xl mx-auto leading-relaxed italic">
                        Request information about receiving a Sacrament or arrange a consultation with our parish team.
                    </p>
                </motion.div>

                <form onSubmit={handleSubmit}>
                    {/* Sacrament type selection */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="mb-12"
                    >
                        <h2 className="font-display text-2xl text-parish-fg mb-6">Which Sacrament?</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {SACRAMENT_TYPES.map(sacrament => {
                                const Icon = sacrament.icon;
                                const isSelected = selectedSacrament === sacrament.id;
                                return (
                                    <button
                                        key={sacrament.id}
                                        type="button"
                                        onClick={() => setSelectedSacrament(sacrament.id)}
                                        aria-pressed={isSelected}
                                        className={`p-6 rounded-2xl border-2 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-parish-accent group ${isSelected
                                            ? 'bg-parish-accent/10 border-parish-accent shadow-md'
                                            : 'bg-parish-surface border-parish-border/10 hover:border-parish-accent/30'
                                            }`}
                                    >
                                        <Icon size={24} className={`mb-3 ${isSelected ? 'text-parish-accent' : 'text-parish-muted group-hover:text-parish-accent'} transition-colors`} />
                                        <div className="font-display text-lg text-parish-fg mb-1">{sacrament.label}</div>
                                        <p className="font-serif text-sm text-parish-muted leading-relaxed">{sacrament.description}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Contact details */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="bg-parish-surface border border-parish-border/10 rounded-[2rem] p-8 md:p-10 shadow-sm mb-8"
                    >
                        <h2 className="font-display text-2xl text-parish-fg mb-6">Your Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="sac-name" className="font-display tracking-widest text-xs uppercase text-parish-accent mb-2 block">
                                    Full Name <span className="text-parish-fg text-xs">*</span>
                                </label>
                                <input id="sac-name" type="text" required value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your name"
                                    className="w-full px-5 py-4 rounded-xl border-2 border-parish-border/10 bg-parish-bg text-parish-fg font-serif text-lg focus:border-parish-accent focus:outline-none transition-colors" />
                            </div>
                            <div>
                                <label htmlFor="sac-email" className="font-display tracking-widest text-xs uppercase text-parish-accent mb-2 block">
                                    Email <span className="text-parish-fg text-xs">*</span>
                                </label>
                                <input id="sac-email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                                    className="w-full px-5 py-4 rounded-xl border-2 border-parish-border/10 bg-parish-bg text-parish-fg font-serif text-lg focus:border-parish-accent focus:outline-none transition-colors" />
                            </div>
                            <div>
                                <label htmlFor="sac-phone" className="font-display tracking-widest text-xs uppercase text-parish-accent mb-2 block">
                                    Phone <span className="text-parish-muted">(optional)</span>
                                </label>
                                <input id="sac-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="0412 345 678"
                                    className="w-full px-5 py-4 rounded-xl border-2 border-parish-border/10 bg-parish-bg text-parish-fg font-serif text-lg focus:border-parish-accent focus:outline-none transition-colors" />
                            </div>
                            <div>
                                <label htmlFor="sac-date" className="font-display tracking-widest text-xs uppercase text-parish-accent mb-2 block">
                                    Preferred Date <span className="text-parish-muted">(if applicable)</span>
                                </label>
                                <input id="sac-date" type="date" value={preferredDate} onChange={e => setPreferredDate(e.target.value)}
                                    className="w-full px-5 py-4 rounded-xl border-2 border-parish-border/10 bg-parish-bg text-parish-fg font-serif text-lg focus:border-parish-accent focus:outline-none transition-colors" />
                            </div>
                        </div>
                        <div className="mt-6">
                            <label htmlFor="sac-info" className="font-display tracking-widest text-xs uppercase text-parish-accent mb-2 block">
                                Additional Information <span className="text-parish-muted">(optional)</span>
                            </label>
                            <textarea
                                id="sac-info"
                                rows={3}
                                value={additionalInfo}
                                onChange={e => setAdditionalInfo(e.target.value)}
                                placeholder="Any questions or details you'd like us to know…"
                                className="w-full px-5 py-4 rounded-xl border-2 border-parish-border/10 bg-parish-bg text-parish-fg font-serif text-lg focus:border-parish-accent focus:outline-none transition-colors resize-none"
                            />
                        </div>
                    </motion.div>

                    {/* Submit */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-center"
                    >
                        <button
                            type="submit"
                            disabled={!isValid || isSubmitting}
                            className="inline-flex items-center gap-3 px-12 py-5 rounded-full bg-parish-accent text-white font-display tracking-widest uppercase text-base hover:bg-parish-accent-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-parish-accent/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-parish-accent focus-visible:ring-offset-2"
                        >
                            {isSubmitting ? (
                                <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting…</>
                            ) : (
                                <><Send size={18} /> Submit Request</>
                            )}
                        </button>
                        <p className="font-serif text-sm text-parish-muted mt-4">
                            Your request will be reviewed by the parish office and a team member will contact you.
                        </p>
                    </motion.div>
                </form>
            </div>
        </div>
    );
}
