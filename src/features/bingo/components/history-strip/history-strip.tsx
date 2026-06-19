import { useTranslations } from 'next-intl';

interface Props {
  drawn: number[];
  limit?: number;
}

export function HistoryStrip({ drawn, limit = 7 }: Props) {
  const t = useTranslations('common');
  const recent = drawn.slice(-limit).reverse();

  if (recent.length === 0) {
    return (
      <div className="hist-strip">
        <span className="text-muted text-[13.5px]">{t('waitingForFirstBall')}</span>
      </div>
    );
  }

  return (
    <div className="hist-strip">
      {recent.map((n, i) => (
        <div
          key={n}
          className={`hist-chip${i === 0 ? ' hist-chip--latest' : ''}`}
        >
          <span className="tnum">{n}</span>
        </div>
      ))}
    </div>
  );
}
