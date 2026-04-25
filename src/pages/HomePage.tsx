import { usePageSEO } from '../hooks/usePageSEO';
import { useJsonLd } from '../hooks/useJsonLd';
import { HeroSection } from '../components/home/HeroSection';
import { TaskCards } from '../components/home/TaskCards';
import { ThisWeekend } from '../components/home/ThisWeekend';
import { LatestBulletin } from '../components/home/LatestBulletin';
import { ParishLifeStrip } from '../components/home/ParishLifeStrip';

export function HomePage() {
    usePageSEO({
        title: 'Home',
        description:
            'Greenacres Walkerville Catholic Parish — Mass times, parish bulletin, sacraments, and community life at St Monica\'s Walkerville and St Martin\'s Greenacres in Adelaide.',
        path: '/',
    });

    useJsonLd({
        '@context': 'https://schema.org',
        '@type': 'Church',
        name: 'Greenacres Walkerville Catholic Parish',
        url: 'https://www.gwparish.org.au',
        address: [
            {
                '@type': 'PostalAddress',
                streetAddress: '90 North East Road',
                addressLocality: 'Walkerville',
                addressRegion: 'SA',
                postalCode: '5081',
                addressCountry: 'AU',
            },
            {
                '@type': 'PostalAddress',
                streetAddress: 'Corner Muller & Hampstead Roads',
                addressLocality: 'Greenacres',
                addressRegion: 'SA',
                postalCode: '5086',
                addressCountry: 'AU',
            },
        ],
    }, 'home-church');

    return (
        <>
            <HeroSection />

            <div className="space-y-16 pb-24 md:space-y-24 md:pb-32 pt-16 md:pt-24">
                {/* "How can we help you today?" — 5 task cards */}
                <TaskCards />

                {/* Divider */}
                <div className="page-section">
                    <div className="page-section-inner section-divider" />
                </div>

                {/* This Weekend — Mass schedule + liturgical info */}
                <ThisWeekend />

                {/* Latest Bulletin — cover image + download */}
                <LatestBulletin />

                {/* Divider */}
                <div className="page-section">
                    <div className="page-section-inner section-divider" />
                </div>

                {/* Parish Life — quick-link strip */}
                <ParishLifeStrip />
            </div>
        </>
    );
}
