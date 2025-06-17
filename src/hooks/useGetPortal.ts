'use client';
import { TLocale } from '@/types/global';
import { TUserType } from '@/types/user.types';
import { usePathname } from 'next/navigation';

export const useGetPathInfo = (): {
  portal: TUserType | null;
  locale: TLocale;
  pathname: string;
} => {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as TLocale;
  if (pathname.startsWith(`/${locale}/hp`)) {
    return { portal: 'HP', locale: locale, pathname };
  } else if (pathname.startsWith(`/${locale}/patient`)) {
    return { portal: 'PATIENT', locale: locale, pathname };
  } else if (locale && pathname.startsWith(`/${locale}/admin`)) {
    return { portal: 'ADMIN', locale: locale, pathname };
  }
  return { portal: null, locale: locale, pathname };
};
