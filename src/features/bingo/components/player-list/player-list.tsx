import { useTranslations } from 'next-intl';

import { Avatar } from '@/common/ui/avatar/avatar';

export interface PlayerInfo {
  id: string;
  name: string;
  isAdmin: boolean;
  isConnected: boolean;
}

interface Props {
  players: PlayerInfo[];
  selfId?: string | null;
}

/** Counts non-admin players. The admin is the host, never a competitor, and
 *  is rendered separately above the list. */
export function countPlayers(players: PlayerInfo[]): number {
  return players.filter((p) => !p.isAdmin).length;
}

export function PlayerList({ players, selfId }: Props) {
  const t = useTranslations('common');
  const admin = players.find((p) => p.isAdmin);
  const others = players.filter((p) => !p.isAdmin);

  return (
    <div className="flex flex-col">
      {admin ? (
        <Row isYou={selfId === admin.id} player={admin} role={t('host')} />
      ) : null}
      {others.map((p) => (
        <Row
          key={p.id}
          isYou={selfId === p.id}
          player={p}
          role={selfId === p.id ? t('you') : undefined}
        />
      ))}
    </div>
  );
}

interface RowProps {
  player: PlayerInfo;
  role?: string;
  isYou: boolean;
}

function Row({ player, role, isYou }: RowProps) {
  return (
    <div
      className="player-row"
      data-disconnected={player.isConnected ? 'false' : 'true'}
    >
      <Avatar name={player.name} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-ink text-[15.5px] font-semibold">{player.name}</span>
          {player.isAdmin ? (
            <span className="tag tag--admin">{role}</span>
          ) : isYou ? (
            <span className="tag tag--you">{role}</span>
          ) : null}
        </div>
      </div>
      <span
        aria-hidden="true"
        className={player.isConnected ? 'dot-on' : 'dot-off'}
        title={player.isConnected ? 'connected' : 'disconnected'}
      />
    </div>
  );
}
