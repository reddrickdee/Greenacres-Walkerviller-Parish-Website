import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Facebook, ExternalLink, RefreshCw } from 'lucide-react';

declare global {
    interface Window {
        fbAsyncInit: () => void;
        FB: {
            init: (params: any) => void;
            XFBML: {
                parse: (element?: HTMLElement) => void;
            };
        };
    }
}

interface FacebookFeedProps {
    pageId: string;
    width?: number | string;
    height?: number;
    tabs?: string;
}

export function FacebookFeed({
    pageId,
    height = 500,
    tabs = 'timeline'
}: FacebookFeedProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [computedWidth, setComputedWidth] = useState<number>(340);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasFailed, setHasFailed] = useState(false);

    // Measure the container to tell Facebook exactly how wide to be
    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new ResizeObserver((entries) => {
            const width = entries[0].contentRect.width;
            // Facebook plugin accepts width between 180 and 500
            const clamped = Math.max(180, Math.min(width, 500));
            setComputedWidth(clamped);
        });

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        // Wait until we have a computed width before trying to load
        if (computedWidth === 340 && containerRef.current) return;

        let retries = 0;
        const maxRetries = 20; // Try for up to 10 seconds (500ms intervals)

        const initFacebook = () => {
            if (!containerRef.current) return;
            const container = containerRef.current.querySelector('.fb-page') as HTMLElement;

            if (window.FB && window.FB.XFBML && container) {
                // Force XFBML parse on our specific container to avoid re-parsing the whole document
                window.FB.XFBML.parse(containerRef.current);

                // Check if FB actually injected the iframe yet
                const hasIframe = containerRef.current.querySelector('iframe');
                if (hasIframe) {
                    setIsLoaded(true);
                    clearInterval(pollInterval);
                    return;
                }
            }

            retries++;
            if (retries >= maxRetries) {
                clearInterval(pollInterval);
                setHasFailed(true);
            }
        };

        const pollInterval = setInterval(initFacebook, 500);

        // Run once immediately
        initFacebook();

        return () => {
            clearInterval(pollInterval);
        };
    }, [pageId, height, tabs, computedWidth]);

    return (
        <div className="relative w-full max-w-[540px] mx-auto group" ref={containerRef}>
            {/* Bento Box Container */}
            <div className="constraint-widget-box w-full constraint-widget-fade" style={{ minHeight: `${height + 80}px` }}>

                {/* Custom Native Header */}
                <div className="px-6 py-5 border-b border-parish-border/5 flex items-center justify-between bg-transparent">
                    <div className="flex items-center gap-4">
                        <motion.div
                            whileHover={{ rotate: 15, scale: 1.1 }}
                            className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center shadow-lg shadow-[#1877F2]/30"
                        >
                            <Facebook size={20} className="text-parish-fg fill-current" />
                        </motion.div>
                        <div>
                            <h3 className="text-parish-fg font-semibold text-lg tracking-tight">Greenacres Walkerville</h3>
                            <p className="text-parish-muted text-sm">Official Parish Page</p>
                        </div>
                    </div>

                    <a
                        href={`https://www.facebook.com/profile.php?id=${pageId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden sm:flex items-center gap-2 bg-parish-border/10 hover:bg-parish-border/20 text-parish-fg px-5 py-2.5 rounded-full font-medium transition-all duration-300 backdrop-blur-md no-underline text-sm border border-parish-border/5"
                    >
                        Visit Page
                        <ExternalLink size={14} className="opacity-70" />
                    </a>
                </div>

                {/* Iframe Content Area */}
                <div
                    className="w-full flex justify-center overflow-y-auto custom-scrollbar flex-1 relative z-10"
                    style={{ minHeight: `${height}px` }}
                >
                    {!isLoaded && !hasFailed && (
                        <div className="absolute inset-0 flex items-center justify-center text-parish-muted">
                            <RefreshCw className="w-6 h-6 animate-spin opacity-50" />
                        </div>
                    )}
                    {hasFailed && !isLoaded ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center h-full">
                            <p className="text-parish-muted font-serif italic mb-6">Unable to load the Facebook feed. Please disable any ad-blockers or tracking protection to view this content.</p>
                            <a
                                href={`https://www.facebook.com/profile.php?id=${pageId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#1877F2] text-white px-6 py-3 rounded-full font-medium shadow-md hover:bg-[#1877F2]/90 transition-colors inline-flex items-center gap-2"
                            >
                                <Facebook size={18} />
                                View on Facebook
                            </a>
                        </div>
                    ) : (
                        <div
                            className="fb-page w-full flex justify-center"
                            data-href={`https://www.facebook.com/profile.php?id=${pageId}`}
                            data-tabs={tabs}
                            data-width={computedWidth}
                            data-height={height}
                            data-small-header="true"
                            data-adapt-container-width="true"
                            data-hide-cover="false"
                            data-show-facepile="true"
                        >
                            <blockquote cite={`https://www.facebook.com/profile.php?id=${pageId}`} className="fb-xfbml-parse-ignore">
                                <a href={`https://www.facebook.com/profile.php?id=${pageId}`}>Greenacres Walkerville Parish</a>
                            </blockquote>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
