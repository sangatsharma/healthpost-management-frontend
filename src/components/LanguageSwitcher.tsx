'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LanguageSwitcher() {
  const router = useRouter();
  const [locale, setLocale] = useState('en');

  const switchLanguage = (lang: string) => {
    document.cookie = `NEXT_LOCALE=${lang}; path=/`;
    router.push(`/${lang}/${window.location.pathname.split(`/${locale}/`)[1]}`);
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
    <div>
      <select
        onChange={(e) => switchLanguage((e.target as HTMLSelectElement).value)}
        value={locale}
      >
        <option value="en">English</option>
        <option value="np">Nepali</option>
      </select>
    </div>
  );
}
