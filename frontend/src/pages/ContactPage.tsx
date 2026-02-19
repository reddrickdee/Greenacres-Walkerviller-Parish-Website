import { motion } from 'framer-motion';
import { useParishData } from '../context/ParishDataContext';

export function ContactPage() {
    const { content, isLoading } = useParishData();

    if (isLoading || !content) {
        return <div className="h-screen flex items-center justify-center bg-parish-bg font-display tracking-widest text-sm uppercase">Loading…</div>;
    }

    const { contact, schools } = content;

    return (
        <div className="min-h-screen bg-parish-bg pt-32 pb-24 px-8 md:px-24">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="mb-24 text-center"
                >
                    <div className="text-parish-accent font-display tracking-widest text-sm uppercase mb-4">Get In Touch</div>
                    <h1 className="font-display text-6xl md:text-8xl text-parish-fg leading-none mx-auto text-balance">
                        Contact <em className="font-serif italic text-parish-accent">Us</em>
                    </h1>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Contact Details Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
                        className="bg-white p-10 md:p-14 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-black/5"
                    >
                        <h2 className="font-display text-3xl mb-8">Parish Office</h2>
                        <div className="space-y-6">
                            <div>
                                <div className="font-display tracking-widest text-xs uppercase text-parish-accent mb-2">Address</div>
                                <p className="font-serif text-xl text-parish-fg">{contact.address}</p>
                            </div>
                            <div>
                                <div className="font-display tracking-widest text-xs uppercase text-parish-accent mb-2">Postal Address</div>
                                <p className="font-serif text-xl text-parish-fg">{contact.postalAddress}</p>
                            </div>
                            <div>
                                <div className="font-display tracking-widest text-xs uppercase text-parish-accent mb-2">Phone</div>
                                <a href={`tel:${contact.phone}`} className="font-serif text-xl text-parish-fg hover:text-parish-accent transition-colors">{contact.phone}</a>
                            </div>
                            <div>
                                <div className="font-display tracking-widest text-xs uppercase text-parish-accent mb-2">Email</div>
                                <a href={`mailto:${contact.email}`} className="font-serif text-xl text-parish-fg hover:text-parish-accent transition-colors">{contact.email}</a>
                            </div>
                            <div>
                                <div className="font-display tracking-widest text-xs uppercase text-parish-accent mb-2">Office Hours</div>
                                <p className="font-serif text-xl text-parish-fg">{contact.officeHours}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Map + Schools */}
                    <div className="space-y-12">
                        {/* Map embeds */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
                            className="bg-white p-6 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-black/5 overflow-hidden"
                        >
                            <iframe
                                title="St Monica's Church"
                                className="w-full h-56 rounded-2xl"
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(contact.stMonicaQuery)}&output=embed`}
                                loading="lazy"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
                            className="bg-white p-6 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-black/5 overflow-hidden"
                        >
                            <iframe
                                title="St Martin's Church"
                                className="w-full h-56 rounded-2xl"
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(contact.stMartinQuery)}&output=embed`}
                                loading="lazy"
                            />
                        </motion.div>
                    </div>
                </div>

                {/* Parish Schools */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="mt-24"
                >
                    <h2 className="font-display text-4xl mb-12 text-center">Parish Schools</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {schools.map((school, i) => (
                            <div key={i} className="bg-white p-10 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-black/5">
                                <h3 className="font-display text-2xl mb-4">{school.name}</h3>
                                <div className="space-y-3 font-serif text-lg text-parish-muted">
                                    <p>{school.address}</p>
                                    <p>Principal: {school.principal}</p>
                                    <p>Phone: <a href={`tel:${school.phone}`} className="hover:text-parish-accent transition-colors">{school.phone}</a></p>
                                    <p>Website: <a href={`https://${school.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-parish-accent transition-colors">{school.website}</a></p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
