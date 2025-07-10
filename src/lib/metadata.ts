import { Metadata } from 'next';

interface MetadataParams {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  noIndex?: boolean;
  image?: string;
  locale?: string;
}

export function generateMetadata({
  title,
  description = 'Comprehensive health post management system for offline and online healthcare management',
  keywords = [],
  canonical,
  noIndex = false,
  image = '/images/hp.png',
  locale = 'en',
}: MetadataParams = {}): Metadata {
  const baseKeywords = [
    'healthcare management',
    'health post',
    'medical records',
    'patient management',
    'healthcare system',
    'offline healthcare',
    'medical administration',
    'health information system',
    'Nepal healthcare',
    'community health',
  ];

  const allKeywords = [...baseKeywords, ...keywords];

  const metadata: Metadata = {
    title: title
      ? `${title} | HealthPost Management System`
      : 'HealthPost Management System',
    description,
    keywords: allKeywords,
    robots: noIndex ? 'noindex,nofollow' : 'index,follow',
    openGraph: {
      title: title
        ? `${title} | HealthPost Management System`
        : 'HealthPost Management System',
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title || 'HealthPost Management System',
        },
      ],
      locale: locale === 'np' ? 'ne_NP' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: title
        ? `${title} | HealthPost Management System`
        : 'HealthPost Management System',
      description,
      images: [image],
    },
  };

  if (canonical) {
    metadata.alternates = {
      canonical,
    };
  }

  return metadata;
}

// Page-specific metadata generators
export const pageMetadata = {
  dashboard: (locale?: string) =>
    generateMetadata({
      title: 'Dashboard',
      description:
        'Main dashboard for managing health post operations, patient records, and system overview',
      keywords: [
        'dashboard',
        'overview',
        'health post dashboard',
        'medical dashboard',
      ],
      locale,
    }),
  healthpost: (locale?: string) =>
    generateMetadata({
      title: 'HealthPosts',
      description:
        'Manage health post information, locations, and operational details',
      keywords: ['health posts', 'overview', 'health post management'],
      locale,
    }),

  staffs: (locale?: string) =>
    generateMetadata({
      title: 'Staffs',
      description: 'Manage health post staff, roles, and responsibilities',
      keywords: ['staffs', 'health post staff', 'medical staff management'],
      locale,
    }),

  patients: (locale?: string) =>
    generateMetadata({
      title: 'Patients',
      description:
        'Manage patient records, medical history, and healthcare information',
      keywords: [
        'patients',
        'patient management',
        'medical records',
        'patient database',
      ],
      locale,
    }),

  appointments: (locale?: string) =>
    generateMetadata({
      title: 'Appointments',
      description:
        'Schedule and manage patient appointments and medical consultations',
      keywords: [
        'appointments',
        'scheduling',
        'medical appointments',
        'consultation',
      ],
      locale,
    }),

  reports: (locale?: string) =>
    generateMetadata({
      title: 'Reports',
      description:
        'Generate and view health post reports, statistics, and analytics',
      keywords: [
        'reports',
        'analytics',
        'health statistics',
        'medical reports',
      ],
      locale,
    }),

  settings: (locale?: string) =>
    generateMetadata({
      title: 'Settings',
      description:
        'Configure system settings, user preferences, and health post management options',
      keywords: ['settings', 'configuration', 'preferences', 'system settings'],
      locale,
    }),

  login: (locale?: string) =>
    generateMetadata({
      title: 'Login',
      description: 'Sign in to your HealthPost Management System account',
      keywords: ['login', 'sign in', 'authentication', 'user access'],
      noIndex: true,
      locale,
    }),

  register: (locale?: string) =>
    generateMetadata({
      title: 'Register',
      description: 'Create a new account for HealthPost Management System',
      keywords: ['register', 'sign up', 'create account', 'new user'],
      noIndex: true,
      locale,
    }),

  unauthorized: (locale?: string) =>
    generateMetadata({
      title: 'Unauthorized',
      description: 'Access denied - insufficient permissions',
      noIndex: true,
      locale,
    }),

  notFound: (locale?: string) =>
    generateMetadata({
      title: 'Page Not Found',
      description: 'The requested page could not be found',
      noIndex: true,
      locale,
    }),
};
