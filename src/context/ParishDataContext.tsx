import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { ParishContent, NewsletterArchive } from '../types';
import { loadParishContent, loadNewsletterArchive } from '../lib/api';

interface ParishDataState {
    content: ParishContent | null;
    newsletters: NewsletterArchive | null;
    isLoading: boolean;
    error: string | null;
}

const ParishDataContext = createContext<ParishDataState>({
    content: null,
    newsletters: null,
    isLoading: true,
    error: null,
});

export function ParishDataProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<ParishDataState>({
        content: null,
        newsletters: null,
        isLoading: true,
        error: null,
    });

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const [content, newsletters] = await Promise.all([
                    loadParishContent(),
                    loadNewsletterArchive(),
                ]);
                if (!cancelled) {
                    setState({ content, newsletters, isLoading: false, error: null });
                }
            } catch (err) {
                if (!cancelled) {
                    setState({
                        content: null,
                        newsletters: null,
                        isLoading: false,
                        error: err instanceof Error ? err.message : 'Failed to load data',
                    });
                }
            }
        }

        load();
        return () => { cancelled = true; };
    }, []);

    return (
        <ParishDataContext.Provider value={state}>
            {children}
        </ParishDataContext.Provider>
    );
}

export function useParishData() {
    return useContext(ParishDataContext);
}
