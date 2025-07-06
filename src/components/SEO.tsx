'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  noIndex?: boolean;
  structuredData?: object;
}

export function SEO({
  title: _title,
  description,
  canonical,
  noIndex = false,
  structuredData,
}: SEOProps) {
  const pathname = usePathname();

  useEffect(() => {
    // Update canonical URL if not provided
    if (!canonical) {
      const canonicalUrl = `https://healthpost-management.com${pathname}`;

      // Remove existing canonical link
      const existingCanonical = document.querySelector('link[rel="canonical"]');
      if (existingCanonical) {
        existingCanonical.remove();
      }

      // Add new canonical link
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = canonicalUrl;
      document.head.appendChild(link);
    }

    // Add structured data if provided
    if (structuredData) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(structuredData);
      script.id = 'seo-structured-data';

      // Remove existing structured data script
      const existingScript = document.getElementById('seo-structured-data');
      if (existingScript) {
        existingScript.remove();
      }

      document.head.appendChild(script);
    }

    // Update meta description if provided
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', description);
    }

    // Update robots meta if noIndex is true
    if (noIndex) {
      let robotsMeta = document.querySelector('meta[name="robots"]');
      if (!robotsMeta) {
        robotsMeta = document.createElement('meta');
        robotsMeta.setAttribute('name', 'robots');
        document.head.appendChild(robotsMeta);
      }
      robotsMeta.setAttribute('content', 'noindex,nofollow');
    }

    // Cleanup function
    return () => {
      if (structuredData) {
        const scriptToRemove = document.getElementById('seo-structured-data');
        if (scriptToRemove) {
          scriptToRemove.remove();
        }
      }
    };
  }, [pathname, canonical, description, noIndex, structuredData]);

  return null;
}

// Pre-configured SEO components for common pages
export function DashboardSEO() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'HealthPost Management Dashboard',
    description:
      'Healthcare management dashboard for monitoring patients, appointments, and health records',
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web Browser',
    permissions: 'https://healthpost-management.com/terms',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <SEO
      title="Dashboard"
      description="Healthcare management dashboard for monitoring patients, appointments, and health records"
      structuredData={structuredData}
    />
  );
}

export function PatientSEO() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Patient Management System',
    description:
      'Comprehensive patient record management and healthcare information system',
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web Browser',
  };

  return (
    <SEO
      title="Patient Management"
      description="Comprehensive patient record management and healthcare information system"
      structuredData={structuredData}
    />
  );
}

export function LoginSEO() {
  return (
    <SEO
      title="Login"
      description="Sign in to your HealthPost Management System account"
      noIndex={true}
    />
  );
}

export function UnauthorizedSEO() {
  return (
    <SEO
      title="Unauthorized Access"
      description="You do not have permission to access this page"
      noIndex={true}
    />
  );
}

export function NotFoundSEO() {
  return (
    <SEO
      title="Page Not Found"
      description="The requested page could not be found"
      noIndex={true}
    />
  );
}
