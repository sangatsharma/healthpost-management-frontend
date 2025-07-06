import { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';

export function generateMetadata(): Metadata {
  return pageMetadata.dashboard();
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
