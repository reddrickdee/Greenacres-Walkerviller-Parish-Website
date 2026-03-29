import type { ParishContent, NewsletterArchive } from '../types';

/**
 * Loads the core parish content from the bundled JSON file.
 */
export async function loadParishContent(): Promise<ParishContent> {
    const res = await fetch('/data/parish_content.json');
    if (!res.ok) throw new Error(`Failed to load parish content: ${res.status}`);
    return res.json();
}

/**
 * Loads the newsletter archive from the bundled JSON file.
 */
export async function loadNewsletterArchive(): Promise<NewsletterArchive> {
    const res = await fetch('/data/newsletters.json');
    if (!res.ok) throw new Error(`Failed to load newsletters: ${res.status}`);
    return res.json();
}
