/**
 * useSanityQuery — generic hook for fetching data from Sanity via GROQ.
 *
 * Features:
 * - Caches results in-memory to avoid redundant fetches
 * - Falls back gracefully when Sanity is not configured
 * - Supports optional static JSON fallback data
 * - Handles loading, error, and data states
 * - Respects the existing env-gated pattern used by Supabase
 */
import { useState, useEffect, useRef } from 'react';
import { sanityClient, isSanityConfigured } from '../lib/sanityClient';

// ── In-memory cache ───────────────────────────────────────────────────────────

const queryCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCacheKey(query: string, params?: Record<string, unknown>): string {
    return `${query}::${params ? JSON.stringify(params) : ''}`;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

interface UseSanityQueryOptions<T> {
    /** GROQ query string. */
    query: string;
    /** Optional GROQ query parameters. */
    params?: Record<string, unknown>;
    /** Static fallback data to use when Sanity is not configured. */
    fallbackData?: T;
    /** If true, skip the query entirely (useful for conditional fetching). */
    enabled?: boolean;
}

interface UseSanityQueryResult<T> {
    data: T | undefined;
    isLoading: boolean;
    error: Error | null;
    /** Whether the data came from Sanity (true) or fallback (false). */
    isLive: boolean;
    /** Re-fetch the query, bypassing cache. */
    refetch: () => void;
}

export function useSanityQuery<T = unknown>({
    query,
    params,
    fallbackData,
    enabled = true,
}: UseSanityQueryOptions<T>): UseSanityQueryResult<T> {
    const [data, setData] = useState<T | undefined>(() => {
        // Check cache on mount
        if (isSanityConfigured && enabled) {
            const key = getCacheKey(query, params);
            const cached = queryCache.get(key);
            if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
                return cached.data as T;
            }
        }
        return fallbackData;
    });
    const [isLoading, setIsLoading] = useState(isSanityConfigured && enabled);
    const [error, setError] = useState<Error | null>(null);
    const [isLive, setIsLive] = useState(false);
    const fetchIdRef = useRef(0);

    const fetchData = (bypassCache = false) => {
        if (!isSanityConfigured || !enabled) {
            setData(fallbackData);
            setIsLoading(false);
            setIsLive(false);
            return;
        }

        const key = getCacheKey(query, params);

        // Check cache unless bypassing
        if (!bypassCache) {
            const cached = queryCache.get(key);
            if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
                setData(cached.data as T);
                setIsLoading(false);
                setIsLive(true);
                return;
            }
        }

        const fetchId = ++fetchIdRef.current;
        setIsLoading(true);
        setError(null);

        sanityClient
            .fetch<T>(query, params ?? {})
            .then(result => {
                // Only apply if this is still the latest fetch
                if (fetchId !== fetchIdRef.current) return;

                queryCache.set(key, { data: result, timestamp: Date.now() });
                setData(result);
                setIsLive(true);
                setIsLoading(false);
            })
            .catch(err => {
                if (fetchId !== fetchIdRef.current) return;

                console.warn('[Sanity] Query failed, using fallback:', err.message);
                setError(err instanceof Error ? err : new Error(String(err)));
                setData(fallbackData);
                setIsLive(false);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, JSON.stringify(params), enabled]);

    return {
        data,
        isLoading,
        error,
        isLive,
        refetch: () => fetchData(true),
    };
}
