import { TPermission } from '@/types/global';
import { UserRole } from '@/types/user.types';
import { Action, TPermissionResource } from '@/zustand/permissions';
import { useUserStore } from '@/zustand/useUserDetails';

type TPermissionResult = {
  hasReadPermission: boolean;
  hasWritePermission: boolean;
};

export function useHasPermission(
  resource: TPermissionResource,
): TPermissionResult {
  const user = useUserStore((state) => state.user);

  // Early return if no user
  if (!user) {
    return { hasReadPermission: false, hasWritePermission: false };
  }

  const { role, permissions = [], healthPostId } = user;

  // Super admin has all permissions
  if (role === UserRole.SUPER_ADMIN) {
    return { hasReadPermission: true, hasWritePermission: true };
  }

  // If user doesn't have a healthPostId, they have no permissions
  if (!healthPostId) {
    return { hasReadPermission: false, hasWritePermission: false };
  }

  // Filter permissions that match the resource and healthPost
  const relevantPermissions = permissions.filter(
    (perm: TPermission) =>
      perm.resource === resource && perm.healthPost === healthPostId,
  );

  const hasReadPermission = relevantPermissions.some(
    (perm) => perm.action === Action.READ,
  );
  const hasWritePermission = relevantPermissions.some(
    (perm) => perm.action === Action.WRITE,
  );

  return { hasReadPermission, hasWritePermission };
}
