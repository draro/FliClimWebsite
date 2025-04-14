'use client';

import { Organization, WithContext } from 'schema-dts';

export function OrganizationJsonLd() {
  const organizationData: WithContext<Organization> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'FlyClim',
    url: 'https://flyclim.com',
    logo: 'https://flyclim.com/logo.png',
    description: 'AI-Powered Weather Optimization for Smarter Aviation Operations',
    sameAs: [
      'https://twitter.com/flyclim',
      'https://linkedin.com/company/flyclim',
      'https://github.com/flyclim'
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-123-4567',
      contactType: 'customer service',
      email: 'info@flyclim.com'
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
    />
  );
}

export function BlogPostJsonLd({
  title,
  description,
  publishedAt,
  updatedAt,
  authorName = 'FlyClim Team',
  images = [],
  url
}: {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  authorName?: string;
  images?: string[];
  url: string;
}) {
  const blogPostData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    image: images.length > 0 ? images : ['https://flyclim.com/logo.png'],
    datePublished: publishedAt,
    dateModified: updatedAt || publishedAt,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'FlyClim',
      logo: {
        '@type': 'ImageObject',
        url: 'https://flyclim.com/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostData) }}
    />
  );
}

export function ProductJsonLd() {
  const productData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'FlyClim Storm Viewer',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: 'AI-powered weather optimization platform for aviation operations',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '127'
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(productData) }}
    />
  );
}