import { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';
import { ProtectedRoute } from '@/components/ProtectedRoutes';
import { Permissions } from '@/zustand/permissions';

export function generateMetadata(): Metadata {
  return pageMetadata.staffs();
}

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredPermission={Permissions.STAFF_MANAGEMENT}>
      {children}
    </ProtectedRoute>
  );
}
