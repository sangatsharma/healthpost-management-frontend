import { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';

export function generateMetadata(): Metadata {
  return pageMetadata.unauthorized();
}

export default function UnauthorizedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
