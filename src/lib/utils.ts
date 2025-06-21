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
