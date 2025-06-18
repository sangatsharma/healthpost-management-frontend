import { FileWarning } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export default function NotFoundPage() {
  const t = useTranslations('GeneralPages');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center rounded-2xl">
      <div className="flex w-full max-w-3xl flex-col items-center gap-4 rounded-lg p-4 text-center">
        <FileWarning size={64} className="text-yellow-500" />
        <h1 className="text-4xl font-bold">{t('NotFound.title')}</h1>
        <p className="text-2xl">{t('NotFound.description')}</p>
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
