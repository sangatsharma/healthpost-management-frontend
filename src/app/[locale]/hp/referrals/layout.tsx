import { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';
import { ProtectedRoute } from '@/components/ProtectedRoutes';
import { Permissions } from '@/zustand/permissions';

export function generateMetadata(): Metadata {
  return pageMetadata.opd();
}

export default function ReferralsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredPermission={Permissions.OPD_REFERRALS}>
      {children}
    </ProtectedRoute>
  );
}
