import { useTranslations } from 'next-intl';

import { Icon } from '@/common/ui/icon/icon';

/**
 * BingoCard — the player's 3×9 card.
 *
 * In interactive mode (onToggleMark provided) cells behave as buttons:
 * - Numbers already drawn but not yet marked by the player get a subtle
 *   "unmark" indicator so the player notices they can click.
 * - Clicking a drawn cell toggles it in/out of `marked`.
 * - Numbers not yet drawn are disabled.
 *
 * In non-interactive mode (no onToggleMark) cells render as static divs with
 * automatic daubs for every drawn number — the legacy display.
 */
interface Props {
  card: number[][];
  drawn: number[];
  lastNumber?: number | null;
  title?: string;
  ownerName?: string;
  /** Row indexes (0–2) to highlight with the winning-row pulse. */
  winningRowIndexes?: readonly number[];
  /** Numbers the player has manually marked. When provided, interactive mode. */
  marked?: Set<number>;
  /** Called when the player clicks a drawn cell (interactive mode only). */
  onToggleMark?: (n: number) => void;
  /** Whether the game is currently active (controls interactivity). */
  gameActive?: boolean;
}

export function BingoCard({
  card,
  drawn,
  lastNumber,
  title,
  ownerName,
  winningRowIndexes,
  marked,
  onToggleMark,
  gameActive,
}: Props) {
  const t = useTranslations('game');
  const drawnSet = new Set(drawn);
  const interactive = !!onToggleMark && gameActive;
  const flat = card.flat();
  const total = flat.filter((n) => n !== 0).length;
  // Pill shows user-marked count in interactive mode, drawn count otherwise.
  const markedCount = interactive && marked
    ? flat.filter((n) => n !== 0 && marked.has(n)).length
    : flat.filter((n) => n !== 0 && drawnSet.has(n)).length;
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
          <b className="tnum">{markedCount}</b>/<span className="tnum">{total}</span>
        </span>
      </div>
      <div aria-label={label} className="bingocard__grid" role="grid">
        {card.map((row, r) =>
          row.map((n, c) => {
            if (n === 0) {
              return <div key={`${r}-${c}`} aria-hidden="true" className="cell cell--empty" />;
            }

            const isDrawn = drawnSet.has(n);
            const isUserMarked = marked ? marked.has(n) : false;
            // In non-interactive mode the daub follows drawn; in interactive mode it follows marked.
            const showDaub = interactive ? isUserMarked : isDrawn;
            const isJust = !interactive && lastNumber === n && isDrawn;
            const isWinRow = winRows?.has(r) ?? false;
            // Drawn but not yet manually marked — subtle prompt for the player.
            const isUnmarkedDrawn = interactive && isDrawn && !isUserMarked;

            const cls = ['cell', 'cell--num'];
            if (showDaub) cls.push('cell--marked');
            if (isJust) cls.push('cell--just');
            if (isWinRow) cls.push('cell--win-row');
            if (isUnmarkedDrawn) cls.push('cell--drawn-hint');
            if (interactive && !isDrawn) cls.push('cell--disabled');

            if (interactive) {
              return (
                <button
                  key={`${r}-${c}`}
                  aria-disabled={!isDrawn}
                  aria-label={isUserMarked ? `${n}, marcado` : `${n}`}
                  aria-pressed={isUserMarked}
                  className={cls.join(' ')}
                  disabled={!isDrawn}
                  role="gridcell"
                  type="button"
                  onClick={() => onToggleMark?.(n)}
                >
                  <span className="cell__n tnum">{n}</span>
                  {showDaub ? (
                    <span className="cell__daub">
                      <span className="daub-ring" />
                    </span>
                  ) : null}
                </button>
              );
            }

            return (
              <div
                key={`${r}-${c}`}
                aria-label={showDaub ? `${n}, marked` : `${n}`}
                className={cls.join(' ')}
                role="gridcell"
              >
                <span className="cell__n tnum">{n}</span>
                {showDaub ? (
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
