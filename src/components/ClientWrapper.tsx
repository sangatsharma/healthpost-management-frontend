'use client';

import { QueryProvider } from '@/provider/QueryClientProvider';
import { ErrorBoundary } from './ErrorBoundry';
import { ThemeProvider } from '@/provider/ThemeProvider';
import { TooltipProvider } from './ui/tooltip';
import { Toaster } from './ui/sonner';
import { AuthProvider } from '@/provider/AuthProvider';
import { GlobalAlertDialog } from './reusables/GlobalAlertDialog';
import HealthPostSidebar from './sidebar/sidebar';

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
  );
}
