import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { ParishContent, NewsletterArchive } from '../types';
import { loadParishContent, loadNewsletterArchive } from '../lib/api';

interface ParishDataState {
    content: ParishContent | null;
    newsletters: NewsletterArchive | null;
    isLoading: boolean;
    error: string | null;
    reload: () => void;
}

const ParishDataContext = createContext<ParishDataState>({
    content: null,
    newsletters: null,
    isLoading: true,
    error: null,
    reload: () => { },
});

export function ParishDataProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<Omit<ParishDataState, 'reload'>>({
        content: null,
        newsletters: null,
        isLoading: true,
        error: null,
    });

    const load = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const [content, newsletters] = await Promise.all([
                loadParishContent(),
                loadNewsletterArchive(),
            ]);
            setState({ content, newsletters, isLoading: false, error: null });
        } catch (err) {
            setState({
                content: null,
                newsletters: null,
                isLoading: false,
                error: err instanceof Error ? err.message : 'Failed to load data',
            });
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    return (
        <ParishDataContext.Provider value={{ ...state, reload: load }}>
            {children}
        </ParishDataContext.Provider>
    );
}

export function useParishData() {
    return useContext(ParishDataContext);
}
