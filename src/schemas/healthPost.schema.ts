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
      .number({
        required_error: t('required'),
        invalid_type_error: t('Healthpost.wardNo'),
      })
      .int()
      .min(1, { message: t('required') }),

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
      required: true,
      message: t('required'),
    }),
    createdAt: z.string().optional(),
    id: z.string().uuid().optional(),
  });
};

export type THealthPostSchema = z.infer<ReturnType<typeof getHealthPostSchema>>;
