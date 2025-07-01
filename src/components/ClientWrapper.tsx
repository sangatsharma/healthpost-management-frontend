'use client';

import { QueryProvider } from '@/provider/QueryClientProvider';
import { ErrorBoundary } from './ErrorBoundry';
import { ThemeProvider } from '@/provider/ThemeProvider';
import { TooltipProvider } from './ui/tooltip';
import { Toaster } from './ui/sonner';
import { AuthProvider } from '@/provider/AuthProvider';
import { GlobalAlertDialog } from './reusables/GlobalAlertDialog';
import HealthPostSidebar from './sidebar/sidebar';
import { Noto_Sans_Devanagari } from 'next/font/google';
import { cn } from '@/lib/utils';
export const devnagari = Noto_Sans_Devanagari({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-devnagari',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});
export function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
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
              <div
                className={cn(
                  'flex min-h-screen justify-start gap-4',
                  devnagari.variable,
                )}
              >
                <GlobalAlertDialog />
                <HealthPostSidebar />
                <div className="h-screen w-full overflow-scroll">
                  {children}
                </div>
              </div>
            </AuthProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}
