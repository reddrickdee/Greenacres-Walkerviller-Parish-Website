import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Greenacres Walkerville Catholic Parish';
const SITE_URL = 'https://www.gwparish.org.au';
const DEFAULT_DESCRIPTION = 'Welcome to Greenacres Walkerville Catholic Parish in Adelaide, South Australia. Join us for Mass, sacraments, community events, and daily reflections.';
const OG_IMAGE = `${SITE_URL}/parish-logo.png`;

interface PageMetaProps {
    title?: string;
    description?: string;
    path?: string;
    type?: string;
}

export function PageMeta({
    title,
    description = DEFAULT_DESCRIPTION,
    path = '',
    type = 'website',
}: PageMetaProps) {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    const canonicalUrl = `${SITE_URL}${path}`;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:image" content={OG_IMAGE} />
            <meta property="og:locale" content="en_AU" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={OG_IMAGE} />
        </Helmet>
    );
}
