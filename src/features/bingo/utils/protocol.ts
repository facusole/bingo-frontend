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

export interface Prize {
  enabled: boolean;
  name: string;
}

export interface PlayerProgress {
  playerId: string;
  /** Cells missing on the row closest to completion. 0 means line is done. */
  toLine: number;
  /** Cells missing to complete the full card (out of 15). */
  toBingo: number;
}

export interface SnapshotData {
  playerId: string;
  token: string;
  isAdmin: boolean;
  /** 3×9 matrix, or `null` when the player is the room admin (host has no card). */
  card: number[][] | null;
  drawn: number[];
  lineAwarded: boolean;
  state: RoomLifecycle;
  players: PlayerInfo[];
  linePrize: Prize;
  bingoPrize: Prize;
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

export interface ClaimRejectedData {
  kind: 'line' | 'bingo';
}

export interface PrizesUpdatedData {
  line: Prize;
  bingo: Prize;
}

export interface HostProgressData {
  players: PlayerProgress[];
}

/** Server -> Client message envelope. */
export type ServerMessage =
  | { type: 'joined_snapshot'; data: SnapshotData }
  | { type: 'player_list'; data: PlayerListData }
  | { type: 'number_drawn'; data: NumberDrawnData }
  | { type: 'line_awarded'; data: WinnersData }
  | { type: 'bingo_awarded'; data: WinnersData }
  | { type: 'room_closed'; data?: undefined }
  | { type: 'error'; data: ErrorData }
  | { type: 'prizes_updated'; data: PrizesUpdatedData }
  | { type: 'host_progress'; data: HostProgressData }
  | { type: 'claim_rejected'; data: ClaimRejectedData };

export interface JoinData {
  name?: string;
  token?: string;
}

export interface SetPrizesData {
  line: Prize;
  bingo: Prize;
}

export interface ClaimData {
  kind: 'line' | 'bingo';
}

/** Client -> Server message envelope. */
export type ClientMessage =
  | { type: 'join'; data: JoinData }
  | { type: 'start' }
  | { type: 'draw' }
  | { type: 'restart' }
  | { type: 'close' }
  | { type: 'set_prizes'; data: SetPrizesData }
  | { type: 'claim'; data: ClaimData };
