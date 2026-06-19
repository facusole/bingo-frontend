'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

import { Banner } from '@/common/ui/banner/banner';
import { Button } from '@/common/ui/button/button';
import { Drawer } from '@/common/ui/drawer/drawer';
import { Icon } from '@/common/ui/icon/icon';
import { Panel } from '@/common/ui/panel/panel';
import { Ball } from '@/features/bingo/components/ball/ball';
import { BingoCard } from '@/features/bingo/components/bingo-card/bingo-card';
import { HistoryBoard } from '@/features/bingo/components/history-board/history-board';
import { HistoryStrip } from '@/features/bingo/components/history-strip/history-strip';
import { HostGamePanel } from '@/features/bingo/components/host-game-panel/host-game-panel';
import {
  countPlayers,
  PlayerList,
  type PlayerInfo,
} from '@/features/bingo/components/player-list/player-list';
import { PrizeDisplay } from '@/features/bingo/components/prize-display/prize-display';
import type { PlayerProgress, Prize } from '@/features/bingo/utils/protocol';

interface Props {
  isAdmin: boolean;
  selfId: string | null;
  /** `null` when the local viewer is the admin (host has no card). */
  card: number[][] | null;
  drawn: number[];
  lastNumber: number | null;
  players: PlayerInfo[];
  lineWinners: string[];
  linePrize: Prize;
  bingoPrize: Prize;
  /** Per-player distance to line/bingo. Populated only on the admin client. */
  progress: PlayerProgress[];
  onCallNext: () => void;
  onCloseRoom: () => void;
}

const LINE_BANNER_MS = 6000;

export function GameScreen({
  isAdmin,
  selfId,
  card,
  drawn,
  lastNumber,
  players,
  lineWinners,
  linePrize,
  bingoPrize,
  progress,
  onCallNext,
  onCloseRoom,
}: Props) {
  const t = useTranslations('game');
  const [lineBannerOpen, setLineBannerOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [playersOpen, setPlayersOpen] = useState(false);

  useEffect(() => {
    if (lineWinners.length === 0) return;
    setLineBannerOpen(true);
    const timer = setTimeout(() => setLineBannerOpen(false), LINE_BANNER_MS);
    return () => clearTimeout(timer);
  }, [lineWinners]);

  const lineNames = lineWinners
    .map((id) => players.find((p) => p.id === id)?.name ?? '—')
    .join(', ');
  const selfIsLineWinner = selfId != null && lineWinners.includes(selfId);
  const playerCount = countPlayers(players);

  // While the celebration window is open, find which row(s) on the local
  // card just completed. Backend doesn't tell us, so derive from card+drawn.
  // Admin has no card; this only matters for the player view.
  const winningRowIndexes = useMemo(() => {
    if (!lineBannerOpen || !selfIsLineWinner || !card) return undefined;
    return card.reduce<number[]>((acc, row, r) => {
      const complete = row.every((n) => n === 0 || drawn.includes(n));
      if (complete) acc.push(r);
      return acc;
    }, []);
  }, [lineBannerOpen, selfIsLineWinner, card, drawn]);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4 lg:max-w-[1140px] lg:grid lg:grid-cols-[320px_minmax(380px,1fr)_300px]">
      {/* Mobile-only players pill (above ball panel). */}
      <button
        aria-haspopup="dialog"
        className="border-line bg-surface hover:bg-paper flex h-10 cursor-pointer items-center justify-between gap-2 self-start rounded-full border px-4 text-[13px] font-semibold transition-colors lg:hidden"
        type="button"
        onClick={() => setPlayersOpen(true)}
      >
        <Icon color="var(--ink)" name="users" size={16} />
        <span>{t('players', { count: playerCount })}</span>
      </button>

      <div className="flex flex-col gap-4">
        <Panel
          live
          action={
            <span className="text-muted tnum text-[13px]">{drawn.length}/90</span>
          }
          title={t('calledNumber')}
        >
          <Ball index={drawn.length} number={lastNumber} />
          {isAdmin ? (
            <div className="mt-3">
              <Button
                block
                disabled={drawn.length >= 90}
                icon="megaphone"
                size="lg"
                onClick={onCallNext}
              >
                {drawn.length >= 90 ? t('noNumbersLeft') : t('callNext')}
              </Button>
            </div>
          ) : (
            <p className="text-muted mt-3 text-center text-[12.5px]">
              {t('hostCallsNumbers')}
            </p>
          )}
        </Panel>

        <Panel
          action={
            // Mobile-only "view all" trigger that opens the history drawer.
            <button
              className="text-primary hover:text-primary-700 cursor-pointer text-[13px] font-semibold underline-offset-2 hover:underline lg:hidden"
              type="button"
              onClick={() => setHistoryOpen(true)}
            >
              {t('viewAll')}
            </button>
          }
          icon="clock"
          title={t('history')}
        >
          <div className="flex flex-col gap-3">
            <HistoryStrip drawn={drawn} />
            {/* The full 90-cell board renders inline only on desktop. */}
            <div className="hidden lg:block">
              <HistoryBoard drawn={drawn} />
            </div>
          </div>
        </Panel>
      </div>

      <div className="flex flex-col gap-4">
        {lineBannerOpen && lineWinners.length > 0 ? (
          <Banner icon="crown" tone="celebrate">
            <span className="banner--celebrate__headline">
              {selfIsLineWinner ? t('lineHeadline.self') : t('lineHeadline.others')}
            </span>
            <span className="banner--celebrate__sub">
              {linePrize.enabled && linePrize.name.trim() !== ''
                ? t('lineWinnerPrize', {
                    count: lineWinners.length,
                    names: lineNames,
                    prize: linePrize.name,
                  })
                : t('lineWinner', {
                    count: lineWinners.length,
                    names: lineNames,
                  })}
            </span>
          </Banner>
        ) : null}
        {card ? (
          <>
            <PrizeDisplay
              bingoPrize={bingoPrize}
              linePrize={linePrize}
              variant="compact"
            />
            <BingoCard
              card={card}
              drawn={drawn}
              lastNumber={lastNumber ?? undefined}
              winningRowIndexes={winningRowIndexes}
            />
          </>
        ) : (
          <HostGamePanel
            bingoPrize={bingoPrize}
            drawn={drawn}
            linePrize={linePrize}
            players={players}
            progress={progress}
          />
        )}
        {isAdmin ? (
          <Button icon="close" size="sm" variant="danger" onClick={onCloseRoom}>
            {t('closeRoom')}
          </Button>
        ) : null}
      </div>

      {/* Desktop-only inline players panel. Mobile uses the drawer below. */}
      <div className="hidden flex-col gap-4 lg:flex">
        <Panel icon="users" title={t('players', { count: playerCount })}>
          <PlayerList players={players} selfId={selfId} />
        </Panel>
      </div>

      <Drawer
        open={historyOpen}
        side="top"
        title={t('calledDrawerTitle')}
        onClose={() => setHistoryOpen(false)}
      >
        <HistoryBoard drawn={drawn} />
      </Drawer>

      <Drawer
        open={playersOpen}
        side="right"
        title={t('playersDrawerTitle')}
        onClose={() => setPlayersOpen(false)}
      >
        <PlayerList players={players} selfId={selfId} />
      </Drawer>
    </div>
  );
}
