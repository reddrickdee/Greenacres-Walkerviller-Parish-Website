import { Link } from 'react-router-dom';
import { HeartHandshake, Repeat, Landmark, Smartphone } from 'lucide-react';
import { usePageSEO } from '../hooks/usePageSEO';
import { useJsonLd } from '../hooks/useJsonLd';
import { SectionIntro, InfoCard, ScriptureBlock, HighlightPageTemplate } from '../components/layout/PageTemplates';

const GOOD_GIVING_URL = 'https://adelaide.goodgiving.com.au/qr/parish/greenacres';

const COLLECTIONS = [
    {
        title: 'First Collection',
        body: 'Supports our priests and the clergy of the Archdiocese — their living costs, care in retirement, and ongoing ministry.',
    },
    {
        title: 'Second Collection',
        body: "Sustains the day-to-day life of our parish — utilities, maintenance of St Monica's and St Martin's, liturgy, and pastoral programs.",
    },
];

const OTHER_WAYS = [
    { title: 'At Mass', body: 'Cash or envelopes during the first and second collections at any weekend or weekday Mass.' },
    { title: 'Direct debit', body: 'Set up planned giving through the Parish Office for a regular contribution that suits you.' },
    { title: 'Bequests', body: 'Remember the parish in your will. The Parish Office can provide the wording and answer any questions.' },
];

export function GivingPage() {
    usePageSEO({
        title: 'Give',
        description:
            'Support Greenacres Walkerville Parish through Good Giving — first and second collections, recurring giving, and other ways to contribute to our parish and clergy.',
        path: '/give',
        ogImage: '/assets/refurbishment/st_monica_5.webp',
    });

    useJsonLd(
        {
            '@context': 'https://schema.org',
            '@type': 'DonateAction',
            name: 'Give to Greenacres Walkerville Catholic Parish',
            recipient: {
                '@type': 'Church',
                name: 'Greenacres Walkerville Catholic Parish',
                url: 'https://www.gwparish.org.au',
            },
            target: GOOD_GIVING_URL,
        },
        'giving-donate',
    );

    return (
        <HighlightPageTemplate
            eyebrow="Stewardship"
            title={<>Your generosity keeps our parish thriving.</>}
            description="Every gift — large or small, one-off or regular — supports the worship, care, and community life of our two churches."
            imageSrc="/assets/refurbishment/st_monica_5.webp"
            imageAlt="Interior of St Monica's Church"
            actions={(
                <>
                    <a href={GOOD_GIVING_URL} target="_blank" rel="noopener noreferrer" className="pilgrimage-button">
                        Give Online via Good Giving
                    </a>
                    <Link to="/contact" className="pilgrimage-button-secondary">Planned Giving Enquiry</Link>
                </>
            )}
        >
            <section className="page-section">
                <div className="page-section-inner">
                    <ScriptureBlock>
                        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                            <div>
                                <div className="ornamental-kicker !text-white/80">Give Online</div>
                                <h2 className="mt-3 text-3xl text-white md:text-4xl">Good Giving — secure, simple, recurring</h2>
                                <p className="mt-3 max-w-xl text-[1.125rem] leading-relaxed text-white/85">
                                    The Archdiocese&apos;s Good Giving platform lets you contribute to both collections in one place, as a single gift or an automatic weekly or monthly donation.
                                </p>
                            </div>
                            <a
                                href={GOOD_GIVING_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 font-body text-[var(--type-button)] font-bold uppercase tracking-[0.22em] text-parish-accent no-underline"
                            >
                                <HeartHandshake className="h-5 w-5" aria-hidden="true" />
                                Give Now
                            </a>
                        </div>
                    </ScriptureBlock>
                </div>
            </section>

            <section className="page-section mt-16 md:mt-24">
                <div className="page-section-inner">
                    <SectionIntro
                        eyebrow="Where Your Gift Goes"
                        title={<>Two collections, two purposes</>}
                        description="At Mass you'll hear two collections announced. Here's what each one supports."
                    />
                    <div className="mt-10 grid gap-6 md:grid-cols-2">
                        {COLLECTIONS.map(c => (
                            <InfoCard key={c.title}>
                                <div className="ornamental-kicker">{c.title}</div>
                                <p className="mt-3 text-[1rem] leading-relaxed text-parish-muted">{c.body}</p>
                            </InfoCard>
                        ))}
                    </div>
                </div>
            </section>

            <section className="page-section mt-16 md:mt-24">
                <div className="page-section-inner">
                    <SectionIntro
                        eyebrow="Set and Forget"
                        title={<>Recurring giving</>}
                        description="A regular gift gives the parish a stable foundation to plan ahead — and saves you remembering cash each week."
                    />
                    <div className="mt-10 grid gap-6 md:grid-cols-3">
                        <InfoCard>
                            <Repeat className="h-6 w-6 text-parish-accent" aria-hidden="true" />
                            <h3 className="mt-3 font-display text-xl text-parish-fg">Good Giving</h3>
                            <p className="mt-2 text-[1rem] leading-relaxed text-parish-muted">
                                Schedule an automatic weekly or monthly gift online in a couple of minutes.
                            </p>
                        </InfoCard>
                        <InfoCard>
                            <Smartphone className="h-6 w-6 text-parish-accent" aria-hidden="true" />
                            <h3 className="mt-3 font-display text-xl text-parish-fg">Find a Mass app</h3>
                            <p className="mt-2 text-[1rem] leading-relaxed text-parish-muted">
                                The Archdiocese&apos;s Find a Mass app includes built-in giving to our parish on the go.
                            </p>
                        </InfoCard>
                        <InfoCard>
                            <Landmark className="h-6 w-6 text-parish-accent" aria-hidden="true" />
                            <h3 className="mt-3 font-display text-xl text-parish-fg">Planned giving</h3>
                            <p className="mt-2 text-[1rem] leading-relaxed text-parish-muted">
                                Prefer direct debit from your bank? The Parish Office can set up planned giving for you.
                            </p>
                        </InfoCard>
                    </div>
                </div>
            </section>

            <section className="page-section mt-16 md:mt-24">
                <div className="page-section-inner">
                    <SectionIntro eyebrow="Other Ways to Give" title={<>However suits you best</>} />
                    <div className="mt-10 grid gap-6 md:grid-cols-3">
                        {OTHER_WAYS.map(w => (
                            <InfoCard key={w.title}>
                                <div className="ornamental-kicker">{w.title}</div>
                                <p className="mt-3 text-[1rem] leading-relaxed text-parish-muted">{w.body}</p>
                            </InfoCard>
                        ))}
                    </div>
                </div>
            </section>
        </HighlightPageTemplate>
    );
}
