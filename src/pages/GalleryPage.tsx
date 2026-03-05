import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePageSEO } from '../hooks/usePageSEO';
import { X, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

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
    { src: '/assets/images/parish_community_gathering.webp', alt: 'Parish community gathering outside the church', category: 'Community', colSpan: 'col-span-1 md:col-span-2', rowSpan: 'row-span-1' },
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

    // Keyboard navigation for lightbox
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') goNext();
        if (e.key === 'ArrowLeft') goPrev();
    }, [closeLightbox, goNext, goPrev]);

    return (
        <div className="min-h-screen bg-parish-bg pt-28 pb-24 px-6 md:px-16 lg:px-24">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="mb-16 md:mb-20 text-center"
                >
                    <div className="text-parish-accent font-display tracking-widest text-base uppercase mb-4">Parish Life</div>
                    <h1 className="font-display text-4xl md:text-5xl lg:text-7xl text-parish-fg leading-tight">
                        Our <em className="font-serif italic text-parish-accent">Gallery</em>
                    </h1>
                    <p className="font-serif text-xl text-parish-muted mt-6 max-w-2xl mx-auto">
                        Glimpses of our community, our beautiful churches, and our shared life in faith.
                    </p>
                </motion.div>

                {/* Category filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="flex items-center gap-2 mb-10 flex-wrap justify-center"
                >
                    <Filter size={16} className="text-parish-muted" />
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-full font-display tracking-wider text-xs uppercase transition-all ${selectedCategory === cat
                                ? 'bg-parish-accent text-white shadow-md'
                                : 'bg-parish-surface border border-parish-border/10 text-parish-muted hover:border-parish-accent/30'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </motion.div>

                {/* Masonry grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[250px] md:auto-rows-[300px]">
                    {filtered.map((img, index) => (
                        <motion.div
                            key={img.src}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.8, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className={`${img.colSpan} ${img.rowSpan} rounded-3xl overflow-hidden group relative bg-parish-fg/5 cursor-pointer`}
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
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                                <div>
                                    <p className="text-white font-serif text-lg tracking-wide">{img.alt}</p>
                                    <span className="text-white/60 font-display text-xs tracking-wider uppercase">{img.category}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-16">
                        <p className="font-serif text-lg text-parish-muted italic">No images in this category yet.</p>
                    </div>
                )}
            </div>

            {/* ── Lightbox Overlay ──────────────────────────────── */}
            <AnimatePresence>
                {lightboxIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
                        onClick={closeLightbox}
                        onKeyDown={handleKeyDown}
                        tabIndex={-1}
                        role="dialog"
                        aria-label="Image lightbox"
                        ref={(el) => el?.focus()}
                    >
                        {/* Close button */}
                        <button
                            onClick={closeLightbox}
                            className="absolute top-6 right-6 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors z-10"
                            aria-label="Close lightbox"
                        >
                            <X size={28} />
                        </button>

                        {/* Prev button */}
                        <button
                            onClick={e => { e.stopPropagation(); goPrev(); }}
                            className="absolute left-4 md:left-8 p-3 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors z-10"
                            aria-label="Previous image"
                        >
                            <ChevronLeft size={32} />
                        </button>

                        {/* Image */}
                        <motion.img
                            key={filtered[lightboxIndex]?.src}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            src={filtered[lightboxIndex]?.src}
                            alt={filtered[lightboxIndex]?.alt}
                            className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl"
                            onClick={e => e.stopPropagation()}
                        />

                        {/* Next button */}
                        <button
                            onClick={e => { e.stopPropagation(); goNext(); }}
                            className="absolute right-4 md:right-8 p-3 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors z-10"
                            aria-label="Next image"
                        >
                            <ChevronRight size={32} />
                        </button>

                        {/* Caption */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
                            <p className="text-white font-serif text-lg">{filtered[lightboxIndex]?.alt}</p>
                            <p className="text-white/40 font-display text-xs tracking-wider uppercase mt-1">
                                {lightboxIndex + 1} / {filtered.length}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
