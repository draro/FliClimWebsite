"use client";

import { Organization, WithContext } from "schema-dts";

export function OrganizationJsonLd() {
  const organizationData: WithContext<Organization> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "FlyClim",
    alternateName: "FlyClim Aviation Solutions",
    url: "https://flyclim.com",
    logo: "https://flyclim.com/logo.png",
    description:
      "Leading provider of electronic AIP (eAIP) systems for Civil Aviation Authorities and AI-powered flight weather optimization solutions. ICAO Annex 15 compliant digital aeronautical information management platform.",
    sameAs: [
      // 'https://twitter.com/flyclim',
      "https://linkedin.com/company/flyclim",
      "https://www.facebook.com/flyclim/",
    ],
    // address: {
    //   '@type': 'PostalAddress',
    //   addressCountry: 'US'
    // },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-989-447-2494",
      contactType: "customer service",
      email: "info@flyclim.com",
      areaServed: "Worldwide",
      availableLanguage: ["English"],
    },
    knowsAbout: [
      "Electronic Aeronautical Information Publication (eAIP)",
      "ICAO Annex 15",
      "NOTAM Management",
      "AIRAC Cycle Management",
      "Aviation Weather Optimization",
      "Flight Planning",
      "Aeronautical Data Quality"
    ],
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
  authorName = "FlyClim Team",
  images = [],
  url,
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
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: description,
    image: images.length > 0 ? images : ["https://flyclim.com/logo.png"],
    datePublished: publishedAt,
    dateModified: updatedAt || publishedAt,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "FlyClim",
      logo: {
        "@type": "ImageObject",
        url: "https://flyclim.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
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
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "FlyClim eAIP System",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Aviation Information Management",
    operatingSystem: "Web",
    description:
      "Enterprise-grade electronic Aeronautical Information Publication (eAIP) system for Civil Aviation Authorities. ICAO Annex 15 and EUROCONTROL Specification 3.0 compliant with automated NOTAM integration, AIRAC cycle management, and advanced workflow automation.",
    featureList: [
      "ICAO Annex 15 Compliance",
      "Automated NOTAM Generation",
      "AIRAC Cycle Management",
      "Multi-level Workflow Automation",
      "Digital Signature Support",
      "Version Control with Git",
      "Multi-format Export (JSON, XML, HTML)",
      "Compliance Validation",
      "Role-based Access Control",
      "Audit Trail & Logging"
    ],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      priceSpecification: {
        "@type": "PriceSpecification",
        price: "Contact for pricing",
        priceCurrency: "USD"
      }
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "47",
      bestRating: "5",
      worstRating: "1"
    },
    audience: {
      "@type": "Audience",
      audienceType: "Civil Aviation Authorities, Air Navigation Service Providers"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(productData) }}
    />
  );
}

export function FAQJsonLd() {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is an eAIP system?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "An eAIP (electronic Aeronautical Information Publication) system is a digital platform used by Civil Aviation Authorities to manage, publish, and distribute aeronautical information in compliance with ICAO standards. It replaces traditional paper-based AIP with a dynamic, searchable electronic system that includes automated NOTAM generation, AIRAC cycle management, and regulatory compliance features."
        }
      },
      {
        "@type": "Question",
        name: "Is FlyClim's eAIP system ICAO compliant?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, FlyClim's eAIP system is fully compliant with ICAO Annex 15 and EUROCONTROL Specification 3.0. Our platform includes automated validation against ICAO standards, proper formatting for GEN, ENR, and AD sections, and support for all NOTAM categories (A-X)."
        }
      },
      {
        "@type": "Question",
        name: "What are the key features of FlyClim's eAIP system?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Key features include: ICAO-compliant document management, automated NOTAM integration, AIRAC cycle management with automated scheduling, multi-level approval workflows with digital signatures, version control using Git, compliance validation and data quality checking, multi-format export (JSON, XML, HTML), role-based access control, and comprehensive audit trails."
        }
      },
      {
        "@type": "Question",
        name: "How does AIRAC cycle management work in the eAIP system?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The eAIP system includes automated AIRAC (Aeronautical Information Regulation And Control) cycle scheduling that aligns with the 28-day international AIRAC cycles. It provides visual change comparison between cycles, automated publication scheduling, version control for all changes, and compliance tracking to ensure all updates are properly coordinated and published according to international standards."
        }
      },
      {
        "@type": "Question",
        name: "Can the eAIP system integrate with existing aviation systems?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, FlyClim's eAIP system is designed for seamless integration with existing aviation infrastructure through comprehensive API support. It can export data in multiple formats (JSON, XML, HTML) and includes automated distribution capabilities. The system supports coordinate and frequency validation, ICAO identifier validation, and can integrate with existing NOTAM systems and flight planning tools."
        }
      },
      {
        "@type": "Question",
        name: "What security features does the eAIP system provide?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The eAIP system includes enterprise-grade security features: 256-bit encryption, GDPR compliance, multi-tenant architecture with complete data isolation, role-based access control (RBAC), digital signature support for document authenticity, comprehensive audit trails, SOC 2 compliance, and 99.9% uptime SLA with regular security audits and penetration testing."
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
    />
  );
}
