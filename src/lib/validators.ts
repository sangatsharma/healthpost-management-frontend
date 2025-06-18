import { TTypeFunction } from '@/types/global';
import { z, ZodEffects, ZodString } from 'zod';

export const basicValidator = ({
  translationFunction,
  required = true,
  message,
  minLength = 1,
  maxLength = 1000,
  useReqMsg = false,
  isEmail = false,
}: {
  translationFunction: TTypeFunction<'Validation'>;
  required: boolean;
  message?: string;
  minLength: number;
  maxLength: number;
  useReqMsg?: boolean;
  isEmail?: boolean;
}):
  | z.ZodString
  | z.ZodOptional<z.ZodString>
  | ZodEffects<ZodString, string, string> => {
  let schema = z
    .string({ required_error: translationFunction('required') })
    .trim()
    .max(maxLength, {
      message: useReqMsg
        ? message
        : translationFunction('maxLength', { max: 4 }),
    });
  if (isEmail) {
    schema = schema.email({
      message: translationFunction('email'),
    });
  }

  // Handle optional or required
  if (!required) {
    return schema.max(maxLength).optional();
  } else {
    schema = schema.min(minLength, {
      message: useReqMsg
        ? message
        : translationFunction('minLength', { min: 4 }),
    }); // Handle required field
  }

  return schema;
};
