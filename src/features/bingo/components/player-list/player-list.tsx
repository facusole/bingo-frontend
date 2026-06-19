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

export function PlayerList({ players, selfId }: Props) {
  const t = useTranslations('common');

  return (
    <div className="flex flex-col">
      {players.map((p) => (
        <div
          key={p.id}
          className="player-row"
          data-disconnected={p.isConnected ? 'false' : 'true'}
        >
          <Avatar name={p.name} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-ink text-[15.5px] font-semibold">{p.name}</span>
              {p.isAdmin ? <span className="tag tag--admin">{t('host')}</span> : null}
              {selfId === p.id ? <span className="tag tag--you">{t('you')}</span> : null}
            </div>
          </div>
          <span
            aria-hidden="true"
            className={p.isConnected ? 'dot-on' : 'dot-off'}
            title={p.isConnected ? 'connected' : 'disconnected'}
          />
        </div>
      ))}
    </div>
  );
}
