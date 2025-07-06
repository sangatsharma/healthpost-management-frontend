'use client';

import { useEffect } from 'react';

interface StructuredDataProps {
  data: object;
}

export function StructuredData({ data }: StructuredDataProps) {
  useEffect(() => {
    // Add structured data to the document head
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    script.id = 'structured-data';

    // Remove existing structured data script if it exists
    const existingScript = document.getElementById('structured-data');
    if (existingScript) {
      existingScript.remove();
    }

    document.head.appendChild(script);

    // Cleanup function
    return () => {
      const scriptToRemove = document.getElementById('structured-data');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [data]);

  return null;
}

// Component for adding schema.org structured data
export function HealthPostStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'MedicalOrganization',
    name: 'HealthPost Management System',
    description:
      'Comprehensive health post management system for offline and online healthcare management',
    url: 'https://healthpost-management.com',
    logo: 'https://healthpost-management.com/images/hp.png',
    sameAs: [],
    medicalSpecialty: [
      'Primary Care',
      'Community Health',
      'Preventive Medicine',
    ],
    serviceArea: {
      '@type': 'Country',
      name: 'Nepal',
    },
    availableService: [
      {
        '@type': 'MedicalService',
        name: 'Patient Management',
        description: 'Comprehensive patient record management system',
      },
      {
        '@type': 'MedicalService',
        name: 'Appointment Scheduling',
        description: 'Online and offline appointment booking system',
      },
      {
        '@type': 'MedicalService',
        name: 'Health Records',
        description: 'Digital health record management and storage',
      },
    ],
  };

  return <StructuredData data={structuredData} />;
}
