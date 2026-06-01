import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Share2, Printer, Check } from 'lucide-react';
import { useParishData } from '../context/ParishDataContext';
import { usePageSEO } from '../hooks/usePageSEO';
import { StoryPageTemplate } from '../components/layout/PageTemplates';
import { ContentLoading, ContentError } from '../components/ContentStates';

export function BulletinPage() {
    const { id } = useParams<{ id: string }>();
    const { newsletters, isLoading } = useParishData();
    const [copied, setCopied] = useState(false);
    const [activeId, setActiveId] = useState('reflection');

    usePageSEO({
        title: 'Parish Bulletin',
        description: 'Read the latest Connections newsletter from Greenacres Walkerville Catholic Parish.',
        path: `/news-events/bulletin/${id}`,
    });

    const item = newsletters?.items.find(i => i.id === id);
    const bulletin = item?.nativeBulletin;

    // Prev/next across bulletins that have a native digital edition.
    const native = newsletters?.items.filter(i => i.nativeBulletin) ?? [];
    const pos = native.findIndex(i => i.id === id);
    const prevItem = pos > 0 ? native[pos - 1] : null;
    const nextItem = pos >= 0 && pos < native.length - 1 ? native[pos + 1] : null;

    const navItems = bulletin
        ? [{ id: 'reflection', title: "Priest's Reflection" }, ...bulletin.sections.map((s, i) => ({ id: `section-${i}`, title: s.title }))]
        : [];

    // Scroll-spy: highlight the section currently in view.
    useEffect(() => {
        if (!navItems.length) return;
        const observer = new IntersectionObserver(
            entries => {
                const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (visible[0]) setActiveId(visible[0].target.id);
            },
            { rootMargin: '-30% 0px -60% 0px' },
        );
        navItems.forEach(s => {
            const el = document.getElementById(s.id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, navItems.length]);

    if (isLoading) return <ContentLoading />;
    if (!newsletters) return <ContentError />;

    if (!item || !bulletin) {
        return (
            <div className="page-shell">
                <section className="page-section">
                    <div className="page-section-inner text-center">
                        <h1 className="text-5xl text-parish-fg">Bulletin Not Found</h1>
                        <p className="mt-6 text-xl text-parish-muted">This bulletin does not have a native digital edition.</p>
                        <Link to="/news-events" className="pilgrimage-button-secondary mt-8 inline-flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                            Back to News & Events
                        </Link>
                    </div>
                </section>
            </div>
        );
    }

    const share = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try { await navigator.share({ title: item.title, url }); return; } catch { /* cancelled */ }
        }
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch { /* ignore */ }
    };

    return (
        <StoryPageTemplate
            eyebrow="Connections Newsletter"
            title={<>{item.title}</>}
            description={bulletin.date}
            imageSrc="/assets/source/news_connections.webp"
            imageAlt="Connections newsletter"
            actions={(
                <Link to="/news-events" className="pilgrimage-button-secondary inline-flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    All News & Events
                </Link>
            )}
        >
            <section className="page-section">
                <div className="page-section-inner grid gap-10 lg:grid-cols-12">
                    {/* Section nav with scroll-spy (desktop) */}
                    <aside className="hidden lg:col-span-3 lg:block print:hidden">
                        <nav className="sticky top-32" aria-label="Bulletin sections">
                            <div className="ornamental-kicker mb-4">On this page</div>
                            <ul className="space-y-2">
                                {navItems.map(s => (
                                    <li key={s.id}>
                                        <a
                                            href={`#${s.id}`}
                                            className={`block text-[0.9375rem] no-underline transition-colors ${activeId === s.id ? 'font-semibold text-parish-accent' : 'text-parish-muted hover:text-parish-accent'}`}
                                        >
                                            {s.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </aside>

                    <div className="max-w-3xl lg:col-span-9">
                        {/* Share / print actions */}
                        <div className="mb-8 flex flex-wrap gap-3 print:hidden">
                            <button type="button" onClick={share} className="pilgrimage-button-secondary inline-flex items-center gap-2 !px-5 !py-2.5">
                                {copied ? <><Check className="h-4 w-4" aria-hidden="true" /> Link copied</> : <><Share2 className="h-4 w-4" aria-hidden="true" /> Share</>}
                            </button>
                            <button type="button" onClick={() => window.print()} className="pilgrimage-button-ghost inline-flex items-center gap-2 !px-5 !py-2.5">
                                <Printer className="h-4 w-4" aria-hidden="true" /> Print
                            </button>
                        </div>

                        {/* Priest's reflection */}
                        <div id="reflection" className="scroll-mt-32">
                            <div className="ornamental-kicker">Priest&apos;s Reflection</div>
                            <div className="reflection-prose mt-6">
                                {bulletin.priestReflection.split('\n\n').map((para, i) => (
                                    <p key={i} className="mb-6 font-body text-lg leading-relaxed text-parish-muted md:text-xl">{para}</p>
                                ))}
                            </div>
                        </div>

                        {/* Sections */}
                        {bulletin.sections.map((section, i) => (
                            <div key={i} id={`section-${i}`} className="mt-10 scroll-mt-32 border-t border-parish-border/5 pt-10">
                                <div className="ornamental-kicker">{section.title}</div>
                                {section.imageAsset && (
                                    <div className="image-panel mt-5 overflow-hidden">
                                        <img src={`/${section.imageAsset}`} alt={section.imageAlt || section.title} className="w-full object-cover" />
                                    </div>
                                )}
                                <p className="mt-5 text-lg leading-relaxed text-parish-muted md:text-xl">{section.content}</p>
                            </div>
                        ))}

                        {/* Prev / next bulletin */}
                        <nav className="mt-14 flex items-center justify-between gap-4 border-t border-parish-border/10 pt-8 print:hidden" aria-label="Bulletin navigation">
                            {prevItem ? (
                                <Link to={`/news-events/bulletin/${prevItem.id}`} className="inline-flex max-w-[45%] items-center gap-2 text-parish-accent no-underline hover:underline">
                                    <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
                                    <span className="truncate">{prevItem.title}</span>
                                </Link>
                            ) : <span />}
                            {nextItem ? (
                                <Link to={`/news-events/bulletin/${nextItem.id}`} className="inline-flex max-w-[45%] items-center gap-2 text-right text-parish-accent no-underline hover:underline">
                                    <span className="truncate">{nextItem.title}</span>
                                    <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                                </Link>
                            ) : <span />}
                        </nav>
                    </div>
                </div>
            </section>
        </StoryPageTemplate>
    );
}
