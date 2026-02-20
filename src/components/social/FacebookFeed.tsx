import { useEffect, useRef } from 'react';

// Extend the Window interface to include fbAsyncInit and FB
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
        <div ref={containerRef} className="w-full h-full overflow-hidden rounded-xl border border-parish-warm-border bg-white/5 shadow-sm p-4">
            <div
                className="fb-page"
                data-href={`https://www.facebook.com/profile.php?id=${pageId}`}
                data-tabs={tabs}
                data-width={width === '100%' ? '' : width}
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
    );
}
