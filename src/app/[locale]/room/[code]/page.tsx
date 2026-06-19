import { setRequestLocale } from 'next-intl/server';

import { TopBar } from '@/common/ui/top-bar/top-bar';
import { RoomShell } from '@/features/bingo/components/room-shell/room-shell';

interface Props {
  params: Promise<{ locale: string; code: string }>;
  searchParams: Promise<{ name?: string }>;
}

export default async function RoomPage({ params, searchParams }: Props) {
  const { locale, code } = await params;
  const sp = await searchParams;

  setRequestLocale(locale);

  const upperCode = code.toUpperCase();
  const initialName = sp.name;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col px-4 pt-2 pb-16 lg:max-w-[1180px] lg:px-6">
      <TopBar live roomCode={upperCode} />
      <div className="mt-2 flex-1">
        <RoomShell code={upperCode} initialName={initialName} />
      </div>
    </main>
  );
}
