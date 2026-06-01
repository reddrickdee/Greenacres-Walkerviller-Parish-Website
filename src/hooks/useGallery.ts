/**
 * useGallery — parish photo albums from Sanity, with static fallback albums
 * built from the existing church/community images and refurbishment photos.
 */
import { useSanityQuery } from './useSanityQuery';
import { useParishData } from '../context/ParishDataContext';

export interface GalleryImg {
    src: string;
    alt: string;
    caption?: string;
}

export interface GalleryAlbumData {
    title: string;
    description?: string;
    coverImage: string;
    images: GalleryImg[];
}

const QUERY = `*[_type == "galleryAlbum"] | order(date desc){
    title, description,
    "coverImage": coverImage.asset->url,
    "images": images[]{ "src": asset->url, alt, caption }
}`;

const CHURCH: GalleryImg[] = [
    { src: '/assets/gallery/Google Chrome 2026-02-20 07.39.40.png', alt: 'Stained glass window detail' },
    { src: '/assets/gallery/Google Chrome 2026-02-20 07.44.20.png', alt: "St Martin's Church exterior" },
    { src: '/assets/gallery/Google Chrome 2026-02-20 07.41.59.png', alt: 'Church interior altar view' },
    { src: '/assets/gallery/Google Chrome 2026-02-20 07.40.12.png', alt: "St Monica's Church altar" },
    { src: '/assets/gallery/Google Chrome 2026-02-20 07.43.11.png', alt: 'Refurbished sanctuary view' },
    { src: '/assets/gallery/Google Chrome 2026-02-20 07.39.17.png', alt: 'Crucifix on wall' },
];

const COMMUNITY: GalleryImg[] = [
    { src: '/assets/source/our_parish.webp', alt: 'Parish community gathering outside the church' },
];

export function useGallery() {
    const { content } = useParishData();
    const { data, isLive } = useSanityQuery<GalleryAlbumData[]>({ query: QUERY, fallbackData: [] });

    const live = Boolean(isLive && data && data.length);
    if (live) return { albums: data!, isLive: true };

    const refurb: GalleryImg[] = (content?.refurbishmentImages ?? []).map((p, i) => ({
        src: `/${p}`,
        alt: `St Monica's refurbishment photo ${i + 1}`,
    }));

    const albums: GalleryAlbumData[] = [
        { title: 'Our Churches', description: "St Monica's Walkerville and St Martin's Greenacres.", coverImage: CHURCH[0].src, images: CHURCH },
        { title: 'Community Life', description: 'Parish gatherings and celebrations.', coverImage: COMMUNITY[0].src, images: COMMUNITY },
    ];
    if (refurb.length) {
        albums.push({ title: 'Church Refurbishment', description: "The 2019 refurbishment of St Monica's Church.", coverImage: refurb[0].src, images: refurb });
    }

    return { albums, isLive: false };
}
