import { hasLocale, NextIntlClientProvider } from 'next-intl';

import { ErrorBoundary } from '@/components/ErrorBoundry';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/provider/AuthProvider';
import { QueryProvider } from '@/provider/QueryClientProvider';
import { ThemeProvider } from '@/provider/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { GlobalAlertDialog } from '@/components/reusables/GlobalAlertDialog';
import HealthPostSidebar from '@/components/sidebar/sidebar';

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
      <ErrorBoundary>
        <QueryProvider>
          <ThemeProvider>
            <TooltipProvider>
              <Toaster
                richColors
                toastOptions={{
                  classNames: {
                    content: 'text-[16px]',
                  },
                }}
              />
              <AuthProvider>
                <div className="flex min-h-screen justify-start gap-4">
                  <GlobalAlertDialog />
                  <HealthPostSidebar />
                  <div className="w-full">{children}</div>
                </div>
              </AuthProvider>
            </TooltipProvider>
          </ThemeProvider>
        </QueryProvider>
      </ErrorBoundary>
    </NextIntlClientProvider>
  );
}
