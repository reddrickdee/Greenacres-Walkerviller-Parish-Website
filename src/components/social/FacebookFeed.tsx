import { useEffect, useRef } from 'react';
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
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Parse the XFBML once the component mounts or updates
        if (window.FB && window.FB.XFBML) {
            if (containerRef.current) {
                window.FB.XFBML.parse(containerRef.current);
            }
        } else {
            // In case FB SDK is still loading, wait for it
            window.fbAsyncInit = () => {
                if (containerRef.current && window.FB && window.FB.XFBML) {
                    window.FB.XFBML.parse(containerRef.current);
                }
            };
        }
    }, [pageId, width, height, tabs]);

    return (
        <div className="relative w-full group">
            {/* Ambient Background Glow Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#1877F2]/20 to-[#42b72a]/20 rounded-[2rem] blur-[24px] opacity-0 group-hover:opacity-100 transition duration-1000"></div>

            {/* Bento Box Container */}
            <div className="relative w-full h-full overflow-hidden rounded-[2rem] border border-white/10 bg-[#141414]/80 backdrop-blur-2xl shadow-2xl flex flex-col">

                {/* Custom Native Header */}
                <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                        <motion.div
                            whileHover={{ rotate: 15, scale: 1.1 }}
                            className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center shadow-lg shadow-[#1877F2]/30"
                        >
                            <Facebook size={20} className="text-white fill-current" />
                        </motion.div>
                        <div>
                            <h3 className="text-white font-semibold text-lg tracking-tight">Greenacres Walkerville</h3>
                            <p className="text-gray-400 text-sm">Official Parish Page</p>
                        </div>
                    </div>

                    <a
                        href={`https://www.facebook.com/profile.php?id=${pageId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden sm:flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full font-medium transition-all duration-300 backdrop-blur-md no-underline text-sm border border-white/5"
                    >
                        Visit Page
                        <ExternalLink size={14} className="opacity-70" />
                    </a>
                </div>

                {/* Iframe Content Area */}
                <div
                    ref={containerRef}
                    className="w-full flex-1 bg-white p-0 relative"
                    style={{ minHeight: height }}
                >
                    <div
                        className="fb-page absolute top-0 left-0 w-full h-full flex justify-center pb-2"
                        data-href={`https://www.facebook.com/profile.php?id=${pageId}`}
                        data-tabs={tabs}
                        data-width={width === '100%' ? '' : width}
                        data-height={height}
                        data-small-header="true"
                        data-adapt-container-width="true"
                        data-hide-cover="true"
                        data-show-facepile="false"
                    >
                        <blockquote cite={`https://www.facebook.com/profile.php?id=${pageId}`} className="fb-xfbml-parse-ignore truncate">
                            <a href={`https://www.facebook.com/profile.php?id=${pageId}`}>Parish Updates</a>
                        </blockquote>
                    </div>
                </div>

            </div>
        </div>
    );
}
