import type React from 'react';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';
// import { PatientPortalLayout } from "./_components/PatientPortalLayout"

export function generateMetadata(): Metadata {
  return pageMetadata.patients();
}

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
