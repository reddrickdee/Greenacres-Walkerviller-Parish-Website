// src/hooks/useAvailableReflectionDates.ts
import { useState, useEffect } from 'react';
import { loadAvailableReflectionDates } from '../lib/api';

export function useAvailableReflectionDates() {
    const [availableDates, setAvailableDates] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function fetchDates() {
            setIsLoading(true);
            try {
                const dates = await loadAvailableReflectionDates();
                if (isMounted) {
                    setAvailableDates(new Set(dates));
                }
            } catch {
                // Silently fail — calendar will just have no highlights
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        fetchDates();

        return () => {
            isMounted = false;
        };
    }, []);

    return { availableDates, isLoading };
}
