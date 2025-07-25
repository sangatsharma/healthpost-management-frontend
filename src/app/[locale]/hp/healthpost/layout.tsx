import { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';
import { ProtectedRoute } from '@/components/ProtectedRoutes';
import { Permissions } from '@/zustand/permissions';

export function generateMetadata(): Metadata {
  return pageMetadata.healthpost();
}

export default function HealthpostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredPermission={Permissions.HP_MANAGEMENT}>
      {children}
    </ProtectedRoute>
  );
}
