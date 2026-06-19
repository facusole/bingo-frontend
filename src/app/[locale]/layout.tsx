import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { Toaster } from 'sonner';

import { fontDisplay, fontNum, fontUi } from '@/styles/foundations/fonts';
import { DEFAULT_PALETTE, PALETTE_COOKIE, isPalette } from '@/common/utils/palettes';
import { routing } from '@/i18n/routing';

export const metadata: Metadata = {
  title: 'Bingo 90',
  description: 'Real-time multiplayer 90-ball bingo. No accounts, just a code.',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface Props {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const cookieStore = await cookies();
  const storedPalette = cookieStore.get(PALETTE_COOKIE)?.value;
  const palette = isPalette(storedPalette) ? storedPalette : DEFAULT_PALETTE;

  const messages = await getMessages();

  return (
    <html
      className={`${fontDisplay.variable} ${fontUi.variable} ${fontNum.variable}`}
      data-palette={palette}
      lang={locale}
    >
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
          <Toaster richColors position="top-center" />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
