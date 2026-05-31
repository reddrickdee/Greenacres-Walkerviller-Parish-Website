export const REFLECTION_SOURCES_URL = '/data/reflection_sources.json';

export const REFLECTION_KINDS = [
    'readings',
    'daily-prayer',
    'gospel-reflection',
    'email-signup',
] as const;

export const REFLECTION_REGIONS = ['Australia', 'Global'] as const;
export const PERMISSION_STATUSES = ['approved', 'permission_required', 'link_only'] as const;

export type ReflectionKind = typeof REFLECTION_KINDS[number];
export type ReflectionRegion = typeof REFLECTION_REGIONS[number];
export type PermissionStatus = typeof PERMISSION_STATUSES[number];

export interface ReflectionSource {
    name: string;
    url?: string;
    kind: ReflectionKind;
    region: ReflectionRegion;
    description: string;
    permissionStatus: PermissionStatus;
    badge?: string;
    excerpt?: string;
}

export interface ReflectionSourceValidationError {
    index: number;
    field: string;
    message: string;
}

export interface ReflectionSourcesResult {
    sources: ReflectionSource[];
    errors: ReflectionSourceValidationError[];
}

type SourceRecord = Record<string, unknown>;

const AUSTRALIAN_REGION_ORDER: Record<ReflectionRegion, number> = {
    Australia: 0,
    Global: 1,
};

const kindLabels: Record<ReflectionKind, string> = {
    readings: 'Readings source',
    'daily-prayer': 'Daily prayer source',
    'gospel-reflection': 'Gospel reflection source',
    'email-signup': 'Email reflection source',
};

function isRecord(value: unknown): value is SourceRecord {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isInSet<T extends readonly string[]>(value: unknown, allowed: T): value is T[number] {
    return typeof value === 'string' && allowed.includes(value);
}

function isValidUrl(value: string): boolean {
    try {
        const url = new URL(value);
        return url.protocol === 'https:' || url.protocol === 'http:';
    } catch {
        return false;
    }
}

function readBoundedString(
    record: SourceRecord,
    field: string,
    index: number,
    min: number,
    max: number,
    errors: ReflectionSourceValidationError[],
    required = true,
): string | undefined {
    const value = record[field];

    if (value == null) {
        if (required) {
            errors.push({ index, field, message: 'Missing required field.' });
        }
        return undefined;
    }

    if (typeof value !== 'string') {
        errors.push({ index, field, message: 'Expected a string.' });
        return undefined;
    }

    const trimmed = value.trim();
    if (!required && trimmed.length === 0) {
        return undefined;
    }

    if (trimmed.length < min || trimmed.length > max) {
        errors.push({ index, field, message: `Expected ${min}-${max} characters.` });
        return undefined;
    }

    return trimmed;
}

function validateReflectionSource(value: unknown, index: number): {
    source: ReflectionSource | null;
    errors: ReflectionSourceValidationError[];
} {
    const errors: ReflectionSourceValidationError[] = [];

    if (!isRecord(value)) {
        return {
            source: null,
            errors: [{ index, field: 'source', message: 'Expected an object.' }],
        };
    }

    const name = readBoundedString(value, 'name', index, 1, 100, errors);
    const url = readBoundedString(value, 'url', index, 1, 2048, errors);
    const description = readBoundedString(value, 'description', index, 1, 500, errors);
    const badge = readBoundedString(value, 'badge', index, 1, 80, errors, false);
    const excerpt = readBoundedString(value, 'excerpt', index, 1, 2000, errors, false);

    if (url && !isValidUrl(url)) {
        errors.push({ index, field: 'url', message: 'Expected an absolute URL.' });
    }

    const kind = isInSet(value.kind, REFLECTION_KINDS) ? value.kind : undefined;
    if (!kind) {
        errors.push({ index, field: 'kind', message: 'Unexpected reflection source kind.' });
    }

    const region = isInSet(value.region, REFLECTION_REGIONS) ? value.region : undefined;
    if (!region) {
        errors.push({ index, field: 'region', message: 'Unexpected reflection source region.' });
    }

    const permissionStatus = isInSet(value.permissionStatus, PERMISSION_STATUSES)
        ? value.permissionStatus
        : undefined;
    if (!permissionStatus) {
        errors.push({
            index,
            field: 'permissionStatus',
            message: 'Unexpected permission status.',
        });
    }

    if (errors.length > 0 || !name || !url || !description || !kind || !region || !permissionStatus) {
        return { source: null, errors };
    }

    return {
        source: {
            name,
            url,
            kind,
            region,
            description,
            permissionStatus,
            ...(badge ? { badge } : {}),
            ...(excerpt ? { excerpt } : {}),
        },
        errors,
    };
}

export function validateReflectionSources(payload: unknown): ReflectionSourcesResult {
    const rawSources = Array.isArray(payload)
        ? payload
        : isRecord(payload) && Array.isArray(payload.sources)
            ? payload.sources
            : null;

    if (!rawSources) {
        return {
            sources: [],
            errors: [{ index: -1, field: 'sources', message: 'Expected a sources array.' }],
        };
    }

    const sources: ReflectionSource[] = [];
    const errors: ReflectionSourceValidationError[] = [];

    rawSources.forEach((sourceValue, index) => {
        const result = validateReflectionSource(sourceValue, index);
        errors.push(...result.errors);
        if (result.source) {
            sources.push(result.source);
        }
    });

    return {
        sources: orderReflectionSources(sources),
        errors,
    };
}

export function orderReflectionSources(sources: ReflectionSource[]): ReflectionSource[] {
    return [...sources].sort((a, b) => (
        AUSTRALIAN_REGION_ORDER[a.region] - AUSTRALIAN_REGION_ORDER[b.region]
    ));
}

export function shouldRenderExcerpt(source: ReflectionSource): boolean {
    return source.permissionStatus === 'approved' && Boolean(source.excerpt?.trim());
}

export function getSourceBadge(source: ReflectionSource): string {
    if (source.badge) {
        return source.badge;
    }

    if (source.region === 'Global') {
        return `Global ${kindLabels[source.kind].toLowerCase()}`;
    }

    return `Australian ${kindLabels[source.kind].toLowerCase()}`;
}
