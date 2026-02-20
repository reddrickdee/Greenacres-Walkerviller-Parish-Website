import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { ListMusic, Star, Share2 } from 'lucide-react';

interface FeaturedResourceData {
    id: string;
    title: string;
    description: string;
    image_url: string;
    link_url: string;
    is_active: boolean;
}

export function FeaturedResource() {
    const [resource, setResource] = useState<FeaturedResourceData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFeaturedResource() {
            try {
                const { data, error } = await supabase
                    .from('featured_resources')
                    .select('*')
                    .eq('is_active', true)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                if (error && error.code !== 'PGRST116') throw error;
                setResource(data);
            } catch (err) {
                console.error('Error fetching featured Hallow resource:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchFeaturedResource();
    }, []);

    // Calculate days left in Lent (Easter 2026 is April 5)
    const easterDate = new Date('2026-04-05');
    const today = new Date();
    const diffTime = easterDate.getTime() - today.getTime();
    const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    if (loading) {
        return (
            <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden animate-pulse">
                <div className="h-[300px] bg-[#2a2a2a]" />
                <div className="p-6 space-y-4">
                    <div className="h-6 bg-[#2a2a2a] rounded w-3/4" />
                    <div className="h-12 bg-[#2a2a2a] rounded-full" />
                    <div className="h-4 bg-[#2a2a2a] rounded w-full" />
                    <div className="h-4 bg-[#2a2a2a] rounded w-5/6" />
                </div>
            </div>
        );
    }

    if (!resource) return null;

    return (
        <div className="bg-[#1a1a1a] text-white rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
            {/* Title Header */}
            <div className="px-5 pt-5 pb-3">
                <h3 className="text-2xl font-bold tracking-tight leading-tight">
                    {resource.title}
                </h3>
            </div>

            {/* Hero Image */}
            <div className="relative w-full aspect-[4/3] overflow-hidden">
                <img
                    src={resource.image_url}
                    alt={resource.title}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Join Challenge CTA */}
            <div className="px-5 pt-4 pb-2">
                <a
                    href={resource.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-white text-black font-bold text-lg py-3.5 rounded-full hover:bg-gray-100 transition-colors no-underline"
                >
                    Join Challenge
                </a>
            </div>

            {/* Days Left */}
            {daysLeft > 0 && (
                <div className="text-center py-2">
                    <span className="text-sm text-gray-400">
                        <span className="text-green-400 mr-1">●</span>
                        {daysLeft} days left
                    </span>
                </div>
            )}

            {/* Action Buttons Row */}
            <div className="flex items-center justify-center gap-10 py-3 border-t border-white/10 mx-5">
                <a
                    href={resource.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 text-gray-400 hover:text-white transition-colors no-underline"
                >
                    <ListMusic size={22} />
                    <span className="text-xs font-medium">Play All</span>
                </a>
                <button className="flex flex-col items-center gap-1.5 text-gray-400 hover:text-white transition-colors">
                    <Star size={22} />
                    <span className="text-xs font-medium">Favorite</span>
                </button>
                <button
                    onClick={() => {
                        if (navigator.share) {
                            navigator.share({ title: resource.title, url: resource.link_url });
                        } else {
                            navigator.clipboard.writeText(resource.link_url);
                        }
                    }}
                    className="flex flex-col items-center gap-1.5 text-gray-400 hover:text-white transition-colors"
                >
                    <Share2 size={22} />
                    <span className="text-xs font-medium">Share</span>
                </button>
            </div>

            {/* Description */}
            <div className="px-5 pb-6 pt-2">
                <p className="text-[15px] text-gray-300 leading-relaxed">
                    {resource.description}
                </p>
            </div>
        </div>
    );
}
