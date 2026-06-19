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

interface Props {
  isAdmin: boolean;
  selfId: string | null;
  card: number[][];
  drawn: number[];
  players: PlayerInfo[];
  bingoWinners: string[];
  reachedFinishedLive: boolean;
  onRestart: () => void;
  onClose: () => void;
  onLeave: () => void;
}

export function FinishedScreen({
  isAdmin,
  selfId,
  card,
  drawn,
  players,
  bingoWinners,
  reachedFinishedLive,
  onRestart,
  onClose,
  onLeave,
}: Props) {
  const t = useTranslations('finished');
  const router = useRouter();
  const winners = bingoWinners
    .map((id) => players.find((p) => p.id === id))
    .filter((p): p is PlayerInfo => Boolean(p));
  const youWon = selfId !== null && bingoWinners.includes(selfId);
  const primary = winners[0];

  function leave() {
    onLeave();
    router.push('/');
  }

  const headline =
    winners.length > 1
      ? t('tieWon', { names: winners.map((w) => w.name).join(', ') })
      : youWon
        ? t('youWon')
        : primary
          ? t('someoneWon', { name: primary.name })
          : t('eyebrow');

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

      <div className="relative z-10">
        <BingoCard
          card={card}
          drawn={drawn}
          ownerName={primary?.name}
          title={t('winningCard')}
        />
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
