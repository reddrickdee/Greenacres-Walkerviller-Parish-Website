import { motion } from 'framer-motion';
import { useParishData } from '../context/ParishDataContext';

export function ContactPage() {
    const { content, isLoading } = useParishData();

    if (isLoading || !content) {
        return <div className="h-screen flex items-center justify-center bg-parish-bg font-display tracking-widest text-lg">Loading…</div>;
    }

    const { contact, schools } = content;

    return (
        <div className="min-h-screen bg-parish-bg pt-28 pb-24 px-6 md:px-16 lg:px-24">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="mb-16 md:mb-20 text-center"
                >
                    <div className="text-parish-accent font-display tracking-widest text-base uppercase mb-4">Get In Touch</div>
                    <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-parish-fg leading-tight text-balance">
                        Contact <em className="font-serif italic text-parish-accent">Us</em>
                    </h1>
                    <p className="font-serif text-xl text-parish-muted mt-6 max-w-2xl mx-auto">
                        We'd love to hear from you. Whether you have a question, need pastoral support, or simply want to say hello.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Contact Details */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.1 }}
                        className="bg-parish-surface p-8 md:p-12 rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.06)] border border-parish-border/5"
                    >
                        <h2 className="font-display text-3xl mb-8">Parish Office</h2>
                        <div className="space-y-6">
                            <div>
                                <div className="font-display tracking-widest text-sm uppercase text-parish-accent mb-2">Address</div>
                                <p className="font-serif text-xl text-parish-fg">{contact.address}</p>
                            </div>
                            <div>
                                <div className="font-display tracking-widest text-sm uppercase text-parish-accent mb-2">Postal Address</div>
                                <p className="font-serif text-xl text-parish-fg">{contact.postalAddress}</p>
                            </div>
                            <div>
                                <div className="font-display tracking-widest text-sm uppercase text-parish-accent mb-2">Phone</div>
                                <a href={`tel:${contact.phone}`} className="font-serif text-xl text-parish-fg hover:text-parish-accent transition-colors underline decoration-parish-accent/30 hover:decoration-parish-accent">{contact.phone}</a>
                            </div>
                            <div>
                                <div className="font-display tracking-widest text-sm uppercase text-parish-accent mb-2">Email</div>
                                <a href={`mailto:${contact.email}`} className="font-serif text-xl text-parish-fg hover:text-parish-accent transition-colors underline decoration-parish-accent/30 hover:decoration-parish-accent break-all">{contact.email}</a>
                            </div>
                            <div>
                                <div className="font-display tracking-widest text-sm uppercase text-parish-accent mb-2">Office Hours</div>
                                <p className="font-serif text-xl text-parish-fg">{contact.officeHours}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Maps */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="bg-parish-surface p-5 rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.06)] border border-parish-border/5 overflow-hidden"
                        >
                            <h3 className="font-display text-xl mb-3 px-2">St Monica's Church</h3>
                            <iframe
                                title="St Monica's Church location"
                                className="w-full h-52 rounded-2xl"
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(contact.stMonicaQuery)}&output=embed`}
                                loading="lazy"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="bg-parish-surface p-5 rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.06)] border border-parish-border/5 overflow-hidden"
                        >
                            <h3 className="font-display text-xl mb-3 px-2">St Martin's Church</h3>
                            <iframe
                                title="St Martin's Church location"
                                className="w-full h-52 rounded-2xl"
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
                    transition={{ duration: 1 }}
                    className="mt-20"
                >
                    <h2 className="font-display text-3xl md:text-4xl mb-10 text-center">Parish Schools</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {schools.map((school, i) => (
                            <div key={i} className="bg-parish-surface p-8 md:p-10 rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.06)] border border-parish-border/5">
                                <h3 className="font-display text-2xl mb-4">{school.name}</h3>
                                <div className="space-y-3 font-serif text-lg text-parish-muted">
                                    <p>{school.address}</p>
                                    <p>Principal: <strong className="text-parish-fg">{school.principal}</strong></p>
                                    <p>Phone: <a href={`tel:${school.phone}`} className="text-parish-fg hover:text-parish-accent transition-colors underline decoration-parish-accent/30">{school.phone}</a></p>
                                    <p>Website: <a href={`https://${school.website}`} target="_blank" rel="noopener noreferrer" className="text-parish-fg hover:text-parish-accent transition-colors underline decoration-parish-accent/30">{school.website}</a></p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
