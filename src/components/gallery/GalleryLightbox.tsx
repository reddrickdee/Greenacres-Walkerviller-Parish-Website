import { useEffect, useRef, useState, type RefObject } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useOverlay } from '../../hooks/useOverlay';
import type { GalleryImg } from '../../hooks/useGallery';

interface Props {
    images: GalleryImg[];
    index: number;
    onClose: () => void;
    onNavigate: (index: number) => void;
    triggerRef: RefObject<HTMLElement | null>;
}

export function GalleryLightbox({ images, index, onClose, onNavigate, triggerRef }: Props) {
    const [zoomed, setZoomed] = useState(false);
    const touchX = useRef<number | null>(null);
    const { overlayRef } = useOverlay({ isOpen: true, onClose, triggerRef });

    const go = (dir: number) => {
        setZoomed(false);
        onNavigate((index + dir + images.length) % images.length);
    };

    // Preload adjacent images.
    useEffect(() => {
        [1, -1].forEach(d => {
            const n = images[(index + d + images.length) % images.length];
            if (n) { const img = new Image(); img.src = n.src; }
        });
    }, [index, images]);

    // Arrow-key navigation (Escape/Tab handled by useOverlay).
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') go(1);
            if (e.key === 'ArrowLeft') go(-1);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index, images.length]);

    // Restore focus to the trigger when the lightbox unmounts.
    useEffect(() => () => { triggerRef.current?.focus(); }, [triggerRef]);

    const current = images[index];
    if (!current) return null;

    const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; };
    const onTouchEnd = (e: React.TouchEvent) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchX.current = null;
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-modal flex items-center justify-center bg-black/95"
            onClick={onClose}
            ref={overlayRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={`Image ${index + 1} of ${images.length}`}
        >
            <button onClick={onClose} className="absolute right-6 top-6 z-10 rounded-full p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white" aria-label="Close lightbox">
                <X size={28} aria-hidden="true" />
            </button>
            <button onClick={e => { e.stopPropagation(); go(-1); }} className="absolute left-4 z-10 rounded-full p-3 text-white/60 transition-colors hover:bg-white/10 hover:text-white md:left-8" aria-label="Previous image">
                <ChevronLeft size={32} aria-hidden="true" />
            </button>

            <motion.img
                key={current.src}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: zoomed ? 1.6 : 1 }}
                transition={{ duration: 0.3 }}
                src={current.src}
                alt={current.alt}
                onClick={e => { e.stopPropagation(); setZoomed(z => !z); }}
                onDoubleClick={e => e.stopPropagation()}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                className={`max-h-[85vh] max-w-[90vw] rounded-xl object-contain ${zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
            />

            <button onClick={e => { e.stopPropagation(); go(1); }} className="absolute right-4 z-10 rounded-full p-3 text-white/60 transition-colors hover:bg-white/10 hover:text-white md:right-8" aria-label="Next image">
                <ChevronRight size={32} aria-hidden="true" />
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 text-center">
                <p className="text-lg text-white">{current.caption || current.alt}</p>
                <p className="mt-1 text-[0.875rem] uppercase tracking-[0.22em] text-white/40">{index + 1} / {images.length}</p>
            </div>
        </motion.div>
    );
}
