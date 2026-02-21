import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Facebook, ExternalLink } from 'lucide-react';

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
    width = '100%',
    height = 500,
    tabs = 'timeline'
}: FacebookFeedProps) {


    useEffect(() => {
        let retries = 0;
        const maxRetries = 20; // Try for up to 10 seconds (500ms intervals)

        const initFacebook = () => {
            const container = document.getElementById('fb-container-feed');

            if (window.FB && window.FB.XFBML && container) {
                // Force XFBML parse on our specific container to avoid re-parsing the whole document
                window.FB.XFBML.parse(container);

                // Check if FB actually injected the iframe yet
                const hasIframe = container.querySelector('iframe');
                if (hasIframe) {
                    clearInterval(pollInterval);
                }
            }

            retries++;
            if (retries >= maxRetries) {
                clearInterval(pollInterval);
            }
        };

        const pollInterval = setInterval(initFacebook, 500);

        // Run once immediately just in case it's already loaded from a previous route
        initFacebook();

        return () => {
            clearInterval(pollInterval);
        };
    }, [pageId, width, height, tabs]);

    return (
        <div className="relative w-full group">
            {/* Ambient Background Glow Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#1877F2]/20 to-[#42b72a]/20 rounded-[2rem] blur-[24px] opacity-0 group-hover:opacity-100 transition duration-1000"></div>

            {/* Bento Box Container */}
            <div className="relative w-full h-full overflow-hidden rounded-[2rem] border border-parish-border/10 bg-parish-surface/80 backdrop-blur-2xl shadow-2xl flex flex-col">

                {/* Custom Native Header */}
                <div className="px-6 py-5 border-b border-parish-border/5 flex items-center justify-between bg-parish-elevated">
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
                    id="fb-container-feed"
                    className="w-full bg-parish-surface flex justify-center"
                    style={{ minHeight: height }}
                >
                    <div
                        className="fb-page"
                        data-href={`https://www.facebook.com/profile.php?id=${pageId}`}
                        data-tabs={tabs}
                        data-width="500"
                        data-height={height}
                        data-small-header="false"
                        data-adapt-container-width="true"
                        data-hide-cover="false"
                        data-show-facepile="true"
                    >
                        <blockquote cite={`https://www.facebook.com/profile.php?id=${pageId}`} className="fb-xfbml-parse-ignore">
                            <a href={`https://www.facebook.com/profile.php?id=${pageId}`}>Greenacres Walkerville Parish</a>
                        </blockquote>
                    </div>
                </div>

            </div>
        </div>
    );
}
