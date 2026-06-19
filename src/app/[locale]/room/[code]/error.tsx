'use client';

import { ClosedScreen } from '@/features/bingo/components/closed-screen/closed-screen';

export default function RoomError() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6">
      <ClosedScreen variant="not_found" />
    </main>
  );
}
