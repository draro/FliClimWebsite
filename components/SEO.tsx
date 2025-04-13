'use client';

import Head from 'next/head';
import { usePathname } from 'next/navigation';

interface SEOProps {
    title: string;
    description: string;
    ogImage?: string;
    ogType?: string;
    twitterCard?: string;
}

export function SEO({
    title,
    description,
    ogImage = '/logo.png',
    ogType = 'website',
    twitterCard = 'summary_large_image'
}: SEOProps) {
    const pathname = usePathname();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://flyclim.com';
    const canonicalUrl = `${baseUrl}${pathname}`;
    const ogImageUrl = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`;

    return (
        <Head>
            {/* Basic Meta Tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:image" content={ogImageUrl} />
            <meta property="og:site_name" content="FlyClim" />

            {/* Twitter */}
            <meta name="twitter:card" content={twitterCard} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImageUrl} />
            <meta name="twitter:site" content="@flyclim" />
        </Head>
    );
}