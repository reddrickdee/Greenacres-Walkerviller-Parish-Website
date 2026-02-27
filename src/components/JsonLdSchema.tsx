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
