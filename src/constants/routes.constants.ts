import { Permissions } from '@/zustand/permissions';
import {
  Home,
  Users,
  FileText,
  Pill,
  UserCheck,
  BarChart3,
  TrendingUp,
  HeartPlusIcon,
  Mail,
  FileInputIcon,
  UserCog,
  Clock,
  Forward,
} from 'lucide-react';
import { TUserType } from '@/types/user.types';
import { TMenuItem, TTypeFunction } from '@/types/global';

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
          key: 'patients',
          icon: Users,
          label: t('SidebarItems.clientsRegistration'),
          href: `/hp/clients`,
          permission: Permissions.PATIENT_RECORDS,
        },
        {
          key: 'opd-section',
          icon: FileInputIcon,
          label: t('SidebarItems.opdSection'),
          href: `/hp/opd-section`,
          permission: Permissions.PRESCRIBE_MEDICATION,
        },
        {
          key: 'opd-referral-section',
          icon: Forward,
          label: t('SidebarItems.referrals'),
          href: `/hp/referrals`,
          permission: Permissions.OPD_REFERRALS,
        },

        {
          key: 'medicalhistory',
          icon: FileText,
          label: t('SidebarItems.medicalhistory'),
          href: `/hp/medicalhistory`,
          permission: Permissions.PATIENT_RECORDS,
        },
        {
          key: 'staff',
          icon: UserCheck,
          label: t('SidebarItems.staffsmanagement'),
          href: `/hp/staffs`,
          permission: Permissions.STAFF_MANAGEMENT,
        },
        {
          key: 'laboratory',
          icon: FileText,
          label: t('SidebarItems.laboratory'),
          href: `/hp/laboratory`,
          permission: Permissions.LAB_RESULTS_UPLOAD,
        },
        // {
        //   key: 'pharmacy',
        //   icon: Pill,
        //   label: 'Pharmacy',
        //   submenu: [
        //     {
        //       key: 'inventory',
        //       icon: Package,
        //       label: 'Inventory',
        //       href: `hp/pharmacy/inventory`,
        //       permission: Permissions.MEDICINE_DISPENSE,
        //     },
        //     {
        //       key: 'prescriptions',
        //       icon: Clipboard,
        //       label: 'Prescriptions',
        //       href: `hp/pharmacy/prescribtions`,
        //       permission: Permissions.MEDICINE_DISPENSE,
        //     },
        //     {
        //       key: 'dispensing',
        //       icon: ShoppingCart,
        //       label: 'Dispensing',
        //       href: '/pharmacy/dispensing',
        //       permission: Permissions.MEDICINE_DISPENSE,
        //     },
        //   ],
        // },

        // {
        //   key: 'reports',
        //   icon: BarChart3,
        //   label: 'Reports',
        //   submenu: [
        //     {
        //       key: 'patient-reports',
        //       icon: FileText,
        //       label: 'Patient Reports',
        //       href: '/reports/patients',
        //       permission: Permissions.LAB_RESULTS_VERIFY,
        //     },
        //     {
        //       key: 'financial-reports',
        //       icon: DollarSign,
        //       label: 'Financial Reports',
        //       href: '/reports/financial',
        //       permission: Permissions.LAB_RESULTS_VERIFY,
        //     },
        //     {
        //       key: 'health-statistics',
        //       icon: TrendingUp,
        //       label: 'Health Statistics',
        //       href: '/reports/statistics',
        //       permission: Permissions.LAB_RESULTS_VERIFY,
        //     },
        //   ],
        // },
        // {
        //   key: 'settings',
        //   icon: Settings,
        //   label: 'Settings',
        //   href: '/settings',
        //   permission: Permissions.SYSTEM_CONFIG,
        // },
      ];
    case 'ADMIN':
      return [
        {
          key: 'dashboard',
          icon: Home,
          label: t('SidebarItems.dashboard'),
          href: `/admin/dashboard`,
          permission: Permissions.ADMIN_DASHBOARD,
        },
        {
          key: 'healthpost',
          icon: HeartPlusIcon,
          label: t('SidebarItems.healthpost'),
          href: `/admin/healthpost`,
          permission: Permissions.HP_MANAGEMENT,
        },

        {
          key: 'staffs',
          icon: Users,
          label: t('SidebarItems.staffsmanagement'),
          href: `/admin/staffs`,
          permission: Permissions.STAFF_MANAGEMENT,
        },
        {
          key: 'email',
          icon: Mail,
          label: t('User.email'),
          href: '/admin/email',
          permission: Permissions.ADMIN_DASHBOARD,
        },
      ];
    case 'PATIENT':
      return [
        {
          key: 'dashboard',
          icon: Home,
          label: t('SidebarItems.dashboard'),
          href: `/patient/dashboard`,
          // permission: Permissions.PATIENT_DASHBOARD,
        },
        {
          key: 'patientProfile',
          icon: UserCog,
          label: t('SidebarItems.profile'),
          href: `/patient/profile`,
          // permission: Permissions.PATIENT_RECORDS,
        },
        {
          key: 'patientReports',
          icon: BarChart3,
          label: t('SidebarItems.reports'),
          href: `/patient/reports`,
          // permission: Permissions.PATIENT_RECORDS,
        },
        {
          key: 'pregnancy',
          icon: HeartPlusIcon,
          label: 'Pregnancy Dashboard',
          href: `/patient/pregnancy`,
          // permission: Permissions.PATIENT_RECORDS,
        },
        {
          key: 'vaccinations',
          icon: UserCheck,
          label: 'Vaccination Records',
          href: `/patient/vaccinations`,
          // permission: Permissions.PATIENT_RECORDS,
        },
        {
          key: 'chronic-conditions',
          icon: TrendingUp,
          label: 'Chronic Conditions',
          href: `/patient/chronic-conditions`,
          // permission: Permissions.PATIENT_RECORDS,
        },
        {
          key: 'medical-history',
          icon: FileText,
          label: 'Medical History',
          href: `/patient/medical-history`,
          // permission: Permissions.PATIENT_RECORDS,
        },
        {
          key: 'medications',
          icon: Pill,
          label: 'Medications',
          href: `/patient/medications`,
          // permission: Permissions.PATIENT_RECORDS,
        },
        {
          key: 'reminders',
          icon: Clock,
          label: 'Reminders',
          href: `/patient/reminders`,
          // permission: Permissions.PATIENT_RECORDS,
        },
      ];
  }
};
