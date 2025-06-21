import { hasLocale, NextIntlClientProvider } from 'next-intl';

import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

import { ClientWrapper } from '@/components/ClientWrapper';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={await import(`../../../messages/${locale}.json`).then(
        (m) => m.default,
      )}
    >
      <ClientWrapper>{children}</ClientWrapper>
    </NextIntlClientProvider>
  );
}
