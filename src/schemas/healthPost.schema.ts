import { basicValidator } from '@/lib/validators';
import { TTypeFunction } from '@/types/global';
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
    adminId: z
      .string({
        required_error: t('required'),
        invalid_type_error: t('required'),
      })
      .uuid(),
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
        message: t('Healthpost.phone'),
      })
      .max(14, {
        message: t('Healthpost.phone'),
      })
      .refine(() => isValidPhoneNumber, {
        message: t('Healthpost.phone'),
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
    status: z.enum(['ACTIVE', 'INACTIVE'], {
      required_error: t('Healthpost.status'),
      invalid_type_error: t('Healthpost.status'),
    }),
    createdAt: z.string().optional(),
    id: z.string().uuid().optional(),
  });
};

export type THealthPostSchema = z.infer<ReturnType<typeof getHealthPostSchema>>;
