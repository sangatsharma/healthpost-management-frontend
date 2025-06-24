import { TPermission } from './global';

export enum UserRole {
  SUPERADMIN = 'SUPERADMIN',
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

export enum UserType {
  PATIENT = 'PATIENT',
  HP = 'HP',
  ADMIN = 'ADMIN',
}
export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export type TUserType = 'PATIENT' | 'HP' | 'ADMIN';

export type TUser = {
  id: string;
  fullName: TFullname;
  email: string;
  role: UserRole;
  accountType: TUserType;
  phoneNumber?: string;
  status: Status;
  permissions: TPermission[];
  healthPostId?: string;
  gender?: TGender;
  profileImage?: string;
  healthPost?: {
    name: string;
  };
  createdAt?: string;
};

export type TFullname = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TGender = 'MALE' | 'FEMALE' | 'OTHER';

export type TLoginReponse = {
  success: boolean;
  message: string;
  data: {
    token: {
      accessToken: string;
      refreshToken: string;
    };
    user: TUser;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
};
