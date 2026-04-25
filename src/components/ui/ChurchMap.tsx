interface ChurchMapProps {
    /** Display name of the church */
    name: string;
    /** Full address string */
    address: string;
    /** Google Maps 'q' parameter — usually the address or place name */
    query?: string;
    /** Height of the map embed */
    height?: string;
    /** Optional className override */
    className?: string;
}

/**
 * A simple Google Maps embed using an iframe (no API key required).
 * Uses the "embed/v1/place" endpoint which supports basic place search.
 */
export function ChurchMap({
    name,
    address,
    query,
    height = '280px',
    className = '',
}: ChurchMapProps) {
    const searchQuery = encodeURIComponent(query ?? `${name}, ${address}`);
    const src = `https://maps.google.com/maps?q=${searchQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

    return (
        <div className={`overflow-hidden rounded-2xl border border-parish-border/15 ${className}`.trim()}>
            <iframe
                title={`Map showing ${name}`}
                src={src}
                width="100%"
                height={height}
                style={{ border: 0, display: 'block' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                aria-label={`Google Maps view of ${name} at ${address}`}
            />
        </div>
    );
}
