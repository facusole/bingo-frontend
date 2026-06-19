'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/common/ui/button/button';
import { Icon } from '@/common/ui/icon/icon';
import { useRouter } from '@/i18n/navigation';

interface Props {
  variant?: 'closed' | 'not_found';
}

export function ClosedScreen({ variant = 'closed' }: Props) {
  const t = useTranslations('closed');
  const router = useRouter();

  return (
    <div className="mx-auto w-full max-w-sm text-center">
      <div className="surface p-10">
        <div
          className="mx-auto mb-5 grid h-15 w-15 place-items-center rounded-2xl"
          style={{
            width: 60,
            height: 60,
            background: 'var(--daub-tint)',
          }}
        >
          <Icon color="var(--daub-deep)" name="close" size={26} />
        </div>
        <h2 className="font-display text-2xl font-bold tracking-tight">{t('title')}</h2>
        <p className="text-muted mt-3 text-[15px] leading-relaxed">
          {variant === 'not_found' ? t('bodyNotFound') : t('body')}
        </p>
        <div className="mt-6">
          <Button block icon="arrowRight" size="lg" onClick={() => router.push('/')}>
            {t('backHome')}
          </Button>
        </div>
      </div>
    </div>
  );
}
