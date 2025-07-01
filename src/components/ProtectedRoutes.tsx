'use client';
import React, { useEffect } from 'react';
import { TPermissionResource } from '@/zustand/permissions';
import { toast } from 'sonner';
import { useHasPermission } from '@/hooks/useHasPermission';
import { useUserStore } from '@/zustand/useUserDetails';
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

  useEffect(() => {
    if (!userLoaded || isLoading) return;
    if (!hasReadPermission && !isLoading) {
      toast.error('You do not have permission to access this page.');
    }
  }, [hasReadPermission, isLoading, userLoaded]);

  if (userLoaded && !isLoading && !hasReadPermission)
    return <UnauthorizedPage />;

  return <>{children}</>;
};
