import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useParishData } from '../context/ParishDataContext';

export function BulletinPage() {
    const { id } = useParams<{ id: string }>();
    const { newsletters, isLoading } = useParishData();

    if (isLoading || !newsletters) {
        return <div className="h-screen flex items-center justify-center bg-parish-bg font-display tracking-widest text-sm uppercase">Loading…</div>;
    }

    const item = newsletters.items.find(i => i.id === id);

    if (!item || !item.nativeBulletin) {
        return (
            <div className="min-h-screen bg-parish-bg pt-32 pb-24 px-8 md:px-24 text-center">
                <h1 className="font-display text-5xl text-parish-fg mb-8">Bulletin Not Found</h1>
                <p className="font-serif text-xl text-parish-muted mb-12">This bulletin does not have a native digital edition.</p>
                <Link to="/news-events" className="font-display tracking-widest text-sm uppercase text-parish-accent hover:underline">
                    ← Back to News & Events
                </Link>
            </div>
        );
    }

    const bulletin = item.nativeBulletin;

    return (
        <div className="min-h-screen bg-parish-bg pt-32 pb-24 px-8 md:px-24">
            <div className="max-w-3xl mx-auto">
                <Link to="/news-events" className="inline-block mb-12 font-display tracking-widest text-xs uppercase text-parish-muted hover:text-parish-accent transition-colors no-underline">
                    ← Back to News & Events
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                    <div className="text-parish-accent font-display tracking-widest text-sm uppercase mb-4">Connections Newsletter</div>
                    <h1 className="font-display text-5xl md:text-7xl text-parish-fg leading-none mb-4">{item.title}</h1>
                    <p className="font-display tracking-widest text-xs uppercase text-parish-muted mb-16">{bulletin.date}</p>
                </motion.div>

                {/* Priest's Reflection */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
                    className="mb-20"
                >
                    <h2 className="font-display text-3xl text-parish-fg mb-6">Priest's Reflection</h2>
                    {bulletin.priestReflection.split('\n\n').map((para, i) => (
                        <p key={i} className="font-serif text-xl leading-relaxed text-parish-muted mb-6">
                            {i === 0 ? (
                                <>
                                    <span className="float-left text-7xl leading-none pr-3 font-display text-parish-accent mt-1">{para.charAt(0)}</span>
                                    {para.slice(1)}
                                </>
                            ) : (
                                para
                            )}
                        </p>
                    ))}
                </motion.div>

                {/* Bulletin Sections */}
                {bulletin.sections.map((section, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className="mb-16 border-t border-black/5 pt-12"
                    >
                        <h3 className="font-display text-2xl text-parish-fg mb-4">{section.title}</h3>
                        <p className="font-serif text-xl text-parish-muted leading-relaxed">{section.content}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
