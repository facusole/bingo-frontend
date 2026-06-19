import { setRequestLocale } from 'next-intl/server';

import { Avatar } from '@/common/ui/avatar/avatar';
import { Banner } from '@/common/ui/banner/banner';
import { Button } from '@/common/ui/button/button';
import { Icon } from '@/common/ui/icon/icon';
import { LocaleSwitcher } from '@/common/ui/locale-switcher/locale-switcher';
import { PaletteSwitcher } from '@/common/ui/palette-switcher/palette-switcher';
import { Panel } from '@/common/ui/panel/panel';
import { Ball } from '@/features/bingo/components/ball/ball';
import { BingoCard } from '@/features/bingo/components/bingo-card/bingo-card';
import { HistoryBoard } from '@/features/bingo/components/history-board/history-board';
import { HistoryStrip } from '@/features/bingo/components/history-strip/history-strip';
import { PlayerList } from '@/features/bingo/components/player-list/player-list';
import { ReconnectToast } from '@/features/bingo/components/reconnect-toast/reconnect-toast';
import { RoomCodeStub } from '@/features/bingo/components/room-code-stub/room-code-stub';

const sampleCard: number[][] = [
  [0, 0, 23, 0, 41, 0, 0, 78, 90],
  [4, 0, 0, 35, 0, 56, 67, 0, 0],
  [0, 12, 0, 0, 48, 0, 0, 71, 88],
];

const sampleDrawn = [68, 12, 4, 23, 41, 56, 17, 78, 35, 88, 7, 71];

const samplePlayers = [
  { id: 'a', name: 'Lucía', isAdmin: true, isConnected: true },
  { id: 'b', name: 'Mateo', isAdmin: false, isConnected: true },
  { id: 'c', name: 'Sofía', isAdmin: false, isConnected: true },
  { id: 'd', name: 'Tomás', isAdmin: false, isConnected: false },
];

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function ComponentsPlayground({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-12">
      <header className="flex items-center justify-between">
        <div className="brand-mark text-lg">
          <span className="brand-dot">90</span>
          <span>Bingo 90 · components</span>
        </div>
        <div className="flex items-center gap-3">
          <PaletteSwitcher />
          <LocaleSwitcher />
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <Panel icon="grid" title="Buttons">
          <div className="flex flex-col gap-3">
            <Button icon="plus">Primary</Button>
            <Button icon="play" variant="ghost">
              Ghost
            </Button>
            <Button icon="close" variant="danger">
              Danger
            </Button>
            <Button variant="quiet">Quiet</Button>
            <Button block disabled size="lg">
              Disabled large block
            </Button>
          </div>
        </Panel>

        <Panel icon="users" title="Avatars">
          <div className="flex flex-wrap items-center gap-3">
            <Avatar name="Lucía" />
            <Avatar name="Mateo" />
            <Avatar name="Sofía Cabral" />
            <Avatar name="Joaquín" size="lg" />
            <Icon name="crown" size={28} />
          </div>
        </Panel>

        <Panel live title="Ball — current draw">
          <Ball index={3} number={23} />
        </Panel>

        <Panel icon="clock" title="Ball — empty state">
          <Ball number={null} />
        </Panel>

        <Panel className="md:col-span-2" icon="grid" title="Bingo card">
          <BingoCard
            card={sampleCard}
            drawn={sampleDrawn}
            lastNumber={71}
            ownerName="Mateo"
          />
        </Panel>

        <Panel className="md:col-span-2" icon="clock" title="History">
          <div className="flex flex-col gap-4">
            <HistoryStrip drawn={sampleDrawn} />
            <HistoryBoard drawn={sampleDrawn} />
          </div>
        </Panel>

        <Panel icon="users" title="Players">
          <PlayerList players={samplePlayers} selfId="b" />
        </Panel>

        <Panel icon="link" title="Room code">
          <RoomCodeStub code="K9P2M" />
        </Panel>

        <Panel className="md:col-span-2" title="Banners + toast">
          <div className="flex flex-col gap-3">
            <Banner icon="clock" tone="wait">
              Esperando a que el anfitrión empiece.
            </Banner>
            <Banner icon="check" tone="info">
              Te uniste a una partida en curso.
            </Banner>
            <Banner icon="close" tone="error">
              La sala se cerró.
            </Banner>
            <div className="self-start">
              <ReconnectToast />
            </div>
          </div>
        </Panel>
      </section>
    </main>
  );
}
