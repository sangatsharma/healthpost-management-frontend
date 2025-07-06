import { TAny } from '@/types/global';
import { TFullname, TUser } from '@/types/user.types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// This function maps an enum to an array of objects with label and value properties
export function mapEnumToOptions<T extends Record<string, string | number>>(
  enumObj: T,
): { label: string; value: string }[] {
  const enumValues = Object.entries(enumObj).filter(
    ([, value]) => typeof value === 'string' || typeof value === 'number',
  );

  return enumValues.map(([key, value]) => ({
    label: key
      .toLowerCase()
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    value: value.toString(),
  }));
}

export const convertToFormData = (
  data: Record<string, TAny>,
  imgKey?: string[],
  dirtyFields?: object,
): FormData => {
  const formData = new FormData();

  for (const [key, value] of Object.entries(data)) {
    // Skip if field is not dirty
    if (
      dirtyFields &&
      Object.keys(dirtyFields).length > 0 &&
      !dirtyFields[key as keyof typeof dirtyFields]
    ) {
      continue;
    }

    const isImageKey = imgKey?.includes(key);

    if (isImageKey) {
      // Expecting array of File or string (URL)
      if (Array.isArray(value)) {
        const validValues = value.filter(
          (val) => val !== null && val !== 'null' && val !== '',
        );

        if (validValues.length === 0) {
          formData.append(key, 'null');
        } else {
          for (const item of validValues) {
            if (item instanceof File) {
              formData.append(key, item);
            } else if (typeof item === 'string') {
              formData.append(key, item); // probably a link
            }
          }
        }
      } else {
        // Fallback for non-array: treat as null
        formData.append(key, 'null');
      }

      continue;
    }

    // Handle other types
    if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else if (value instanceof FileList) {
      Array.from(value).forEach((file) => formData.append(key, file));
    } else if (value instanceof Date) {
      formData.append(key, value.toISOString());
    } else if (typeof value === 'object' && value !== null) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value != null ? String(value) : '');
    }
  }

  return formData;
};

export interface RenderFullNameProps {
  userData?: Partial<TUser> | null;
  params?: Partial<TFullname>;
}

export const renderFullName = ({
  userData = null,
  params,
}: RenderFullNameProps): string => {
  if (!userData && !params) {
    return '';
  }
  // Fallback to `userData` if `params` is not provided.
  if (userData) {
    const { fullName } = userData;
    if (!fullName) {
      return '';
    }
    const fulljoinName = [
      fullName.firstName,
      fullName.middleName,
      fullName.lastName,
    ]
      .filter(Boolean)
      .join(' ');

    return fulljoinName || '';
  }

  // Use `params` if provided, overriding `userData`.
  if (params) {
    const { firstName = '', middleName = '', lastName = '' } = params;
    const fullName = [firstName, middleName, lastName]
      .filter(Boolean)
      .join(' ');

    return fullName || '';
  }

  // Default to an empty string (should never reach here due to earlier checks).
  return '';
};
