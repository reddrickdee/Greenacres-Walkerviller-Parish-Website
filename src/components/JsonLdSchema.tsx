import { useEffect } from 'react';

const SCHEMA = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'Organization',
            '@id': 'https://www.gwparish.org.au/#organization',
            name: 'Greenacres Walkerville Catholic Parish',
            alternateName: 'GW Parish',
            url: 'https://www.gwparish.org.au',
            logo: 'https://www.gwparish.org.au/parish-logo.png',
            description:
                'A welcoming and inclusive Catholic parish community in Adelaide, South Australia, with churches in Greenacres and Walkerville.',
            telephone: '(08) 8261 6200',
            email: 'admin@gwparish.org.au',
            address: {
                '@type': 'PostalAddress',
                streetAddress: '56-80 Princes Road',
                addressLocality: 'Greenacres',
                addressRegion: 'SA',
                postalCode: '5086',
                addressCountry: 'AU',
            },
            sameAs: [
                'https://www.facebook.com/profile.php?id=61584973342464',
            ],
        },
        {
            '@type': 'Church',
            '@id': 'https://www.gwparish.org.au/#st-martins',
            name: "St Martin's Catholic Church",
            parentOrganization: { '@id': 'https://www.gwparish.org.au/#organization' },
            address: {
                '@type': 'PostalAddress',
                streetAddress: 'Corner Muller and Hampstead Roads',
                addressLocality: 'Greenacres',
                addressRegion: 'SA',
                postalCode: '5086',
                addressCountry: 'AU',
            },
            openingHoursSpecification: [
                {
                    '@type': 'OpeningHoursSpecification',
                    dayOfWeek: 'Sunday',
                    opens: '09:30',
                    closes: '10:30',
                    description: 'Sunday Mass',
                },
                {
                    '@type': 'OpeningHoursSpecification',
                    dayOfWeek: 'Tuesday',
                    opens: '09:00',
                    closes: '09:30',
                    description: 'Weekday Mass',
                },
                {
                    '@type': 'OpeningHoursSpecification',
                    dayOfWeek: 'Thursday',
                    opens: '09:00',
                    closes: '09:30',
                    description: 'Weekday Mass',
                },
            ],
        },
        {
            '@type': 'Church',
            '@id': 'https://www.gwparish.org.au/#st-monicas',
            name: "St Monica's Catholic Church",
            parentOrganization: { '@id': 'https://www.gwparish.org.au/#organization' },
            address: {
                '@type': 'PostalAddress',
                streetAddress: '90 North East Road',
                addressLocality: 'Walkerville',
                addressRegion: 'SA',
                postalCode: '5081',
                addressCountry: 'AU',
            },
            openingHoursSpecification: [
                {
                    '@type': 'OpeningHoursSpecification',
                    dayOfWeek: 'Saturday',
                    opens: '18:00',
                    closes: '19:00',
                    description: 'Weekend Vigil Mass',
                },
                {
                    '@type': 'OpeningHoursSpecification',
                    dayOfWeek: 'Sunday',
                    opens: '11:00',
                    closes: '12:00',
                    description: 'Ordinariate Mass',
                },
                {
                    '@type': 'OpeningHoursSpecification',
                    dayOfWeek: 'Wednesday',
                    opens: '09:00',
                    closes: '09:30',
                    description: 'Weekday Mass',
                },
            ],
        },
        {
            '@type': 'WebSite',
            '@id': 'https://www.gwparish.org.au/#website',
            url: 'https://www.gwparish.org.au',
            name: 'Greenacres Walkerville Catholic Parish',
            publisher: { '@id': 'https://www.gwparish.org.au/#organization' },
        },
        {
            '@type': 'BreadcrumbList',
            '@id': 'https://www.gwparish.org.au/#breadcrumb',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.gwparish.org.au/' },
                { '@type': 'ListItem', position: 2, name: 'Mass Times', item: 'https://www.gwparish.org.au/mass-times' },
                { '@type': 'ListItem', position: 3, name: 'Sacraments', item: 'https://www.gwparish.org.au/sacraments' },
                { '@type': 'ListItem', position: 4, name: 'About Us', item: 'https://www.gwparish.org.au/about' },
                { '@type': 'ListItem', position: 5, name: "I'm New Here", item: 'https://www.gwparish.org.au/new-here' },
                { '@type': 'ListItem', position: 6, name: 'News & Events', item: 'https://www.gwparish.org.au/news-events' },
                { '@type': 'ListItem', position: 7, name: 'Give', item: 'https://www.gwparish.org.au/give' },
                { '@type': 'ListItem', position: 8, name: 'History', item: 'https://www.gwparish.org.au/history' },
                { '@type': 'ListItem', position: 9, name: 'Contact', item: 'https://www.gwparish.org.au/contact' },
                { '@type': 'ListItem', position: 10, name: 'Volunteer', item: 'https://www.gwparish.org.au/volunteer' },
                { '@type': 'ListItem', position: 11, name: 'Gallery', item: 'https://www.gwparish.org.au/gallery' },
                { '@type': 'ListItem', position: 12, name: 'Safeguarding', item: 'https://www.gwparish.org.au/safeguarding' },
            ],
        },
        {
            '@type': 'Event',
            name: 'Sunday Mass — St Martin\'s Church',
            description: 'Weekly Sunday Mass at St Martin\'s Catholic Church, Greenacres.',
            startDate: '2026-03-08T09:30:00+10:30',
            endDate: '2026-03-08T10:30:00+10:30',
            eventSchedule: {
                '@type': 'Schedule',
                repeatFrequency: 'P1W',
                byDay: 'https://schema.org/Sunday',
                startTime: '09:30',
                endTime: '10:30',
            },
            location: { '@id': 'https://www.gwparish.org.au/#st-martins' },
            organizer: { '@id': 'https://www.gwparish.org.au/#organization' },
            eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
            isAccessibleForFree: true,
        },
        {
            '@type': 'Event',
            name: 'Saturday Vigil Mass — St Monica\'s Church',
            description: 'Weekly Saturday Vigil Mass at St Monica\'s Catholic Church, Walkerville.',
            startDate: '2026-03-07T18:00:00+10:30',
            endDate: '2026-03-07T19:00:00+10:30',
            eventSchedule: {
                '@type': 'Schedule',
                repeatFrequency: 'P1W',
                byDay: 'https://schema.org/Saturday',
                startTime: '18:00',
                endTime: '19:00',
            },
            location: { '@id': 'https://www.gwparish.org.au/#st-monicas' },
            organizer: { '@id': 'https://www.gwparish.org.au/#organization' },
            eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
            isAccessibleForFree: true,
        },
    ],
};

/**
 * Injects JSON-LD structured data into the page <head>.
 * Rendered once on the homepage to provide rich Google results
 * (knowledge panel, church locations, opening hours).
 */
export function JsonLdSchema() {
    useEffect(() => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(SCHEMA);
        document.head.appendChild(script);
        return () => {
            script.remove();
        };
    }, []);
    return null;
}
