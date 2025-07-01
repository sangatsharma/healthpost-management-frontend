import { ReactNode } from 'react';
import './globals.css';
import { Noto_Sans_Devanagari, Poppins } from 'next/font/google';
import { useLocale } from 'next-intl';
import { ThemeScript } from '@/components/ThemeScript';
import { cn } from '@/lib/utils';

export const devnagari = Noto_Sans_Devanagari({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-devnagari',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
  fallback: ['Noto Sans Devanagari', 'system-ui', 'sans-serif'],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  const locale = useLocale();
  return (
    <html
      lang={locale || 'en'}
      className={cn(poppins.variable, devnagari.variable)}
    >
      <head>
        <ThemeScript />
      </head>
      <body
        className={cn(
          'bg-background text-foreground scrollbar-thin-custom antialiased transition-colors duration-300',
          poppins.className,
        )}
      >
        {children}
      </body>
    </html>
  );
}
