import { Permissions } from '@/zustand/permissions';
import { UserType } from './user.constant';
import {
  Home,
  Users,
  Activity,
  FileText,
  Pill,
  UserCheck,
  Settings,
  Package,
  Clipboard,
  ShoppingCart,
  UserPlus,
  UserCog,
  Clock,
  BarChart3,
  DollarSign,
  TrendingUp,
  HeartPlusIcon,
  Mail,
} from 'lucide-react';
import { TUserType } from '@/types/user.types';
import { TMenuItem, TTypeFunction } from '@/types/global';
const LOCALES = ['en', 'np'] as const;

const PUBLIC_PATHS = ['login'] as const;

export const PUBLIC_ROUTES: string[] = LOCALES.flatMap((locale) =>
  UserType.flatMap((role) =>
    PUBLIC_PATHS.map((path) => `/${locale}/${role}/${path}`),
  ),
);

export function isPublicRoute(pathname: string): boolean {
  if (pathname.includes('unauthorized') || pathname.includes('404')) {
    return true;
  }
  return PUBLIC_ROUTES.some(
    (route) => pathname === route.replace(/\/$/, ''), // Handle trailing slashes
  );
}

export const ADMIN_ROUTES = [
  '/admin/dashboard',
  '/admin/users',
  '/admin/settings',
];

export const PATIENT_ROUTES = ['/patient/dashboard', '/patient/records'];

export const HEALTHPOST_ROUTES = [
  '/clinical/records',
  '/clinical/lab',
  '/clinical/maternal',
  '/community/reports',
  '/inventory',
];

export const EMAIL_ROUTES = ['/email/inbox', '/email/new'];

export const PROTECTED_ROUTES = [
  ...ADMIN_ROUTES,
  ...HEALTHPOST_ROUTES,
  ...PATIENT_ROUTES,
  ...EMAIL_ROUTES,
];

export const getMenuItems = ({
  itemsFor,
  t,
}: {
  itemsFor: TUserType;
  t: TTypeFunction<'GeneralPages'>;
}): TMenuItem[] => {
  switch (itemsFor) {
    case 'HP':
      return [
        {
          key: 'dashboard',
          icon: Home,
          label: t('SidebarItems.dashboard'),
          href: `hp/dashboard`,
          permission: Permissions.HEALTH_POST_DASHBOARD,
        },
        {
          key: 'patients',
          icon: Users,
          label: 'Patient Registry',
          href: `hp/patients`,
          permission: Permissions.PATIENT_RECORDS,
        },
        {
          key: 'medical-records',
          icon: FileText,
          label: 'Medical Records',
          href: `hp/medical-records`,
          permission: Permissions.MEDICINE_DISPENSE,
        },
        {
          key: 'pharmacy',
          icon: Pill,
          label: 'Pharmacy',
          submenu: [
            {
              key: 'inventory',
              icon: Package,
              label: 'Inventory',
              href: `hp/pharmacy/inventory`,
              permission: Permissions.MEDICINE_DISPENSE,
            },
            {
              key: 'prescriptions',
              icon: Clipboard,
              label: 'Prescriptions',
              href: `hp/pharmacy/prescribtions`,
              permission: Permissions.MEDICINE_DISPENSE,
            },
            {
              key: 'dispensing',
              icon: ShoppingCart,
              label: 'Dispensing',
              href: '/pharmacy/dispensing',
              permission: Permissions.MEDICINE_DISPENSE,
            },
          ],
        },
        {
          key: 'lab-results',
          icon: Activity,
          label: 'Lab Results',
          href: `hp/lab-results`,
          permission: Permissions.LAB_RESULTS_UPLOAD,
        },
        {
          key: 'staff',
          icon: UserCheck,
          label: 'Staff Management',
          submenu: [
            {
              key: 'doctors',
              icon: UserPlus,
              label: 'Doctors',
              href: `hp/staff/doctors`,
              permission: Permissions.USER_MANAGE,
            },
            {
              key: 'nurses',
              icon: UserCog,
              label: 'Nurses',
              href: '/staff/nurses',
              permission: Permissions.USER_MANAGE,
            },
            {
              key: 'admin-staff',
              icon: Users,
              label: 'Admin Staff',
              href: '/staff/admin',
              permission: Permissions.USER_MANAGE,
            },
            {
              key: 'schedules',
              icon: Clock,
              label: 'Schedules',
              href: '/staff/schedules',
              permission: Permissions.USER_MANAGE,
            },
          ],
        },
        {
          key: 'reports',
          icon: BarChart3,
          label: 'Reports',
          submenu: [
            {
              key: 'patient-reports',
              icon: FileText,
              label: 'Patient Reports',
              href: '/reports/patients',
              permission: Permissions.LAB_RESULTS_VERIFY,
            },
            {
              key: 'financial-reports',
              icon: DollarSign,
              label: 'Financial Reports',
              href: '/reports/financial',
              permission: Permissions.LAB_RESULTS_VERIFY,
            },
            {
              key: 'health-statistics',
              icon: TrendingUp,
              label: 'Health Statistics',
              href: '/reports/statistics',
              permission: Permissions.LAB_RESULTS_VERIFY,
            },
          ],
        },
        {
          key: 'settings',
          icon: Settings,
          label: 'Settings',
          href: '/settings',
          permission: Permissions.SYSTEM_CONFIG,
        },
      ];
    case 'ADMIN':
      return [
        {
          key: 'dashboard',
          icon: Home,
          label: t('SidebarItems.dashboard'),
          href: `dashboard`,
          permission: Permissions.ADMIN_DASHBOARD,
        },
        {
          key: 'healthpost',
          icon: HeartPlusIcon,
          label: t('SidebarItems.healthpost'),
          href: `healthpost`,
          permission: Permissions.HP_MANAGEMENT,
        },
        {
          key: 'admitpatients',
          icon: UserPlus,
          label: t('SidebarItems.patients'),
          href: `admitpatients`,
          permission: Permissions.PATIENT_RECORDS,
        },
        // {
        //   key: 'medicalhistory',
        //   icon: FileText,
        //   label: t('SidebarItems.medicalhistory'),
        //   href: `medicalhistory`,
        //   permission: Permissions.ADMIN_MANAGEMENT,
        // },
        {
          key: 'staffs',
          icon: Users,
          label: t('SidebarItems.staffsmanagement'),
          href: `staffs`,
          permission: Permissions.ADMIN_MANAGEMENT,
        },
        {
          key: 'email',
          icon: Mail,
          label: t('User.email'),
          href: 'email',
          permission: Permissions.SYSTEM_CONFIG,
        },
      ];
    default:
      return [
        {
          key: 'dashboard',
          icon: Home,
          label: 'Dashboard',
          href: `/patient/test`,
          permission: Permissions.PATIENT_DASHBOARD,
        },
        {
          key: 'patients',
          icon: Users,
          label: 'Patient Records',
          href: `/patient/records`,
          permission: Permissions.PATIENT_RECORDS,
        },
        {
          key: 'settings',
          icon: Settings,
          label: 'Settings',
          href: `/patient/settings`,
          permission: Permissions.SYSTEM_CONFIG,
        },
      ];
  }
};
