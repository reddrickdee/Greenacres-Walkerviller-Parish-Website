import { useEffect } from 'react';

/**
 * Injects a page-specific JSON-LD script into the document head.
 * Cleans up on unmount so schemas don't leak across route changes.
 *
 * @param schema - A plain object conforming to Schema.org types.
 * @param id     - A unique identifier to prevent duplicates (used as data-jsonld-id).
 */
export function useJsonLd(schema: Record<string, unknown>, id: string) {
    useEffect(() => {
        // Remove any existing script with the same id (guards against HMR re-renders)
        const existing = document.querySelector(`script[data-jsonld-id="${id}"]`);
        if (existing) existing.remove();

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-jsonld-id', id);
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);

        return () => {
            script.remove();
        };
    }, [schema, id]);
}
