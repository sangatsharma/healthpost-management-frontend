import { TAny, TEnumKeys, TTypeFunction } from '@/types/global';
import { TFullname, TUser } from '@/types/user.types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// This function maps an enum to an array of objects with label and value properties
export function mapEnumToOptions<T extends Record<string, string>>(
  enumObj: T,
  t: TTypeFunction<'Enums'>,
  translationKeyPrefix: TEnumKeys,
): { label: string; value: string }[] {
  return Object.entries(enumObj).map(([key, value]) => ({
    label: t(`${translationKeyPrefix}.${key}` as Parameters<typeof t>[0]),
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
    if (!value) {
      formData.append(key, 'null');
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
    } else if (value === undefined) {
      formData.append(key, 'null');
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

export const cleanNepaliDate = (date?: string): string => {
  if (!date) return '';
  return date.split('T')[0];
};
export function replaceWithNepali(text: string) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/\bmorning\b/gi, 'बिहान')
    .replace(/\bafternoon\b/gi, 'दिउसो')
    .replace(/\bnight\b/gi, 'बेलुका')
    .replace(/\bevening\b/gi, 'साँझ');
}

export function getRequestingParty(url: string): 'OPD' | 'CLIENTS' {
  const value = url.split('||')[0];
  const isOpd = value.toLowerCase().includes('opd');
  return isOpd ? 'OPD' : 'CLIENTS';
}

export async function serializeFormData(
  formData: FormData,
): Promise<Record<string, TAny>> {
  const result: Record<string, TAny> = {};

  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      // Read file as base64 or binary string
      const base64 = await fileToBase64(value);
      result[key] = {
        name: value.name,
        type: value.type,
        size: value.size,
        base64, // you can reconstruct the File from this later
      };
    } else {
      result[key] = value;
    }
  }

  return result;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file); // You can also use readAsArrayBuffer
  });
}
export function base64ToFile(base64: string, name: string, type: string): File {
  const byteString = atob(base64.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new File([ab], name, { type });
}
