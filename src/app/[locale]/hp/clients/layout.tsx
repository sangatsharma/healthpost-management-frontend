import { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';
import { ProtectedRoute } from '@/components/ProtectedRoutes';
import { Permissions } from '@/zustand/permissions';

export function generateMetadata(): Metadata {
  return pageMetadata.patients();
}

export default function PatientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredPermission={Permissions.PATIENT_RECORDS}>
      {children}
    </ProtectedRoute>
  );
}
