'use client';

import { QueryProvider } from '@/provider/QueryClientProvider';
import { ErrorBoundary } from './ErrorBoundry';
import { TooltipProvider } from './ui/tooltip';
import { Toaster } from './ui/sonner';
import { AuthProvider } from '@/provider/AuthProvider';
import { GlobalAlertDialog } from './reusables/GlobalAlertDialog';
import HealthPostSidebar from './sidebar/sidebar';
import { Noto_Sans_Devanagari } from 'next/font/google';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { useUserStore } from '@/zustand/useUserStore';
import { HealthPostProvider } from '@/provider/HealthPostProvider';

export const devnagari = Noto_Sans_Devanagari({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-devnagari',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});
export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useUserStore();

  // //TODO: Register service worker based on user accountType
  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator && user) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }, [JSON.stringify(user)]);

  return (
    <ErrorBoundary>
      <QueryProvider>
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
            <HealthPostProvider>
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
            </HealthPostProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}
