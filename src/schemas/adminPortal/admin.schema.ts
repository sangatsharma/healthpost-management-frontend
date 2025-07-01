import { basicValidator, createFileUploadValidator } from '@/lib/validators';
import { TTypeFunction } from '@/types/global';
import { Gender, Status, UserRole, UserType } from '@/types/user.types';
import { Action, Permissions } from '@/zustand/permissions';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { z } from 'zod';

export const getStaffSchema = (t: TTypeFunction<'Validation'>) => {
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
    email: basicValidator({
      translationFunction: t,
      required: true,
      message: t('email'),
      minLength: 1,
      maxLength: 100,
      isEmail: true,
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
    status: z.nativeEnum(Status, {
      invalid_type_error: t('required'),
      message: t('required'),
      required_error: t('required'),
    }),
    role: z.nativeEnum(UserRole, {
      invalid_type_error: t('required'),
      message: t('required'),
      required_error: t('required'),
    }),
    gender: z.nativeEnum(Gender, {
      invalid_type_error: t('required'),
      message: t('required'),
      required_error: t('required'),
    }),
    accountType: z.nativeEnum(UserType, {
      invalid_type_error: t('required'),
      message: t('required'),
      required_error: t('required'),
    }),
    healthPostId: z
      .string({
        required_error: t('required'),
        invalid_type_error: t('required'),
      })
      .optional(),
    permissions: z
      .array(
        z.object({
          action: z.nativeEnum(Action),
          resource: z.nativeEnum(Permissions),
        }),
        {
          required_error: t('required'),
          invalid_type_error: t('required'),
        },
      )
      .min(1, {
        message: t('required'),
      }),
    profileImage: createFileUploadValidator({
      required: false,
    }),
  });
};

export type TStaffSchema = z.infer<ReturnType<typeof getStaffSchema>>;
