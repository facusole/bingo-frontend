'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';

import { usePathname, useRouter } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';

export function LocaleSwitcher() {
  const t = useTranslations('locales');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function onChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const next = event.target.value as Locale;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <select
      aria-label="Language"
      className="font-num bg-surface text-ink border-line h-7 cursor-pointer rounded-md border px-2 text-xs font-semibold uppercase tracking-wider disabled:opacity-60"
      disabled={isPending}
      value={locale}
      onChange={onChange}
    >
      {routing.locales.map((l) => (
        <option key={l} value={l}>
          {t(l)}
        </option>
      ))}
    </select>
  );
}
