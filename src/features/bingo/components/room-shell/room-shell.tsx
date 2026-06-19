'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

import { useRoom } from '@/features/bingo/hooks/use-room';
import { ClosedScreen } from '@/features/bingo/components/closed-screen/closed-screen';
import { FinishedScreen } from '@/features/bingo/components/finished-screen/finished-screen';
import { GameScreen } from '@/features/bingo/components/game-screen/game-screen';
import { LobbyScreen } from '@/features/bingo/components/lobby-screen/lobby-screen';
import { ReconnectToast } from '@/features/bingo/components/reconnect-toast/reconnect-toast';

interface Props {
  code: string;
  initialName?: string;
}

export function RoomShell({ code, initialName }: Props) {
  const { state, start, draw, restart, close, setPrizes, forgetToken } = useRoom({
    code,
    name: initialName,
  });
  const tCommon = useTranslations('common');
  const lastErrorRef = useRef<string | null>(null);

  // Mid-game errors (after the snapshot arrived) surface as a toast.
  // Handshake errors are routed via status (`fatal`/`not_found`) instead.
  useEffect(() => {
    if (!state.error) return;
    if (state.error === lastErrorRef.current) return;
    if (state.status === 'connected' && state.playerId) {
      toast.error(state.error);
    }
    lastErrorRef.current = state.error;
  }, [state.error, state.status, state.playerId]);

  if (state.status === 'not_found') {
    return <ClosedScreen variant="not_found" />;
  }
  if (state.status === 'closed') {
    return <ClosedScreen variant="closed" />;
  }
  if (state.status === 'session_expired' || state.status === 'fatal') {
    return <ClosedScreen variant="not_found" />;
  }

  if (state.status === 'connecting' || state.playerId === null) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center py-12 text-center">
        <span className="spinner" />
        <p className="text-muted mt-4">{tCommon('connecting')}</p>
      </div>
    );
  }

  const reconnectingBanner =
    state.status === 'reconnecting' ? (
      <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2">
        <ReconnectToast />
      </div>
    ) : null;

  if (state.state === 'finished') {
    return (
      <>
        {reconnectingBanner}
        <FinishedScreen
          bingoPrize={state.bingoPrize}
          bingoWinners={state.bingoWinners}
          card={state.card}
          drawn={state.drawn}
          isAdmin={state.isAdmin}
          linePrize={state.linePrize}
          players={state.players}
          reachedFinishedLive={state.reachedFinishedLive}
          selfId={state.playerId}
          onClose={() => {
            forgetToken();
            close();
          }}
          onLeave={forgetToken}
          onRestart={restart}
          onSetPrizes={setPrizes}
        />
      </>
    );
  }

  if (state.state === 'active') {
    return (
      <>
        {reconnectingBanner}
        <GameScreen
          bingoPrize={state.bingoPrize}
          card={state.card}
          drawn={state.drawn}
          isAdmin={state.isAdmin}
          lastNumber={state.lastNumber}
          linePrize={state.linePrize}
          lineWinners={state.lineWinners}
          players={state.players}
          progress={state.progress}
          selfId={state.playerId}
          onCallNext={draw}
          onCloseRoom={() => {
            forgetToken();
            close();
          }}
        />
      </>
    );
  }

  // idle / lobby
  return (
    <>
      {reconnectingBanner}
      <LobbyScreen
        bingoPrize={state.bingoPrize}
        code={code}
        isAdmin={state.isAdmin}
        linePrize={state.linePrize}
        players={state.players}
        selfId={state.playerId}
        onLeave={forgetToken}
        onSetPrizes={setPrizes}
        onStart={start}
      />
    </>
  );
}
