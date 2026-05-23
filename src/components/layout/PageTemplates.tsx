import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';


type TemplateVariant = 'story' | 'utility' | 'highlight';

interface BaseTemplateProps {
    eyebrow: string;
    title: ReactNode;
    description: string;
    imageSrc: string;
    imageAlt: string;
    actions?: ReactNode;
    aside?: ReactNode;
    children: ReactNode;
}

interface SectionIntroProps {
    eyebrow: string;
    title: ReactNode;
    description?: string;
    align?: 'left' | 'center';
}

interface SurfaceProps {
    children: ReactNode;
    className?: string;
}

const reveal = {
    initial: { opacity: 0, y: 28, filter: 'blur(8px)' },
    whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] as const },
};

const noMotion = {
    initial: { opacity: 1, y: 0 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0 },
};

function templateAccent(variant: TemplateVariant) {
    if (variant === 'utility') {
        return 'bg-gradient-to-br from-parish-surface via-parish-surface to-parish-elevated/85';
    }

    if (variant === 'highlight') {
        return 'bg-gradient-to-br from-parish-elevated/90 via-parish-surface to-parish-surface';
    }

    return 'bg-gradient-to-br from-parish-surface via-parish-surface to-parish-elevated/90';
}

function TemplateFrame({
    variant,
    eyebrow,
    title,
    description,
    imageSrc,
    imageAlt,
    actions,
    aside,
    children,
}: BaseTemplateProps & { variant: TemplateVariant }) {
    const prefersReduced = useReducedMotion();
    const heroMotion = prefersReduced
        ? { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
        : { initial: { opacity: 0, y: 24, filter: 'blur(6px)' }, animate: { opacity: 1, y: 0, filter: 'blur(0px)' }, transition: { duration: 0.85, ease: [0.32, 0.72, 0, 1] } };

    return (
        <div className="page-shell">
            <section className="page-section">
                <div className="page-section-inner">
                    <motion.div
                        {...heroMotion}
                        className={`sanctuary-panel noise-bg ${templateAccent(variant)}`}
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-12">
                            <div className="order-2 lg:order-1 lg:col-span-7 px-7 py-8 md:px-10 md:py-12 lg:px-14 lg:py-16">
                                <span className="section-label mb-6">{eyebrow}</span>
                                <h1 className="max-w-4xl text-[clamp(2.9rem,6vw,5.9rem)] leading-[0.95] text-parish-fg text-balance">
                                    {title}
                                </h1>
                                <p className="mt-6 max-w-2xl text-lg md:text-xl text-parish-muted text-balance">
                                    {description}
                                </p>
                                {actions && (
                                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                                        {actions}
                                    </div>
                                )}
                                {aside && (
                                    <div className="mt-8 max-w-2xl">
                                        {aside}
                                    </div>
                                )}
                            </div>

                            <div className="order-1 lg:order-2 lg:col-span-5">
                                <div className="image-panel h-full min-h-[320px] rounded-none border-x-0 border-y-0 lg:min-h-[540px] lg:rounded-l-[3rem]">
                                    <img
                                        src={imageSrc}
                                        alt={imageAlt}
                                        loading="eager"
                                        decoding="async"
                                        width={800}
                                        height={540}
                                        className="h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-8">
                                        <div className="max-w-sm rounded-[1.5rem] border border-parish-overlay-border/15 bg-parish-overlay-bg/35 px-5 py-4 text-parish-overlay-text/92 backdrop-blur-md">
                                            <div className="ornamental-kicker !text-parish-overlay-muted">Parish Welcome</div>
                                            <p className="mt-2 text-sm leading-relaxed text-parish-overlay-text/85">
                                                A calm, practical first step into the life of Greenacres Walkerville Parish.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <div className="mt-16 md:mt-24">
                {children}
            </div>
        </div>
    );
}

export function StoryPageTemplate(props: BaseTemplateProps) {
    return <TemplateFrame variant="story" {...props} />;
}

export function UtilityPageTemplate(props: BaseTemplateProps) {
    return <TemplateFrame variant="utility" {...props} />;
}

export function HighlightPageTemplate(props: BaseTemplateProps) {
    return <TemplateFrame variant="highlight" {...props} />;
}

export function SectionIntro({
    eyebrow,
    title,
    description,
    align = 'left',
}: SectionIntroProps) {
    const prefersReduced = useReducedMotion();
    const motionProps = prefersReduced ? noMotion : reveal;

    return (
        <motion.div
            {...motionProps}
            className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}
        >
            <span className="section-label mb-5">{eyebrow}</span>
            <h2 className="text-[clamp(2rem,4vw,3.6rem)] text-parish-fg text-balance">{title}</h2>
            {description && (
                <p className="mt-4 text-lg md:text-xl text-parish-muted text-balance">
                    {description}
                </p>
            )}
        </motion.div>
    );
}

export function InfoCard({ children, className = '' }: SurfaceProps) {
    return <div className={`sanctuary-card ${className}`.trim()}>{children}</div>;
}

export function ScriptureBlock({ children, className = '' }: SurfaceProps) {
    return <div className={`scripture-panel ${className}`.trim()}>{children}</div>;
}

export function ActionBand({ children, className = '' }: SurfaceProps) {
    return <div className={`sanctuary-panel px-7 py-8 md:px-10 md:py-10 ${className}`.trim()}>{children}</div>;
}
