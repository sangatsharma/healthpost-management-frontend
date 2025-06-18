import { TFunc } from '@/types/global';
import { z } from 'zod';

export const getLoginSchema = (t: TFunc<'Validation'>) =>
  z
    .object({
      accountType: z.enum(['PATIENT', 'HP', 'ADMIN']),
      step: z.enum(['email', 'otp']),
      email: z
        .string({ required_error: t('required') })
        .trim()
        .email({
          message: t('email'),
        }),
      otp: z
        .string()
        .trim()
        .max(6, {
          message: t('otp'),
        }),
      // .optional(),
    })
    .superRefine((data, ctx) => {
      if (data.step === 'otp' && (!data.otp || data.otp.length < 6)) {
        ctx.addIssue({
          path: ['otp'],
          code: z.ZodIssueCode.custom,
          message: t('otp'),
        });
      }
    });
export type TLoginSchema = z.infer<ReturnType<typeof getLoginSchema>>;
