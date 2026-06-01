import { useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { usePageSEO } from '../hooks/usePageSEO';
import { ActionBand, SectionIntro, HighlightPageTemplate } from '../components/layout/PageTemplates';
import { useGallery, type GalleryImg } from '../hooks/useGallery';
import { GalleryAlbum } from '../components/gallery/GalleryAlbum';
import { GalleryLightbox } from '../components/gallery/GalleryLightbox';

export function GalleryPage() {
    const { albums } = useGallery();
    const [active, setActive] = useState<{ images: GalleryImg[]; index: number } | null>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);

    usePageSEO({
        title: 'Gallery',
        description:
            "Photos of St Monica's and St Martin's churches, parish community gatherings, and the 2019 refurbishment at Greenacres Walkerville Catholic Parish.",
        path: '/gallery',
    });

    const open = (images: GalleryImg[], index: number, trigger: HTMLButtonElement) => {
        triggerRef.current = trigger;
        setActive({ images, index });
    };

    return (
        <HighlightPageTemplate
            eyebrow="Parish Life"
            title={<>Glimpses of our community, our churches, and our shared life in faith.</>}
            description="Browse photo albums from St Monica's and St Martin's churches, parish celebrations, and the 2019 refurbishment."
            imageSrc="/assets/source/our_parish.webp"
            imageAlt="Parish community gathering"
            actions={(
                <>
                    <Link to="/history" className="pilgrimage-button">Parish History</Link>
                    <Link to="/about" className="pilgrimage-button-secondary">About Us</Link>
                </>
            )}
        >
            <section className="page-section">
                <div className="page-section-inner">
                    <SectionIntro eyebrow="Albums" title={<>Browse our parish in pictures.</>} />
                    <div className="mt-10 space-y-16">
                        {albums.map(album => (
                            <GalleryAlbum key={album.title} album={album} onOpen={open} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="page-section mt-16 md:mt-24">
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
                                <Link to="/history" className="pilgrimage-button">View Parish History</Link>
                            </div>
                        </div>
                    </ActionBand>
                </div>
            </section>

            <AnimatePresence>
                {active && (
                    <GalleryLightbox
                        images={active.images}
                        index={active.index}
                        onClose={() => setActive(null)}
                        onNavigate={i => setActive({ images: active.images, index: i })}
                        triggerRef={triggerRef}
                    />
                )}
            </AnimatePresence>
        </HighlightPageTemplate>
    );
}
