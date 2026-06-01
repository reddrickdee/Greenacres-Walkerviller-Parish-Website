import { usePageSEO } from '../hooks/usePageSEO';

const SECTIONS = [
    {
        heading: 'Who we are',
        body: [
            'This Privacy Policy explains how Greenacres Walkerville Catholic Parish ("the parish", "we", "us") handles personal information collected through this website, in line with the Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).',
        ],
    },
    {
        heading: 'What we collect',
        body: [
            'We only collect personal information you choose to provide — typically your name, email address, and phone number when you submit a contact or volunteer form, or post to the Community Hub. We do not require you to identify yourself to browse informational pages.',
        ],
    },
    {
        heading: 'How we use and store it',
        body: [
            'Information you submit is used solely to respond to your enquiry, coordinate parish ministries and events, or publish content you have asked us to share. Form submissions and Community Hub posts are stored using Supabase, a third-party database and authentication service. We do not sell or rent your personal information.',
        ],
    },
    {
        heading: 'Cookies and analytics',
        body: [
            'This site uses Vercel Speed Insights to measure page performance. This collects anonymised, aggregated technical data (such as load times and device type) and is not used to identify individuals. Your theme and accessibility preferences are stored locally in your browser and are never transmitted to us.',
        ],
    },
    {
        heading: 'Third-party services',
        body: [
            'Some features rely on trusted third parties, each with their own privacy practices: Supabase (data storage), Google Fonts (typography), the Good Giving platform (online donations), and embedded Google Maps. Following an external link or donating online is subject to that provider’s privacy policy.',
        ],
    },
    {
        heading: 'Your rights',
        body: [
            'Under the Australian Privacy Principles you may request access to the personal information we hold about you, ask us to correct it, or request its deletion. We will respond to reasonable requests within a reasonable timeframe.',
        ],
    },
    {
        heading: 'Contact us',
        body: [
            'For any privacy enquiry, or to access or correct your information, contact the Parish Office at admin@gwparish.org.au or (08) 8261 6200.',
        ],
    },
];

export function PrivacyPage() {
    usePageSEO({
        title: 'Privacy Policy',
        description:
            'How Greenacres Walkerville Catholic Parish collects, uses, and protects personal information in line with the Australian Privacy Principles.',
        path: '/privacy',
    });

    return (
        <div className="page-shell">
            <section className="page-section">
                <div className="page-section-inner max-w-3xl">
                    <span className="section-label mb-5">Legal</span>
                    <h1 className="text-[clamp(2.4rem,5vw,4rem)] tracking-tight text-parish-fg text-balance">Privacy Policy</h1>
                    <p className="mt-4 text-[0.875rem] uppercase tracking-[0.16em] text-parish-muted">Last updated 1 June 2026</p>

                    <div className="mt-10 space-y-10">
                        {SECTIONS.map(s => (
                            <div key={s.heading}>
                                <h2 className="font-display text-2xl text-parish-fg md:text-3xl">{s.heading}</h2>
                                {s.body.map((p, i) => (
                                    <p key={i} className="mt-4 text-[1.0625rem] leading-relaxed text-parish-muted">{p}</p>
                                ))}
                            </div>
                        ))}
                    </div>

                    <p className="mt-12 text-[0.875rem] leading-relaxed text-parish-muted/70">
                        This policy is provided in good faith as general information. It should be reviewed by the parish or Archdiocese before being relied upon as a legal document.
                    </p>
                </div>
            </section>
        </div>
    );
}
