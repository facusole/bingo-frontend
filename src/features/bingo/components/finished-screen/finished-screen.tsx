'use client';

import { useTranslations } from 'next-intl';

import { Avatar } from '@/common/ui/avatar/avatar';
import { Banner } from '@/common/ui/banner/banner';
import { Button } from '@/common/ui/button/button';
import { Icon } from '@/common/ui/icon/icon';
import { useRouter } from '@/i18n/navigation';
import { BingoCard } from '@/features/bingo/components/bingo-card/bingo-card';
import { Confetti } from '@/features/bingo/components/confetti/confetti';
import type { PlayerInfo } from '@/features/bingo/components/player-list/player-list';
import { PrizeDisplay } from '@/features/bingo/components/prize-display/prize-display';
import { PrizeEditor } from '@/features/bingo/components/prize-editor/prize-editor';
import type { Prize } from '@/features/bingo/utils/protocol';

interface Props {
  isAdmin: boolean;
  selfId: string | null;
  /** `null` when the local viewer is the admin (host has no card). */
  card: number[][] | null;
  drawn: number[];
  players: PlayerInfo[];
  bingoWinners: string[];
  reachedFinishedLive: boolean;
  linePrize: Prize;
  bingoPrize: Prize;
  onRestart: () => void;
  onClose: () => void;
  onLeave: () => void;
  onSetPrizes: (line: Prize, bingo: Prize) => void;
}

export function FinishedScreen({
  isAdmin,
  selfId,
  card,
  drawn,
  players,
  bingoWinners,
  reachedFinishedLive,
  linePrize,
  bingoPrize,
  onRestart,
  onClose,
  onLeave,
  onSetPrizes,
}: Props) {
  const t = useTranslations('finished');
  const router = useRouter();
  const winners = bingoWinners
    .map((id) => players.find((p) => p.id === id))
    .filter((p): p is PlayerInfo => Boolean(p));
  const youWon = selfId !== null && bingoWinners.includes(selfId);
  const primary = winners[0];
  const hasBingoPrize =
    bingoPrize.enabled && bingoPrize.name.trim() !== '';

  function leave() {
    onLeave();
    router.push('/');
  }

  const winnersList = winners.map((w) => w.name).join(', ');
  let headline: string;
  if (winners.length > 1) {
    headline = hasBingoPrize
      ? t('tieWonPrize', { names: winnersList, prize: bingoPrize.name })
      : t('tieWon', { names: winnersList });
  } else if (youWon) {
    headline = hasBingoPrize
      ? t('youWonPrize', { prize: bingoPrize.name })
      : t('youWon');
  } else if (primary) {
    headline = hasBingoPrize
      ? t('someoneWonPrize', { name: primary.name, prize: bingoPrize.name })
      : t('someoneWon', { name: primary.name });
  } else {
    headline = t('eyebrow');
  }

  return (
    <div className="relative mx-auto flex w-full max-w-md flex-col gap-4">
      <Confetti run={reachedFinishedLive} />
      <div className="relative z-10 text-center">
        <div className="eyebrow mb-2">{t('eyebrow')}</div>
        {primary ? (
          <div className="relative inline-flex">
            <span
              className="absolute left-1/2 -translate-x-1/2"
              style={{ top: -16 }}
            >
              <Icon color="var(--daub)" name="crown" size={30} />
            </span>
            <Avatar name={primary.name} size="lg" />
          </div>
        ) : null}
        <h2 className="font-display mt-3 text-3xl font-bold tracking-tight">{headline}</h2>
        <p className="text-muted mt-2 text-[15px]">
          {youWon ? t('youWonBody') : t('someoneWonBody')}
        </p>
      </div>

      {card ? (
        <div className="relative z-10">
          <BingoCard
            card={card}
            drawn={drawn}
            ownerName={primary?.name}
            title={t('winningCard')}
          />
        </div>
      ) : null}

      {/* Admin can adjust prizes for the next round; everyone else just sees them. */}
      <div className="relative z-10">
        {isAdmin ? (
          <PrizeEditor
            bingoPrize={bingoPrize}
            linePrize={linePrize}
            onChange={onSetPrizes}
          />
        ) : (
          <PrizeDisplay bingoPrize={bingoPrize} linePrize={linePrize} />
        )}
      </div>

      <div className="relative z-10 flex flex-col gap-3">
        {isAdmin ? (
          <>
            <Button block icon="refresh" size="lg" onClick={onRestart}>
              {t('playAgain')}
            </Button>
            <Button block icon="close" variant="danger" onClick={onClose}>
              {t('closeRoom')}
            </Button>
          </>
        ) : (
          <>
            <Banner icon="clock" tone="wait">
              {t('hostDecides')}
            </Banner>
            <Button block icon="exit" variant="ghost" onClick={leave}>
              {t('leaveCta')}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
