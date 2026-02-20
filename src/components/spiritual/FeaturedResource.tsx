import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { ExternalLink } from 'lucide-react';

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

    if (loading || !resource) {
        return null; // or a skeleton loader if preferred
    }

    return (
        <div className="bg-[#121118] text-white rounded-xl overflow-hidden shadow-md border border-[#2a2835] group relative flex flex-col sm:flex-row">
            {/* Dark gradient overlay for a more contemplative, premium feel */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1b1924] to-[#0f0e14] opacity-80 pointer-events-none"></div>

            {/* Image Section */}
            <div className="relative w-full sm:w-1/3 aspect-[4/3] sm:aspect-auto sm:min-h-[250px] overflow-hidden">
                <img
                    src={resource.image_url}
                    alt={resource.title}
                    className="object-cover w-full h-full transform transition-transform duration-700 group-hover:scale-105"
                />
                {/* Shadow gradient over image for text readability if layout stacks */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#121118] sm:bg-gradient-to-r sm:from-transparent sm:to-[#121118]"></div>
            </div>

            {/* Content Section */}
            <div className="relative z-10 flex flex-col justify-center p-6 sm:p-8 sm:w-2/3">
                <div className="flex items-center gap-2 text-[#a8a3c5] text-sm font-semibold tracking-wider uppercase mb-3">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
                    </svg>
                    <span>Featured on Hallow</span>
                </div>

                <h3 className="font-heading text-2xl sm:text-3xl font-bold mb-3 leading-tight tracking-tight">
                    {resource.title}
                </h3>

                <p className="text-gray-300 mb-6 leading-relaxed max-w-lg">
                    {resource.description}
                </p>

                <div className="mt-auto">
                    <a
                        href={resource.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white text-[#121118] px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg shadow-black/20"
                    >
                        <span>Join the Challenge</span>
                        <ExternalLink size={18} />
                    </a>
                </div>
            </div>
        </div>
    );
}
