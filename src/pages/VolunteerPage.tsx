import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePageSEO } from '../hooks/usePageSEO';
import { Heart, Users, Music, BookOpen, HandHelping, Baby, Send, CheckCircle } from 'lucide-react';

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

        // In production this would POST to Supabase volunteer_requests table
        await new Promise(resolve => setTimeout(resolve, 1200));

        setIsSubmitting(false);
        setIsSubmitted(true);
    };

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
                    <h1 className="font-display text-4xl md:text-5xl text-parish-fg mb-6">Thank You, {name}!</h1>
                    <p className="font-serif text-xl text-parish-muted italic mb-6 leading-relaxed">
                        Your volunteer interest has been submitted. A ministry coordinator will be in touch within a few days.
                    </p>
                    <div className="bg-parish-surface border border-parish-border/10 rounded-2xl p-6 mb-8">
                        <h3 className="font-display tracking-widest text-xs uppercase text-parish-accent mb-3">Ministries Selected</h3>
                        <div className="flex flex-wrap gap-2">
                            {selectedMinistries.map(id => {
                                const m = MINISTRIES.find(m => m.id === id);
                                return m ? (
                                    <span key={id} className="px-3 py-1.5 bg-parish-accent/10 text-parish-accent rounded-full font-display text-xs tracking-wider uppercase">
                                        {m.label}
                                    </span>
                                ) : null;
                            })}
                        </div>
                    </div>
                    <p className="font-serif text-lg text-parish-muted italic">
                        "Each of you should use whatever gift you have received to serve others." — 1 Peter 4:10
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-parish-bg pt-28 pb-24 px-6 md:px-16 lg:px-24">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="mb-16 text-center"
                >
                    <div className="text-parish-accent font-display tracking-widest text-base uppercase mb-4">Volunteer</div>
                    <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-parish-fg leading-tight mb-6 text-balance">
                        Share Your <em className="font-serif italic text-parish-accent">Gifts</em>
                    </h1>
                    <p className="font-serif text-xl md:text-2xl text-parish-muted max-w-2xl mx-auto leading-relaxed italic">
                        Our parish thrives because of generous volunteers. Find your place in one of our many ministries.
                    </p>
                </motion.div>

                <form onSubmit={handleSubmit}>
                    {/* Ministry selection grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="mb-12"
                    >
                        <h2 className="font-display text-2xl text-parish-fg mb-6">Select Ministries of Interest</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {MINISTRIES.map(ministry => {
                                const Icon = ministry.icon;
                                const isSelected = selectedMinistries.includes(ministry.id);
                                return (
                                    <button
                                        key={ministry.id}
                                        type="button"
                                        onClick={() => toggleMinistry(ministry.id)}
                                        aria-pressed={isSelected}
                                        className={`p-6 rounded-2xl border-2 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-parish-accent group ${isSelected
                                            ? 'bg-parish-accent/10 border-parish-accent shadow-md'
                                            : 'bg-parish-surface border-parish-border/10 hover:border-parish-accent/30'
                                            }`}
                                    >
                                        <Icon size={24} className={`mb-3 ${isSelected ? 'text-parish-accent' : 'text-parish-muted group-hover:text-parish-accent'} transition-colors`} />
                                        <div className="font-display text-base text-parish-fg mb-1">{ministry.label}</div>
                                        <p className="font-serif text-sm text-parish-muted leading-relaxed">{ministry.description}</p>
                                    </button>
                                );
                            })}
                        </div>
                        {selectedMinistries.length === 0 && (
                            <p className="text-parish-muted font-serif text-sm italic mt-3">Please select at least one ministry.</p>
                        )}
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
                                <label htmlFor="vol-name" className="font-display tracking-widest text-xs uppercase text-parish-accent mb-2 block">
                                    Full Name <span className="text-parish-fg text-xs">*</span>
                                </label>
                                <input id="vol-name" type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
                                    className="w-full px-5 py-4 rounded-xl border-2 border-parish-border/10 bg-parish-bg text-parish-fg font-serif text-lg focus:border-parish-accent focus:outline-none transition-colors" />
                            </div>
                            <div>
                                <label htmlFor="vol-email" className="font-display tracking-widest text-xs uppercase text-parish-accent mb-2 block">
                                    Email <span className="text-parish-fg text-xs">*</span>
                                </label>
                                <input id="vol-email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                                    className="w-full px-5 py-4 rounded-xl border-2 border-parish-border/10 bg-parish-bg text-parish-fg font-serif text-lg focus:border-parish-accent focus:outline-none transition-colors" />
                            </div>
                            <div>
                                <label htmlFor="vol-phone" className="font-display tracking-widest text-xs uppercase text-parish-accent mb-2 block">
                                    Phone <span className="text-parish-muted">(optional)</span>
                                </label>
                                <input id="vol-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="0412 345 678"
                                    className="w-full px-5 py-4 rounded-xl border-2 border-parish-border/10 bg-parish-bg text-parish-fg font-serif text-lg focus:border-parish-accent focus:outline-none transition-colors" />
                            </div>
                            <div>
                                <label htmlFor="vol-message" className="font-display tracking-widest text-xs uppercase text-parish-accent mb-2 block">
                                    Anything else? <span className="text-parish-muted">(optional)</span>
                                </label>
                                <input id="vol-message" type="text" value={message} onChange={e => setMessage(e.target.value)} placeholder="Skills, availability, etc."
                                    className="w-full px-5 py-4 rounded-xl border-2 border-parish-border/10 bg-parish-bg text-parish-fg font-serif text-lg focus:border-parish-accent focus:outline-none transition-colors" />
                            </div>
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
                                <><Send size={18} /> Sign Up to Volunteer</>
                            )}
                        </button>
                    </motion.div>
                </form>
            </div>
        </div>
    );
}
