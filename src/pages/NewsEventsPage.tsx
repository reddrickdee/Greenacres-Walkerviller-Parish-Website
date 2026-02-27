import { motion } from 'framer-motion';
import { useParishData } from '../context/ParishDataContext';
import { usePageSEO } from '../hooks/usePageSEO';

export function NewsEventsPage() {
    const { content, newsletters, isLoading } = useParishData();

    usePageSEO({
        title: 'News & Events',
        description: 'Stay connected with Greenacres Walkerville Parish. Parish bulletins, Connections newsletter archive, upcoming events, and community updates.',
        path: '/news-events',
    });

    if (isLoading || !content || !newsletters) {
        return <div className="h-screen flex items-center justify-center bg-parish-bg font-display tracking-widest text-lg">Loading…</div>;
    }

    return (
        <div className="min-h-screen bg-parish-bg pt-28 pb-24 px-6 md:px-16 lg:px-24">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="mb-16 md:mb-20 text-center"
                >
                    <div className="text-parish-accent font-display tracking-widest text-base uppercase mb-4">Parish Life</div>
                    <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-parish-fg leading-tight text-balance">
                        News & <em className="font-serif italic text-parish-accent">Events</em>
                    </h1>
                    <p className="font-serif text-xl text-parish-muted mt-6 max-w-2xl mx-auto">
                        Stay connected with your parish community.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                    {/* Main Content */}
                    <div className="lg:col-span-8">
                        <h2 className="font-display text-3xl mb-8 border-b-2 border-parish-accent/20 pb-4">Parish Bulletin</h2>
                        <div className="space-y-10">
                            {content.newsItems.map((item, index) => (
                                <motion.a
                                    key={item.title}
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-40px" }}
                                    transition={{ duration: 0.8, delay: index * 0.1 }}
                                    className="group block bg-parish-surface p-8 rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.06)] border border-parish-border/5 hover:border-parish-accent/30 transition-all no-underline"
                                >
                                    <h3 className="font-display text-2xl mb-3 text-parish-fg group-hover:text-parish-accent transition-colors">{item.title}</h3>
                                    <p className="font-serif text-xl text-parish-muted leading-relaxed">{item.summary}</p>
                                    <span className="mt-4 inline-block font-display tracking-widest text-sm uppercase text-parish-accent">
                                        Open Resource →
                                    </span>
                                </motion.a>
                            ))}
                        </div>

                        {/* Events */}
                        <h2 className="font-display text-3xl mt-20 mb-8 border-b-2 border-parish-accent/20 pb-4">Upcoming Events</h2>
                        <div className="space-y-6">
                            {content.eventItems.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: i * 0.1 }}
                                    className="flex flex-col sm:flex-row gap-5 items-start bg-parish-surface p-6 rounded-2xl border border-parish-border/5"
                                >
                                    <div className="bg-parish-accent text-parish-surface px-5 py-3 rounded-xl font-display text-sm tracking-widest uppercase text-center min-w-[120px] shrink-0">
                                        {item.dateLabel}
                                    </div>
                                    <div>
                                        <h3 className="font-display text-xl mb-2">{item.title}</h3>
                                        <p className="font-serif text-lg text-parish-muted">{item.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4">
                        <div className="bg-parish-surface p-8 md:p-10 rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.06)] border border-parish-border/5 sticky top-28">
                            <h3 className="font-display text-2xl mb-6">Bulletin Archive</h3>
                            <p className="font-serif text-base text-parish-muted mb-6">Browse past editions of the Connections newsletter.</p>
                            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                                {newsletters.items.map(item => (
                                    <div key={item.id} className="group border-b border-parish-border/5 pb-3">
                                        {item.isCurrent && (
                                            <span className="font-display tracking-widest text-xs uppercase text-parish-accent mb-1 block">✦ Current Issue</span>
                                        )}
                                        {item.nativeBulletin ? (
                                            <a
                                                href={`/news-events/bulletin/${item.id}`}
                                                className="font-serif text-base text-parish-fg group-hover:text-parish-accent transition-colors no-underline block py-1"
                                            >
                                                {item.title}
                                            </a>
                                        ) : (
                                            <a
                                                href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-serif text-base text-parish-fg group-hover:text-parish-accent transition-colors no-underline flex justify-between items-center py-1"
                                            >
                                                <span>{item.title}</span>
                                                <span className="text-parish-muted text-sm shrink-0 ml-2">PDF ↗</span>
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
