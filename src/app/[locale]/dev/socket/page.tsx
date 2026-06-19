import { setRequestLocale } from 'next-intl/server';

import { SocketTester } from './socket-tester';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function SocketDevPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-12">
      <h1 className="font-display text-3xl font-bold">useRoom playground</h1>
      <p className="text-muted text-sm">
        Enter a room code and (optionally) a name. The hook will connect over WS and dump the
        live <code>RoomState</code>.
      </p>
      <SocketTester />
    </main>
  );
}
