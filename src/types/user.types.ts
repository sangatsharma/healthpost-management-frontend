import { TClientSchema } from '@/schemas/healthpostPortal/clients.schema';
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

export enum CasteType {
  BRAMAN_CHHETRI = 'BRAMAN_CHHETRI',
  DALIT = 'DALIT',
  JANAJATI = 'JANAJATI',
  MUSLIM = 'MUSLIM',
  MADESHI = 'MADESHI',
  OTHERS = 'OTHERS',
}

export enum Nationality {
  NEPALI = 'NEPALI',
  INDIAN = 'INDIAN',
  OTHER = 'OTHER',
}

export enum MarriageStatus {
  MARRIED = 'MARRIED',
  UNMARRIED = 'UNMARRIED',
  DIVORCED = 'DIVORCED',
  WIDOWED = 'WIDOWED',
  SEPARATED = 'SEPARATED',
  OTHER = 'OTHER',
}

export enum BloodGroup {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
}

export enum DisabilityType {
  PHYSICAL = 'PHYSICAL', // Mobility impairments, e.g., limb loss
  VISUAL = 'VISUAL', // Partial or full vision loss
  HEARING = 'HEARING', // Partial or full hearing loss
  INTELLECTUAL = 'INTELLECTUAL', // Cognitive or developmental disabilities
  MENTAL = 'MENTAL', // Psychiatric or mental health disorders
  MULTIPLE = 'MULTIPLE', // Combination of multiple disabilities
  OTHER = 'OTHER', // Not classified under known categories
}

export enum DisabilityIdentityType {
  NATIONAL_CARD = 'NATIONAL_CARD', // Issued by federal government
  PROVINCIAL_CARD = 'PROVINCIAL_CARD', // Issued by provincial authority
  LOCAL_CARD = 'LOCAL_CARD', // Issued by local government
  HOSPITAL_CERTIFICATE = 'HOSPITAL_CERTIFICATE', // Certified by health institutions
  OTHER = 'OTHER', // Any other recognized proof
}

export type TLoginReponse = {
  success: boolean;
  message: string;
  data: {
    user: TUser;
  };
};

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
  profileImage?: string[];
  healthPost?: {
    name: string;
  };
  createdAt?: string;
  refreshToken?: string;
};

export type TFullname = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TGender = 'MALE' | 'FEMALE' | 'OTHER';

export type TClient = TClientSchema & {
  createdAt: string;
  id: string;
};
