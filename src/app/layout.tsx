import { ReactNode } from 'react';
import './globals.css';
import { Poppins } from 'next/font/google';
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

export default function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={params?.locale || 'en'} className={poppins.variable}>
      <body className="bg-background text-foreground font-poppins antialiased">
        {children}
      </body>
    </html>
  );
}
