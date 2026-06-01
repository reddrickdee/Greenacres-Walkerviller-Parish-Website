import { Link } from 'react-router-dom';
import { Church, Clock3, Mail, Phone } from 'lucide-react';
import { FOOTER_QUICK_LINKS } from '../../lib/navigation';
import { useLiturgicalSeason } from '../../hooks/useLiturgicalSeason';

export function Footer() {
    const season = useLiturgicalSeason();

    return (
        /* ── Footer ────────────────────────────────────────────────────── */
        <footer className="mt-8 border-t border-parish-border/15 bg-parish-elevated/50 px-6 py-16 md:px-10 lg:px-16" role="contentinfo">
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-16">
                    {/* Column 1: Parish identity */}
                    <div>
                        <Link to="/" className="flex items-center gap-3 no-underline mb-4">
                            <img
                                src="/icons/parish-logo-72.webp"
                                alt=""
                                width={40}
                                height={40}
                                className="h-10 w-10 object-contain"
                            />
                            <div>
                                <div className="font-display text-lg font-bold text-parish-fg leading-tight">
                                    Greenacres<br />Walkerville
                                </div>
                                <div className="text-[0.8125rem] font-semibold uppercase tracking-[0.22em] text-parish-muted">
                                    Catholic Parish
                                </div>
                            </div>
                        </Link>
                        <p className="text-sm leading-relaxed text-parish-muted">
                            A welcoming community of faith in the footsteps of Jesus.
                        </p>
                        <div className="mt-4 space-y-2 text-sm text-parish-muted">
                            <div className="flex gap-2">
                                <Church className="mt-0.5 h-4 w-4 text-parish-accent shrink-0" aria-hidden="true" />
                                <span>St Monica&apos;s Church, 90 North East Road, Walkerville</span>
                            </div>
                            <div className="flex gap-2">
                                <Church className="mt-0.5 h-4 w-4 text-parish-accent shrink-0" aria-hidden="true" />
                                <span>St Martin&apos;s Church, Corner Muller &amp; Hampstead Roads, Greenacres</span>
                            </div>
                        </div>
                        <div className="mt-6 border-t border-parish-border/15 pt-4 text-[0.8125rem] text-parish-muted">
                            <div className="font-semibold text-parish-fg uppercase tracking-wider mb-2">Child Safeguarding Contacts</div>
                            <p className="mb-1">
                                Child Abuse Report Line: <a href="tel:131478" className="font-semibold text-parish-accent hover:underline">13 14 78</a>
                            </p>
                            <p>
                                Archdiocese Office: <a href="tel:0882108150" className="font-semibold text-parish-accent hover:underline">(08) 8210 8150</a>
                            </p>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="ornamental-kicker mb-4">Quick Links</h3>
                        <div className="space-y-2.5">
                            {FOOTER_QUICK_LINKS.map(link => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className="block text-sm text-parish-muted no-underline transition-colors duration-300 hover:text-parish-accent"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Column 3: Parish Office */}
                    <div>
                        <h3 className="ornamental-kicker mb-4">Parish Office</h3>
                        <div className="space-y-2.5 text-sm text-parish-muted">
                            <div className="flex gap-2">
                                <Clock3 className="mt-0.5 h-4 w-4 text-parish-accent shrink-0" aria-hidden="true" />
                                <div>
                                    <p>Monday – Thursday</p>
                                    <p>9:00am – 3:00pm</p>
                                    <p className="mt-1">Friday</p>
                                    <p>9:00am – 12:00pm</p>
                                </div>
                            </div>
                            <p className="text-[0.8125rem] text-parish-muted/60 mt-2">
                                We are closed on public holidays.
                            </p>
                        </div>
                        <Link to="/contact" className="pilgrimage-button mt-6">
                            Contact the Office
                        </Link>
                    </div>

                    {/* Column 4: Acknowledgement */}
                    <div>
                        <h3 className="ornamental-kicker mb-4">We acknowledge</h3>
                        <p className="text-sm leading-relaxed text-parish-muted">
                            We acknowledge the Kaurna people, the traditional custodians of the land on which we gather, and pay our respects to Elders past, present and emerging.
                        </p>
                        <div className="mt-6 flex items-center gap-3">
                            <a
                                href="mailto:admin@gwparish.org.au"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-parish-border/15 text-parish-muted no-underline transition-colors hover:text-parish-accent hover:border-parish-accent/30"
                                aria-label="Email"
                            >
                                <Mail className="h-4 w-4" aria-hidden="true" />
                            </a>
                            <a
                                href="tel:(08) 8261 6100"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-parish-border/15 text-parish-muted no-underline transition-colors hover:text-parish-accent hover:border-parish-accent/30"
                                aria-label="Phone"
                            >
                                <Phone className="h-4 w-4" aria-hidden="true" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-12 border-t border-parish-border/15 pt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between text-[0.8125rem] text-parish-muted/60">
                    <p>© {new Date().getFullYear()} Greenacres Walkerville Catholic Parish</p>
                    <div className="flex items-center gap-4">
                        <Link to="/contact" className="no-underline hover:text-parish-accent transition-colors">
                            Privacy
                        </Link>
                        <a href="/sitemap.xml" className="no-underline hover:text-parish-accent transition-colors">
                            Terms of Use
                        </a>
                    </div>
                </div>

                {/* Liturgical season indicator */}
                <div className="mt-4 flex items-center gap-2 text-[0.8125rem] text-parish-muted/40">
                    <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ backgroundColor: season.cssColor }}
                        aria-hidden="true"
                    />
                    <span>Season of {season.label}</span>
                </div>
            </div>
        </footer>
    );
}
