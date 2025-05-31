import { TMenuItem } from '@/types/global';
import { TUser, UserRole } from '@/types/user.types';

export enum Permissions {
  // System-wide permissions
  ALL = 'ALL',
  SYSTEM_CONFIG = 'SYSTEM_CONFIG',

  // Dashboard access
  DASHBOARD = 'DASHBOARD',

  // Patient management
  PATIENT_RECORDS = 'PATIENT_RECORDS',

  // Clinical workflows
  PRESCRIBE_MEDICATION = 'PRESCRIBE_MEDICATION',
  ORDER_LAB_TESTS = 'ORDER_LAB_TESTS',
  VACCINATION_RECORD = 'VACCINATION_RECORD',
  MATERNAL_HEALTH_EDIT = 'MATERNAL_HEALTH_EDIT',

  // Laboratory
  LAB_RESULTS_UPLOAD = 'LAB_RESULTS_UPLOAD',
  LAB_RESULTS_VERIFY = 'LAB_RESULTS_VERIFY',

  // Community health
  COMMUNITY_REPORTS = 'COMMUNITY_REPORTS',
  HOME_VISIT_RECORD = 'HOME_VISIT_RECORD',

  // Inventory
  INVENTORY_VIEW = 'INVENTORY_VIEW',
  INVENTORY_MANAGE = 'INVENTORY_MANAGE',
  MEDICINE_DISPENSE = 'MEDICINE_DISPENSE',

  // Administrative
  USER_MANAGE = 'USER_MANAGE',
  REPORTS_GENERATE = 'REPORTS_GENERATE',
  DATA_EXPORT = 'DATA_EXPORT',
}

export type TPermissionResource = keyof typeof Permissions;

export const ROLE_PERMISSIONS: Record<UserRole, Permissions[]> = {
  SUPER_ADMIN: [Permissions.ALL],
  ADMIN: [
    Permissions.DASHBOARD,
    Permissions.PATIENT_RECORDS,
    Permissions.USER_MANAGE,
    Permissions.REPORTS_GENERATE,
  ],
  HEALTH_ASSISTANT: [
    Permissions.PATIENT_RECORDS,
    Permissions.PRESCRIBE_MEDICATION,
    Permissions.ORDER_LAB_TESTS,
    Permissions.VACCINATION_RECORD,
  ],
  ANM: [
    Permissions.MATERNAL_HEALTH_EDIT,
    Permissions.VACCINATION_RECORD,
    Permissions.HOME_VISIT_RECORD,
  ],
  LAB_TECHNICIAN: [
    Permissions.LAB_RESULTS_UPLOAD,
    Permissions.LAB_RESULTS_VERIFY,
  ],
  FCHV: [Permissions.COMMUNITY_REPORTS, Permissions.HOME_VISIT_RECORD],
  INVENTORY_KEEPER: [
    Permissions.INVENTORY_VIEW,
    Permissions.INVENTORY_MANAGE,
    Permissions.MEDICINE_DISPENSE,
  ],
  PATIENT: [Permissions.PATIENT_RECORDS],
  OFFICE_HELPER: [],
  ALL: [],
};

// Define actions that can be performed on resources
export enum Action {
  READ = 'READ',
  WRITE = 'WRITE',
}

export const checkPermission = (
  user: TUser,
  permission: TPermissionResource,
): boolean => {
  return !!user?.permissions?.some(
    (perm) => perm?.resource === permission || perm.resource === 'ALL',
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
      if (item.permission && !checkPermission(user, item.permission)) {
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
