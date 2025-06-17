'use client';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { useTypedTranslations } from '@/hooks/useTypedTranslations';

export default function UnauthorizedPage() {
  const t = useTypedTranslations('GeneralPages');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center rounded-2xl">
      <div className="flex w-full max-w-2xl flex-col items-center gap-2 rounded-lg p-4 text-center">
        <AlertTriangle size={64} className="text-red-500" />
        <h1 className="text-4xl font-bold">{t('unauthorized.title')}</h1>
        <p className="text-2xl">{t('unauthorized.description')}</p>
      </div>
      <div className="flex gap-3">
        <Button variant="default" className="px-4 py-2 text-[18px]">
          <Link href="/">{t('NotFound.returnHome')}</Link>
        </Button>
        <Button variant="secondary" className="px-4 py-2 text-[18px]">
          <Link href="/contact">{t('NotFound.contactSupport')}</Link>
        </Button>
      </div>
    </div>
  );
}
