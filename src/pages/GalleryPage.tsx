import { motion } from 'framer-motion';
import { usePageSEO } from '../hooks/usePageSEO';
import { PageMeta } from '../components/PageMeta';

// Using the images copied from 'Church Gallery' plus the AI-generated one
const GALLERY_IMAGES = [
    { src: '/assets/gallery/Google Chrome 2026-02-20 07.39.40.png', alt: 'Stained glass window detail', colSpan: 'col-span-1 md:col-span-2', rowSpan: 'row-span-2' },
    { src: '/assets/gallery/Google Chrome 2026-02-20 07.44.20.png', alt: 'St Martin Church Exterior', colSpan: 'col-span-1', rowSpan: 'row-span-1' },
    { src: '/assets/images/parish_community_gathering.webp', alt: 'Parish community gathering outside the church', colSpan: 'col-span-1 md:col-span-2', rowSpan: 'row-span-1' },
    { src: '/assets/gallery/pomelli-image.png', alt: 'Greenacres Walkerville Parish Logo', colSpan: 'col-span-1', rowSpan: 'row-span-1' },
    { src: '/assets/gallery/Google Chrome 2026-02-20 07.41.59.png', alt: 'Church interior altar view', colSpan: 'col-span-1 md:col-span-2', rowSpan: 'row-span-1' },
    { src: '/assets/gallery/Google Chrome 2026-02-20 07.40.12.png', alt: 'St Monica Church altar', colSpan: 'col-span-1', rowSpan: 'row-span-2' },
    { src: '/assets/gallery/Google Chrome 2026-02-20 07.39.17.png', alt: 'Crucifix on wall', colSpan: 'col-span-1', rowSpan: 'row-span-1' },
    { src: '/assets/gallery/Google Chrome 2026-02-20 07.43.11.png', alt: 'Refurbished sanctuary view', colSpan: 'col-span-1 md:col-span-2', rowSpan: 'row-span-2' },
    { src: '/assets/gallery/pomelli-image (1).png', alt: 'Parish seal', colSpan: 'col-span-1', rowSpan: 'row-span-1' },
];

export function GalleryPage() {
    usePageSEO({
        title: 'Gallery',
        description: 'Photos of St Monica\'s and St Martin\'s churches, parish community gatherings, and the 2019 refurbishment at Greenacres Walkerville Catholic Parish.',
        path: '/gallery',
    });

    return (
        <div className="min-h-screen bg-parish-bg pt-28 pb-24 px-6 md:px-16 lg:px-24">
            <PageMeta title="Gallery" description="Photo gallery of Greenacres Walkerville Catholic Parish — our churches, community gatherings, and parish life." path="/gallery" />
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

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[250px] md:auto-rows-[300px]">
                    {GALLERY_IMAGES.map((img, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className={`${img.colSpan} ${img.rowSpan} rounded-3xl overflow-hidden group relative bg-parish-fg/5`}
                        >
                            <img
                                src={img.src}
                                alt={img.alt}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                                <p className="text-white font-serif text-lg tracking-wide">{img.alt}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
