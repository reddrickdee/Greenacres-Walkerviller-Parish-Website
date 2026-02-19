import { motion } from 'framer-motion';
import { useParishData } from '../context/ParishDataContext';

export function NewsEventsPage() {
    const { content, newsletters, isLoading } = useParishData();

    if (isLoading || !content || !newsletters) {
        return <div className="h-screen flex items-center justify-center bg-parish-bg font-display tracking-widest text-sm uppercase">Loading…</div>;
    }

    return (
        <div className="min-h-screen bg-parish-bg pt-32 pb-24 px-8 md:px-24">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="mb-24 text-center"
                >
                    <div className="text-parish-accent font-display tracking-widest text-sm uppercase mb-4">Parish Life</div>
                    <h1 className="font-display text-6xl md:text-8xl text-parish-fg leading-none mx-auto text-balance">
                        News & <em className="font-serif italic text-parish-accent">Events</em>
                    </h1>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24">

                    {/* Main News Area */}
                    <div className="md:col-span-8">
                        <h2 className="font-display text-4xl mb-12 border-b border-black/10 pb-4">Parish Bulletin</h2>
                        <div className="space-y-12">
                            {content.newsItems.map((item, index) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.8, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                                    className="group cursor-pointer"
                                >
                                    <h3 className="font-display text-3xl mb-4 group-hover:text-parish-accent transition-colors">{item.title}</h3>
                                    <p className="font-serif text-xl text-parish-muted leading-relaxed">{item.summary}</p>
                                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 border-b border-black/10 pb-1 group-hover:border-parish-accent transition-colors no-underline">
                                        <span className="font-display tracking-widest text-xs uppercase text-parish-fg group-hover:text-parish-accent transition-colors">Open Resource</span>
                                    </a>
                                </motion.div>
                            ))}
                        </div>

                        {/* Events Calendar */}
                        <h2 className="font-display text-4xl mt-24 mb-12 border-b border-black/10 pb-4">Upcoming Events</h2>
                        <div className="space-y-6">
                            {content.eventItems.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: i * 0.1 }}
                                    className="flex gap-6 items-start border-b border-black/5 pb-6"
                                >
                                    <div className="bg-parish-accent text-white px-4 py-2 rounded-xl font-display text-xs tracking-widest uppercase text-center min-w-[100px]">
                                        {item.dateLabel}
                                    </div>
                                    <div>
                                        <h3 className="font-display text-xl mb-1">{item.title}</h3>
                                        <p className="font-serif text-parish-muted">{item.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="md:col-span-4 space-y-16">
                        {/* Newsletter Archive */}
                        <div className="bg-white p-10 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-black/5">
                            <h3 className="font-display text-2xl mb-8">Bulletin Archive</h3>
                            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                {newsletters.items.map(item => (
                                    <div key={item.id} className="group border-b border-black/5 pb-3 cursor-pointer flex justify-between items-center">
                                        <div>
                                            {item.isCurrent && <span className="font-display tracking-widest text-[10px] uppercase text-parish-accent mb-1 block">Current</span>}
                                            <span className="font-serif text-base text-parish-fg group-hover:text-parish-accent transition-colors">{item.title}</span>
                                        </div>
                                        {item.nativeBulletin ? (
                                            <a href={`/news-events/bulletin/${item.id}`} className="text-parish-accent text-xs font-display tracking-widest uppercase no-underline">Read</a>
                                        ) : (
                                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-parish-muted hover:text-parish-accent transition-colors">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                            </a>
                                        )}
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
