'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Drawer } from '@/common/ui/drawer/drawer';
import { Icon } from '@/common/ui/icon/icon';
import { LocaleSwitcher } from '@/common/ui/locale-switcher/locale-switcher';
import { PaletteSwitcher } from '@/common/ui/palette-switcher/palette-switcher';
import { Link } from '@/i18n/navigation';

interface Props {
  roomCode?: string;
  live?: boolean;
}

export function TopBar({ roomCode, live }: Props) {
  const t = useTranslations('common');
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="mx-auto flex w-full max-w-[1180px] items-center justify-between px-1 py-4">
        <Link aria-label={t('brand')} className="brand-mark text-lg" href="/">
          <span className="brand-dot">90</span>
          <span>{t('brand')}</span>
        </Link>

        <div className="flex items-center gap-3">
          {live ? <span aria-label={t('live')} className="pulse-live" /> : null}
          {roomCode ? (
            <span className="font-num bg-surface text-ink border-line rounded-lg border px-3 py-1.5 text-[13px] font-semibold tracking-[0.12em]">
              {roomCode}
            </span>
          ) : null}

          {/* Desktop: inline switchers */}
          <div className="hidden items-center gap-3 lg:flex">
            <PaletteSwitcher />
            <LocaleSwitcher />
          </div>

          {/* Mobile: hamburger trigger */}
          <button
            aria-controls="top-bar-menu"
            aria-expanded={menuOpen}
            aria-label={t('menu')}
            className="border-line hover:bg-paper grid h-9 w-9 cursor-pointer place-items-center rounded-full border transition-colors lg:hidden"
            type="button"
            onClick={() => setMenuOpen(true)}
          >
            <Icon color="var(--ink)" name="menu" size={18} />
          </button>
        </div>
      </header>

      <Drawer
        open={menuOpen}
        side="top"
        title={t('menu')}
        onClose={() => setMenuOpen(false)}
      >
        <div className="flex flex-col gap-5 pb-2">
          <section className="flex flex-col gap-2">
            <span className="eyebrow">{t('theme')}</span>
            <PaletteSwitcher />
          </section>
          <section className="flex flex-col gap-2">
            <span className="eyebrow">{t('language')}</span>
            <LocaleSwitcher />
          </section>
        </div>
      </Drawer>
    </>
  );
}
