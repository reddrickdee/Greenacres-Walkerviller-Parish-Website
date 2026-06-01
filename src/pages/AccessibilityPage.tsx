import { usePageSEO } from '../hooks/usePageSEO';

const FEATURES = [
    'A large 18px base font size with a readability-first type scale, and an in-page text-size control.',
    'Minimum 44×44px touch targets for buttons and links.',
    'Full keyboard navigation with visible focus indicators.',
    'Semantic HTML landmarks and ARIA labelling for screen readers.',
    'A "Sacred Night" dark mode and a reduced-motion mode that respects your system preference.',
    'Colour contrast targeting WCAG 2.2 Level AA.',
];

export function AccessibilityPage() {
    usePageSEO({
        title: 'Accessibility',
        description:
            'Our commitment to accessibility: Greenacres Walkerville Parish aims for WCAG 2.2 Level AA conformance. Learn about current features and how to report a barrier.',
        path: '/accessibility',
    });

    return (
        <div className="page-shell">
            <section className="page-section">
                <div className="page-section-inner max-w-3xl">
                    <span className="section-label mb-5">Legal</span>
                    <h1 className="text-[clamp(2.4rem,5vw,4rem)] tracking-tight text-parish-fg text-balance">Accessibility Statement</h1>
                    <p className="mt-4 text-[0.875rem] uppercase tracking-[0.16em] text-parish-muted">Last updated 1 June 2026</p>

                    <div className="mt-10 space-y-10">
                        <div>
                            <h2 className="font-display text-2xl text-parish-fg md:text-3xl">Our commitment</h2>
                            <p className="mt-4 text-[1.0625rem] leading-relaxed text-parish-muted">
                                Greenacres Walkerville Catholic Parish is committed to making this website usable for everyone, including people with disability. We aim to conform with the Web Content Accessibility Guidelines (WCAG) 2.2 at Level AA, and we design with the Disability Discrimination Act 1992 (Cth) in mind.
                            </p>
                        </div>

                        <div>
                            <h2 className="font-display text-2xl text-parish-fg md:text-3xl">Current features</h2>
                            <ul className="mt-4 space-y-3">
                                {FEATURES.map((f, i) => (
                                    <li key={i} className="flex gap-3 text-[1.0625rem] leading-relaxed text-parish-muted">
                                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-parish-accent" aria-hidden="true" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h2 className="font-display text-2xl text-parish-fg md:text-3xl">Known limitations</h2>
                            <p className="mt-4 text-[1.0625rem] leading-relaxed text-parish-muted">
                                Some content provided by third parties — such as embedded Google Maps and the external Good Giving donation portal — is outside our direct control and may not fully meet the same standards. We choose reputable providers and offer alternatives, such as phoning the Parish Office, wherever possible.
                            </p>
                        </div>

                        <div>
                            <h2 className="font-display text-2xl text-parish-fg md:text-3xl">Report a barrier</h2>
                            <p className="mt-4 text-[1.0625rem] leading-relaxed text-parish-muted">
                                If you encounter any accessibility barrier on this site, please tell us so we can put it right. Contact the Parish Office at{' '}
                                <a href="mailto:admin@gwparish.org.au" className="font-semibold text-parish-accent hover:underline">admin@gwparish.org.au</a>{' '}
                                or{' '}
                                <a href="tel:0882616200" className="font-semibold text-parish-accent hover:underline">(08) 8261 6200</a>. We welcome your feedback and will respond as soon as we can.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
