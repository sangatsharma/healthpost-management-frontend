'use client';
import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { usePathname, useRouter } from 'next/navigation';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [locale, setLocale] = useState('en');

  const switchLanguage = (lang: string) => {
    document.cookie = `NEXT_LOCALE=${lang}; path=/`;
    router.replace(`/${lang}/${pathname.split(`/${locale}/`)[1]}`);
    setLocale(lang);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const match = document.cookie.match(/NEXT_LOCALE=(\w+)/);
      const detectedLocale = match ? match[1] : 'en';
      setLocale(detectedLocale);
      document.documentElement.lang = detectedLocale;
    }
  }, []);

  return (
    <div className="w-full">
      <Select
        value={locale}
        onValueChange={(value) => {
          switchLanguage(value);
        }}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="w-full">
          <SelectItem key={'en'} value="en" disabled={locale === 'en'}>
            English{' '}
          </SelectItem>
          <SelectItem key={'np'} value="np" disabled={locale === 'np'}>
            नेपाली
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
