/**
 * Wire format types — copied verbatim from FRONT_SCOPE.md §5/§6.
 * The Go backend's JSON serialization is the source of truth; do not reshape.
 */

export type RoomLifecycle = 'idle' | 'active' | 'finished';

export interface PlayerInfo {
  id: string;
  name: string;
  isAdmin: boolean;
  isConnected: boolean;
}

export interface SnapshotData {
  playerId: string;
  token: string;
  isAdmin: boolean;
  /** 3×9 matrix. `0` means empty cell. */
  card: number[][];
  drawn: number[];
  lineAwarded: boolean;
  state: RoomLifecycle;
  players: PlayerInfo[];
}

export interface PlayerListData {
  players: PlayerInfo[];
}

export interface NumberDrawnData {
  number: number;
}

export interface WinnersData {
  winners: string[];
}

export interface ErrorData {
  message: string;
}

/** Server -> Client message envelope. */
export type ServerMessage =
  | { type: 'joined_snapshot'; data: SnapshotData }
  | { type: 'player_list'; data: PlayerListData }
  | { type: 'number_drawn'; data: NumberDrawnData }
  | { type: 'line_awarded'; data: WinnersData }
  | { type: 'bingo_awarded'; data: WinnersData }
  | { type: 'room_closed'; data?: undefined }
  | { type: 'error'; data: ErrorData };

export interface JoinData {
  name?: string;
  token?: string;
}

/** Client -> Server message envelope. */
export type ClientMessage =
  | { type: 'join'; data: JoinData }
  | { type: 'start' }
  | { type: 'draw' }
  | { type: 'restart' }
  | { type: 'close' };
