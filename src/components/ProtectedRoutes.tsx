import React from 'react';
import { useRouter } from 'next/router';
import { TPermissionResource } from '@/zustand/permissions';
import { toast } from 'sonner';
import { useHasPermission } from '@/hooks/useHasPermission';

type ProtectedRouteProps = {
  requiredPermission: TPermissionResource;
  children: React.ReactNode;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredPermission,
  children,
}) => {
  const router = useRouter();
  const { hasReadPermission } = useHasPermission(requiredPermission);

  if (!hasReadPermission) {
    toast.error('You do not have permission to access this page.');
    router.replace('/unauthorized');
    return null;
  }

  return <>{children}</>;
};
