import { Link } from 'react-router-dom';
import { Heart, ExternalLink, Shield, RefreshCw, CreditCard } from 'lucide-react';
import { usePageSEO } from '../hooks/usePageSEO';
import { ActionBand, InfoCard, ScriptureBlock, SectionIntro, HighlightPageTemplate } from '../components/layout/PageTemplates';

export function GivePage() {
    usePageSEO({
        title: 'Give — Support Our Parish',
        description: 'Support Greenacres Walkerville Catholic Parish through online giving, planned giving, or direct deposit. Your generosity sustains our community.',
        path: '/give',
    });

    return (
        <HighlightPageTemplate
            eyebrow="Parish Giving"
            title={<>Your generosity sustains our community.</>}
            description="Every contribution — whether a one-off gift or regular planned giving — supports the pastoral, educational, and outreach mission of Greenacres Walkerville Parish."
            imageSrc="/assets/source/our_parish_2.webp"
            imageAlt="Parish community"
            actions={(
                <>
                    <a
                        href="https://goodgiving.com.au/home/myparish"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pilgrimage-button inline-flex items-center gap-2"
                    >
                        <Heart className="h-4 w-4" />
                        Give Online via Good Giving
                    </a>
                    <Link to="/contact" className="pilgrimage-button-secondary">
                        Contact The Parish Office
                    </Link>
                </>
            )}
        >
            {/* How Your Gift Helps */}
            <section className="page-section">
                <div className="page-section-inner">
                    <SectionIntro
                        eyebrow="How You Can Give"
                        title={<>Every gift, no matter the size, makes a difference.</>}
                        description="There are several ways to support the parish — choose whichever is most convenient for you."
                    />

                    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        <InfoCard>
                            <CreditCard className="h-6 w-6 text-parish-brass" />
                            <div className="mt-4 ornamental-kicker">Online Giving</div>
                            <p className="mt-3 text-sm leading-relaxed text-parish-muted">
                                Use the Good Giving platform to make a one-time or recurring contribution securely online. Supports both first and second collections.
                            </p>
                            <a
                                href="https://goodgiving.com.au/home/myparish"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-parish-accent no-underline"
                            >
                                Good Giving <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                        </InfoCard>

                        <InfoCard>
                            <RefreshCw className="h-6 w-6 text-parish-brass" />
                            <div className="mt-4 ornamental-kicker">Planned Giving</div>
                            <p className="mt-3 text-sm leading-relaxed text-parish-muted">
                                Set up a regular direct debit or credit card payment to provide the parish with sustainable income. Contact the office for an Authorisation Form.
                            </p>
                            <Link
                                to="/contact"
                                className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-parish-accent no-underline"
                            >
                                Contact Office
                            </Link>
                        </InfoCard>

                        <InfoCard>
                            <Shield className="h-6 w-6 text-parish-brass" />
                            <div className="mt-4 ornamental-kicker">Direct Deposit</div>
                            <p className="mt-3 text-sm leading-relaxed text-parish-muted">
                                Transfer directly to the parish bank account. Include your name and envelope number (if applicable) as the reference. Contact the office for bank details.
                            </p>
                            <Link
                                to="/contact"
                                className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-parish-accent no-underline"
                            >
                                Get Details
                            </Link>
                        </InfoCard>
                    </div>
                </div>
            </section>

            {/* Scripture */}
            <section className="page-section mt-12 md:mt-16">
                <div className="page-section-inner grid gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                        <SectionIntro
                            eyebrow="Where Your Gift Goes"
                            title={<>Sustaining a living parish.</>}
                            description="Your contributions directly support the day-to-day running of our two churches, pastoral care for the sick and homebound, sacramental programs for children and families, and outreach to those in need through St Vincent de Paul."
                        />
                    </div>
                    <div className="lg:col-span-7">
                        <ScriptureBlock>
                            <div className="ornamental-kicker !text-parish-brass">Scripture</div>
                            <p className="mt-4 text-2xl leading-relaxed text-parish-inverse/88 md:text-[2rem]">
                                &ldquo;Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.&rdquo;
                            </p>
                            <p className="mt-4 text-sm uppercase tracking-[0.22em] text-parish-brass">2 Corinthians 9:7</p>
                        </ScriptureBlock>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="page-section mt-16 md:mt-20">
                <div className="page-section-inner">
                    <ActionBand>
                        <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
                            <div className="lg:col-span-8">
                                <span className="section-label mb-4">Questions About Giving</span>
                                <h2 className="text-[clamp(2.2rem,4vw,3.9rem)] text-parish-fg">
                                    The parish office is here to help with any questions about giving or planned contributions.
                                </h2>
                            </div>
                            <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
                                <Link to="/contact" className="pilgrimage-button">
                                    Contact The Parish
                                </Link>
                            </div>
                        </div>
                    </ActionBand>
                </div>
            </section>
        </HighlightPageTemplate>
    );
}
