import { Space_Grotesk } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from 'next-themes';
import { cn } from '@/lib/utils';
import { ThemeColorProvider } from '@/app/(shared)/providers/theme-context';
import { Navbar } from "@/app/(site)/components/layout/navbar";
import { Footer } from "@/app/(site)/components/layout/footer";
import { SidebarProvider } from '@/app/(site)/components/layout/sidebar-context';
import { locales } from '@/config/i18n';
import { getTranslations } from 'next-intl/server';
import { unstable_setRequestLocale } from 'next-intl/server';
import { getDictionary } from '@/get-dictionary';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: {
      template: '%s | Canopy Charts',
      default: 'Canopy Charts'
    },
    description: t('description'),
    icons: {
      icon: [
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
      ],
      shortcut: '/favicon.svg',
      apple: { url: '/favicon.png', sizes: '192x192', type: 'image/png' },
      other: [
        {
          rel: 'mask-icon',
          url: '/favicon.svg',
          color: '#22c55e'
        }
      ]
    },
  };
}

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const messages = await getDictionary(locale as any);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={cn(
        spaceGrotesk.variable,
        'min-h-screen bg-white text-foreground antialiased',
        'selection:bg-green-500/20 selection:text-green-900 dark:selection:text-green-100',
        'dark:bg-[#1B1B1B]'
      )}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ThemeColorProvider>
              <SidebarProvider>
                <div className="relative min-h-screen">
                  <Navbar />
                  {children}
                  <Footer />
                </div>
              </SidebarProvider>
            </ThemeColorProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
