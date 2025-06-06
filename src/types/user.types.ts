import { TPermission } from './global';

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  PATIENT = 'PATIENT',
  HEALTH_ASSISTANT = 'HEALTH_ASSISTANT',
  ANM = 'ANM',
  LAB_TECHNICIAN = 'LAB_TECHNICIAN',
  FCHV = 'FCHV',
  INVENTORY_KEEPER = 'INVENTORY_KEEPER',
  OFFICE_HELPER = 'OFFICE_HELPER',
  ALL = 'ALL',
}

export type TUserType = 'PATIENT' | 'HP' | 'ADMIN';

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
