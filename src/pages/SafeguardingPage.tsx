import { motion } from 'framer-motion';
import { usePageSEO } from '../hooks/usePageSEO';
import { PageMeta } from '../components/PageMeta';

export function SafeguardingPage() {
    usePageSEO({
        title: 'Safeguarding & Child Protection',
        description: 'Greenacres Walkerville Parish is committed to the safety of children and vulnerable adults. Zero tolerance policy, reporting procedures, and privacy information.',
        path: '/safeguarding',
    });

    return (
        <div className="min-h-screen bg-parish-bg pt-28 pb-24 px-6 md:px-16 lg:px-24">
            <PageMeta title="Safeguarding & Child Protection" description="Greenacres Walkerville Parish safeguarding policies, child protection, and reporting procedures. Zero tolerance approach to all forms of abuse." path="/safeguarding" />
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="mb-16 md:mb-20"
                >
                    <div className="text-parish-accent font-display tracking-widest text-base uppercase mb-4">Our Commitment</div>
                    <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-parish-fg leading-tight">
                        Safeguarding & <em className="font-serif italic text-parish-accent">Child Protection</em>
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.1 }}
                    className="prose prose-lg prose-p:font-serif prose-p:text-parish-muted prose-headings:font-display prose-headings:text-parish-fg max-w-none"
                >
                    <div className="bg-parish-surface p-8 md:p-12 rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.06)] border border-parish-border/5 mb-12">
                        <h2 className="text-3xl mb-6">Zero Tolerance Policy</h2>
                        <p className="text-xl leading-relaxed">
                            The Catholic Archdiocese of Adelaide and the Greenacres Walkerville Parish have a <strong>zero-tolerance approach to all forms of abuse</strong>. We are deeply committed to the care, safety, and well-being of all children, young people, and adults at risk who interact with our parish community.
                        </p>
                        <p className="text-xl leading-relaxed mt-4">
                            We proactively work to create an environment where everyone feels safe, respected, and empowered. Our practices strictly adhere to the National Catholic Safeguarding Standards (NCSS) and the overarching policies of the Archdiocese.
                        </p>
                    </div>

                    <h3 className="text-2xl mt-12 mb-6">National Catholic Safeguarding Standards</h3>
                    <p>
                        Our parish fully endorses and actively implements the National Catholic Safeguarding Standards, which integrate recommendations from the Royal Commission into Institutional Responses to Child Sexual Abuse. These standards guide our leadership, culture, and human resource management (including rigorous screening and necessary Working with Children Checks for all clergy, staff, and volunteers).
                    </p>

                    <h3 className="text-2xl mt-12 mb-6">Reporting Concerns</h3>
                    <div className="bg-parish-fg text-parish-surface p-8 rounded-[2rem] mt-6">
                        <p className="text-parish-surface/80 mb-6">
                            If you have any concerns regarding the safety of a child or vulnerable adult within our parish, or if you need to report an incident, please contact the Archdiocesan Safeguarding Unit immediately.
                        </p>
                        <ul className="list-none pl-0 space-y-4 text-parish-surface">
                            <li className="flex items-center gap-4">
                                <span className="text-parish-accent font-display text-xl">✦</span>
                                <strong>Phone:</strong> (08) 8210 8150
                            </li>
                            <li className="flex items-center gap-4">
                                <span className="text-parish-accent font-display text-xl">✦</span>
                                <strong>Email:</strong> safeguarding@adelaide.catholic.org.au
                            </li>
                        </ul>
                        <p className="text-parish-surface/80 text-sm mt-8 italic">
                            If a child or vulnerable person is in immediate danger, always call Police on 000.
                        </p>
                    </div>

                    <h3 className="text-2xl mt-12 mb-6">Privacy Policy</h3>
                    <p>
                        Greenacres Walkerville Parish respects your privacy and is committed to protecting your personal information. Any information collected through this website, including contact forms or donation portals, is handled in accordance with the Privacy Act 1988 (Cth) and Archdiocesan privacy guidelines. We do not digitally publish the names or identifying photos of children without explicit, written parental consent.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
