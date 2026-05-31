import { useEffect, useState } from 'react';
import {
    REFLECTION_SOURCES_URL,
    validateReflectionSources,
    type ReflectionSource,
    type ReflectionSourceValidationError,
} from '../lib/reflectionSources';

interface ReflectionSourcesState {
    sources: ReflectionSource[];
    errors: ReflectionSourceValidationError[];
    status: 'loading' | 'ready' | 'error';
}

export function useReflectionSources(): ReflectionSourcesState {
    const [state, setState] = useState<ReflectionSourcesState>({
        sources: [],
        errors: [],
        status: 'loading',
    });

    useEffect(() => {
        let isActive = true;

        fetch(REFLECTION_SOURCES_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Unable to load ${REFLECTION_SOURCES_URL}`);
                }
                return response.json();
            })
            .then(payload => {
                if (!isActive) return;
                const result = validateReflectionSources(payload);
                if (result.errors.length > 0) {
                    console.warn('Reflection source validation errors', result.errors);
                }
                setState({ ...result, status: 'ready' });
            })
            .catch(error => {
                if (!isActive) return;
                console.warn('Unable to load reflection sources', error);
                setState({ sources: [], errors: [], status: 'error' });
            });

        return () => {
            isActive = false;
        };
    }, []);

    return state;
}
