'use client';

import { useLocale } from 'next-intl';

/**
 * Hook to format numbers according to the current locale.
 * Supports Nepali numerals and falls back to standard formatting.
 */

export const useLocalizedNumber = (options?: Intl.NumberFormatOptions) => {
  const locale = useLocale();
  const formatNumber = (value: number | bigint) => {
    const formatOptions: Intl.NumberFormatOptions = {
      numberingSystem: locale === 'np' ? 'deva' : undefined,
      ...options,
    };
    return new Intl.NumberFormat(locale, formatOptions).format(value);
  };
  return formatNumber;
};
