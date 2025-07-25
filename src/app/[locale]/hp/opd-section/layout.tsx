import { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';
import { ProtectedRoute } from '@/components/ProtectedRoutes';
import { Permissions } from '@/zustand/permissions';

export function generateMetadata(): Metadata {
  return pageMetadata.opd();
}

export default function OpdLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredPermission={Permissions.PRESCRIBE_MEDICATION}>
      {children}
    </ProtectedRoute>
  );
}
