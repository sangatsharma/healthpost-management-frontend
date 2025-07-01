import { basicValidator, createFileUploadValidator } from '@/lib/validators';
import { TTypeFunction } from '@/types/global';
import { Status } from '@/types/user.types';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { z } from 'zod';

export const getHealthPostSchema = (t: TTypeFunction<'Validation'>) => {
  return z.object({
    name: basicValidator({
      translationFunction: t,
      required: true,
      message: t('Healthpost.name'),
      minLength: 4,
      maxLength: 200,
    }),
    location: basicValidator({
      translationFunction: t,
      required: true,
      message: t('Healthpost.location'),
      minLength: 4,
      maxLength: 100,
    }),

    email: basicValidator({
      translationFunction: t,
      required: true,
      message: t('Healthpost.email'),
      minLength: 1,
      maxLength: 100,
      isEmail: true,
    }),
    phone: z.coerce
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
          return !isNaN(wardNumber) && wardNumber >= 1 && wardNumber;
        },
        {
          message: t('Healthpost.wardNo'),
        },
      ),

    municipality: basicValidator({
      translationFunction: t,
      required: true,
      message: t('Healthpost.municipality'),
      minLength: 1,
      maxLength: 200,
    }),
    status: z.nativeEnum(Status, {
      required_error: t('status'),
      invalid_type_error: t('status'),
    }),
    images: createFileUploadValidator({
      required: false,
      message: t('required'),
    }),
  });
};

export type THealthPostSchema = z.infer<ReturnType<typeof getHealthPostSchema>>;
