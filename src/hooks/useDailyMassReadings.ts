import { useState, useEffect, useCallback, useRef } from 'react';
import { getAdelaideDateKey, buildUniversalisUrl } from '../lib/adelaideDate';

/**
 * Shape of a reading section returned by Universalis JSONP.
 * Each reading (R1, Ps, R2, GA, G) has at least source + text;
 * R1 and G also carry a heading.
 */
export interface ReadingSection {
    source: string;
    text: string;
    heading?: string;
}

export interface UniversalisData {
    number: number;
    date: string;
    day: string;
    Mass_R1: ReadingSection;
    Mass_Ps: ReadingSection;
    Mass_R2?: ReadingSection;
    Mass_GA?: ReadingSection;
    Mass_G: ReadingSection;
    copyright: { text: string };
}

export type ReadingsStatus = 'idle' | 'loading' | 'success' | 'error' | 'timeout';

export interface DailyMassReadingsResult {
    data: UniversalisData | null;
    status: ReadingsStatus;
    dateKey: string;
    universalisUrl: string;
    retry: () => void;
}

const TIMEOUT_MS = 12_000;

let callbackCounter = 0;

/**
 * Fetches today's Mass readings from Universalis via JSONP,
 * using the Australia/Adelaide calendar.
 *
 * The date is always resolved in Adelaide timezone so the page
 * targets the parish's calendar day regardless of the visitor's timezone.
 */
export function useDailyMassReadings(): DailyMassReadingsResult {
    const dateKey = getAdelaideDateKey();
    const [data, setData] = useState<UniversalisData | null>(null);
    const [status, setStatus] = useState<ReadingsStatus>('idle');
    const [retryCount, setRetryCount] = useState(0);
    const scriptRef = useRef<HTMLScriptElement | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const settledRef = useRef(false);

    const universalisUrl = `https://universalis.com/Australia.Adelaide/mass.htm`;

    const cleanup = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        if (scriptRef.current) {
            scriptRef.current.remove();
            scriptRef.current = null;
        }
    }, []);

    const retry = useCallback(() => {
        setRetryCount(c => c + 1);
    }, []);

    useEffect(() => {
        settledRef.current = false;
        setStatus('loading');
        setData(null);

        const cbName = `__universalisCb_${++callbackCounter}`;
        const url = buildUniversalisUrl(dateKey, cbName);

        (window as any)[cbName] = (payload: UniversalisData) => {
            settledRef.current = true;
            setData(payload);
            setStatus('success');
            delete (window as any)[cbName];
            cleanup();
        };

        const script = document.createElement('script');
        script.id = `universalis-jsonp-${callbackCounter}`;
        script.src = url;
        script.async = true;

        script.onerror = () => {
            settledRef.current = true;
            setStatus('error');
            delete (window as any)[cbName];
            cleanup();
        };

        scriptRef.current = script;
        document.head.appendChild(script);

        timeoutRef.current = setTimeout(() => {
            if (!settledRef.current) {
                settledRef.current = true;
                setStatus('timeout');
                delete (window as any)[cbName];
                cleanup();
            }
        }, TIMEOUT_MS);

        return () => {
            delete (window as any)[cbName];
            cleanup();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateKey, retryCount]);

    return { data, status, dateKey, universalisUrl, retry };
}
