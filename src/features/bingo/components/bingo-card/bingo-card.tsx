import { useTranslations } from 'next-intl';

import { Icon } from '@/common/ui/icon/icon';

/**
 * BingoCard — the player's 3×9 card with auto-marked cells.
 *
 * Design contract:
 * - `card` is a 3×9 matrix. A `0` means "empty cell" per the backend; a
 *   positive integer is a number. This matches the backend's wire format.
 * - A cell is marked when its number is in `drawn`.
 * - When `lastNumber` matches a cell, it gets the "just marked" stamp
 *   animation (`.cell--just`). The daub itself is always the clean ring.
 */
interface Props {
  card: number[][];
  drawn: number[];
  lastNumber?: number | null;
  title?: string;
  ownerName?: string;
  /** Row indexes (0–2) to highlight with the winning-row pulse. Empty/omitted
   *  by default; the parent decides when the pulse should play (e.g. only
   *  during the line-celebration window, and only on the winner's own card). */
  winningRowIndexes?: readonly number[];
}

export function BingoCard({ card, drawn, lastNumber, title, ownerName, winningRowIndexes }: Props) {
  const t = useTranslations('game');
  const drawnSet = new Set(drawn);
  const flat = card.flat();
  const total = flat.filter((n) => n !== 0).length;
  const marked = flat.filter((n) => n !== 0 && drawnSet.has(n)).length;
  const label = title ?? t('yourCard');
  const winRows = winningRowIndexes ? new Set(winningRowIndexes) : null;

  return (
    <div className="bingocard">
      <div className="flex items-center justify-between px-1 pt-0.5 pb-3">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Icon color="var(--muted)" name="grid" size={16} />
          <span className="text-[14.5px] font-semibold">{label}</span>
          {ownerName ? <span className="text-muted text-[13px]">· {ownerName}</span> : null}
        </div>
        <span className="remaining-pill">
          <b className="tnum">{marked}</b>/<span className="tnum">{total}</span>
        </span>
      </div>
      <div aria-label={label} className="bingocard__grid" role="grid">
        {card.map((row, r) =>
          row.map((n, c) => {
            if (n === 0) {
              return <div key={`${r}-${c}`} aria-hidden="true" className="cell cell--empty" />;
            }
            const isMarked = drawnSet.has(n);
            const isJust = lastNumber === n && isMarked;
            const isWinRow = winRows?.has(r) ?? false;
            const cls = ['cell', 'cell--num'];

            if (isMarked) cls.push('cell--marked');
            if (isJust) cls.push('cell--just');
            if (isWinRow) cls.push('cell--win-row');

            return (
              <div
                key={`${r}-${c}`}
                aria-label={isMarked ? `${n}, marked` : `${n}`}
                className={cls.join(' ')}
                role="gridcell"
              >
                <span className="cell__n tnum">{n}</span>
                {isMarked ? (
                  <span className="cell__daub">
                    <span className="daub-ring" />
                  </span>
                ) : null}
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}
