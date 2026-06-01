import type { GalleryAlbumData, GalleryImg } from '../../hooks/useGallery';

interface Props {
    album: GalleryAlbumData;
    onOpen: (images: GalleryImg[], index: number, trigger: HTMLButtonElement) => void;
}

export function GalleryAlbum({ album, onOpen }: Props) {
    return (
        <div>
            <div className="image-panel relative overflow-hidden rounded-2xl">
                <img src={album.coverImage} alt="" className="h-48 w-full object-cover md:h-60" />
                <div className="absolute inset-0 z-10 flex flex-col justify-end bg-gradient-to-t from-parish-overlay-bg/70 to-transparent p-6">
                    <h3 className="font-display text-2xl text-white md:text-3xl">{album.title}</h3>
                    {album.description && <p className="mt-1 text-[1rem] text-white/80">{album.description}</p>}
                </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {album.images.map((img, i) => (
                    <button
                        key={img.src + i}
                        type="button"
                        onClick={e => onOpen(album.images, i, e.currentTarget)}
                        className="image-panel group relative aspect-square overflow-hidden border-0 bg-transparent !p-0"
                        aria-label={`View ${img.alt}`}
                    >
                        <img
                            src={img.src}
                            alt={img.alt}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
