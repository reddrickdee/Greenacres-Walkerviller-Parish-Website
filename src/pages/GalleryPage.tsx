import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { usePageSEO } from '../hooks/usePageSEO';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ActionBand, SectionIntro, HighlightPageTemplate } from '../components/layout/PageTemplates';

interface GalleryImage {
    src: string;
    alt: string;
    category: string;
    colSpan: string;
    rowSpan: string;
}

const GALLERY_IMAGES: GalleryImage[] = [
    { src: '/assets/gallery/Google Chrome 2026-02-20 07.39.40.png', alt: 'Stained glass window detail', category: 'Church', colSpan: 'col-span-1 md:col-span-2', rowSpan: 'row-span-2' },
    { src: '/assets/gallery/Google Chrome 2026-02-20 07.44.20.png', alt: 'St Martin Church Exterior', category: 'Church', colSpan: 'col-span-1', rowSpan: 'row-span-1' },
    { src: '/assets/source/our_parish.webp', alt: 'Parish community gathering outside the church', category: 'Community', colSpan: 'col-span-1 md:col-span-2', rowSpan: 'row-span-1' },
    { src: '/assets/gallery/pomelli-image.png', alt: 'Greenacres Walkerville Parish Logo', category: 'Church', colSpan: 'col-span-1', rowSpan: 'row-span-1' },
    { src: '/assets/gallery/Google Chrome 2026-02-20 07.41.59.png', alt: 'Church interior altar view', category: 'Church', colSpan: 'col-span-1 md:col-span-2', rowSpan: 'row-span-1' },
    { src: '/assets/gallery/Google Chrome 2026-02-20 07.40.12.png', alt: 'St Monica Church altar', category: 'Church', colSpan: 'col-span-1', rowSpan: 'row-span-2' },
    { src: '/assets/gallery/Google Chrome 2026-02-20 07.39.17.png', alt: 'Crucifix on wall', category: 'Sacraments', colSpan: 'col-span-1', rowSpan: 'row-span-1' },
    { src: '/assets/gallery/Google Chrome 2026-02-20 07.43.11.png', alt: 'Refurbished sanctuary view', category: 'Church', colSpan: 'col-span-1 md:col-span-2', rowSpan: 'row-span-2' },
    { src: '/assets/gallery/pomelli-image (1).png', alt: 'Parish seal', category: 'Church', colSpan: 'col-span-1', rowSpan: 'row-span-1' },
];

const CATEGORIES = ['All', 'Church', 'Community', 'Sacraments', 'Events'];

export function GalleryPage() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    usePageSEO({
        title: 'Gallery',
        description: 'Photos of St Monica\'s and St Martin\'s churches, parish community gatherings, and the 2019 refurbishment at Greenacres Walkerville Catholic Parish.',
        path: '/gallery',
    });

    const filtered = selectedCategory === 'All'
        ? GALLERY_IMAGES
        : GALLERY_IMAGES.filter(img => img.category === selectedCategory);

    const openLightbox = useCallback((index: number) => {
        setLightboxIndex(index);
        document.body.style.overflow = 'hidden';
    }, []);

    const closeLightbox = useCallback(() => {
        setLightboxIndex(null);
        document.body.style.overflow = '';
    }, []);

    const goNext = useCallback(() => {
        if (lightboxIndex !== null) setLightboxIndex((lightboxIndex + 1) % filtered.length);
    }, [lightboxIndex, filtered.length]);

    const goPrev = useCallback(() => {
        if (lightboxIndex !== null) setLightboxIndex((lightboxIndex - 1 + filtered.length) % filtered.length);
    }, [lightboxIndex, filtered.length]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') goNext();
        if (e.key === 'ArrowLeft') goPrev();
    }, [closeLightbox, goNext, goPrev]);

    return (
        <HighlightPageTemplate
            eyebrow="Parish Life"
            title={<>Glimpses of our community, our churches, and our shared life in faith.</>}
            description="Browse images from St Monica's and St Martin's churches, parish celebrations, and the 2019 refurbishment. Select a category to narrow the view."
            imageSrc="/assets/source/our_parish.webp"
            imageAlt="Parish community gathering"
            actions={(
                <>
                    <Link to="/history" className="pilgrimage-button">
                        Parish History
                    </Link>
                    <Link to="/about" className="pilgrimage-button-secondary">
                        About Us
                    </Link>
                </>
            )}
        >
            <section className="page-section">
                <div className="page-section-inner">
                    <SectionIntro
                        eyebrow="Browse Gallery"
                        title={<>Filter by category or browse the whole collection.</>}
                    />

                    <div className="mt-6 flex flex-wrap items-center gap-2">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`rounded-full px-4 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.24em] transition-all duration-300 ${selectedCategory === cat
                                    ? 'bg-parish-fg text-parish-inverse shadow-halo'
                                    : 'border border-parish-border/10 bg-parish-surface/70 text-parish-muted hover:border-parish-brass/30 hover:text-parish-fg'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="mt-10 grid auto-rows-[250px] grid-cols-1 gap-4 md:auto-rows-[300px] md:grid-cols-3 lg:grid-cols-4">
                        {filtered.map((img, index) => (
                            <motion.div
                                key={img.src}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ duration: 0.7, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                                className={`${img.colSpan} ${img.rowSpan} image-panel group relative cursor-pointer !p-0 overflow-hidden`}
                                onClick={() => openLightbox(index)}
                                role="button"
                                tabIndex={0}
                                aria-label={`View ${img.alt}`}
                                onKeyDown={e => e.key === 'Enter' && openLightbox(index)}
                            >
                                <img
                                    src={img.src}
                                    alt={img.alt}
                                    loading="lazy"
                                    decoding="async"
                                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-parish-overlay-bg/60 via-transparent to-transparent p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                                    <div>
                                        <p className="text-lg tracking-wide text-parish-overlay-text">{img.alt}</p>
                                        <span className="text-xs uppercase tracking-[0.22em] text-parish-overlay-text/60">{img.category}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {filtered.length === 0 && (
                        <div className="py-16 text-center">
                            <p className="text-lg italic text-parish-muted">No images in this category yet.</p>
                        </div>
                    )}
                </div>
            </section>

            <section className="page-section mt-16 md:mt-20">
                <div className="page-section-inner">
                    <ActionBand>
                        <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
                            <div className="lg:col-span-8">
                                <span className="section-label mb-4">Our Story In Pictures</span>
                                <h2 className="text-[clamp(2.2rem,4vw,3.9rem)] text-parish-fg">
                                    Learn more about the history behind these images.
                                </h2>
                            </div>
                            <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
                                <Link to="/history" className="pilgrimage-button">
                                    View Parish History
                                </Link>
                            </div>
                        </div>
                    </ActionBand>
                </div>
            </section>

            {/* Lightbox Overlay */}
            <AnimatePresence>
                {lightboxIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95"
                        onClick={closeLightbox}
                        onKeyDown={handleKeyDown}
                        tabIndex={-1}
                        role="dialog"
                        aria-label="Image lightbox"
                        ref={(el) => el?.focus()}
                    >
                        <button
                            onClick={closeLightbox}
                            className="absolute right-6 top-6 z-10 rounded-full p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                            aria-label="Close lightbox"
                        >
                            <X size={28} />
                        </button>

                        <button
                            onClick={e => { e.stopPropagation(); goPrev(); }}
                            className="absolute left-4 z-10 rounded-full p-3 text-white/60 transition-colors hover:bg-white/10 hover:text-white md:left-8"
                            aria-label="Previous image"
                        >
                            <ChevronLeft size={32} />
                        </button>

                        <motion.img
                            key={filtered[lightboxIndex]?.src}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            src={filtered[lightboxIndex]?.src}
                            alt={filtered[lightboxIndex]?.alt}
                            className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain"
                            onClick={e => e.stopPropagation()}
                        />

                        <button
                            onClick={e => { e.stopPropagation(); goNext(); }}
                            className="absolute right-4 z-10 rounded-full p-3 text-white/60 transition-colors hover:bg-white/10 hover:text-white md:right-8"
                            aria-label="Next image"
                        >
                            <ChevronRight size={32} />
                        </button>

                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
                            <p className="text-lg text-white">{filtered[lightboxIndex]?.alt}</p>
                            <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/40">
                                {lightboxIndex + 1} / {filtered.length}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </HighlightPageTemplate>
    );
}
