import { basicValidator, createFileUploadValidator } from '@/lib/validators';
import { TTypeFunction } from '@/types/global';
import {
  BloodGroup,
  CasteType,
  DisabilityIdentityType,
  DisabilityType,
  Gender,
  MarriageStatus,
  Nationality,
  Status,
  UserRole,
  UserType,
} from '@/types/user.types';
import { Heart, MapPin, User, Users } from 'lucide-react';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { z } from 'zod';

// PERSONAL INFORMATION SUB-SCHEMA
export const getPersonalInfoSchema = (t: TTypeFunction<'Validation'>) => {
  return z.object({
    firstName: basicValidator({
      translationFunction: t,
      required: true,
      message: t('required'),
      minLength: 2,
      maxLength: 50,
    }),
    middleName: basicValidator({
      translationFunction: t,
      required: false,
      message: t('required'),
      minLength: 2,
      maxLength: 50,
    }),
    lastName: basicValidator({
      translationFunction: t,
      required: true,
      message: t('required'),
      minLength: 2,
      maxLength: 50,
    }),
    dobBs: z
      .string({
        required_error: t('required'),
        invalid_type_error: t('required'),
      })
      .min(1, { message: t('required') }),
    dobAd: z.string().optional(),
    gender: z.nativeEnum(Gender, {
      invalid_type_error: t('required'),
      message: t('required'),
      required_error: t('required'),
    }),
    casteType: z.nativeEnum(CasteType, {
      invalid_type_error: t('required'),
      message: t('required'),
      required_error: t('required'),
    }),
    phoneNumber: z.coerce
      .string()
      .trim()
      .min(13, {
        message: t('phone'),
      })
      .max(14, {
        message: t('phone'),
      })
      .refine(() => isValidPhoneNumber, {
        message: t('phone'),
      }),
    citizenshipNumber: basicValidator({
      translationFunction: t,
      required: false,
      minLength: 1,
      maxLength: 20,
    }),
    nationalId: basicValidator({
      translationFunction: t,
      required: false,
      minLength: 1,
      maxLength: 20,
    }),
    nationality: z.nativeEnum(Nationality, {
      invalid_type_error: t('required'),
      message: t('required'),
      required_error: t('required'),
    }),
    emergencyContact: z.coerce
      .string({
        required_error: t('required'),
        invalid_type_error: t('required'),
        message: t('required'),
      })
      .trim()
      .min(13, {
        message: t('phone'),
      })
      .max(14, {
        message: t('phone'),
      })
      .refine(() => isValidPhoneNumber, {
        message: t('phone'),
      }),
  });
};
//Todo change district municipality province to enum value
// ADDRESS INFORMATION SUB-SCHEMA
export const getAddressInfoSchema = (t: TTypeFunction<'Validation'>) => {
  return z.object({
    // Permanent Address
    districtId: z
      .string({
        required_error: t('required'),
        invalid_type_error: t('required'),
      })
      .min(1, { message: t('required') }),
    palityId: z
      .string({
        required_error: t('required'),
        invalid_type_error: t('required'),
      })
      .min(1, { message: t('required') }),
    wardNo: z.coerce
      .string({
        required_error: t('required'),
        invalid_type_error: t('Healthpost.wardNo'),
      })
      .trim()
      .min(1, { message: t('required') })
      .refine(
        (value) => {
          const wardNumber = parseInt(value, 10);
          return !isNaN(wardNumber) && wardNumber && wardNumber >= 1;
        },
        {
          message: t('Healthpost.wardNo'),
        },
      ),

    tole: basicValidator({
      translationFunction: t,
      required: true,
      message: t('required'),
      minLength: 1,
      maxLength: 100,
    }),

    // Temporary Address (Optional)
    tDistrictId: z.string().optional(),
    tPalityId: z.string().optional(),
    tWardNo: z.coerce
      .string()
      .trim()
      .refine(
        (value) => {
          if (!value) return true;
          const wardNumber = parseInt(value, 10);
          return !isNaN(wardNumber) && wardNumber && wardNumber >= 1;
        },
        {
          message: t('Healthpost.wardNo'),
        },
      ),
    tTole: basicValidator({
      translationFunction: t,
      required: false,
      message: t('required'),
      minLength: 1,
      maxLength: 100,
    }),
  });
};

// FAMILY INFORMATION SUB-SCHEMA
export const getFamilyInfoSchema = (t: TTypeFunction<'Validation'>) => {
  return z.object({
    fatherName: basicValidator({
      translationFunction: t,
      required: true,
      message: t('required'),
      minLength: 2,
      maxLength: 100,
    }).refine((value) => value?.includes(''), {
      message: t('fullName'),
    }),
    motherName: basicValidator({
      translationFunction: t,
      required: true,
      message: t('required'),
      minLength: 2,
      maxLength: 100,
    }).refine((value) => value?.includes(''), {
      message: t('fullName'),
    }),
    guardianName: basicValidator({
      translationFunction: t,
      required: false,
      message: t('required'),
      minLength: 2,
      maxLength: 100,
    }).refine((value) => value?.includes(''), {
      message: t('fullName'),
    }),
    spouseName: basicValidator({
      translationFunction: t,
      required: false,
      message: t('required'),
      minLength: 2,
      maxLength: 100,
    }).refine((value) => value?.includes(''), {
      message: t('fullName'),
    }),
    maritalStatus: z.nativeEnum(MarriageStatus, {
      invalid_type_error: t('required'),
      message: t('required'),
      required_error: t('required'),
    }),
  });
};

// HEALTH & ADDITIONAL INFO SUB-SCHEMA
export const getHealthInfoSchema = (t: TTypeFunction<'Validation'>) => {
  return z.object({
    bloodGroup: z.nativeEnum(BloodGroup, {
      invalid_type_error: t('required'),
      message: t('required'),
      required_error: t('required'),
    }),
    height: z.string().optional(),
    disabilityType: z
      .nativeEnum(DisabilityType, {
        invalid_type_error: t('required'),
      })
      .optional(),
    disabilityIdentityType: z
      .nativeEnum(DisabilityIdentityType, {
        invalid_type_error: t('required'),
      })
      .optional(),

    // Health Insurance
    nshiNumber: basicValidator({
      translationFunction: t,
      required: false,
      message: t('required'),
      minLength: 1,
      maxLength: 50,
    }),

    // Banking Information
    bank: z.string().optional(),
    bankBranch: z.string().optional(),
    bankAccountNumber: basicValidator({
      translationFunction: t,
      required: false,
      message: t('required'),
      minLength: 1,
      maxLength: 50,
    }),

    // Additional Health Info
    weight: z.string().optional(),
    isVaccineCompleted: z.boolean().optional(),
    isMinor: z.boolean().optional(),
    isEligibleForSgc: z.boolean().optional(),
  });
};

// SYSTEM INFORMATION SUB-SCHEMA
export const getSystemInfoSchema = (t: TTypeFunction<'Validation'>) => {
  return z.object({
    email: basicValidator({
      translationFunction: t,
      required: true,
      message: t('email'),
      minLength: 1,
      maxLength: 100,
      isEmail: true,
    }),
    status: z.nativeEnum(Status, {
      invalid_type_error: t('required'),
      message: t('required'),
      required_error: t('required'),
    }),
    role: z.literal(UserRole.PATIENT, {
      invalid_type_error: t('required'),
      message: t('required'),
      required_error: t('required'),
    }),
    accountType: z.literal(UserType.PATIENT, {
      invalid_type_error: t('required'),
      message: t('required'),
      required_error: t('required'),
    }),
    healthPostId: z.string({
      required_error: t('required'),
      invalid_type_error: t('required'),
    }),
    profileImage: createFileUploadValidator({
      required: false,
    }),
    //todo - Add authorization for lockReport
    lockReport: z.boolean().optional(),
  });
};

// MAIN CLIENT SCHEMA (COMBINES ALL SUB-SCHEMAS)
export const getClientSchema = (t: TTypeFunction<'Validation'>) => {
  return z.object({
    ...getPersonalInfoSchema(t).shape,
    ...getAddressInfoSchema(t).shape,
    ...getFamilyInfoSchema(t).shape,
    ...getHealthInfoSchema(t).shape,
    ...getSystemInfoSchema(t).shape,
  });
};

export type TPersonalInfoSchema = z.infer<
  ReturnType<typeof getPersonalInfoSchema>
>;
export type TAddressInfoSchema = z.infer<
  ReturnType<typeof getAddressInfoSchema>
>;
export type TFamilyInfoSchema = z.infer<ReturnType<typeof getFamilyInfoSchema>>;
export type THealthInfoSchema = z.infer<ReturnType<typeof getHealthInfoSchema>>;
export type TSystemInfoSchema = z.infer<ReturnType<typeof getSystemInfoSchema>>;

// Main client schema type
export type TClientSchema = z.infer<ReturnType<typeof getClientSchema>>;

export const getClientFormSteps = () // t: TTypeFunction<'Validation'>,
: {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  fields: (keyof TClientSchema)[];
}[] => [
  {
    id: 1,
    title: 'Personal Information',
    description: 'Basic personal details',
    icon: User,
    fields: [
      'firstName',
      'middleName',
      'lastName',
      'casteType',
      'gender',
      'dobBs',
      'dobAd',
      'phoneNumber',
      'email',
      'status',
      'role',
      'accountType',
      'healthPostId',
      'profileImage',
      'citizenshipNumber',
      'nationalId',
      'nationality',
      'emergencyContact',
    ],
  },
  {
    id: 2,
    title: 'Address Information',
    description: 'Permanent and temporary address',
    icon: MapPin,
    fields: [
      'districtId',
      'palityId',
      'wardNo',
      'tole',
      'tDistrictId',
      'tPalityId',
      'tWardNo',
      'tTole',
    ],
  },
  {
    id: 3,
    title: 'Family Information',
    description: 'Family and guardian details',
    icon: Users,
    fields: [
      'fatherName',
      'motherName',
      'guardianName',
      'maritalStatus',
      'spouseName',
    ],
  },
  {
    id: 4,
    title: 'Health & Banking',
    description: 'Health and financial information',
    icon: Heart,
    fields: [
      'bloodGroup',
      'height',
      'weight',
      'disabilityType',
      'disabilityIdentityType',
      'isEligibleForSgc',
      'isVaccineCompleted',
      'isMinor',
      // 'nshiNumber',
      // 'bankId',
      // 'bankBranchId',
      // 'bankAccountNumber',
    ],
  },
];
