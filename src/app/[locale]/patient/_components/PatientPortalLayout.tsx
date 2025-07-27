'use client';
import { useUserStore } from '@/zustand/useUserStore';
import UnauthorizedPage from '../../unauthorized/page';

export const ProtectedPatientRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const userLoaded = useUserStore((state) => state.isLoggedIn);
  const user = useUserStore((state) => state.user);

  if (userLoaded && user?.accountType !== 'PATIENT')
    return <UnauthorizedPage />;

  return <>{children}</>;
};
