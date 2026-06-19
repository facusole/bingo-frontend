import { useTranslations } from 'next-intl';

import { Panel } from '@/common/ui/panel/panel';
import type { Prize } from '@/features/bingo/utils/protocol';

interface Props {
  linePrize: Prize;
  bingoPrize: Prize;
  /** When `compact`, renders an inline header strip suitable for in-game placement.
   *  Default renders as a full Panel. */
  variant?: 'panel' | 'compact';
}

/** Read-only view of the current line/bingo prizes. */
export function PrizeDisplay({ linePrize, bingoPrize, variant = 'panel' }: Props) {
  const t = useTranslations('prizes');
  const noLine = !linePrize.enabled || linePrize.name.trim() === '';
  const noBingo = !bingoPrize.enabled || bingoPrize.name.trim() === '';
  if (noLine && noBingo) return null;

  if (variant === 'compact') {
    return (
      <div className="border-line bg-surface flex flex-wrap items-center justify-center gap-x-4 gap-y-1 rounded-full border px-3 py-1.5 text-[12.5px]">
        {!noLine ? (
          <span>
            <span className="text-muted font-semibold uppercase tracking-wide">
              {t('lineShort')}
            </span>{' '}
            <span className="text-ink font-semibold">{linePrize.name}</span>
          </span>
        ) : null}
        {!noBingo ? (
          <span>
            <span className="text-muted font-semibold uppercase tracking-wide">
              {t('bingoShort')}
            </span>{' '}
            <span className="text-ink font-semibold">{bingoPrize.name}</span>
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <Panel icon="crown" title={t('title')}>
      <ul className="flex flex-col gap-2">
        {!noLine ? (
          <PrizeRow label={t('lineLabel')} name={linePrize.name} />
        ) : null}
        {!noBingo ? (
          <PrizeRow label={t('bingoLabel')} name={bingoPrize.name} />
        ) : null}
      </ul>
    </Panel>
  );
}

function PrizeRow({ label, name }: { label: string; name: string }) {
  return (
    <li className="flex items-baseline justify-between gap-3">
      <span className="text-muted text-[12.5px] font-semibold uppercase tracking-wide">
        {label}
      </span>
      <span className="text-ink truncate text-[14.5px] font-semibold">{name}</span>
    </li>
  );
}
