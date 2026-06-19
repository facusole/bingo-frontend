'use client';

import { useCallback, useEffect, useReducer, useRef } from 'react';

import { wsBase } from '@/common/utils/config';
import {
  clearToken,
  getToken,
  setToken,
} from '@/features/bingo/utils/token-store';
import type {
  ClientMessage,
  PlayerInfo,
  RoomLifecycle,
  ServerMessage,
} from '@/features/bingo/utils/protocol';

export type ConnectionStatus =
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'closed'
  | 'not_found'
  | 'session_expired'
  | 'fatal';

export interface RoomState {
  status: ConnectionStatus;
  playerId: string | null;
  isAdmin: boolean;
  card: number[][] | null;
  drawn: number[];
  lastNumber: number | null;
  lineAwarded: boolean;
  state: RoomLifecycle;
  players: PlayerInfo[];
  lineWinners: string[];
  bingoWinners: string[];
  error: string | null;
  /** True only when the room reached "finished" via a live bingo_awarded
   *  this session. Stays false when the initial snapshot already says
   *  finished (late joiner / reconnect — confetti should not run). */
  reachedFinishedLive: boolean;
}

const INITIAL: RoomState = {
  status: 'connecting',
  playerId: null,
  isAdmin: false,
  card: null,
  drawn: [],
  lastNumber: null,
  lineAwarded: false,
  state: 'idle',
  players: [],
  lineWinners: [],
  bingoWinners: [],
  error: null,
  reachedFinishedLive: false,
};

type Action =
  | { kind: 'status'; status: ConnectionStatus }
  | { kind: 'server'; msg: ServerMessage }
  | { kind: 'reset' };

function reducer(state: RoomState, action: Action): RoomState {
  if (action.kind === 'reset') return INITIAL;
  if (action.kind === 'status') return { ...state, status: action.status };

  const msg = action.msg;
  switch (msg.type) {
    case 'joined_snapshot': {
      const d = msg.data;
      return {
        ...state,
        status: 'connected',
        playerId: d.playerId,
        isAdmin: d.isAdmin,
        card: d.card,
        drawn: d.drawn,
        lastNumber: d.drawn.length > 0 ? d.drawn[d.drawn.length - 1] : null,
        lineAwarded: d.lineAwarded,
        state: d.state,
        players: d.players,
        lineWinners: [],
        bingoWinners: [],
        error: null,
      };
    }
    case 'player_list':
      return { ...state, players: msg.data.players };
    case 'number_drawn':
      return {
        ...state,
        drawn: [...state.drawn, msg.data.number],
        lastNumber: msg.data.number,
      };
    case 'line_awarded':
      return { ...state, lineWinners: msg.data.winners, lineAwarded: true };
    case 'bingo_awarded':
      return {
        ...state,
        bingoWinners: msg.data.winners,
        state: 'finished',
        reachedFinishedLive: true,
      };
    case 'room_closed':
      return { ...state, status: 'closed' };
    case 'error':
      return { ...state, error: msg.data.message };
    default:
      return state;
  }
}

interface UseRoomOptions {
  /** The 5-char short code from the URL. */
  code: string;
  /** Used when no token is stored yet (new joiner). */
  name?: string;
  /** Skip opening the socket. Useful while the join form is still being filled. */
  paused?: boolean;
}

interface UseRoomReturn {
  state: RoomState;
  start: () => void;
  draw: () => void;
  restart: () => void;
  close: () => void;
  /** Reset state and force a fresh connection attempt (e.g. after stale-token recovery). */
  reconnect: () => void;
  /** Clear the persisted token (used when leaving the room). */
  forgetToken: () => void;
}

const MAX_BACKOFF_ATTEMPTS = 4;

export function useRoom({ code, name, paused }: UseRoomOptions): UseRoomReturn {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const wsRef = useRef<WebSocket | null>(null);
  const attemptRef = useRef(0);
  const sessionExpiredRef = useRef(false);
  const fatalErrorRef = useRef(false);
  const gotSnapshotRef = useRef(false);
  const intendedCloseRef = useRef(false);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const send = useCallback((msg: ClientMessage) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify(msg));
  }, []);

  // The main connect/reconnect routine.
  useEffect(() => {
    if (paused) return;
    if (typeof window === 'undefined') return;

    function connect() {
      intendedCloseRef.current = false;
      const ws = new WebSocket(`${wsBase()}/ws?room=${encodeURIComponent(code)}`);
      wsRef.current = ws;

      ws.onopen = () => {
        const stored = getToken(code);
        const join: ClientMessage = stored
          ? { type: 'join', data: { token: stored } }
          : { type: 'join', data: { name: name ?? '' } };
        ws.send(JSON.stringify(join));
      };

      ws.onmessage = (ev) => {
        let parsed: ServerMessage | null = null;
        try {
          parsed = JSON.parse(ev.data) as ServerMessage;
        } catch {
          return;
        }
        if (!parsed || typeof parsed.type !== 'string') return;

        if (parsed.type === 'joined_snapshot') {
          setToken(code, parsed.data.token);
          attemptRef.current = 0;
          gotSnapshotRef.current = true;
        }

        if (parsed.type === 'error') {
          // Error before any snapshot means the handshake failed.
          if (!gotSnapshotRef.current) {
            const hadStoredToken = !!getToken(code);
            if (hadStoredToken) {
              // Stale token — the close handler will retry with a name fallback.
              clearToken(code);
              sessionExpiredRef.current = true;
            } else {
              // No token to clear (room full, invalid payload, etc.) — fatal.
              fatalErrorRef.current = true;
            }
          }
        }

        dispatch({ kind: 'server', msg: parsed });

        if (parsed.type === 'room_closed') {
          clearToken(code);
          intendedCloseRef.current = true;
          ws.close();
        }
      };

      ws.onclose = (ev) => {
        wsRef.current = null;

        // 404 on upgrade: the dial itself failed with no snapshot ever.
        if (ev.code === 1006 && attemptRef.current === 0 && !gotSnapshotRef.current) {
          dispatch({ kind: 'status', status: 'not_found' });
          return;
        }

        if (intendedCloseRef.current) {
          return;
        }

        if (fatalErrorRef.current) {
          fatalErrorRef.current = false;
          dispatch({ kind: 'status', status: 'fatal' });
          return;
        }

        if (sessionExpiredRef.current) {
          // Token was rejected. If we have a name fallback, retry as new joiner.
          sessionExpiredRef.current = false;
          if (name && name.trim().length >= 2) {
            attemptRef.current = 0;
            connect();
            return;
          }
          dispatch({ kind: 'status', status: 'session_expired' });
          return;
        }

        if (attemptRef.current < MAX_BACKOFF_ATTEMPTS) {
          const delay = 1000 * Math.pow(2, attemptRef.current);
          attemptRef.current += 1;
          dispatch({ kind: 'status', status: 'reconnecting' });
          reconnectTimerRef.current = setTimeout(connect, delay);
          return;
        }

        dispatch({ kind: 'status', status: 'closed' });
      };

      ws.onerror = () => {
        // Most browsers emit an error event before close; the close handler
        // owns the reconnection policy, so we only set a status hint here.
        if (wsRef.current?.readyState !== WebSocket.OPEN) {
          dispatch({ kind: 'status', status: 'reconnecting' });
        }
      };
    }

    dispatch({ kind: 'status', status: 'connecting' });
    connect();

    return () => {
      intendedCloseRef.current = true;
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      const ws = wsRef.current;
      if (ws) {
        // Detach handlers first so events from a still-connecting socket
        // (Strict Mode dev double-mount) don't fire into our reducer after
        // cleanup. Then close regardless of readyState — close() is a no-op
        // on already-closed sockets and transitions CONNECTING sockets to
        // CLOSING immediately.
        ws.onopen = null;
        ws.onmessage = null;
        ws.onclose = null;
        ws.onerror = null;
        if (
          ws.readyState !== WebSocket.CLOSED &&
          ws.readyState !== WebSocket.CLOSING
        ) {
          ws.close();
        }
      }
      wsRef.current = null;
      gotSnapshotRef.current = false;
    };
  }, [code, name, paused]);

  const start = useCallback(() => send({ type: 'start' }), [send]);
  const draw = useCallback(() => send({ type: 'draw' }), [send]);
  const restart = useCallback(() => send({ type: 'restart' }), [send]);
  const closeRoom = useCallback(() => send({ type: 'close' }), [send]);

  const reconnect = useCallback(() => {
    attemptRef.current = 0;
    sessionExpiredRef.current = false;
    dispatch({ kind: 'reset' });
  }, []);

  const forgetToken = useCallback(() => {
    clearToken(code);
  }, [code]);

  return {
    state,
    start,
    draw,
    restart,
    close: closeRoom,
    reconnect,
    forgetToken,
  };
}
