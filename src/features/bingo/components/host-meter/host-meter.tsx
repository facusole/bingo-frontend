'use client';

import { useTranslations } from 'next-intl';

import { Avatar } from '@/common/ui/avatar/avatar';
import { Panel } from '@/common/ui/panel/panel';
import type { PlayerInfo } from '@/features/bingo/components/player-list/player-list';
import type { PlayerProgress } from '@/features/bingo/utils/protocol';

interface Props {
  players: PlayerInfo[];
  progress: PlayerProgress[];
}

interface Row {
  player: PlayerInfo;
  toLine: number;
  toBingo: number;
}

/** Sort criterion: hottest player first.
 *  Primary: lower toLine (closer to line).
 *  Tie-breaker: lower toBingo (closer to bingo).
 *  Final: name, for stable order with identical numbers. */
function sortRows(a: Row, b: Row) {
  if (a.toLine !== b.toLine) return a.toLine - b.toLine;
  if (a.toBingo !== b.toBingo) return a.toBingo - b.toBingo;
  return a.player.name.localeCompare(b.player.name);
}

/** Admin-only tension meter: shows how close each player is to line / bingo,
 *  sorted by closeness. Hottest at top. Backend sends the numbers stable by
 *  id; we re-order here for UX. */
export function HostMeter({ players, progress }: Props) {
  const t = useTranslations('hostMeter');
  const byId = new Map(players.map((p) => [p.id, p]));
  const rows: Row[] = progress
    .map((pr) => {
      const player = byId.get(pr.playerId);
      if (!player) return null;
      return { player, toLine: pr.toLine, toBingo: pr.toBingo };
    })
    .filter((r): r is Row => r !== null)
    .sort(sortRows);

  return (
    <Panel icon="megaphone" title={t('title')}>
      {rows.length === 0 ? (
        <p className="text-muted text-center text-[13px]">{t('empty')}</p>
      ) : (
        <ul className="flex flex-col">
          {rows.map(({ player, toLine, toBingo }) => {
            const hotLine = toLine <= 1;
            const hotBingo = toBingo <= 1;
            return (
              <li
                key={player.id}
                className="border-line-soft flex items-center gap-3 border-b py-2 last:border-b-0"
                data-hot={hotLine || hotBingo ? 'true' : 'false'}
              >
                <Avatar name={player.name} />
                <span className="text-ink min-w-0 flex-1 truncate text-[14px] font-semibold">
                  {player.name}
                </span>
                <div className="tnum flex items-baseline gap-3 text-[12.5px] font-semibold">
                  <span
                    className={
                      hotLine ? 'text-[var(--daub-deep)]' : 'text-muted'
                    }
                  >
                    {t('toLine', { n: toLine })}
                  </span>
                  <span
                    className={
                      hotBingo ? 'text-[var(--daub-deep)]' : 'text-muted'
                    }
                  >
                    {t('toBingo', { n: toBingo })}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}
