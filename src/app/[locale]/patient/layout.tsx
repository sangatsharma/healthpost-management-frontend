import { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';

export function generateMetadata(): Metadata {
  return pageMetadata.patients();
}

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
