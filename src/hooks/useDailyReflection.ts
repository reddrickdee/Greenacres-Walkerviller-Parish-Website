// src/hooks/useDailyReflection.ts
import { useState, useEffect } from 'react';
import { loadDailyReflectionFromCMS } from '../lib/api';
import type { DailyReflection } from '../types';

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
                const data = await loadDailyReflectionFromCMS(dateIso);
                if (isMounted) {
                    setReflection(data);
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
