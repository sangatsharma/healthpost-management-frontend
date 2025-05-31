import './globals.css';
import { Poppins } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';

import { ErrorBoundary } from '@/components/ErrorBoundry';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/provider/AuthProvider';
import { QueryProvider } from '@/provider/QueryClientProvider';
import { ThemeProvider } from '@/provider/ThemeProvider';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;

  return (
    <html lang={locale || 'en'} className={poppins.variable}>
      <body className="bg-background text-foreground font-poppins antialiased">
        <ErrorBoundary>
          <ThemeProvider>
            <QueryProvider>
              <NextIntlClientProvider>
                <TooltipProvider>
                  <AuthProvider>{children}</AuthProvider>
                </TooltipProvider>
              </NextIntlClientProvider>
            </QueryProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
