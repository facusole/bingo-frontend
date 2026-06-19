'use client';

import { useState } from 'react';

import { Button } from '@/common/ui/button/button';
import { useRoom } from '@/features/bingo/hooks/use-room';
import { createRoom } from '@/features/bingo/utils/api';
import { setToken } from '@/features/bingo/utils/token-store';

export function SocketTester() {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [connected, setConnected] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div className="surface flex flex-col gap-3 p-4">
        <label className="text-muted text-xs font-semibold uppercase tracking-wider">
          Room code (5 chars)
        </label>
        <input
          className="border-line h-11 rounded-xl border px-3 text-base uppercase tracking-widest"
          maxLength={5}
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
        />
        <label className="text-muted text-xs font-semibold uppercase tracking-wider">
          Name (only used if no token is stored yet)
        </label>
        <input
          className="border-line h-11 rounded-xl border px-3 text-base"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="flex gap-3">
          <Button disabled={code.length !== 5} onClick={() => setConnected(true)}>
            Connect
          </Button>
          <Button
            disabled={!name || creating}
            variant="ghost"
            onClick={async () => {
              setCreating(true);
              setCreateError(null);
              try {
                const r = await createRoom(name || 'admin');
                setToken(r.shortCode, r.adminToken);
                setCode(r.shortCode);
                setConnected(true);
              } catch (err) {
                setCreateError(err instanceof Error ? err.message : 'failed');
              } finally {
                setCreating(false);
              }
            }}
          >
            Create + connect
          </Button>
          {connected ? (
            <Button variant="quiet" onClick={() => setConnected(false)}>
              Disconnect
            </Button>
          ) : null}
        </div>
        {createError ? (
          <div className="banner banner--error">createRoom: {createError}</div>
        ) : null}
      </div>

      {connected ? <RoomDump code={code} name={name} /> : null}
    </div>
  );
}

function RoomDump({ code, name }: { code: string; name: string }) {
  const { state, start, draw, restart, close, forgetToken } = useRoom({ code, name });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <Button disabled={!state.isAdmin} size="sm" onClick={start}>
          start
        </Button>
        <Button disabled={!state.isAdmin} size="sm" onClick={draw}>
          draw
        </Button>
        <Button disabled={!state.isAdmin} size="sm" variant="ghost" onClick={restart}>
          restart
        </Button>
        <Button disabled={!state.isAdmin} size="sm" variant="danger" onClick={close}>
          close
        </Button>
        <Button size="sm" variant="quiet" onClick={forgetToken}>
          forget token
        </Button>
      </div>
      <pre className="border-line bg-surface overflow-auto rounded-xl border p-4 text-xs">
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>
  );
}
