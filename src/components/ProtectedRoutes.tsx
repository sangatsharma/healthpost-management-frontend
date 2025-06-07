'use client';
import React, { useEffect } from 'react';
import { TPermissionResource } from '@/zustand/permissions';
import { toast } from 'sonner';
import { useHasPermission } from '@/hooks/useHasPermission';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/zustand/useUserDetails';

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
  const router = useRouter();

  useEffect(() => {
    if (!userLoaded || isLoading) return;
    if (!hasReadPermission && !isLoading) {
      toast.error('You do not have permission to access this page.');
      router.replace('/unauthorized');
    }
  }, [hasReadPermission, router, isLoading, userLoaded]);
  console.log('hasReadPermission', hasReadPermission, 'isLoading', isLoading);
  if (!userLoaded || isLoading || !hasReadPermission) return null;

  return <>{children}</>;
};
