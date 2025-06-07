import { TPermission } from '@/types/global';
import { UserRole } from '@/types/user.types';
import { Action, TPermissionResource } from '@/zustand/permissions';
import { useUserStore } from '@/zustand/useUserDetails';
import { useState, useEffect } from 'react';

type TPermissionResult = {
  hasReadPermission: boolean;
  hasWritePermission: boolean;
  isLoading: boolean;
};

export function useHasPermission(
  resource: TPermissionResource,
): TPermissionResult {
  const user = useUserStore((state) => state.user);
  const userLoaded = useUserStore((state) => state.isLoggedIn);

  const [permissions, setPermissions] = useState<TPermissionResult>({
    hasReadPermission: false,
    hasWritePermission: false,
    isLoading: true,
  });

  useEffect(() => {
    if (!userLoaded) {
      setPermissions((prev) => ({ ...prev, isLoading: true }));
      return;
    }

    // Early return if no user
    if (!user) {
      setPermissions({
        hasReadPermission: false,
        hasWritePermission: false,
        isLoading: false,
      });
      return;
    }

    const { role, permissions: userPermissions = [], healthPostId } = user;

    // Super admin has all permissions
    if (role === UserRole.SUPER_ADMIN) {
      setPermissions({
        hasReadPermission: true,
        hasWritePermission: true,
        isLoading: false,
      });
      return;
    }

    // If user doesn't have a healthPostId, they have no permissions
    if (!healthPostId) {
      setPermissions({
        hasReadPermission: false,
        hasWritePermission: false,
        isLoading: false,
      });
      return;
    }

    // Filter permissions that match the resource
    const relevantPermissions = userPermissions.filter(
      (perm: TPermission) => perm.resource === resource,
      // && perm.healthPost === healthPostId, // Uncomment if needed
    );

    const newReadPermission = relevantPermissions.some(
      (perm) => perm.action === Action.READ || perm.action === Action.WRITE,
    );
    const newWritePermission = relevantPermissions.some(
      (perm) => perm.action === Action.WRITE,
    );

    setPermissions({
      hasReadPermission: newReadPermission,
      hasWritePermission: newWritePermission,
      isLoading: false,
    });
  }, [user, resource, userLoaded]);

  return permissions;
}
