import { TAny } from '@/types/global';
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
    label: key.replace('_', ' ') as string,
    value: value.toString() as string,
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
