import { TTypeFunction } from '@/types/global';
import { EnumLike, z, ZodEffects, ZodString } from 'zod';

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
        : translationFunction('minLength', { min: minLength }),
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

type EnumValidatorOptions = {
  translationfunction: TTypeFunction<'Validation'>;
  required?: boolean; // default true
  required_error?: string;
  invalid_type_error?: string;
  min_selection?: number; // minimum array length (if array: true)
  max_selection?: number; // maximum array length (if array: true)
  min_selection_error?: string;
  max_selection_error?: string;
};

export function enumValidator<T extends EnumLike>(
  enumType: T,

  options: EnumValidatorOptions,
) {
  const {
    translationfunction,
    required = true,
    required_error = translationfunction('required'),
    invalid_type_error = translationfunction('required'),
    min_selection,
    max_selection,
    min_selection_error = translationfunction('minSelection', {
      min: min_selection || 1,
    }),
    max_selection_error = translationfunction('maxSelection', {
      max: max_selection || 100,
    }),
  } = options;

  // Base enum validator
  const baseEnum = z.nativeEnum(enumType, {
    required_error,
    invalid_type_error,
    message: invalid_type_error,
  });

  // Handle array case
  if (min_selection !== undefined && min_selection > 1) {
    let arrayValidator = z.array(baseEnum, {
      required_error,
      invalid_type_error,
    });

    // Apply min selection
    if (min_selection !== undefined) {
      arrayValidator = arrayValidator.min(min_selection, min_selection_error);
    }

    // Apply max selection
    if (max_selection !== undefined) {
      arrayValidator = arrayValidator.max(max_selection, max_selection_error);
    }

    return required ? arrayValidator : arrayValidator.optional();
  }

  // Handle single value case
  return required ? baseEnum : baseEnum.optional();
}
