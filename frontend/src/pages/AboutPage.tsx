import { motion } from 'framer-motion';
import { useParishData } from '../context/ParishDataContext';

export function AboutPage() {
    const { content, isLoading } = useParishData();

    if (isLoading || !content) {
        return <div className="h-screen flex items-center justify-center bg-parish-bg font-display tracking-widest text-sm uppercase">Loading…</div>;
    }

    return (
        <div className="min-h-screen bg-parish-bg pt-32 pb-24 px-8 md:px-24">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="mb-24 text-center"
                >
                    <div className="text-parish-accent font-display tracking-widest text-sm uppercase mb-4">About Our Parish</div>
                    <h1 className="font-display text-6xl md:text-8xl text-parish-fg leading-none mx-auto max-w-4xl text-balance">
                        Welcome and <em className="font-serif italic text-parish-accent">Mission</em>
                    </h1>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
                        className="md:col-span-8 prose prose-lg"
                    >
                        <p className="text-2xl leading-relaxed text-parish-muted font-light mb-8 font-serif">
                            <span className="float-left text-8xl leading-none pr-4 font-display text-parish-accent mt-2">{content.priestWelcome.charAt(0)}</span>
                            {content.priestWelcome.slice(1)}
                        </p>

                        <h2 className="font-display text-4xl text-parish-fg mt-16 mb-6">From the Pastoral Council</h2>
                        <p className="font-serif text-xl leading-relaxed text-parish-muted mb-6">
                            {content.pastoralChairMessage}
                        </p>

                        <h3 className="font-display text-3xl text-parish-fg mt-12 mb-6">Our Vision</h3>
                        <p className="font-serif text-xl leading-relaxed text-parish-muted mb-6">
                            {content.visionStatement}
                        </p>
                        <ul className="list-disc pl-6 space-y-4 font-serif text-lg text-parish-muted">
                            {content.missionPoints.map((point, i) => (
                                <li key={i}>{point.title}</li>
                            ))}
                        </ul>
                    </motion.div>

                    <div className="md:col-span-4 space-y-12">
                        <div className="bg-[#1C1917] p-10 rounded-[2rem] text-white">
                            <h3 className="font-display text-2xl mb-6 text-parish-accent">Parish Prayer</h3>
                            <p className="font-serif text-lg italic leading-relaxed text-white/80">
                                "{content.parishPrayerText}"
                            </p>
                        </div>

                        <div className="bg-white p-10 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-black/5">
                            <h3 className="font-display text-2xl mb-6">Council Members</h3>
                            <div className="space-y-6">
                                {content.councilMembers.map((member, i) => (
                                    <div key={i} className="border-b border-black/5 pb-4 last:border-0">
                                        <div className="font-display tracking-widest text-xs uppercase text-parish-accent mb-1">{member.role}</div>
                                        <div className="font-serif text-xl text-parish-fg">{member.name}</div>
                                        <p className="font-serif text-sm text-parish-muted mt-2 line-clamp-3">{member.bio}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
