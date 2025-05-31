'use client';
import { TLocale } from '@/types/global';
import { TUserType } from '@/types/user.types';
import { usePathname } from 'next/navigation';

export const useGetPathInfo = (): {
  portal: TUserType;
  locale: TLocale;
  pathname: string;
} => {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as TLocale;
  if (pathname.startsWith(`/${locale}/hp`)) {
    return { portal: 'hp', locale: locale, pathname };
  } else if (pathname.startsWith(`/${locale}/patient`)) {
    return { portal: 'patient', locale: locale, pathname };
  } else {
    return { portal: 'admin', locale: locale, pathname };
  }
};
