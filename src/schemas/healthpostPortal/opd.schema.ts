import { TreatementType, VisitType } from '@/constants/healthpost.constant';
import { basicValidator } from '@/lib/validators';
import { TTypeFunction } from '@/types/global';
import { z } from 'zod';

export const getOpdSchema = (t: TTypeFunction<'Validation'>) => {
  return z.object({
    visitedDate: z.string().min(1, t('required')),
    patientId: z
      .string({
        message: t('required'),
      })
      .trim()
      .min(1, t('required')),
    vitals: z
      .object({
        bp: z.string().optional(),
        pulse: z.string().optional(),
        temperature: z.string().optional(),
        respiration: z.string().optional(),
        weight: z.string().optional(),
        height: z.string().optional(),
        mucus: z.string().optional(),
      })
      .optional(),
    complaints: basicValidator({
      translationFunction: t,
      required: true,
      minLength: 1,
      maxLength: 1000,
    }),
    diagnosis: basicValidator({
      translationFunction: t,
      required: true,
      minLength: 1,
      maxLength: 1000,
    }),
    observedExamination: basicValidator({
      translationFunction: t,
      required: true,
      minLength: 1,
      maxLength: 1000,
    }),
    treatment: basicValidator({
      translationFunction: t,
      required: true,
      minLength: 1,
      maxLength: 1000,
    }),
    medicines: z
      .array(
        z.object({
          value: z.string().optional(),
          label: z.string().optional(),
          id: z.string().optional(),
        }),
        {
          message: t('required'),
          required_error: t('required'),
        },
      )
      .optional(),
    prescribtions: z
      .array(
        z.object({
          name: z.string({
            message: t('required'),
            required_error: t('required'),
          }),
          id: z.string({
            message: t('required'),
            required_error: t('required'),
          }),
          duration: z
            .string({
              message: t('required'),
              required_error: t('required'),
            })
            .trim(),
          frequency: z
            .string({
              message: t('required'),
              required_error: t('required'),
            })
            .trim(),
          intakeTime: z
            .string({
              message: t('required'),
              required_error: t('required'),
            })
            .trim(),
          quantity: z
            .string({
              message: t('required'),
              required_error: t('required'),
            })
            .trim(),
          intakeRoute: z.string({
            message: t('required'),
            required_error: t('required'),
          }),
          timing: z.enum(['BEFORE_FOOD', 'AFTER_FOOD', 'ANY_TIME'], {
            message: t('required'),
            required_error: t('required'),
          }),
          dosage: z
            .string({
              message: t('required'),
              required_error: t('required'),
            })
            .trim(),
        }),
      )
      .optional(),
    examinier: z.string({
      message: t('required'),
      required_error: t('required'),
    }),
    healthPostId: z.string({
      message: t('required'),
    }),
    followUpRequired: z.boolean().optional(),
    followUpDate: z.string().optional(),
    isGenderViolence: z.boolean().optional(),
    isPregnant: z.boolean().optional(),
    treatementType: z.nativeEnum(TreatementType, {
      message: t('required'),
    }),
    visitType: z.nativeEnum(VisitType, {
      message: t('required'),
    }),
  });
};

export type TOpdSchema = z.infer<ReturnType<typeof getOpdSchema>>;
