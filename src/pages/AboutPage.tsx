import { motion } from 'framer-motion';
import { useParishData } from '../context/ParishDataContext';

export function AboutPage() {
    const { content, isLoading } = useParishData();

    if (isLoading || !content) {
        return <div className="h-screen flex items-center justify-center bg-parish-bg font-display tracking-widest text-lg">Loading…</div>;
    }

    return (
        <div className="min-h-screen bg-parish-bg pt-28 pb-24 px-6 md:px-16 lg:px-24">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="mb-16 md:mb-20 text-center"
                >
                    <div className="text-parish-accent font-display tracking-widest text-base uppercase mb-4">About Our Parish</div>
                    <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-parish-fg leading-tight mx-auto max-w-3xl text-balance">
                        Welcome and <em className="font-serif italic text-parish-accent">Mission</em>
                    </h1>
                </motion.div>

                {/* Priest's Welcome */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
                    className="mb-16 md:mb-20"
                >
                    <h2 className="font-display text-3xl md:text-4xl text-parish-fg mb-8">From the Parish Priest</h2>
                    <p className="font-serif text-xl md:text-2xl leading-relaxed text-parish-muted">
                        {content.priestWelcome}
                    </p>
                </motion.div>

                {/* Pastoral Council Chair */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="bg-parish-surface p-8 md:p-12 rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.06)] border border-parish-border/5 mb-16 md:mb-20"
                >
                    <h2 className="font-display text-3xl md:text-4xl text-parish-fg mb-8">From the Pastoral Council</h2>
                    <p className="font-serif text-xl md:text-2xl leading-relaxed text-parish-muted">
                        {content.pastoralChairMessage}
                    </p>
                </motion.div>

                {/* Vision + Mission */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 md:mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <h2 className="font-display text-3xl md:text-4xl text-parish-fg mb-6">Our Vision</h2>
                        <p className="font-serif text-xl leading-relaxed text-parish-muted">
                            {content.visionStatement}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.15 }}
                    >
                        <h2 className="font-display text-3xl md:text-4xl text-parish-fg mb-6">Our Mission</h2>
                        <ul className="space-y-4">
                            {content.missionPoints.map((point, i) => (
                                <li key={i} className="font-serif text-xl leading-relaxed text-parish-muted flex gap-4 items-start">
                                    <span className="text-parish-accent font-display text-2xl leading-none mt-1">✦</span>
                                    <span>{point.title}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* Parish Prayer */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="bg-parish-inverse p-8 md:p-14 rounded-[2rem] text-parish-surface mb-16 md:mb-20 text-center"
                >
                    <h2 className="font-display text-3xl text-parish-accent mb-8">Parish Prayer</h2>
                    <p className="font-serif text-xl md:text-2xl italic leading-relaxed text-parish-surface/80 max-w-3xl mx-auto">
                        "{content.parishPrayerText}"
                    </p>
                </motion.div>

                {/* Council Members */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                >
                    <h2 className="font-display text-3xl md:text-4xl text-parish-fg mb-10 text-center">Pastoral Council</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {content.councilMembers.map((member, i) => (
                            <div key={i} className="bg-parish-surface p-8 md:p-10 rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.06)] border border-parish-border/5">
                                <div className="font-display tracking-widest text-sm uppercase text-parish-accent mb-2">{member.role}</div>
                                <div className="font-display text-2xl text-parish-fg mb-4">{member.name}</div>
                                <p className="font-serif text-lg text-parish-muted leading-relaxed">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
