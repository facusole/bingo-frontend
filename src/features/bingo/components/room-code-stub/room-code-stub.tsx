'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/common/ui/button/button';
import { Icon } from '@/common/ui/icon/icon';

interface Props {
  code: string;
}

export function RoomCodeStub({ code }: Props) {
  const t = useTranslations('lobby');
  const [copied, setCopied] = useState(false);

  function copy() {
    try {
      if (navigator.clipboard) {
        void navigator.clipboard.writeText(code);
      }
    } catch {
      // best-effort — older browsers / iframes may block clipboard
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="ticket">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Icon color="var(--muted)" name="link" size={13} />
            <span className="eyebrow">{t('eyebrow')}</span>
          </div>
          <div className="ticket__code tnum">{code}</div>
        </div>
        <Button
          icon={copied ? 'check' : 'copy'}
          size="sm"
          variant={copied ? 'primary' : 'ghost'}
          onClick={copy}
        >
          {copied ? t('copied') : t('copyCode')}
        </Button>
      </div>
    </div>
  );
}
