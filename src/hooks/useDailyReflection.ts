// src/hooks/useDailyReflection.ts
import { useState, useEffect } from 'react';
import { loadDailyReflectionFromCMS } from '../lib/api';
import { fetchUniversalisReadings } from '../lib/universalisApi';
import type { DailyReflection } from '../types';

/**
 * Two-tier fetching strategy:
 * 1. Fetch readings from Universalis (client-side, always fresh)
 * 2. Fetch reflection data from Supabase (admin-authored content)
 * 3. Merge: Universalis readings + Supabase reflection fields
 *
 * If Universalis is unreachable, falls back entirely to Supabase data.
 */
export function useDailyReflection(dateIso: string) {
    const [reflection, setReflection] = useState<DailyReflection | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchReflection() {
            setIsLoading(true);
            setError(null);

            try {
                // Fire both requests in parallel
                const [universalisData, cmsData] = await Promise.all([
                    fetchUniversalisReadings(dateIso).catch(() => null),
                    loadDailyReflectionFromCMS(dateIso).catch(() => null),
                ]);

                if (!isMounted) return;

                if (universalisData && cmsData) {
                    // Merge: Universalis readings + Supabase reflection/metadata
                    setReflection({
                        ...cmsData,
                        // Prefer fresh Universalis readings over potentially stale DB readings
                        firstReadingHtml: universalisData.firstReadingHtml ?? cmsData.firstReadingHtml,
                        psalmHtml: universalisData.psalmHtml ?? cmsData.psalmHtml,
                        secondReadingHtml: universalisData.secondReadingHtml ?? cmsData.secondReadingHtml,
                        gospelAcclamationHtml: universalisData.gospelAcclamationHtml ?? cmsData.gospelAcclamationHtml,
                        gospelHtml: universalisData.gospelHtml ?? cmsData.gospelHtml,
                        // Source references & headings
                        firstReadingSource: universalisData.firstReadingSource ?? cmsData.firstReadingSource,
                        firstReadingHeading: universalisData.firstReadingHeading ?? cmsData.firstReadingHeading,
                        psalmSource: universalisData.psalmSource ?? cmsData.psalmSource,
                        secondReadingSource: universalisData.secondReadingSource ?? cmsData.secondReadingSource,
                        secondReadingHeading: universalisData.secondReadingHeading ?? cmsData.secondReadingHeading,
                        gospelAcclamationSource: universalisData.gospelAcclamationSource ?? cmsData.gospelAcclamationSource,
                        gospelSource: universalisData.gospelSource ?? cmsData.gospelSource,
                        gospelHeading: universalisData.gospelHeading ?? cmsData.gospelHeading,
                        // Use CMS title/colour if available (admin may have overridden)
                        title: cmsData.title || universalisData.title,
                        liturgicalColor: cmsData.liturgicalColor || universalisData.liturgicalColor,
                    });
                } else if (universalisData) {
                    // Only Universalis available (no reflection written yet)
                    setReflection(universalisData);
                } else if (cmsData) {
                    // Only Supabase available (Universalis unreachable)
                    setReflection(cmsData);
                } else {
                    // Nothing available
                    setReflection(null);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err : new Error('Failed to fetch reflection'));
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        fetchReflection();

        return () => {
            isMounted = false;
        };
    }, [dateIso]);

    return { reflection, isLoading, error };
}
