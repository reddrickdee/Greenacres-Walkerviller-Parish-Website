import type { ImgHTMLAttributes } from 'react';

interface ResponsiveImageProps
    extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'width' | 'height'> {
    /** Intrinsic width of the source image (used for aspect-ratio). */
    width: number;
    /** Intrinsic height of the source image (used for aspect-ratio). */
    height: number;
    /** Image source URL. */
    src: string;
    /** Alt text (required for accessibility). */
    alt: string;
    /**
     * The `sizes` attribute tells the browser which layout width to
     * use when selecting from a `srcset`. Example: "(max-width: 768px) 100vw, 50vw".
     */
    sizes?: string;
    /**
     * When true, the image is treated as above-the-fold:
     *   - `loading="eager"` instead of lazy
     *   - `fetchPriority="high"`
     */
    priority?: boolean;
    /** Additional CSS class names for the `<img>` element. */
    className?: string;
}

/**
 * Shared responsive image component.
 *
 * Enforces `width` + `height` for intrinsic aspect-ratio (prevents CLS),
 * defaults to `loading="lazy"` + `decoding="async"`, and provides a
 * `priority` shorthand for hero/LCP images.
 */
export function ResponsiveImage({
    width,
    height,
    src,
    alt,
    sizes,
    priority = false,
    className = '',
    style,
    ...rest
}: ResponsiveImageProps) {
    const priorityProps = priority ? { fetchpriority: 'high' } : {};

    return (
        <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            loading={priority ? 'eager' : 'lazy'}
            decoding={priority ? 'sync' : 'async'}
            className={className}
            style={{
                aspectRatio: `${width} / ${height}`,
                ...style,
            }}
            {...priorityProps}
            {...rest}
        />
    );
}
