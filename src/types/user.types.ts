import { TPermission } from './global';

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN', // Controls entire system across municipalities/districts
  ADMIN = 'ADMIN', // Controls a single HealthPost or municipality's data
  PATIENT = 'PATIENT', // Regular system user
  HEALTH_ASSISTANT = 'HEALTH_ASSISTANT', // Provides basic clinical and preventive services
  ANM = 'ANM', // Auxiliary Nurse Midwife (maternal, child & reproductive health)
  LAB_TECHNICIAN = 'LAB_TECHNICIAN', // Handles tests like malaria, blood, etc.
  FCHV = 'FCHV', // Female Community Health Volunteer (key role in Nepal rural health)
  INVENTORY_KEEPER = 'INVENTORY_KEEPER', // Handles inventory of medical supplies
  OFFICE_HELPER = 'OFFICE_HELPER', // No defined permissions by default
  ALL = 'ALL',
}

export type TUserType = 'patient' | 'hp' | 'admin';

export type TUser = {
  id: number | string;
  name: TFullname;
  email: string;
  role: UserRole;
  accountType: TUserType;
  phoneNumber?: string;
  status: boolean;
  permissions?: TPermission[];
  healthPostId?: string;
};

export type TFullname = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TGender = 'MALE' | 'FEMALE' | 'OTHER';
