import { ReactNode } from 'react';
import './globals.css';
import { Poppins } from 'next/font/google';
import { useLocale } from 'next-intl';
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

export default function RootLayout({ children }: { children: ReactNode }) {
  const locale = useLocale();
  return (
    <html lang={locale || 'en'} className={poppins.variable}>
      <body className="bg-background text-foreground font-poppins scrollbar-thin-custom antialiased transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
