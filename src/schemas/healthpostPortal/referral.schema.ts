import { TTypeFunction } from '@/types/global';
import { z } from 'zod';

export const getReferalSchema = (t: TTypeFunction<'Validation'>) =>
  z.object({
    staffId: z.string().min(1, t('required')),
    healthPostId: z.string().min(1, t('required')),
    referredHealthPostId: z.string().min(1, t('required')),
    patientId: z.string().min(1, t('required')),
    opdId: z.string().min(1, t('required')),
    referralReason: z.string().optional(),
  });

export type TReferalSchema = z.infer<ReturnType<typeof getReferalSchema>>;
