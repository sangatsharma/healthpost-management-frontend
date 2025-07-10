'use client';
import { TPermissionResource } from '@/zustand/permissions';
import { useHasPermission } from '@/hooks/useHasPermission';
import { useUserStore } from '@/zustand/useUserStore';
import UnauthorizedPage from '@/app/[locale]/unauthorized/page';

type ProtectedRouteProps = {
  requiredPermission: TPermissionResource;
  children: React.ReactNode;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredPermission,
  children,
}) => {
  const { hasReadPermission, isLoading } = useHasPermission(requiredPermission);
  const userLoaded = useUserStore((state) => state.isLoggedIn);

  if (userLoaded && !isLoading && !hasReadPermission)
    return <UnauthorizedPage />;

  return <>{children}</>;
};
