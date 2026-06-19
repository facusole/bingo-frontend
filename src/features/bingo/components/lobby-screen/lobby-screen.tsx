'use client';

import { useTranslations } from 'next-intl';

import { Banner } from '@/common/ui/banner/banner';
import { Button } from '@/common/ui/button/button';
import { Panel } from '@/common/ui/panel/panel';
import { useRouter } from '@/i18n/navigation';
import {
  countPlayers,
  PlayerList,
  type PlayerInfo,
} from '@/features/bingo/components/player-list/player-list';
import { PrizeDisplay } from '@/features/bingo/components/prize-display/prize-display';
import { PrizeEditor } from '@/features/bingo/components/prize-editor/prize-editor';
import { RoomCodeStub } from '@/features/bingo/components/room-code-stub/room-code-stub';
import type { Prize } from '@/features/bingo/utils/protocol';

interface Props {
  code: string;
  isAdmin: boolean;
  selfId: string | null;
  players: PlayerInfo[];
  linePrize: Prize;
  bingoPrize: Prize;
  onStart: () => void;
  onLeave: () => void;
  onSetPrizes: (line: Prize, bingo: Prize) => void;
}

export function LobbyScreen({
  code,
  isAdmin,
  selfId,
  players,
  linePrize,
  bingoPrize,
  onStart,
  onLeave,
  onSetPrizes,
}: Props) {
  const t = useTranslations('lobby');
  const router = useRouter();

  function leave() {
    onLeave();
    router.push('/');
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      <div className="mb-2">
        <div className="eyebrow mb-2">{t('eyebrow')}</div>
        <RoomCodeStub code={code} />
        <p className="text-muted mt-3 text-center text-[13.5px]">
          {t('shareHint', { role: isAdmin ? 'admin' : 'player' })}
        </p>
      </div>

      {isAdmin ? (
        <PrizeEditor
          bingoPrize={bingoPrize}
          linePrize={linePrize}
          onChange={onSetPrizes}
        />
      ) : (
        <PrizeDisplay bingoPrize={bingoPrize} linePrize={linePrize} />
      )}

      <Panel
        icon="users"
        title={t('playersCount', { count: countPlayers(players) })}
      >
        <PlayerList players={players} selfId={selfId} />
      </Panel>

      {isAdmin ? (
        <Button block icon="play" size="lg" onClick={onStart}>
          {t('startCta')}
        </Button>
      ) : (
        <Banner icon="clock" tone="wait">
          {t('waitingForHost')}
        </Banner>
      )}
      <button
        className="text-muted self-center pt-2 text-sm font-medium underline underline-offset-2 cursor-pointer"
        type="button"
        onClick={leave}
      >
        {t('leaveCta')}
      </button>
    </div>
  );
}
