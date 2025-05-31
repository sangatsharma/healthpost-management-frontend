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
  const { role, permissions = [], healthPostId = [] } = user || {};

  const hasReadPermission = permissions.some(
    (perm: TPermission) =>
      perm.action === Action.READ &&
      perm.resource === resource &&
      perm.healthPost === healthPostId,
  );

  const hasWritePermission = permissions.some(
    (perm: TPermission) =>
      perm.action === Action.WRITE &&
      perm.resource === resource &&
      perm.healthPost === healthPostId,
  );

  if (role === UserRole.SUPER_ADMIN) {
    return { hasReadPermission: true, hasWritePermission: true };
  }

  return { hasReadPermission, hasWritePermission };
}
