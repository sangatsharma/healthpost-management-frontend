import { ReactNode } from 'react';
import './globals.css';
import { Poppins } from 'next/font/google';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';
import { Metadata, Viewport } from 'next';
import { ThemeProvider } from 'next-themes';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
  fallback: ['Noto Sans Devanagari', 'system-ui', 'sans-serif'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | HealthPost Management System',
    default: 'HealthPost Management System',
  },
  description:
    'Comprehensive health post management system for offline and online healthcare management',
  keywords: [
    'healthcare management',
    'health post',
    'medical records',
    'patient management',
    'healthcare system',
    'offline healthcare',
    'medical administration',
    'health information system',
    'Nepal healthcare',
    'community health',
  ],
  authors: [{ name: 'HealthPost Management Team' }],
  creator: 'HealthPost Management Team',
  publisher: 'HealthPost Management System',
  category: 'Healthcare',
  classification: 'Medical Management System',
  metadataBase: new URL('https://healthpost-management.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en',
      'ne-NP': '/np',
    },
  },
  openGraph: {
    title: 'HealthPost Management System',
    description:
      'Comprehensive health post management system for offline and online healthcare management',
    url: 'https://healthpost-management.com',
    siteName: 'HealthPost Management System',
    images: [
      {
        url: '/images/hp.png',
        width: 1200,
        height: 630,
        alt: 'HealthPost Management System',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HealthPost Management System',
    description:
      'Comprehensive health post management system for offline and online healthcare management',
    images: ['/images/hp.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48 32x32 16x16', type: 'image/x-icon' },
      { url: '/images/hp.png', sizes: '192x192', type: 'image/png' },
      { url: '/images/hp.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/images/hp.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'HealthPost',
    startupImage: [
      {
        url: '/images/hp.png',
        media: '(device-width: 768px) and (device-height: 1024px)',
      },
    ],
  },
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },
  verification: {
    // Add your verification tokens here when available
    // google: 'google-site-verification-token',
    // yandex: 'yandex-verification-token',
    // yahoo: 'yahoo-site-verification-token',
  },
  other: {
    'application-name': 'HealthPost Management System',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'HealthPost',
    'theme-color': '#2563eb',
    'msapplication-TileColor': '#2563eb',
    'msapplication-navbutton-color': '#2563eb',
    'msapplication-starturl': '/',
    'msapplication-TileImage': '/images/hp.png',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2563eb' },
    { media: '(prefers-color-scheme: dark)', color: '#1e40af' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  colorScheme: 'light dark',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const locale = useLocale();
  return (
    <html lang={locale || 'en'} className={cn(poppins.variable)}>
      <body
        className={cn(
          'bg-background text-foreground scrollbar-thin-custom antialiased transition-colors duration-300',
          poppins.className,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {' '}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
