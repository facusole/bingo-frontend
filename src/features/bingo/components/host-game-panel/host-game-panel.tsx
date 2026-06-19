'use client';

import { useTranslations } from 'next-intl';

import { Panel } from '@/common/ui/panel/panel';
import { HostMeter } from '@/features/bingo/components/host-meter/host-meter';
import type { PlayerInfo } from '@/features/bingo/components/player-list/player-list';
import { PrizeDisplay } from '@/features/bingo/components/prize-display/prize-display';
import type { PlayerProgress, Prize } from '@/features/bingo/utils/protocol';

interface Props {
  linePrize: Prize;
  bingoPrize: Prize;
  drawn: number[];
  players: PlayerInfo[];
  progress: PlayerProgress[];
}

const TOTAL_BALLS = 90;

/** Middle-column view shown to the admin during the active game in place of
 *  the bingo card. Bundles the (read-only) prize panel, live stats, and the
 *  tension meter. */
export function HostGamePanel({
  linePrize,
  bingoPrize,
  drawn,
  players,
  progress,
}: Props) {
  const t = useTranslations('hostPanel');
  const playerCount = players.filter((p) => !p.isAdmin).length;
  const drawnCount = drawn.length;
  const remaining = TOTAL_BALLS - drawnCount;

  return (
    <div className="flex flex-col gap-4">
      <PrizeDisplay bingoPrize={bingoPrize} linePrize={linePrize} />
      <Panel icon="grid" title={t('statsTitle')}>
        <dl className="grid grid-cols-3 gap-3 text-center">
          <Stat label={t('drawn')} value={`${drawnCount}/${TOTAL_BALLS}`} />
          <Stat label={t('remaining')} value={`${remaining}`} />
          <Stat label={t('players')} value={`${playerCount}`} />
        </dl>
      </Panel>
      <HostMeter players={players} progress={progress} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center">
      <dt className="text-muted text-[11px] font-semibold uppercase tracking-wide">
        {label}
      </dt>
      <dd className="font-num text-ink tnum text-2xl font-bold">{value}</dd>
    </div>
  );
}
