import { TMenuItem } from '@/types/global';
import { TUser } from '@/types/user.types';

export enum Permissions {
  ALL = 'ALL',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  HP_MANAGEMENT = 'HP_MANAGEMENT',
  STAFF_MANAGEMENT = 'STAFF_MANAGEMENT',
  PATIENT_RECORDS = 'PATIENT_RECORDS',
  PRESCRIBE_MEDICATION = 'PRESCRIBE_MEDICATION',
  OPD_REFERRALS = 'OPD_REFERRALS',
  ORDER_LAB_TESTS = 'ORDER_LAB_TESTS',
  LAB_RESULTS_UPLOAD = 'LAB_RESULTS_UPLOAD',
  LAB_RESULTS_VERIFY = 'LAB_RESULTS_VERIFY',
  DATA_EXPORT = 'DATA_EXPORT',
}

export type TPermissionResource = keyof typeof Permissions;

// Define actions that can be performed on resources
export enum Action {
  READ = 'READ',
  WRITE = 'WRITE',
}
export type TAction = keyof typeof Action;

export const checkPermission = (
  user: TUser,
  permission: TPermissionResource,
): boolean => {
  return !!user?.permissions?.some(
    (perm) =>
      perm?.resource === permission || perm.resource === Permissions.ALL,
  );
};

export const filterMenuItems = (
  menuItems: TMenuItem[],
  user: TUser,
): TMenuItem[] => {
  return menuItems
    .map((item) => {
      // If item has submenu, filter submenu items first
      if (item.submenu) {
        const filteredSubmenu = item.submenu.filter((subItem) =>
          checkPermission(user, subItem.permission),
        );

        // Only show parent menu if user has access to at least one submenu item
        if (filteredSubmenu.length > 0) {
          return {
            ...item,
            submenu: filteredSubmenu,
          };
        }
        return null;
      }

      // For regular menu items, check permission
      if (
        item.permission &&
        !checkPermission(user, item.permission) &&
        user.accountType !== 'PATIENT'
      ) {
        return null;
      }

      return item;
    })
    .filter(Boolean) as TMenuItem[];
};

export const hasAnySubmenuPermission = (
  item: TMenuItem,
  user: TUser,
): boolean => {
  if (!item.submenu) return true;
  return item.submenu.some((subItem) =>
    checkPermission(user, subItem.permission),
  );
};
