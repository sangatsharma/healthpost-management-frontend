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

interface FileUploadValidatorProps {
  required?: boolean;
  message?: string;
}

type FileArray = z.ZodArray<z.ZodUnion<[z.ZodType<File>, z.ZodString]>, 'many'>;

type FileUploadValidator = FileArray | z.ZodOptional<FileArray>;

export const createFileUploadValidator = ({
  required = false,
  message = 'Required',
}: FileUploadValidatorProps = {}): FileUploadValidator => {
  const baseItemValidator = z.union([
    z.instanceof(File, { message }),
    z.string(),
  ]);

  const arrayValidator = z.array(baseItemValidator);

  return required
    ? arrayValidator.min(1, 'At least one file is required')
    : arrayValidator.optional();
};
