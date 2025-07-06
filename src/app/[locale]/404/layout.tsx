import { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';

export function generateMetadata(): Metadata {
  return pageMetadata.notFound();
}

export default function NotFoundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
